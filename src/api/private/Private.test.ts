import app from '@/index'
import { ApiResponse, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { describe, expect, setSystemTime, test } from 'bun:test'
import { login } from '../auth/Auth.test';
import dayjs from 'dayjs';
import { Branch } from './branches/Branch.schema';
import { generateTestHeader } from '@/lib/utils/testingUtils';

describe('Private API', () => {
  test('Without Token', async () => {
    const _response = await app.request('/api/private/branches');

    const response: ApiResponse = await _response.json();

    expect(response.code).toBe(401)
  })

  test('Wrong Token', async () => {
    const _response = await app.request('/api/private/branches', {
      headers: generateTestHeader('Hsjdnasdmaskd')
    });

    const response: ApiResponse = await _response.json();

    expect(response.code).toBe(401)
  })

  test('Expired Token', async () => {
    const loginResponse = await login();
    setSystemTime(dayjs().add(1, 'week').toDate())
    const _response = await app.request('/api/private/branches', {
      headers: generateTestHeader(loginResponse.data.token)
    });

    const response: ApiResponse = await _response.json();

    expect(response.code).toBe(401)
  })

  test('Valid Token', async () => {
    const loginResponse = await login();
    const _response = await app.request('/api/private/branches', {
      headers: generateTestHeader(loginResponse.data.token)
    });

    const response: ApiResponseList<Branch[]> = await _response.json();

    expect(response.code).toBe(200)
    expect(response.data).toBeArray()
  })
})