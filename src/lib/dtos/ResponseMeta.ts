export class ResponseMeta {
  page!: number
  pageSize!: number
  pageCount!: number
  totalData: number

  constructor(data: {
    page: number | string
    pageSize: number | string
    total: number
  }) {
    this.page = Number(data.page);
    this.pageSize = Number(data.pageSize);
    this.pageCount = Math.ceil(data.total / Number(data.pageSize));
    this.totalData = data.total
  }
}