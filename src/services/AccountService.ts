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

  static async get(param: ParamId): Promise<ExtendedAccountResponse | undefined> {
    const account = await db.query.accountsTable.findFirst({
      where: and(
        eq(accountsTable.id, Number(param.id)),
        isNull(accountsTable.deletedAt),
      ),
      with: {
        employee: true,
        owner: true,
        user: {
          columns: {
            password: false,
          }
        },
        mutations: true,
      }
    })

    if (!account) {
      throw new NotFoundException('Akun tidak ditemukan.')
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

  static async update(param: ParamId, request: AccountUpdate) {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingAccountId = await this.checkRecord(param);

      await transaction
        .update(accountsTable)
        .set({ ...request, updatedAt })
        .where(and(
          eq(accountsTable.id, existingAccountId),
          isNull(accountsTable.deletedAt),
        ))
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingAccountId = await this.checkRecord(param);

      await transaction
        .update(accountsTable)
        .set({ deletedAt })
        .where(eq(accountsTable.id, existingAccountId))
    })
  }

  static async checkRecord(param: ParamId) {
    const account = db
      .select({ id: accountsTable.id })
      .from(accountsTable)
      .where(and(
        eq(accountsTable.id, Number(param.id)),
        isNull(accountsTable.deletedAt)
      ))
      .get();


    if (!account) {
      throw new NotFoundException('Akun tidak ditemukan.')
    }

    return account.id
  }
}