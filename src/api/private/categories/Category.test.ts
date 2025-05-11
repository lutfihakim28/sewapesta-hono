// import { Category, CategoryFilter, CategoryRequest } from './Category.schema';
// import { beforeAll, describe, expect, test } from 'bun:test'
// import app from 'index';
// import { ApiResponse, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
// import { generateTestHeader } from '@/lib/utils/testing-utils';
// import { db } from 'db';
// import { categories } from 'db/schema/categories';
// import { and, eq, isNull } from 'drizzle-orm';
// import { logger } from '@/lib/utils/logger';

// const path = '/api/private/categories'
// const payload: CategoryRequest = {
//   name: 'Kategori',
// }

// describe('Category', () => {
//   beforeAll(() => {
//     logger.debug(globalThis.testAuthData, 'Category Test')
//   })
//   test('List', async () => {
//     const query: CategoryFilter = {
//       keyword: 'equip',

//     };
//     const searchParam = new URLSearchParams(query)

//     const _response = await app.request(`${path}?${searchParam.toString()}`, {
//       headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//     })

//     const response: ApiResponseList<Category[]> = await _response.json()

//     expect(response.code).toBe(200)
//     expect(response.data).toBeArray()
//     expect(response.data.length).toBeGreaterThan(0)
//     expect(response.data.every((category) => category.name.toLowerCase().includes(query.keyword!.toLowerCase()))).toBeTrue()
//   })

//   describe('Create', () => {
//     test('By Admin', async () => {
//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(403)
//     })

//     test('Bad Request', async () => {
//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify({
//           name: 1
//         }),
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(422)
//     })

//     test('Unique Fail', async () => {
//       const [category] = await db
//         .select({ name: categories.name })
//         .from(categories)
//         .limit(1)

//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify({
//           name: category.name
//         }),
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(422)
//     })

//     test('Success', async () => {
//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(200)

//       await db.delete(categories).where(eq(categories.name, payload.name))
//     })
//   })

//   describe('Update', async () => {
//     test('By Admin', async () => {
//       const _response = await app.request(`${path}/1`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(403)
//     })

//     test('Not Found', async () => {
//       const _response = await app.request(`${path}/999999`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('Success', async () => {
//       const [oldCategory] = await db
//         .select({ name: categories.name })
//         .from(categories)
//         .where(eq(categories.id, 1))
//         .limit(1)

//       const _response = await app.request(`${path}/1`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(200)

//       const [newCategory] = await db
//         .select({ name: categories.name })
//         .from(categories)
//         .where(eq(categories.id, 1))
//         .limit(1)

//       expect(newCategory?.name).toBe(payload.name)

//       await db
//         .update(categories)
//         .set({ name: oldCategory!.name })
//         .where(eq(categories.id, 1))
//     })
//   })

//   describe('Delete', async () => {
//     test('By Admin', async () => {
//       const _response = await app.request(`${path}/1`, {
//         method: 'DELETE',
//         headers: generateTestHeader(globalThis.testAuthData.Admin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(403)
//     })

//     test('Not Found', async () => {
//       const _response = await app.request(`${path}/999999`, {
//         method: 'DELETE',
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(404)
//     })

//     test('Success', async () => {
//       const _response = await app.request(`${path}/1`, {
//         method: 'DELETE',
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(200)

//       const [newCategory] = await db
//         .select({ name: categories.name })
//         .from(categories)
//         .where(and(
//           eq(categories.id, 1),
//           isNull(categories.deletedAt)
//         ))
//         .limit(1)

//       expect(newCategory).toBeFalsy()

//       await db
//         .update(categories)
//         .set({ deletedAt: null })
//         .where(eq(categories.id, 1))
//     })
//   })
// })