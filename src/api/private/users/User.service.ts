import { db } from 'db';
import { users } from 'db/schema/users';
import { and, asc, count, desc, eq, inArray, isNull, like, or, SQL } from 'drizzle-orm';
import { ProfileColumn, ProfileRequest, sortableUserColumns, User, UserChangePassword, UserColumn, UserCreate, UserExtended, UserFilter, UserListColumn, UserRoleSchema, UserRoleUpdate } from './User.schema';
import { profiles } from 'db/schema/profiles';
import { UnauthorizedException } from '@/utils/exceptions/UnauthorizedException';
import { LoginRequest } from '@/api/auth/Auth.schema';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { profileColumns, userColumns } from './User.column';
import { locationQuery } from '@/api/public/locations/Location.query';
import { countOffset } from '@/utils/helpers/count-offset';
import { BadRequestException } from '@/utils/exceptions/BadRequestException';
import { RoleEnum } from '@/utils/enums/RoleEnum';
import { validationMessages } from '@/utils/constants/validation-message';
import { usersRoles } from 'db/schema/users-roles';
import { buildJsonGroupArray } from '@/utils/helpers/build-json-group-array';
import { AppDate } from '@/utils/libs/AppDate';
import { ConstraintException } from '@/utils/exceptions/ConstraintException';
import { ForbiddenException } from '@/utils/exceptions/ForbiddenException';

