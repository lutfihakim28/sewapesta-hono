export function generateTestHeader(token?: string, contentType = 'application/json') {
  const header = new Headers({
    'Content-Type': contentType
  })

  if (token) {
    header.append('Authorization', `Bearer ${token}`)
  }

  return header
}