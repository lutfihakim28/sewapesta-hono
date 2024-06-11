import { honoApp } from '@/lib/hono';
import { UserRoute } from '@/routes/UserRoute';

const UserController = honoApp()

UserController.openapi(UserRoute, (context) => {
  const { id } = context.req.valid('param')
  return context.json({
    code: 200,
    messages: ['Sukses'],
    data: {
      id: Number(id),
      username: 'Ultra-man',
      accountId: 1,
    }
  }, 200)
})

export default UserController