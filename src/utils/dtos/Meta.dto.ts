export class Meta {
  page!: number
  pageSize!: number
  pageCount!: number
  totalData: number

  constructor(data: {
    page?: number | string
    pageSize?: number | string
    total: number
  }) {
    this.page = Number(data.page || 1);
    this.pageSize = Number(data.pageSize || 5);
    this.totalData = data.total
    this.pageCount = Math.ceil(this.totalData / this.pageSize);
  }
}