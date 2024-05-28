import { db } from '@/db';
import { accountsTable } from '@/db/schema/accounts';
import { ParamId } from '@/schemas/ParamIdSchema';
import { AccountRequest } from '@/schemas/accounts/AccountRequestSchema';
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
      }
    })

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

  static async update(param: ParamId) {
    const updatedAt = dayjs().unix();
    await db
      .update(accountsTable)
      .set({ updatedAt })
      .where(and(
        eq(accountsTable.id, Number(param.id)),
        isNull(accountsTable.deletedAt),
      ))
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db
      .update(accountsTable)
      .set({ deletedAt })
      .where(eq(accountsTable.id, Number(param.id)))
  }
}