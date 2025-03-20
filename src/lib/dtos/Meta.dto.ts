export class Meta {
  page!: number
  pageSize!: number
  pageCount!: number
  totalData: number

  constructor(data: {
    page: number | string
    pageSize?: number | string
    total: number
  }) {
    this.page = Number(data.page);
    this.pageSize = Number(data.pageSize || 5);
    this.pageCount = Math.ceil(data.total / Number(data.pageSize || 5));
    this.totalData = data.total
  }
}