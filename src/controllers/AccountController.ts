import { messages } from '@/constatnts/messages';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { honoApp } from '@/lib/hono';
import { ListAccountRoute, DetailAccountRoute, DepositAccountRoute, WithdrawAccountRoute, AccountMutationRoute } from '@/routes/AccountRoute';
import { AccountMutationService } from '@/services/AccountMutationService';
import { AccountService } from '@/services/AccountService';

const AccountController = honoApp();

AccountController.openapi(ListAccountRoute, async (context) => {
  const query = context.req.valid('query');

  const accounts = await AccountService.getList(query);
  const totalData = await AccountService.count(query);

  return context.json({
    code: 200,
    messages: messages.successList('akun'),
    data: accounts,
    meta: {
      page: Number(query.page),
      limit: Number(query.limit),
      totalPage: Math.ceil(totalData / Number(query.limit)),
    }
  }, 200)
})

AccountController.openapi(DetailAccountRoute, async (context) => {
  const param = context.req.valid('param')

  const account = await AccountService.get(param);

  return context.json({
    code: 200,
    messages: messages.successDetail('akun'),
    data: account,
  }, 200)
})

AccountController.openapi(AccountMutationRoute, async (context) => {
  const param = context.req.valid('param');
  const query = context.req.valid('query');

  if (query.sortBy === 'amount' && !query.type) {
    throw new BadRequestException(['Tipe mutasi harus dipilih saat mengurutkan berdasarkan nominal.'])
  }

  const mutations = await AccountMutationService.getList(param, query);
  const totalData = await AccountMutationService.count(param, query);

  return context.json({
    code: 200,
    messages: messages.successList('mutasi akun'),
    data: mutations,
    meta: {
      page: Number(query.page),
      limit: Number(query.limit),
      totalPage: Math.ceil(totalData / Number(query.limit)),
    }
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
    messages: messages.successDeposit,
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
    messages: messages.successWithdraw,
  }, 200)
})

export default AccountController;