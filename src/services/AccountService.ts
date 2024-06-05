import { messages } from '@/constatnts/messages';
import { db } from '@/db';
import { accountsTable } from '@/db/schema/accounts';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { AccountRequest, AccountUpdate } from '@/schemas/accounts/AccountRequestSchema';
import { AccountResponse } from '@/schemas/accounts/AccountResponseSchema';
import { ExtendedAccountResponse } from '@/schemas/accounts/ExtendedAccountResponseSchema';
import dayjs from 'dayjs';
import { and, eq, isNull } from 'drizzle-orm';

export abstract class AccountService {
  static async getList(): Promise<Array<AccountResponse>> {
    const accounts = await db.query.accountsTable.findMany({
      where: isNull(accountsTable.deletedAt),
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
}