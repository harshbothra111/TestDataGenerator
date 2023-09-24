import { Injectable } from '@angular/core';
import { Faker, en } from '@faker-js/faker';

@Injectable({
  providedIn: 'root'
})
export class CommerceService {

  constructor() { }
  getData(column: any) {
    let dataFaker = new Faker({ locale: [en] });
    let data: any = {
      department: dataFaker.commerce.department(),
      isbn: dataFaker.commerce.isbn(),
      price: dataFaker.commerce.price({
        min: column.range.min ? column.range.min : undefined,
        max: column.range.max ? column.range.max : undefined,
        dec: column.range.hasDecimal ? 2 : undefined
      }),
      product: dataFaker.commerce.product(),
      productAdjective: dataFaker.commerce.productAdjective(),
      productDescription: dataFaker.commerce.productDescription(),
      productMaterial: dataFaker.commerce.productMaterial(),
      productName: dataFaker.commerce.productName(),
    }
    return data[column.subCategory];
  }
}
