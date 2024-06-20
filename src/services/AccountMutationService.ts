import { db } from 'db';
import { AccountMutationRequest } from '@/schemas/accountMutations/AccountMutationRequestSchema';
import { AccountService } from './AccountService';
import { accountMutationsTable } from 'db/schema/accountMutations';
import dayjs from 'dayjs';
import { AccountMutationTypeEnum } from '@/enums/AccountMutationTypeEnum';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { AccountMutationColumn, AccountMutationFilter } from '@/schemas/accountMutations/AccountMutationFilterSchema';
import { AccountMutation } from '@/schemas/accountMutations/AccountMutationSchema';
import { and, asc, between, desc, eq, count } from 'drizzle-orm';
import { countOffset } from '@/utils/countOffset';
import { dateFormat } from '@/constatnts/dateFormat';

export abstract class AccountMutationService {
  static async getList(param: ParamId, query: AccountMutationFilter): Promise<Array<AccountMutation>> {
    const accountMutations = await db.transaction(async (transaction) => {
      const account = await AccountService.checkRecord({ id: param.id });

      let startAt: number = 0;
      let endAt: number = 0;
      let sort: 'asc' | 'desc' = 'asc';
      let sortBy: AccountMutationColumn = 'id';

      if (query.startAt) {
        startAt = dayjs(query.startAt).startOf('day').unix();
      }

      if (query.endAt) {
        endAt = dayjs(query.endAt).endOf('day').unix();
      }

      if (query.sort) {
        sort = query.sort
      }

      if (query.sortBy) {
        sortBy = query.sortBy
      }

      const isRange = startAt && endAt;

      const mutations = transaction
        .select()
        .from(accountMutationsTable)
        .where(and(
          eq(accountMutationsTable.accountId, account.id),
          query.type
            ? eq(accountMutationsTable.type, query.type)
            : undefined,
          isRange
            ? between(accountMutationsTable.createdAt, startAt, endAt)
            : undefined,
        ))
        .orderBy(sort === 'asc' ? asc(accountMutationsTable[sortBy]) : desc(accountMutationsTable[sortBy]))
        .limit(Number(query.limit || 5))
        .offset(countOffset(query.page, query.limit))
        .all();

      return mutations;
    })

    return accountMutations.map((mutation) => ({
      ...mutation,
      createdAt: dayjs.unix(mutation.createdAt).format(dateFormat),
    }))
  }

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

      await AccountService.updateBalance(account.id, {
        balance: account.balance + request.amount,
      })
    })
  }

  static async credit(request: AccountMutationRequest & { accountId: number }) {
    const createdAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const account = await AccountService.checkRecord({ id: request.accountId.toString() });

      if (request.amount > account.balance) {
        throw new BadRequestException(['Nominal tidak boleh melebihi saldo akun.'])
      }

      await transaction
        .insert(accountMutationsTable)
        .values({
          ...request,
          createdAt,
          type: AccountMutationTypeEnum.Credit,
        })

      await AccountService.updateBalance(account.id, {
        balance: account.balance - request.amount,
      })
    })
  }

  static async count(param: ParamId, query: AccountMutationFilter): Promise<number> {
    const data = db
      .select({ count: count() })
      .from(accountMutationsTable)
      .where(and(
        eq(accountMutationsTable.accountId, Number(param.id)),
        query.type
          ? eq(accountMutationsTable.type, query.type)
          : undefined,
        query.startAt
          ? between(accountMutationsTable.createdAt, dayjs(query.startAt).startOf('day').unix(), dayjs(query.endAt).endOf('day').unix())
          : undefined
      ))
      .get()

    return data ? data.count : 0;
  }
}