export class UserService {
  static async list(query: UserFilter): Promise<[UserExtended[], number]> {
    let orders: SQL<unknown>[] = [];

    const pushOrders = (
      cols: string | string[] | undefined,
      direction: 'asc' | 'desc'
    ) => {
      const targetCols = Array.isArray(cols) ? cols : [cols];
      const isAsc = direction === 'asc';
      const opposite = isAsc ? 'desc' : 'asc';

      targetCols.forEach((col) => {
        if (!sortableUserColumns.includes(col as UserListColumn)) return;
        if ((query[opposite] as UserListColumn[]).includes(col as UserListColumn)) return;

        const orderFn = isAsc ? asc : desc;
        if (col === 'name' || col === 'phone') {
          orders.push(orderFn(profiles[col as ProfileColumn]))
          return;
        }
        orders.push(orderFn(users[col as UserColumn]));
      });
    };

    pushOrders(query.asc, 'asc');
    pushOrders(query.desc, 'desc');

    const conditions: ReturnType<typeof and>[] = [
      isNull(users.deletedAt),
    ];

    if (query.role) {
      conditions.push(
        eq(usersRoles.role, query.role)
      )
    }

    if (query.keyword) {
      conditions.push(or(
        like(users.username, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
        like(profiles.phone, `%${query.keyword}%`),
      ))
    }

    const [_users, [meta]] = await Promise.all([
      db
        .with(locationQuery)
        .select({
          ...userColumns,
          ...profileColumns,
          roles: buildJsonGroupArray([usersRoles.role], true),
          location: {
            subdistrictCode: locationQuery.subdistrictCode,
            subdistrict: locationQuery.subdistrict,
            districtCode: locationQuery.districtCode,
            district: locationQuery.district,
            cityCode: locationQuery.cityCode,
            city: locationQuery.city,
            provinceCode: locationQuery.provinceCode,
            province: locationQuery.province,
          }
        })
        .from(users)
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .innerJoin(usersRoles, eq(usersRoles.userId, users.id))
        .leftJoin(locationQuery, eq(locationQuery.subdistrictCode, profiles.subdistrictCode))
        .where(and(...conditions))
        .orderBy(...orders)
        .groupBy(users.id)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db
        .select({
          count: count().mapWith(Number),
        })
        .from(users)
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
    ])

    return [_users.map((user) => ({
      ...user,
      roles: (JSON.parse(user.roles) as unknown[]).map((role) => UserRoleSchema.parse(role))
    })), meta.count]
  }

  static async get(id: number, additionalConditions?: SQL<unknown>[]): Promise<UserExtended> {
    const conditions = [
      isNull(users.deletedAt),
      eq(users.id, id),
    ]

    if (additionalConditions) {
      conditions.push(...additionalConditions)
    }
    const [user] = await db
      .with(locationQuery)
      .select({
        ...userColumns,
        ...profileColumns,
        roles: buildJsonGroupArray([usersRoles.role], true),
        location: {
          subdistrictCode: locationQuery.subdistrictCode,
          subdistrict: locationQuery.subdistrict,
          districtCode: locationQuery.districtCode,
          district: locationQuery.district,
          cityCode: locationQuery.cityCode,
          city: locationQuery.city,
          provinceCode: locationQuery.provinceCode,
          province: locationQuery.province,
        }
      })
      .from(users)
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .innerJoin(usersRoles, eq(usersRoles.userId, users.id))
      .leftJoin(locationQuery, eq(locationQuery.subdistrictCode, profiles.subdistrictCode))
      .where(and(
        ...conditions
      ))
      .limit(1);

    return {
      ...user,
      roles: (JSON.parse(user.roles) as unknown[]).map((role) => UserRoleSchema.parse(role))
    };
  }

  static async create(payload: UserCreate): Promise<UserExtended> {
    const user = await db.transaction(async (transaction) => {
      const { profile, password: userPassword, roles, ...userPayload } = payload;
      const password = await Bun.password.hash(userPassword);
      const [user] = await transaction
        .insert(users)
        .values({
          ...userPayload,
          password,
        })
        .returning({
          id: users.id
        })

      await Promise.all(roles.map((role) => transaction
        .insert(usersRoles)
        .values({
          userId: user.id,
          role,
        })
      ))

      if (profile) {
        await transaction
          .insert(profiles)
          .values({
            ...profile,
            userId: user.id
          })
      }

      return await this.get(user.id)
    })

    return user;
  }

  static async updateProfile(id: number, payload: ProfileRequest): Promise<UserExtended> {
    const user = await db.transaction(async (transaction) => {
      const [profile] = await transaction
        .update(profiles)
        .set(payload)
        .where(eq(profiles.userId, id))
        .returning({ id: profiles.id })

      if (!profile) {
        throw new NotFoundException('user', id)
      }

      return await this.get(id)
    })

    return user;
  }

  static async delete(id: number): Promise<void> {
    await db.transaction(async (transaction) => {
      const [user] = await transaction
        .update(users)
        .set({
          deletedAt: new AppDate().unix(),
        })
        .where(and(
          isNull(users.deletedAt),
          eq(users.id, id)
        ))
        .returning({ id: users.id })

      if (!user) {
        throw new NotFoundException('user', id);
      }

      await transaction
        .update(profiles)
        .set({
          deletedAt: new AppDate().unix(),
        })
        .where(eq(profiles.userId, id))
    })
  }

  static async changePassword(id: number, payload: UserChangePassword, loggedUser: User): Promise<UserExtended> {
    const [user] = await db
      .select({
        id: users.id,
        password: users.password,
      })
      .from(users)
      .where(and(
        isNull(users.deletedAt),
        eq(users.id, id)
      ))
      .limit(1)

    if (!user) {
      throw new NotFoundException('user', id);
    }

    let isMatch = false;

    if (loggedUser.roles.includes(RoleEnum.SuperAdmin)) {
      isMatch = true
    } else if (!payload.oldPassword) {
      throw new BadRequestException(validationMessages.required('Old password'))
    } else {
      isMatch = await Bun.password.verify(payload.oldPassword, user.password);
    }

    if (!isMatch) {
      throw new ForbiddenException('incorrectPassword')
    }

    const newPassword = await Bun.password.hash(payload.newPassword)

    await db
      .update(users)
      .set({
        password: newPassword
      })
      .where(and(
        isNull(users.deletedAt),
        eq(users.id, user.id)
      ))

    return await this.get(user.id)
  }

  static async changeRole(userId: number, payload: UserRoleUpdate): Promise<void> {
    if (!payload.assigned) {
      if (payload.role === RoleEnum.SuperAdmin) {
        throw new ForbiddenException('roleRemoval')
      }
      await db
        .delete(usersRoles)
        .where(and(
          eq(usersRoles.userId, userId),
          eq(usersRoles.role, payload.role)
        ))
      return
    }
    if (payload.role === RoleEnum.SuperAdmin) {
      throw new ForbiddenException('roleAssignment')
    }
    await db
      .insert(usersRoles)
      .values({
        userId,
        role: payload.role
      })
      .onConflictDoNothing()
  }

  static async checkCredentials(loginRequest: LoginRequest): Promise<number> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, loginRequest.username))
      .limit(1)

    if (!user) {
      throw new UnauthorizedException('invalidCredential')
    }

    const isMatch = await Bun.password.verify(loginRequest.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('invalidCredential')
    }

    return user.id
  }

  static async check(id: number, roles?: RoleEnum[]) {
    const conditions: ReturnType<typeof and>[] = [
      eq(users.id, id),
      isNull(users.deletedAt)
    ]

    if (roles) {
      conditions.push(inArray(
        users.id,
        db.select({ id: users.id })
          .from(usersRoles)
          .innerJoin(users, eq(users.id, usersRoles.userId))
          .where(inArray(
            usersRoles.role,
            roles
          ))
      ))
    }

    const [user] = await db
      .select(userColumns)
      .from(users)
      .where(and(...conditions))
      .limit(1)

    if (!user) {
      throw new ConstraintException('user', id)
    }
  }

  private constructor() { }
}