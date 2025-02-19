import { Location } from '@/lib/dtos/Location.dto';
import { District } from '../districts/District.dto';

export class Subdistrict extends Location {
  public districtCode?: string;
  public district?: District

  constructor(data: Subdistrict) {
    super(data)
    if (data.district) {
      this.district = new District(data.district)
    }
  }
}