import app from '@/index'
import { ApiResponse, ApiResponseList } from '@/lib/dtos/ApiResponse.dto'
import { describe, expect, test } from 'bun:test'
import { Province } from './provinces/Province.schema'
import { validationMessages } from '@/lib/constants/validationMessage'
import { City } from './cities/City.schema'

describe('Location', () => {
  describe('Province', () => {
    const searchParam = new URLSearchParams()
    searchParam.append('page', '1')
    searchParam.append('pageSize', '5')

    test('List', async () => {
      const _response = await app.request(`/api/public/locations/provinces?${searchParam.toString()}`)

      const response: ApiResponseList<Province[]> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data).toBeArrayOfSize(5)
    })
  })

  describe('Cities', () => {
    const searchParam = new URLSearchParams()
    searchParam.append('page', '1')
    searchParam.append('pageSize', '5')

    test('No Param', async () => {
      const _response = await app.request(`/api/public/locations/cities?${searchParam.toString()}`)

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(422)
    })

    test('List', async () => {
      searchParam.append('provinceCode', '33')
      const _response = await app.request(`/api/public/locations/cities?${searchParam.toString()}`)

      const response: ApiResponseList<City[]> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data).toBeArrayOfSize(5)
      expect(response.data.every((city) => city.code.startsWith('33'))).toBeTrue()
    })
  })

  describe('Districts', () => {
    const searchParam = new URLSearchParams()
    searchParam.append('page', '1')
    searchParam.append('pageSize', '5')

    test('No Param', async () => {
      const _response = await app.request(`/api/public/locations/districts?${searchParam.toString()}`)

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(422)
    })

    test('List', async () => {
      searchParam.append('cityCode', '33.74')
      const _response = await app.request(`/api/public/locations/districts?${searchParam.toString()}`)

      const response: ApiResponseList<City[]> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data).toBeArrayOfSize(5)
      expect(response.data.every((city) => city.code.startsWith('33.74'))).toBeTrue()
    })
  })

  describe('Subdistricts', () => {
    const searchParam = new URLSearchParams()
    searchParam.append('page', '1')
    searchParam.append('pageSize', '5')

    test('No Param', async () => {
      const _response = await app.request(`/api/public/locations/subdistricts?${searchParam.toString()}`)

      const response: ApiResponse = await _response.json()

      expect(response.code).toBe(422)
    })

    test('List', async () => {
      searchParam.append('districtCode', '33.74.12')
      const _response = await app.request(`/api/public/locations/subdistricts?${searchParam.toString()}`)

      const response: ApiResponseList<City[]> = await _response.json()

      expect(response.code).toBe(200)
      expect(response.data).toBeArrayOfSize(5)
      expect(response.data.every((city) => city.code.startsWith('33.74.12'))).toBeTrue()
    })
  })
})