import { profiles } from 'db/schema/profiles';
import { users } from 'db/schema/users';
import { getTableColumns } from 'drizzle-orm';

export const { createdAt, deletedAt, password, profileId, refreshToken, updatedAt, ...userColumns } = getTableColumns(users)
export const { createdAt: ca, deletedAt: da, updatedAt: ua, subdistrictCode, ...profileColumns } = getTableColumns(profiles);
