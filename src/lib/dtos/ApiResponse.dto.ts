import { Meta } from './Meta.dto';

export class ApiResponse {
  public code!: number
  public messages!: string[]

  constructor(response: ApiResponse) {
    this.code = response.code
    this.messages = response.messages
  }
}

export class ApiResponseData<T> extends ApiResponse {
  public data!: T
  constructor(response: ApiResponseData<T>) {
    super(response)
    this.data = response.data
  }
}

export class ApiResponseList<T> extends ApiResponseData<T> {
  public meta!: Meta
  constructor(response: ApiResponseList<T>) {
    super(response)
    this.meta = response.meta
  }
}