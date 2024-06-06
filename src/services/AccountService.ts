import { messages } from '@/constatnts/messages';
import { db } from '@/db';
import { accountsTable } from '@/db/schema/accounts';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { AccountColumn, AccountFilter } from '@/schemas/accounts/AccountFilterSchema';
import { AccountRequest, AccountUpdate } from '@/schemas/accounts/AccountRequestSchema';
import { AccountResponse } from '@/schemas/accounts/AccountResponseSchema';
import { countOffset } from '@/utils/countOffset';
import dayjs from 'dayjs';
import { and, asc, count, desc, eq, isNull, like } from 'drizzle-orm';

export abstract class AccountService {
  static async getList(query: AccountFilter): Promise<Array<AccountResponse>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: AccountColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const accounts = await db.query.accountsTable.findMany({
      where: and(
        isNull(accountsTable.deletedAt),
        query.keyword
          ? like(accountsTable.name, `%${query.keyword}%`)
          : undefined
      ),
      orderBy: sort === 'asc'
        ? asc(accountsTable[sortBy])
        : desc(accountsTable[sortBy]),
      limit: Number(query.limit || 5),
      offset: countOffset(query.page, query.limit)
    })

    return accounts
  }

  static async get(param: ParamId): Promise<AccountResponse | undefined> {
    const account = await db.query.accountsTable.findFirst({
      where: and(
        eq(accountsTable.id, Number(param.id)),
        isNull(accountsTable.deletedAt),
      ),
    })

    if (!account) {
      throw new NotFoundException(messages.errorNotFound('akun'))
    }

    return account
  }

  static async create(request: AccountRequest): Promise<number> {
    const createdAt = dayjs().unix();
    const account = db
      .insert(accountsTable)
      .values({
        ...request,
        createdAt,
      })
      .returning({ id: accountsTable.id })
      .get()

    return account.id;
  }

  static async update(accountId: number, request: AccountUpdate) {
    const updatedAt = dayjs().unix();
    await db
      .update(accountsTable)
      .set({ ...request, updatedAt })
      .where(and(
        eq(accountsTable.id, accountId),
      ))
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingAccount = await this.checkRecord(param);

      await transaction
        .update(accountsTable)
        .set({ deletedAt })
        .where(eq(accountsTable.id, existingAccount.id))
    })
  }

  static async checkRecord(param: ParamId) {
    const account = db
      .select({ id: accountsTable.id, balance: accountsTable.balance })
      .from(accountsTable)
      .where(and(
        eq(accountsTable.id, Number(param.id)),
        isNull(accountsTable.deletedAt)
      ))
      .get();


    if (!account) {
      throw new NotFoundException(messages.errorNotFound('akun'))
    }

    return account
  }

  static async count(query: AccountFilter): Promise<number> {
    const account = db
      .select({ count: count() })
      .from(accountsTable)
      .where(and(
        isNull(accountsTable.deletedAt),
        query.keyword
          ? like(accountsTable.name, `%${query.keyword}%`)
          : undefined
      ))
      .get();

    return account ? account.count : 0;
  }
}