import { login } from '@/api/auth/Auth.test'
import app from 'index'
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto'
import { RoleEnum } from '@/lib/enums/RoleEnum'
import { beforeAll, describe, expect, test } from 'bun:test'
import { db } from 'db'
import { and, eq, isNull } from 'drizzle-orm'
import { Branch, BranchExtended, BranchFilter, BranchRequest } from './Branch.schema'
import { branches } from 'db/schema/branches'
import { subdistricts } from 'db/schema/subdistricts'
import { districts } from 'db/schema/districts'
import { cities } from 'db/schema/cities'
import { provinces } from 'db/schema/provinces'
import dayjs from 'dayjs'
import { faker } from '@faker-js/faker/locale/id_ID'
import { SortEnum } from '@/lib/enums/SortEnum'
import { generateTestHeader, getTestUsers } from '@/lib/utils/testingUtils'
import { LoginData } from '@/api/auth/Auth.schema'


const path = '/api/private/branches';
const payload: BranchRequest = {
  address: faker.location.streetAddress(),
  cpName: faker.person.fullName(),
  cpPhone: faker.helpers.fromRegExp('628[1-9][0-9]{8,9}'),
  name: faker.company.name(),
  subdistrictCode: '33.74.12.1001'
}
let user: Record<RoleEnum, LoginData>

beforeAll(async () => {
  user = await getTestUsers()
})

