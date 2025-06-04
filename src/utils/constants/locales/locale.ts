import { pinoLogger } from '@/utils/helpers/logger'
import { dataEn, dataId } from './data'
import { messageEn, messageId } from './messages'

export type AcceptedLocale = 'en' | 'id'

type Data = typeof dataEn
type Message = typeof messageEn

export type DataKey = keyof Data;
export type MessageKey = keyof Message;

const locale: {
  data: {
    [k in AcceptedLocale]: Data
  },
  message: {
    [k in AcceptedLocale]: Message
  },
} = {
  data: {
    en: dataEn,
    id: dataId,
  },
  message: {
    en: messageEn,
    id: messageId,
  },
}

type ExtractParams<T, K extends keyof T> =
  T[K] extends (params: infer P) => any ? P : T[K] extends string ? undefined : never;

type TextCase = 'lower' | 'upper' | 'capitalize' | 'sentence';

type TOption<K, P> = {
  key: K,
  lang: AcceptedLocale,
  mode?: 'singular' | 'plural',
  textCase?: TextCase,
  params?: P
}

export function tMessage<K extends keyof Message>({ key, lang, params, textCase }: TOption<K, ExtractParams<Message, K>>) {
  const messages = locale.message[lang]
  const message = messages[key]

  if (typeof message === 'string') {
    return changeCase(message, textCase)
  }
  if (params) {
    return (message as (params: any) => string)(params)
  }
  return '';
}

export function tData<K extends keyof Data>({ key, lang, params, textCase, mode = 'singular' }: TOption<K, ExtractParams<Data, K>>) {
  const data = locale.data[lang]

  const descriptor = Object.getOwnPropertyDescriptor(data, key)

  let message
  if (descriptor && descriptor.get) {
    message = descriptor.get.call(data)
  } else {
    message = data[key]
  }

  if (typeof message === 'string' && message.includes('|')) {
    const [singular, plural] = message.replaceAll(' | ', '|').split('|')
    if (mode === 'singular') return changeCase(singular, textCase);
    return changeCase(plural, textCase)
  }

  if (typeof message === 'string') {
    return changeCase(message, textCase)
  }

  if (params) {
    return (message as (params: any) => string)(params)
  }

  return '';
}

function changeCase(text: string, textCase?: TextCase) {
  if (textCase === 'capitalize') {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (textCase === 'sentence') {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  if (textCase === 'upper') {
    return text.toUpperCase();
  }

  if (textCase === 'lower') {
    return text.toLowerCase();
  }

  return text;
}





