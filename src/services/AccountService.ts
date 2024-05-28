import { db } from '@/db';
import { accountsTable } from '@/db/schema/accounts';
import { AccountRequest } from '@/schemas/accounts/AccountRequestSchema';
import { AccountResponse } from '@/schemas/accounts/AccountResponseSchema';
import { ExtendedAccountResponse } from '@/schemas/accounts/ExtendedAccountResponseSchema';
import dayjs from 'dayjs';
import { eq, isNull } from 'drizzle-orm';

export abstract class AccountService {
  static async getList(): Promise<Array<AccountResponse>> {
    const accounts = await db.query.accountsTable.findMany({
      where: isNull(accountsTable.deletedAt),
    })

    return accounts
  }

  static async get(): Promise<ExtendedAccountResponse | undefined> {
    const account = await db.query.accountsTable.findFirst({
      where: isNull(accountsTable.deletedAt),
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
}