describe('Branch', () => {
  describe('List', () => {
    test('As Customer', async () => {
      const _response = await app.request(path, {
        headers: generateTestHeader(user.Customer.token)
      })

      const response: ApiResponse = await _response.json();

      expect(response.code).toBe(403)
    })

    describe('Filter', async () => {
      test('By Location', async () => {
        const [location] = await db
          .select({
            subdistrictCode: subdistricts.code,
            subdistrict: subdistricts.name,
            districtCode: districts.code,
            district: districts.name,
            cityCode: cities.code,
            city: cities.name,
            provinceCode: provinces.code,
            province: provinces.name,
          })
          .from(branches)
          .innerJoin(subdistricts, eq(branches.subdistrictCode, subdistricts.code))
          .innerJoin(districts, eq(subdistricts.districtCode, districts.code))
          .innerJoin(cities, eq(districts.cityCode, cities.code))
          .innerJoin(provinces, eq(cities.provinceCode, provinces.code))
          .limit(1)

        // PROVINCES

        let filter: BranchFilter = {
          provinceCode: location!.provinceCode,
          page: '1',
        }
        let searchParam = new URLSearchParams(filter)

        let _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        let response: ApiResponseList<BranchExtended[]> = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((el) => el.location.province === location!.province)).toBeTrue()
        expect(response.data.length).toBeGreaterThan(0)

        // CITIES
        filter = {
          cityCode: location!.cityCode,
          page: '1',
        }
        searchParam = new URLSearchParams(filter)

        _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        response = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((el) => el.location.city === location!.city)).toBeTrue()
        expect(response.data.length).toBeGreaterThan(0)

        // DISTRICTS
        filter = {
          districtCode: location!.districtCode,
          page: '1',
        }
        searchParam = new URLSearchParams(filter)

        _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        response = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((el) => el.location.district === location!.district)).toBeTrue()
        expect(response.data.length).toBeGreaterThan(0)

        // SUBDISTRICTS
        filter = {
          subdistrictCode: location!.subdistrictCode,
          page: '1',
        }
        searchParam = new URLSearchParams(filter)

        _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        response = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((el) => el.location.subdistrict === location!.subdistrict)).toBeTrue()
        expect(response.data.length).toBeGreaterThan(0)

        // ALL
        filter = {
          cityCode: location!.cityCode,
          districtCode: location!.districtCode,
          subdistrictCode: location!.subdistrictCode,
          provinceCode: location!.provinceCode,
          page: '1',
        }
        searchParam = new URLSearchParams(filter)

        _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        response = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((el) => el.location.subdistrict === location!.subdistrict)).toBeTrue()
        expect(response.data.length).toBeGreaterThan(0)
      })

      test('By keyword', async () => {
        const keyword = 'yayasan';
        const searchParam = new URLSearchParams({
          keyword,
        })

        const _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        const response: ApiResponseList<BranchExtended[]> = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((branch) => branch.name.toLowerCase().includes(keyword)))
      })

      test('Sort', async () => {
        const query: BranchFilter = {
          sort: SortEnum.Descending,
          sortBy: 'id',
          page: '1',
        }
        const searchParam = new URLSearchParams(query)

        const _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        const response: ApiResponseList<BranchExtended[]> = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.at(0)?.id).toBeGreaterThan(response.data.at(-1)?.id || -1)
      })
    })
  })

  describe('Detail', () => {
    test('As Customer', async () => {
      const _response = await app.request(`${path}/1`, {
        headers: generateTestHeader(user.Customer.token)
      })

      const response: ApiResponse = await _response.json();

      expect(response.code).toBe(403)
    })

    test('As SuperAdmin', async () => {
      const _response = await app.request(`${path}/1`, {
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponseList<Branch> = await _response.json();

      expect(response.code).toBe(200)
      expect(response.data.id).toBe(1)
    })

    test('Not Found', async () => {
      const _response = await app.request(`${path}/999999`, {
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(404)
    })

    test('Deleted Branch', async () => {
      const branchId = 2;

      await db
        .update(branches)
        .set({ deletedAt: dayjs().unix() })
        .where(eq(branches.id, branchId))

      const _response = await app.request(`${path}/${branchId}`, {
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(404)

      await db
        .update(branches)
        .set({ deletedAt: null })
        .where(eq(branches.id, branchId))
    })
  })

  describe('Create', () => {
    test('As Admin', async () => {
      const _response = await app.request(path, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(403)
    })

    test('Bad Request', async () => {
      const _response = await app.request(path, {
        method: 'POST',
        body: JSON.stringify({
          address: 1,
          cpName: true,
          cpPhone: 2,
          name: false,
          subdistrictCode: '33.74.12.1001'
        }),
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(422)
    })

    test('Success', async () => {
      const _response = await app.request(path, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponseData<Branch> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data.id).toBeTruthy()

      await db.delete(branches).where(eq(branches.id, response.data.id))
    })
  })

  describe('Update', () => {
    test('Not Found', async () => {
      const _response = await app.request(`${path}/999999`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(404)
    })

    test('Bad Request', async () => {
      const _response = await app.request(`${path}/1`, {
        method: 'PUT',
        body: JSON.stringify({
          address: 1,
          cpName: true,
          cpPhone: 2,
          name: false,
          subdistrictCode: '33.74.12.1001'
        }),
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(422)
    })

    test('Admin Other Branch', async () => {
      const adminBranchId = user.Admin.user.branchId;

      let branchId = 1;
      if (adminBranchId === 1) branchId = 2;
      if (adminBranchId === 2) branchId = 3;

      const _response = await app.request(`${path}/${branchId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(403)
    })

    test('Admin This Branch', async () => {
      const [branch] = await db
        .select()
        .from(branches)
        .where(eq(branches.id, user.Admin.user.branchId))
        .limit(1)

      const _response = await app.request(`${path}/${user.Admin.user.branchId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponseData<Branch> = await _response.json()

      expect(response.code).toBe(200)

      const [lastestBranch] = await db
        .select({ name: branches.name })
        .from(branches)
        .where(eq(branches.id, user.Admin.user.branchId))
        .limit(1)

      expect(lastestBranch?.name).toBe(payload.name)

      await db
        .update(branches)
        .set({
          address: branch!.address,
          cpName: branch!.cpName,
          cpPhone: branch!.cpPhone,
          name: branch!.name,
          subdistrictCode: branch!.subdistrictCode,
        })
        .where(eq(branches.id, 1))
    })
  })

  describe('Delete', () => {
    test('Not Found', async () => {
      const _response = await app.request(`${path}/999999`, {
        method: 'DELETE',
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(404)
    })

    test('Admin Other Branch', async () => {
      const adminBranchId = user.Admin.user.branchId;

      let branchId = 1;
      if (adminBranchId === 1) branchId = 2;
      if (adminBranchId === 2) branchId = 3;

      const _response = await app.request(`${path}/${branchId}`, {
        method: 'DELETE',
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(403)
    })

    test('Admin This Branch', async () => {
      const adminBranchId = user.Admin.user.branchId;

      const _response = await app.request(`${path}/${adminBranchId}`, {
        method: 'DELETE',
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponseData<Branch> = await _response.json()

      expect(response.code).toBe(200)

      const [lastestBranch] = await db
        .select({ name: branches.name })
        .from(branches)
        .where(and(
          eq(branches.id, adminBranchId),
          isNull(branches.deletedAt)
        ))
        .limit(1)

      expect(lastestBranch?.name).toBeFalsy()

      await db
        .update(branches)
        .set({ deletedAt: null })
        .where(eq(branches.id, adminBranchId))
    })
  })
})