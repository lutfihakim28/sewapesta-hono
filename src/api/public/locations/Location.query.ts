import { db } from 'db';
import { cities } from 'db/schema/cities';
import { districts } from 'db/schema/districts';
import { provinces } from 'db/schema/provinces';
import { subdistricts } from 'db/schema/subdistricts';
import { eq, sql } from 'drizzle-orm';

export const locationQuery = db.$with('locationQuery').as(db
  .select({
    subdistrict: sql<string>`${subdistricts.name}`.as('subdistrict'),
    district: sql<string>`${districts.name}`.as('district'),
    city: sql<string>`${cities.name}`.as('city'),
    province: sql<string>`${provinces.name}`.as('province'),
    subdistrictCode: sql<string>`${subdistricts.code}`.as('subdistrictCode'),
    districtCode: sql<string>`${districts.code}`.as('districtCode'),
    cityCode: sql<string>`${cities.code}`.as('cityCode'),
    provinceCode: sql<string>`${provinces.code}`.as('provinceCode'),
  })
  .from(subdistricts)
  .leftJoin(districts, eq(districts.code, subdistricts.districtCode))
  .leftJoin(cities, eq(cities.code, districts.cityCode))
  .leftJoin(provinces, eq(provinces.code, cities.provinceCode))
);