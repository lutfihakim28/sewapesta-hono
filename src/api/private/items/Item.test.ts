import { describe, expect, test } from 'bun:test'
import { ItemExtended } from './Item.schema'
import app from 'index'
import { generateTestHeader } from '@/lib/utils/testing-utils'
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto'

const path = '/api/private/items'

describe('Item', () => {
  describe('List', () => {
    test('As Admin', async () => {
      const _response = await app.request(path, {
        headers: generateTestHeader(globalThis.testAuthData.Admin.token)
      })

      const response: ApiResponseList<ItemExtended[]> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data).toBeArray()
    })
  })
})