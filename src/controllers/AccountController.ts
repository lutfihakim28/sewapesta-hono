import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { ListAccountRoute, DetailAccountRoute, DepositAccountRoute, WithdrawAccountRoute } from '@/routes/AccountRoute';
import { AccountMutationService } from '@/services/AccountMutationService';
import { AccountService } from '@/services/AccountService';

const AccountController = honoApp();

AccountController.openapi(ListAccountRoute, async (context) => {
  const accounts = await AccountService.getList();

  return context.json({
    code: 200,
    messages: [messages.successList('akun')],
    data: accounts,
  }, 200)
})

AccountController.openapi(DetailAccountRoute, async (context) => {
  const param = context.req.valid('param')

  const account = await AccountService.get(param);

  return context.json({
    code: 200,
    messages: [messages.successDetail('akun')],
    data: account,
  }, 200)
})

AccountController.openapi(DepositAccountRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  await AccountMutationService.debit({
    ...payload,
    accountId: Number(param.id),
  })

  return context.json({
    code: 200,
    messages: [messages.successDeposit],
  }, 200)
})

AccountController.openapi(WithdrawAccountRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  await AccountMutationService.credit({
    ...payload,
    accountId: Number(param.id),
  })

  return context.json({
    code: 200,
    messages: [messages.successWithdraw],
  }, 200)
})

export default AccountController;