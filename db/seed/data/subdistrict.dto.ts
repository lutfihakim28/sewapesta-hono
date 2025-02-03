export type SubdistrictData = { name: string, code: string, district_code: string }

export class SubdistrictDto {
  name!: string;
  code!: string;
  districtCode!: string;

  constructor(data: SubdistrictData) {
    this.name = data.name;
    this.code = data.code;
    this.districtCode = data.district_code;
  }

  static fromArray(subdistricts: SubdistrictData[]) {
    return subdistricts.map(district => new SubdistrictDto(district));
  }
}