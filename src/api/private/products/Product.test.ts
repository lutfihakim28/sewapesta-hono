import { RoleEnum } from '@/lib/enums/RoleEnum'
import { generateTestHeader, getTestUsers } from '@/lib/utils/testingUtils'
import { beforeAll, describe, expect, test } from 'bun:test'
import { Product, ProductRequest } from './Product.schema'
import app from '@/index'
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto'
import { SortEnum } from '@/lib/enums/SortEnum'
import { db } from 'db'
import { products } from 'db/schema/products'
import { eq } from 'drizzle-orm'
import { LoginData } from '@/api/auth/Auth.schema'

const path = '/api/private/products'
let user: Record<RoleEnum, LoginData>
const payload: ProductRequest = {
  name: 'Kategori',
  branchId: 1,
  rentalTimeIncrement: 8,
}

beforeAll(async () => {
  user = await getTestUsers()
})

describe('Product', () => {
  describe('List', () => {
    test('As Customer', async () => {
      const _response = await app.request(path, {
        headers: generateTestHeader(user.Customer.token)
      })

      const response: ApiResponse = await _response.json();

      expect(response.code).toBe(403)
    })

    test('As Admin', async () => {
      const _response = await app.request(path, {
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponseList<Product[]> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data).toBeArray()
      expect(response.data.every((product) => product.branchId === user.Admin.user.branchId)).toBeTruthy()
    })

    test('As SuperAdmin', async () => {
      const _response = await app.request(path, {
        headers: generateTestHeader(user.SuperAdmin.token)
      })

      const response: ApiResponseList<Product[]> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data).toBeArray()
      expect(response.data.every((product) => product.branchId === user.SuperAdmin.user.branchId)).toBeFalsy()
    })

    describe('Filter', async () => {
      test('By keyword', async () => {
        const keyword = 'event';
        const searchParam = new URLSearchParams({
          keyword,
        })

        const _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        const response: ApiResponseList<Product[]> = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((branch) => branch.name.toLowerCase().includes(keyword)))
      })

      test('By Branch as Admin', async () => {
        const adminBranchId = user.Admin.user.branchId
        let branchId = '1';
        if (adminBranchId === 1) branchId = '2'
        if (adminBranchId === 2) branchId = '3'

        const searchParam = new URLSearchParams({ branchId })

        const _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.Admin.token)
        })

        const response: ApiResponseList<Product[]> = await _response.json()
        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((product) => product.branchId === adminBranchId)).toBeTruthy()
      })

      test('By Branch as SuperAdmin', async () => {
        const searchParam = new URLSearchParams({ branchId: '2' })

        const _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        const response: ApiResponseList<Product[]> = await _response.json()
        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.every((product) => product.branchId === 2)).toBeTruthy()
      })

      test('Sort', async () => {
        const searchParam = new URLSearchParams({
          sort: SortEnum.Descending,
          sortBy: 'id'
        })

        const _response = await app.request(`${path}?${searchParam.toString()}`, {
          headers: generateTestHeader(user.SuperAdmin.token)
        })

        const response: ApiResponseList<Product[]> = await _response.json()

        expect(response.code).toBe(200)
        expect(response.data).toBeArray()
        expect(response.data.at(0)?.id).toBeGreaterThan(response.data.at(-1)?.id || -1)
      })
    })
  })

  describe('Detail', () => {
    test('Not Found', async () => {
      const _response = await app.request(`${path}/999999`, {
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(404)
    })

    test('As Admin Other Branch', async () => {
      const adminBranchId = user.Admin.user.branchId
      let branchId = 1;
      if (adminBranchId === 1) branchId = 2
      if (adminBranchId === 2) branchId = 3

      const product = db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.branchId, branchId))
        .get()

      const _response = await app.request(`${path}/${product!.id}`, {
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(404)
    })

    test('As Admin This Branch', async () => {
      const product = db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.branchId, user.Admin.user.branchId))
        .get()

      const _response = await app.request(`${path}/${product!.id}`, {
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponseData<Product> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data.id).toBe(product!.id)
      expect(response.data.branchId).toBe(user.Admin.user.branchId)
    })
  })

  describe('Create', () => {
    test('By Owner', async () => {
      const _response = await app.request(path, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: generateTestHeader(user.Customer.token)
      })

      const response = await _response.json()

      expect(response.code).toBe(403)
    })

    test('Wrong Branch', async () => {
      const adminBranchId = user.Admin.user.branchId
      let branchId = 1;
      if (adminBranchId === 1) branchId = 2
      if (adminBranchId === 2) branchId = 3

      const _response = await app.request(path, {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          branchId,
        }),
        headers: generateTestHeader(user.Admin.token)
      })

      const response = await _response.json()

      expect(response.code).toBe(422)
    })

    test('Bad Request', async () => {
      const _response = await app.request(path, {
        method: 'POST',
        body: JSON.stringify({
          rentalIncrement: '1',
          name: 1,
          branchId: '1'
        }),
        headers: generateTestHeader(user.Admin.token)
      })

      const response = await _response.json()

      expect(response.code).toBe(422)
    })

    test('Success', async () => {
      const _response = await app.request(path, {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          branchId: user.Admin.user.branchId,
        }),
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponseData<Product> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data.name).toBe(payload.name)

      const product = db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.id, response.data.id))
        .get()

      expect(product?.id).toBeTruthy()

      await db.delete(products).where(eq(products.id, response.data.id))
    })
  })

  describe('Update', async () => {
    test('Not Found', async () => {
      const _response = await app.request(`${path}/99999999`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: generateTestHeader(user.Admin.token)
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(404)
    })

    test.todo('Bad Request')
    test.todo('Other Branch Admin')
    test.todo('This Branch Admin')
  })
})