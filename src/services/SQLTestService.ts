import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { db } from 'db';
import { items } from 'db/schema/items';
import { orderedProducts } from 'db/schema/orderedProducts';
import { productsItems } from 'db/schema/productsItems';
import { products } from 'db/schema/products';
import { and, eq, inArray, isNull, sql, sum } from 'drizzle-orm';
import { branches } from 'db/schema/branches';
import { subdistricts } from 'db/schema/subdistricts';
import { cities } from 'db/schema/cities';
import { districts } from 'db/schema/districts';
import { provinces } from 'db/schema/provinces';
import { countOffset } from '@/lib/utils/countOffset';

export abstract class SQLTestService {
  static async test() {
    // const _branches = await db.query.branches.findMany({
    //   columns: {
    //     address: true,
    //     cpName: true,
    //     cpPhone: true,
    //     id: true,
    //     name: true,
    //   },
    //   with: {
    //     subdistrict: {
    //       columns: {
    //         code: true,
    //         name: true,
    //       },
    //       with: {
    //         district: {
    //           columns: {
    //             code: true,
    //             name: true,
    //           },
    //           with: {
    //             city: {
    //               columns: {
    //                 code: true,
    //                 name: true,
    //               },
    //               with: {
    //                 province: {
    //                   columns: {
    //                     code: true,
    //                     name: true,
    //                   },
    //                 }
    //               },
    //             }
    //           },
    //         }
    //       },
    //     }
    //   },
    // })

    // return _branches.map((branch) => new Branch(branch))
  }
}