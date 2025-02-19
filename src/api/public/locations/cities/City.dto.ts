import { Location } from '@/lib/dtos/Location.dto';
import { Province } from '../provinces/Province.dto';

export class City extends Location {
  provinceCode?: string
  province?: Province

  constructor(data: City) {
    super(data)
    if (data.province) {
      this.province = new Province(data.province)
    }
  }
}