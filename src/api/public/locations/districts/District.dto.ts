import { Location } from '@/lib/dtos/Location.dto';
import { City } from '../cities/City.dto';

export class District extends Location {
  public cityCode?: string
  public city?: City

  constructor(data: District) {
    super(data)
    if (data.city) {
      this.city = new City(data.city)
    }
  }
}