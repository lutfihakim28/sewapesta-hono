import { UserRoute } from '../routes/UserRoute';
import { honoApp } from '../lib/hono';

const UserController = honoApp()

UserController.openapi(UserRoute, (context) => {
  const { id } = context.req.valid('param')
  return context.json({
    id: Number(id),
    username: 'Ultra-man',
  }, 200)
})

export default UserController