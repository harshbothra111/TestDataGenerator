import { Injectable } from "@angular/core";
import { CompanyService } from "../services/company.service";
import { CommerceService } from "../services/commerce.service";

@Injectable({
    providedIn: 'root'
})

export class ServiceFacade {
    constructor(private companyService: CompanyService,
        private commerceService: CommerceService) { }
    getData(columnDetail: any) {
        let data: any = {
            Company: this.companyService.getData(columnDetail),
            Commerce: this.commerceService.getData(columnDetail)
        };
        return data[columnDetail.category];
    }
}