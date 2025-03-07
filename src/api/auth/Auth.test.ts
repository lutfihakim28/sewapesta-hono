import app from '@/index'
import { ApiResponse, ApiResponseData } from '@/lib/dtos/ApiResponse.dto'
import { describe, test, expect, beforeEach } from 'bun:test'
import { LoginData } from './Auth.schema'
import { db } from 'db'
import { users } from 'db/schema/users'
import { eq } from 'drizzle-orm'
import { generateTestHeader } from '@/lib/utils/testingUtils'
import { branches } from 'db/schema/branches'

const username = 'superadmin'
let jwt: string | undefined;
let userId: number;

beforeEach(async () => {
  jwt = undefined;
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)

  userId = user.id || 0
  await db.update(users).set({ refreshToken: null }).where(eq(users.id, userId))
})

describe('Auth', () => {
  describe('Login', () => {
    test('Success Case', async () => {
      const response = await login()

      expect(response.code).toBe(200)
      expect(response.data.user.username).toBe(username)
    })

    test('Wrong Password', async () => {
      const _response = await app.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: 'passwords',
        }),
        headers: generateTestHeader(),
      })

      const response: ApiResponse = await _response.json();

      expect(response.code).toBe(401)
    })

    test('Username Not Found', async () => {
      const _response = await app.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: 'superadmins',
          password: 'password',
        }),
        headers: generateTestHeader(),
      })

      const response: ApiResponse = await _response.json();

      expect(response.code).toBe(401)
    })
  })

  describe('Refresh', () => {
    test('Logged Out User', async () => {
      const _response = await app.request('/api/auth/refresh', {
        method: 'PUT',
        body: JSON.stringify({
          userId
        }),
        headers: generateTestHeader()
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(401)
    })

    test('Logged In User', async () => {
      await login();

      const _response = await app.request('/api/auth/refresh', {
        method: 'PUT',
        body: JSON.stringify({
          userId
        }),
        headers: generateTestHeader()
      })

      const response: ApiResponseData<LoginData> = await _response.json()
      expect(response.code).toBe(200)
      expect(response.data.user.username).toBe(username)
    })
  })

  describe('Logout', () => {
    test('No Token', async () => {
      const _response = await app.request('/api/auth/logout', {
        method: 'DELETE',
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(401)
    })

    test('Wrong Token', async () => {
      const _response = await app.request('/api/auth/logout', {
        method: 'DELETE',
        headers: generateTestHeader('Jshkdhmdnmqw')
      })

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(401)
    })

    test('With Token', async () => {
      await login();

      const _response = await app.request('/api/auth/logout', {
        method: 'DELETE',
        headers: generateTestHeader(jwt)
      })

      const response: ApiResponse = await _response.json()

      const [user] = await db
        .select({ refreshToken: users.refreshToken })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      expect(user.refreshToken).toBeNull()
      expect(response.code).toBe(200)
    })
  })
})

export async function login(_username?: string) {
  const _response = await app.request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: _username || username,
      password: 'password'
    }),
    headers: generateTestHeader(),
  })

  const response: ApiResponseData<LoginData> = await _response.json();
  jwt = response.data.token;
  userId = response.data.user.id;
  return response
}