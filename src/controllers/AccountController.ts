import { messages } from '@/constatnts/messages';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { honoApp } from '@/lib/hono';
import { AccountMutationRoute } from '@/routes/accounts/AccountMutationRoute';
import { CreateAccountRoute } from '@/routes/accounts/CreateAccountRoute';
import { DepositAccountRoute } from '@/routes/accounts/DepositAccountRoute';
import { DetailAccountRoute } from '@/routes/accounts/DetailAccountRoute';
import { ListAccountRoute } from '@/routes/accounts/ListAccountRoute';
import { UpdateAccountRoute } from '@/routes/accounts/UpdateAccountRoute';
import { WithdrawAccountRoute } from '@/routes/accounts/WithdrawAccountRoute';
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
      pageSize: Number(query.pageSize),
      pageCount: Math.ceil(totalData / Number(query.pageSize)),
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

AccountController.openapi(CreateAccountRoute, async (context) => {
  const payload = context.req.valid('json');

  await AccountService.createPaymentAccount(payload)

  return context.json({
    code: 200,
    messages: messages.successCreate('akun'),
  }, 200)
})

AccountController.openapi(UpdateAccountRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');

  await AccountService.updatePaymentAccount(param, payload);

  return context.json({
    code: 200,
    messages: messages.successUpdate('akun')
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
      pageSize: Number(query.pageSize),
      pageCount: Math.ceil(totalData / Number(query.pageSize)),
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