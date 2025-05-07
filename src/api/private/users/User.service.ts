import { db } from 'db';
import { users } from 'db/schema/users';
import { and, asc, count, desc, eq, isNull, like, or, SQL } from 'drizzle-orm';
import { ProfileColumn, User, UserChangePassword, UserColumn, UserCreate, UserExtended, UserFilter, UserUpdate } from './User.schema';
import { profiles } from 'db/schema/profiles';
import { UnauthorizedException } from '@/lib/exceptions/UnauthorizedException';
import { messages } from '@/lib/constants/messages';
import { LoginRequest } from '@/api/auth/Auth.schema';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { profileColumns, userColumns } from './User.column';
import { SortEnum } from '@/lib/enums/SortEnum';
import { locationQuery } from '@/api/public/locations/Location.query';
import { countOffset } from '@/lib/utils/count-offset';
import dayjs from 'dayjs';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { validationMessages } from '@/lib/constants/validation-message';

export abstract class UserService {
  static async list(query: UserFilter): Promise<[UserExtended[], number]> {
    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: UserColumn | ProfileColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    let orderBy: SQL = asc(users.id);

    if (sortBy === 'name') {
      orderBy = sort === SortEnum.Ascending
        ? asc(profiles[sortBy])
        : desc(profiles[sortBy])
    } else if (sortBy === 'id' || sortBy === 'username' || sortBy === 'role') {
      orderBy = sort === SortEnum.Ascending
        ? asc(users[sortBy])
        : desc(users[sortBy])
    }

    const conditions: ReturnType<typeof and>[] = [
      isNull(users.deletedAt),
    ];

    if (query.role) {
      conditions.push(
        eq(users.role, query.role)
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
        .leftJoin(locationQuery, eq(locationQuery.subdistrictCode, profiles.subdistrictCode))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db
        .select({
          count: count().mapWith(Number),
        })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .where(and(...conditions))
    ])

    return [_users, meta.count]
  }

  static async get(id: number): Promise<UserExtended> {
    const [user] = await db
      .with(locationQuery)
      .select({
        ...userColumns,
        ...profileColumns,
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
      .leftJoin(locationQuery, eq(locationQuery.subdistrictCode, profiles.subdistrictCode))
      .where(and(
        isNull(users.deletedAt),
        eq(users.id, id)
      ))
      .limit(1);

    return user;
  }

  static async create(payload: UserCreate): Promise<UserExtended> {
    const user = await db.transaction(async (transaction) => {
      const { profile, password: userPassword, ...userPayload } = payload;
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

  static async update(id: number, payload: UserUpdate): Promise<UserExtended> {
    const user = await db.transaction(async (transaction) => {
      const { profile, ...userPayload } = payload;
      const [user] = await transaction
        .update(users)
        .set(userPayload)
        .where(and(
          isNull(users.deletedAt),
          eq(users.id, id)
        ))
        .returning({ id: users.id })

      if (!user) {
        throw new NotFoundException(messages.errorNotFound(`User with ID ${id}`));
      }

      if (profile) {
        await transaction
          .update(profiles)
          .set(profile)
          .where(eq(profiles.userId, id))
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
          deletedAt: dayjs().unix(),
        })
        .where(and(
          isNull(users.deletedAt),
          eq(users.id, id)
        ))
        .returning({ id: users.id })

      if (!user) {
        throw new NotFoundException(messages.errorNotFound(`User with ID ${id}`));
      }

      await transaction
        .update(profiles)
        .set({
          deletedAt: dayjs().unix(),
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
      throw new NotFoundException(messages.errorNotFound(`User with ID ${id}`));
    }

    let isMatch = false;

    if (loggedUser.role === RoleEnum.SuperAdmin) {
      isMatch = true
    } else if (!payload.oldPassword) {
      throw new BadRequestException(validationMessages.required('Old password'))
    } else {
      isMatch = await Bun.password.verify(payload.oldPassword, user.password);
    }

    if (!isMatch) {
      throw new BadRequestException('Your password is not match.')
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

  static async checkCredentials(loginRequest: LoginRequest): Promise<number> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, loginRequest.username))
      .limit(1)

    if (!user) {
      throw new UnauthorizedException(messages.invalidCredential)
    }

    const isMatch = await Bun.password.verify(loginRequest.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(messages.invalidCredential)
    }

    return user.id
  }

  // static async check(id: number): Promise<User> {
  //   const conditions: ReturnType<typeof and>[] = [
  //     eq(users.id, id),
  //     isNull(users.deletedAt)
  //   ]

  //   const [user] = await db
  //     .select(userColumns)
  //     .from(users)
  //     .where(and(
  //       ...conditions
  //     ))
  //     .limit(1)

  //   if (!user) {
  //     throw new NotFoundException(messages.errorConstraint('User'))
  //   }

  //   return user
  // }
}