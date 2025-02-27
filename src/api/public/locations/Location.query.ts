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
    code: subdistricts.code
  })
  .from(subdistricts)
  .innerJoin(districts, eq(districts.code, subdistricts.districtCode))
  .innerJoin(cities, eq(cities.code, districts.cityCode))
  .innerJoin(provinces, eq(provinces.code, cities.provinceCode))
);