import { ErrorHandler } from 'hono/types';
import { AcceptedLocale, tMessage } from '../constants/locales/locale';
import { HTTPException } from 'hono/http-exception';
import { pinoLogger } from './logger';
import { JwtTokenExpired } from 'hono/utils/jwt/types';
import { ApiResponse } from '../dtos/ApiResponse.dto';
import { ConstraintException } from '../exceptions/ConstraintException';
import { Context } from 'hono';
import { NotFoundException } from '../exceptions/NotFoundException';
import { ForbiddenException } from '../exceptions/ForbiddenException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { ItemTypeUnmatchException } from '../exceptions/ItemTypeUnmatchException';
import { UniqueConstraintException } from '../exceptions/UniqueConstraintException';

export const errorHandler: ErrorHandler = (error, context) => {
  const lang = context.get('language') as AcceptedLocale;

  if (error instanceof JwtTokenExpired || error.name === 'JwtTokenExpired') {
    return context.json(new ApiResponse({
      code: 401,
      messages: [tMessage({ lang, key: 'expiredRefreshToken' })]
    }), 401);
  }

  if (error instanceof HTTPException) {
    return handleHttpException(error, context);
  }

  pinoLogger.error({ error: error.message, stack: error.stack, name: error.name }, 'Unhandled Error');
  return context.json(new ApiResponse({
    code: 500,
    messages: [tMessage({ key: 'errorServer', lang })]
  }), 500);
};

function handleHttpException(error: HTTPException, context: Context<any, any, {}>) {
  // if (error instanceof Ba)

  if (error instanceof ConstraintException) {
    return handleConstrainException(error, context)
  }

  if (error instanceof ForbiddenException) {
    return handleForbiddenException(error, context);
  }

  if (error instanceof ItemTypeUnmatchException) {
    return handleItemTypeUnmatchException(error, context);
  }

  if (error instanceof NotFoundException) {
    return handleNotFoundException(error, context)
  }

  if (error instanceof UnauthorizedException) {
    return handleUnauthorizedException(error, context);
  }

  if (error instanceof UniqueConstraintException) {
    return handleUniqueConstraintException(error, context);
  }

  const { status, message, cause } = error;

  pinoLogger.error(error, `Error ${status}`);

  const messages = status === 422 && cause
    ? cause as string[]
    : message.split(',');

  return context.json(new ApiResponse({
    code: status,
    messages
  }), status);
}

function handleConstrainException(error: ConstraintException, context: Context<any, any, {}>) {
  const lang = context.get('language') as AcceptedLocale;

  return context.json(new ApiResponse({
    code: error.status,
    messages: [error.writeMessage(lang)]
  }))
}

function handleForbiddenException(error: ForbiddenException, context: Context<any, any, {}>) {
  const lang = context.get('language') as AcceptedLocale;

  return context.json(new ApiResponse({
    code: error.status,
    messages: [error.writeMessage(lang)]
  }))
}

function handleItemTypeUnmatchException(error: ItemTypeUnmatchException, context: Context<any, any, {}>) {
  const lang = context.get('language') as AcceptedLocale;
  return context.json(new ApiResponse({
    code: error.status,
    messages: [error.writeMessage(lang)]
  }))
}

function handleNotFoundException(error: NotFoundException, context: Context<any, any, {}>) {
  const lang = context.get('language') as AcceptedLocale;

  return context.json(new ApiResponse({
    code: error.status,
    messages: [error.writeMessage(lang)]
  }))
}

function handleUnauthorizedException(error: UnauthorizedException, context: Context<any, any, {}>) {
  const lang = context.get('language') as AcceptedLocale;

  return context.json(new ApiResponse({
    code: error.status,
    messages: [error.writeMessage(lang)]
  }))
}

function handleUniqueConstraintException(error: UniqueConstraintException, context: Context<any, any, {}>) {
  const lang = context.get('language') as AcceptedLocale;
  return context.json(new ApiResponse({
    code: error.status,
    messages: [error.writeMessage(lang)]
  }))
}