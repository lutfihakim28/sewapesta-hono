import { db } from '@/db';
import { accountsTable } from '@/db/schema/accounts';
import { AccountMutationRequest } from '@/schemas/accountMutations/AccountMutationRequestSchema';
import { and, eq, isNull } from 'drizzle-orm';

export abstract class AccountMutationService {
  static async deposit(request: AccountMutationRequest) {
    await db.transaction(async (transaction) => {
      const account = await transaction
        .select({
          balance: accountsTable.balance,
        })
        .from(accountsTable)
        .where(and(
          eq(accountsTable.id, request.accountId),
          isNull(accountsTable.deletedAt)
        ))

      if (!account) {

      }
    })
  }
}