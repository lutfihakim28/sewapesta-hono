export type CityData = { name: string, code: string, province_code: string }

export class CityDto {
  name!: string;
  code!: string;
  provinceCode!: string;

  constructor(data: CityData) {
    this.name = data.name;
    this.code = data.code;
    this.provinceCode = data.province_code;
  }

  static fromArray(cities: CityData[]) {
    return cities.map(city => new CityDto(city));
  }
}