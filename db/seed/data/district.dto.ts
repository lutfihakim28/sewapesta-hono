export type DistrictData = { name: string, code: string, city_code: string }

export class DistrictDto {
  name!: string;
  code!: string;
  cityCode!: string;

  constructor(data: DistrictData) {
    this.name = data.name;
    this.code = data.code;
    this.cityCode = data.city_code;
  }

  static fromArray(districts: DistrictData[]) {
    return districts.map(district => new DistrictDto(district));
  }
}