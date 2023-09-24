import { Injectable } from '@angular/core';
import { Faker, en } from '@faker-js/faker';

@Injectable({
  providedIn: 'root'
})
export class DataTypeService {

  constructor() { }
  getData(column:any){
    let dataFaker = new Faker({locale: [en]});
    let data:any = {
      boolean : dataFaker.datatype.boolean()
    }
    return ''+data[column.subCategory];
  }
}
