import { CityFilter } from '@/schemas/cities/CityFilterSchema';
import { DistrictFilter } from '@/schemas/districts/DistrictFilterSchema';
import { ProvinceFilter } from '@/schemas/provinces/ProvinceFilterSchema';
import { SubdistrictFilter } from '@/schemas/subdistricts/SubdistrictFilterSchema';
import { db } from 'db';
import { cities } from 'db/schema/cities';
import { districts } from 'db/schema/districts';
import { provinces } from 'db/schema/provinces';
import { subdistricts } from 'db/schema/subdistricts';
import { and, eq, like } from 'drizzle-orm';

export class LocationService {
  static async listProvinces(query: ProvinceFilter) {
    const _provinces = await db
      .select({
        value: provinces.code,
        label: provinces.name
      })
      .from(provinces)
      .where(query.keyword
        ? like(provinces.name, `%${query.keyword}%`)
        : undefined)

    return _provinces
  }

  static async listCities(query: CityFilter) {
    const _cities = await db
      .select({
        value: cities.code,
        label: cities.name
      })
      .from(cities)
      .where(and(
        eq(cities.provinceCode, query.provinceCode),
        query.keyword
          ? like(cities.name, `%${query.keyword}%`)
          : undefined
      ))

    return _cities
  }

  static async listDistricts(query: DistrictFilter) {
    const _districts = await db
      .select({
        value: districts.code,
        label: districts.name
      })
      .from(districts)
      .where(and(
        eq(districts.cityCode, query.cityCode),
        query.keyword
          ? like(districts.name, `%${query.keyword}%`)
          : undefined
      ))

    return _districts
  }

  static async listSubdistricts(query: SubdistrictFilter) {
    const _subdistricts = await db
      .select({
        value: subdistricts.code,
        label: subdistricts.name
      })
      .from(subdistricts)
      .where(and(
        eq(subdistricts.districtCode, query.districtCode),
        query.keyword
          ? like(subdistricts.name, `%${query.keyword}%`)
          : undefined
      ))

    return _subdistricts
  }
}