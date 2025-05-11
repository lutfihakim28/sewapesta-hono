// import app from 'index'
// import { ApiResponse, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
// import { describe, expect, setSystemTime, test } from 'bun:test'
// import { login } from '../auth/Auth.test';
// import dayjs from 'dayjs';
// import { generateTestHeader } from '@/lib/utils/testing-utils';

// describe('Private API', () => {
//   test('Without Token', async () => {
//     const _response = await app.request('/api/private/branches');

//     const response: ApiResponse = await _response.json();

//     expect(response.code).toBe(401)
//   })

//   test('Wrong Token', async () => {
//     const _response = await app.request('/api/private/branches', {
//       headers: generateTestHeader('Hsjdnasdmaskd')
//     });

//     const response: ApiResponse = await _response.json();

//     expect(response.code).toBe(401)
//   })

//   test('Expired Token', async () => {
//     const loginResponse = await login();
//     const now = dayjs()
//     setSystemTime(now.add(1, 'week').toDate())
//     const _response = await app.request('/api/private/branches', {
//       headers: generateTestHeader(loginResponse.data.token)
//     });

//     const response: ApiResponse = await _response.json();

//     expect(response.code).toBe(401)
//     setSystemTime(now.toDate())
//   })
// })