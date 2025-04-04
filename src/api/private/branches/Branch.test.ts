import app from 'index'
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto'
import { beforeAll, describe, expect, test } from 'bun:test'
import { db } from 'db'
import { and, eq, isNull } from 'drizzle-orm'
import { Branch, BranchExtended, BranchFilter, BranchRequest } from './Branch.schema'
import { branches } from 'db/schema/branches'
import dayjs from 'dayjs'
import { faker } from '@faker-js/faker/locale/id_ID'
import { SortEnum } from '@/lib/enums/SortEnum'
import { generateTestHeader } from '@/lib/utils/testing-utils'
import { locationQuery } from '@/api/public/locations/Location.query'
import { logger } from '@/lib/utils/logger'


const path = '/api/private/branches';
const payload: BranchRequest = {
  address: faker.location.streetAddress(),
  cpName: faker.person.fullName(),
  cpPhone: faker.helpers.fromRegExp('628[1-9][0-9]{8,9}'),
  name: faker.company.name(),
  subdistrictCode: '33.74.12.1001'
}

describe('Branch', () => {
  beforeAll(() => {
    logger.debug(globalThis.testAuthData, 'Branch Test')
  })
  describe('List', () => {
    test('As Customer', async () => {
      const _response = await app.request(path, {
        headers: generateTestHeader(globalThis.testAuthData.Customer.token)
      })

      const response: ApiResponse = await _response.json();

      expect(response.code).toBe(403)
    })

    describe('Filter', async () => {
      test('By Location', async () => {
        const [location] = await db
          .with(locationQuery)
          .select({
            subdistrictCode: locationQuery.subdistrictCode,
            subdistrict: locationQuery.subdistrict,
            districtCode: locationQuery.districtCode,
            district: locationQuery.district,
            cityCode: locationQuery.cityCode,
            city: locationQuery.city,
            provinceCode: locationQuery.provinceCode,
            province: locationQuery.province,
          })
          .from(branches)
          .leftJoin(locationQuery, eq(locationQuery.subdistrictCode, branches.subdistrictCode))
          .limit(1)

        // PROVINCES

        let filter: BranchFilter = {
          provinceCode: location!.provinceCode,
        }
        let searchParam = new URLSearchParams(filter)

        let _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
        })

        let response: ApiResponseList<BranchExtended[]> = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((el) => el.location.province === location!.province)).toBeTrue()
        expect(response.data.length).toBeGreaterThan(0)

        // CITIES
        filter = {
          cityCode: location!.cityCode,
        }
        searchParam = new URLSearchParams(filter)

        _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
        })

        response = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((el) => el.location.city === location!.city)).toBeTrue()
        expect(response.data.length).toBeGreaterThan(0)

        // DISTRICTS
        filter = {
          districtCode: location!.districtCode,
        }
        searchParam = new URLSearchParams(filter)

        _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
        })

        response = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((el) => el.location.district === location!.district)).toBeTrue()
        expect(response.data.length).toBeGreaterThan(0)

        // SUBDISTRICTS
        filter = {
          subdistrictCode: location!.subdistrictCode,
        }
        searchParam = new URLSearchParams(filter)

        _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
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
        }
        searchParam = new URLSearchParams(filter)

        _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
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
          headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
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
        }
        const searchParam = new URLSearchParams(query)

        const _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
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
        headers: generateTestHeader(globalThis.testAuthData.Customer.token)
      })

      const response: ApiResponse = await _response.json();

      expect(response.code).toBe(403)
    })

    test('As SuperAdmin', async () => {
      const _response = await app.request(`${path}/1`, {
        headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
      })

      const response: ApiResponseList<Branch> = await _response.json();

      expect(response.code).toBe(200)
      expect(response.data.id).toBe(1)
    })

    test('Not Found', async () => {
      const _response = await app.request(`${path}/999999`, {
        headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
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
        headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
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
        headers: generateTestHeader(globalThis.testAuthData.Admin.token)
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
        headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(422)
    })

    test('Success', async () => {
      const _response = await app.request(path, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
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
        headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
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
        headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(422)
    })

    test('Admin Other Branch', async () => {
      const adminBranchId = globalThis.testAuthData.Admin.user.branchId;

      let branchId = 1;
      if (adminBranchId === 1) branchId = 2;
      if (adminBranchId === 2) branchId = 3;

      const _response = await app.request(`${path}/${branchId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: generateTestHeader(globalThis.testAuthData.Admin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(403)
    })

    test('Admin This Branch', async () => {
      const [branch] = await db
        .select()
        .from(branches)
        .where(eq(branches.id, globalThis.testAuthData.Admin.user.branchId))
        .limit(1)

      const _response = await app.request(`${path}/${globalThis.testAuthData.Admin.user.branchId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: generateTestHeader(globalThis.testAuthData.Admin.token)
      })

      const response: ApiResponseData<Branch> = await _response.json()

      expect(response.code).toBe(200)

      const [lastestBranch] = await db
        .select({ name: branches.name })
        .from(branches)
        .where(eq(branches.id, globalThis.testAuthData.Admin.user.branchId))
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
        headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(404)
    })

    test('Admin Other Branch', async () => {
      const adminBranchId = globalThis.testAuthData.Admin.user.branchId;

      let branchId = 1;
      if (adminBranchId === 1) branchId = 2;
      if (adminBranchId === 2) branchId = 3;

      const _response = await app.request(`${path}/${branchId}`, {
        method: 'DELETE',
        headers: generateTestHeader(globalThis.testAuthData.Admin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(403)
    })

    test('Admin This Branch', async () => {
      const adminBranchId = globalThis.testAuthData.Admin.user.branchId;

      const _response = await app.request(`${path}/${adminBranchId}`, {
        method: 'DELETE',
        headers: generateTestHeader(globalThis.testAuthData.Admin.token)
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