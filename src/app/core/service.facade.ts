import { Injectable } from "@angular/core";
import { CompanyService } from "../services/company.service";
import { CommerceService } from "../services/commerce.service";
import { DataTypeService } from "../services/data-type.service";

@Injectable({
    providedIn: 'root'
})

export class ServiceFacade {
    constructor(private companyService: CompanyService,
        private commerceService: CommerceService,
        private dataTypeService: DataTypeService) { }
    getData(columnDetail: any) {
        let data: any = {
            Company: this.companyService.getData(columnDetail),
            Commerce: this.commerceService.getData(columnDetail),
            Datatype: this.dataTypeService.getData(columnDetail)
        };
        return data[columnDetail.category];
    }
}