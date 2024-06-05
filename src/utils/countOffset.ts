export function countOffset(page: number | string = 1, limit: number | string = 5) {
  return (Number(page) - 1) * Number(limit)
}