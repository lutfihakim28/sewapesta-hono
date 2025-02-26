import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { db } from 'db';
import { items } from 'db/schema/items';
import { orderedProducts } from 'db/schema/orderedProducts';
import { productsItems } from 'db/schema/productsItems';
import { products } from 'db/schema/products';
import { and, asc, desc, eq, inArray, isNull, sql, sum } from 'drizzle-orm';
import { branches } from 'db/schema/branches';
import { subdistricts } from 'db/schema/subdistricts';
import { cities } from 'db/schema/cities';
import { districts } from 'db/schema/districts';
import { provinces } from 'db/schema/provinces';
import { countOffset } from '@/lib/utils/countOffset';

export abstract class SQLTestService {
  static async test() {
    const district = await db
      .select()
      .from(subdistricts)
      .orderBy(asc(subdistricts.code))
      .limit(1)

    return district

    // return _branches.map((branch) => new Branch(branch))
  }
}