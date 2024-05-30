import { db } from '@/db';
import { AccountMutationRequest } from '@/schemas/accountMutations/AccountMutationRequestSchema';
import { AccountService } from './AccountService';
import { accountsTable } from '@/db/schema/accounts';
import { eq, sql } from 'drizzle-orm';
import { accountMutationsTable } from '@/db/schema/accountMutations';
import dayjs from 'dayjs';
import { AccountMutationTypeEnum } from '@/enums/AccountMutationTypeEnum';
import { InvalidException } from '@/exceptions/InvalidException';

export abstract class AccountMutationService {
  static async debit(request: AccountMutationRequest & { accountId: number }) {
    const createdAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const account = await AccountService.checkRecord({ id: request.accountId.toString() });

      await transaction
        .insert(accountMutationsTable)
        .values({
          ...request,
          createdAt,
          type: AccountMutationTypeEnum.Debit,
        })

      await AccountService.update(account.id, {
        balance: account.balance + request.amount,
      })
    })
  }

  static async credit(request: AccountMutationRequest & { accountId: number }) {
    const createdAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const account = await AccountService.checkRecord({ id: request.accountId.toString() });

      if (request.amount > account.balance) {
        throw new InvalidException(['Nominal tidak boleh melebihi saldo akun.'])
      }

      await transaction
        .insert(accountMutationsTable)
        .values({
          ...request,
          createdAt,
          type: AccountMutationTypeEnum.Credit,
        })

      await AccountService.update(account.id, {
        balance: account.balance - request.amount,
      })
    })
  }
}