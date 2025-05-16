// import { generateTestHeader } from '@/lib/utils/testing-utils'
// import { beforeAll, describe, expect, test } from 'bun:test'
// import { Product, ProductRequest } from './Product.schema'
// import app from 'index'
// import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto'
// import { SortEnum } from '@/lib/enums/SortEnum'
// import { db } from 'db'
// import { products } from 'db/schema/products'
// import { and, eq, isNull, not } from 'drizzle-orm'
// import dayjs from 'dayjs'

// const path = '/api/private/products'
// const payload: ProductRequest = {
//   name: 'Produk',
//   rentalTimeIncrement: 8,
// }
// let testedProduct: Product
// let testedOtherProduct: Product

// describe('Product', () => {
//   beforeAll(async () => {
//     const [[product], [otherProduct]] = await Promise.all([
//       db
//         .select()
//         .from(products)
//         .where(and(
//           isNull(products.deletedAt)
//         ))
//         .limit(1),
//       db
//         .select()
//         .from(products)
//         .where(and(
//           isNull(products.deletedAt)
//         ))
//         .limit(1)
//     ])

//     testedProduct = product
//     testedOtherProduct = otherProduct
//   })

//   describe('List', () => {
//     test('As Customer', async () => {
//       const _response = await app.request(path, {
//         headers: generateTestHeader(globalThis.testAuthData.Customer.token)
//       })

//       const response: ApiResponse = await _response.json();

//       expect(response.code).toBe(403)
//     })

//     test('As Admin', async () => {
//       const _response = await app.request(path, {
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponseList<Product[]> = await _response.json()

//       expect(response.code).toBe(200)
//       expect(response.data).toBeArray()
//     })

//     test('As SuperAdmin', async () => {
//       const _response = await app.request(path, {
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponseList<Product[]> = await _response.json()

//       expect(response.code).toBe(200)
//       expect(response.data).toBeArray()
//     })

//     describe('Filter', async () => {
//       test('By keyword', async () => {
//         const keyword = 'event';
//         const searchParam = new URLSearchParams({
//           keyword,
//         })

//         const _response = await app.request(`${path}?${searchParam.toString()}`, {
//           headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//         })

//         const response: ApiResponseList<Product[]> = await _response.json()

//         expect(response.code).toBe(200)
//         expect(response.data).toBeArray()
//       })

//       test('By Branch as Admin', async () => {

//         const _response = await app.request(`${path}`, {
//           headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//         })

//         const response: ApiResponseList<Product[]> = await _response.json()
//         expect(response.code).toBe(200)
//         expect(response.data).toBeArray()
//       })

//       test('By Branch as SuperAdmin', async () => {
//         const searchParam = new URLSearchParams({ branchId: '2' })

//         const _response = await app.request(`${path}?${searchParam.toString()}`, {
//           headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//         })

//         const response: ApiResponseList<Product[]> = await _response.json()
//         expect(response.code).toBe(200)
//         expect(response.data).toBeArray()
//       })

//       test('Sort', async () => {
//         const searchParam = new URLSearchParams({
//           sort: SortEnum.Descending,
//           sortBy: 'id'
//         })

//         const _response = await app.request(`${path}?${searchParam.toString()}`, {
//           headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//         })

//         const response: ApiResponseList<Product[]> = await _response.json()

//         expect(response.code).toBe(200)
//         expect(response.data).toBeArray()
//         expect(response.data.at(0)?.id).toBeGreaterThan(response.data.at(-1)?.id || -1)
//       })
//     })
//   })

//   describe('Detail', () => {
//     test('Not Found', async () => {
//       const _response = await app.request(`${path}/999999`, {
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('As Admin Other Branch', async () => {
//       const [product] = await db
//         .select({ id: products.id })
//         .from(products)
//         .limit(1)

//       const _response = await app.request(`${path}/${product!.id}`, {
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('As Admin This Branch', async () => {
//       const [product] = await db
//         .select({ id: products.id })
//         .from(products)
//         .limit(1)

//       const _response = await app.request(`${path}/${product!.id}`, {
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponseData<Product> = await _response.json()

//       expect(response.code).toBe(200)
//       expect(response.data.id).toBe(product!.id)
//     })
//   })

//   describe('Create', () => {
//     test('By Owner', async () => {
//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.Customer.token)
//       })

//       const response = await _response.json()

//       expect(response.code).toBe(403)
//     })

//     test('Wrong Branch', async () => {

//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify({
//           ...payload,
//         }),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(422)
//     })

//     test('Bad Request', async () => {
//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify({
//           rentalIncrement: '1',
//           name: 1,
//           branchId: '1'
//         }),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response = await _response.json()

//       expect(response.code).toBe(422)
//     })

//     test('Success', async () => {
//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify({
//           ...payload,
//         }),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponseData<Product> = await _response.json()

//       expect(response.code).toBe(200)
//       expect(response.data.name).toBe(payload.name)

//       const [product] = await db
//         .select({ id: products.id })
//         .from(products)
//         .where(eq(products.id, response.data.id))
//         .limit(1)

//       expect(product?.id).toBeTruthy()

//       await db.delete(products).where(eq(products.id, response.data.id))
//     })
//   })

//   describe('Update', async () => {
//     test('Not Found', async () => {
//       const _response = await app.request(`${path}/99999999`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('Bad Request', async () => {
//       const _response = await app.request(`${path}/${testedProduct.id}`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           name: 1,
//         }),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(422)
//     })

//     test('Deleted', async () => {
//       await db.update(products).set({ deletedAt: new AppDate().unix }).where(eq(products.id, testedProduct.id));

//       const _response = await app.request(`${path}/${testedProduct.id}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)

//       await db.update(products).set({ deletedAt: null }).where(eq(products.id, testedProduct.id));
//     })

//     test('Other Branch Admin', async () => {
//       const _response = await app.request(`${path}/${testedOtherProduct.id}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('This Branch Admin Wrong Branch Payload', async () => {
//       const _response = await app.request(`${path}/${testedProduct.id}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('This Branch Admin Success', async () => {
//       const _response = await app.request(`${path}/${testedProduct.id}`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           ...payload,
//         }),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponseData<Product> = await _response.json()

//       expect(response.code).toBe(200)
//       expect(response.data.id).toBe(testedProduct.id)
//       expect(response.data.name).toBe(payload.name)

//       await db
//         .update(products)
//         .set({
//           name: testedProduct.name,
//           rentalTimeIncrement: testedProduct.rentalTimeIncrement,
//         })
//         .where(eq(products.id, testedProduct.id))
//     })
//   })

//   describe('Delete', () => {
//     test('Not Found', async () => {
//       const _response = await app.request(`${path}/99999999`, {
//         method: 'DELETE',
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('Deleted', async () => {
//       await db.update(products).set({ deletedAt: new AppDate().unix }).where(eq(products.id, testedProduct.id));

//       const _response = await app.request(`${path}/${testedProduct.id}`, {
//         method: 'DELETE',
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)

//       await db.update(products).set({ deletedAt: null }).where(eq(products.id, testedProduct.id));
//     })

//     test('Other Branch Admin', async () => {
//       const _response = await app.request(`${path}/${testedOtherProduct.id}`, {
//         method: 'DELETE',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('This Branch Admin', async () => {
//       const _response = await app.request(`${path}/${testedProduct.id}`, {
//         method: 'DELETE',
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(200)

//       await db.update(products).set({ deletedAt: null }).where(eq(products.id, testedProduct.id)).returning();
//     })
//   })
// })