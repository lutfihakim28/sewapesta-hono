import { messages } from '@/lib/constants/messages';
import { honoApp } from '@/lib/hono';
import { ProvinceRoute } from '@/routes/locations/ProvinceRoute';
import { LocationService } from '@/services/LocationService';

const LocationController = honoApp()

LocationController.openapi(ProvinceRoute, async (context) => {
  const query = context.req.valid('query')
  const data = await LocationService.listProvinces(query)

  return context.json({
    code: 200,
    messages: messages.successList('provinsi'),
    
  })
})

export default LocationController