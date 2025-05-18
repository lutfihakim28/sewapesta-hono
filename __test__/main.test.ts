import { LoginData, LoginRequest } from '@/api/auth/Auth.schema';
import { Category, CategoryRequest } from '@/api/private/categories/Category.schema';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { pinoLogger } from '@/utils/helpers/logger';
import { generateTestHeader } from '@/utils/helpers/testing-utils';
import { faker } from '@faker-js/faker';
import { describe, expect, test } from 'bun:test'
import app from 'index';

let token: string | undefined = undefined;

describe.only('Testing App Flow', () => {

  test('Superadmin logging in the app', async () => {
    const payload: LoginRequest = {
      username: 'superadmin',
      password: 'password',
    }
    const apiResponse = await app.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: generateTestHeader(),
    })

    const response: ApiResponseData<LoginData> = await apiResponse.json();

    expect(response.data.token).toBeTruthy();

    token = response.data.token;
  })

  const categoryName = faker.word.noun();
  test(`Creating category with name ${categoryName}`, async () => {
    const payload: CategoryRequest = {
      name: categoryName
    }

    pinoLogger.debug(token, 'TOKEN')

    const apiResponse = await app.request('/api/private/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: generateTestHeader(token),
    })

    const response: ApiResponse = await apiResponse.json();

    expect(response.code).toBe(200);
  })

  test(`Category ${categoryName} exist in list`, async () => {
    const apiResponse = await app.request('/api/private/categories', {
      method: 'GET',
      headers: generateTestHeader(token),
    })

    const response: ApiResponseList<Category[]> = await apiResponse.json();

    expect(response.code).toBe(200);
    expect(response.data.some((category) => category.name === categoryName))
  })

});
