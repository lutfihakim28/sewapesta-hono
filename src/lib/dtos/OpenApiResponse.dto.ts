import { ResponseConfig, ZodContentObject } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';
import { ServerErrorSchema } from '../schemas/ServerError.schema';
import { UnauthorizedSchema } from '../schemas/Unauthorized.schema';
import { ForbiddenSchema } from '../schemas/ForbiddenSchema';
import { NotFoundSchema } from '../schemas/NotFound.schema';
import { BadRequestSchema } from '../schemas/BadRequest.schema';

type SuccessResponse = { schema: ZodType<unknown>, description: string }
type StatusCode = 200 | 401 | 403 | 404 | 422 | 500;

export class OpenApiResponse {
  [statusCode: string]: ResponseConfig;

  constructor(data: {
    codes?: StatusCode[],
    successResponse: SuccessResponse
  }) {
    this[200] = new OpenApiResponseStatus(data.successResponse.schema, data.successResponse.description)

    if (data.codes?.includes(401)) {
      this[401] = new OpenApiResponseStatus(UnauthorizedSchema, 'Unautrorized');
    }

    if (data.codes?.includes(403)) {
      this[403] = new OpenApiResponseStatus(ForbiddenSchema, 'Forbidden');
    }

    if (data.codes?.includes(404)) {
      this[404] = new OpenApiResponseStatus(NotFoundSchema, 'Not Found');
    }

    if (data.codes?.includes(422)) {
      this[422] = new OpenApiResponseStatus(BadRequestSchema, 'Bad Request');
    }

    this[500] = new OpenApiResponseStatus(ServerErrorSchema, 'Internal server error');
  }
}

class OpenApiResponseStatus implements ResponseConfig {
  description!: string;
  content?: ZodContentObject;

  constructor(schema: ZodType<unknown>, description: string) {
    this.description = description;
    this.content = {
      "application/json": { schema }
    }
  }
}