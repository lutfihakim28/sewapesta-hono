export function countOffset(page: number | string = 1, pageSize: number | string = 5) {
  return (Number(page) - 1) * Number(pageSize)
}