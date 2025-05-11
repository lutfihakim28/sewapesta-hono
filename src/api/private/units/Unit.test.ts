// import { Unit, UnitFilter, UnitRequest } from './Unit.schema';
// import { beforeAll, describe, expect, test } from 'bun:test'
// import app from 'index';
// import { ApiResponse, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
// import { generateTestHeader } from '@/lib/utils/testing-utils';
// import { db } from 'db';
// import { and, eq, isNull } from 'drizzle-orm';
// import { units } from 'db/schema/units';
// import { logger } from '@/lib/utils/logger';

// const path = '/api/private/units'
// const payload: UnitRequest = {
//   name: 'Unit',
// }

// describe('Unit', () => {
//   beforeAll(() => {
//     logger.debug(globalThis.testAuthData, 'Unit Test')
//   })
//   test('List', async () => {
//     const query: UnitFilter = {
//       keyword: 'pcs'
//     };
//     const searchParam = new URLSearchParams(query)

//     const _response = await app.request(`${path}?${searchParam.toString()}`, {
//       headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//     })


//     const response: ApiResponseList<Unit[]> = await _response.json()

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
//       const [unit] = await db
//         .select({ name: units.name })
//         .from(units)
//         .limit(1)

//       const _response = await app.request(path, {
//         method: 'POST',
//         body: JSON.stringify({
//           name: unit.name
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

//       await db.delete(units).where(eq(units.name, payload.name))
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
//       const [oldUnit] = await db
//         .select({ name: units.name })
//         .from(units)
//         .where(eq(units.id, 1))
//         .limit(1)

//       const _response = await app.request(`${path}/1`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//         headers: generateTestHeader(globalThis.testAuthData.SuperAdmin.token)
//       })

//       const response: ApiResponse = await _response.json()

//       expect(response.code).toBe(200)

//       const [newUnit] = await db
//         .select({ name: units.name })
//         .from(units)
//         .where(eq(units.id, 1))
//         .limit(1)

//       expect(newUnit?.name).toBe(payload.name)

//       await db
//         .update(units)
//         .set({ name: oldUnit!.name })
//         .where(eq(units.id, 1))
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

//       const [newUnit] = await db
//         .select({ name: units.name })
//         .from(units)
//         .where(and(
//           eq(units.id, 1),
//           isNull(units.deletedAt)
//         ))
//         .limit(1)

//       expect(newUnit).toBeFalsy()

//       await db
//         .update(units)
//         .set({ deletedAt: null })
//         .where(eq(units.id, 1))
//     })
//   })
// })