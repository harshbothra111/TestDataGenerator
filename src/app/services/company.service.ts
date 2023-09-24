import { Injectable } from '@angular/core';
import { Faker, SimpleFaker, en, faker } from '@faker-js/faker';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor() { }
  getData(column:any){
    let dataFaker = new Faker({locale: [en]});
    let data:any = {
      name : dataFaker.company.name()
    }
    return data[column.subCategory];
  }
}
