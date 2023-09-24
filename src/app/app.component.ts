import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceFacade } from './core/service.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Test Data Generator';
  noOfColumns = 1;
  isCreated = false;
  columnDetails: any = [];
  categories: any = [];
  selectedCategoryIndex: any;
  @ViewChild('dataForm') form: NgForm;
  submitted: boolean;
  noOfRows = 1;
  data: any = [];
  currentRow: number = 0;
  subCategories: any = [];
  isNumberCategory: any = [];
  isDecimalCategory: any = [];

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private serviceFacade: ServiceFacade) {
    this.http.get("assets/data/column-types.json").subscribe({
      next: (response) => {
        this.categories = response;
      }
    })
  }

  createColumns() {
    this.columnDetails = [];
    this.isCreated = this.noOfColumns > 0;
    if (this.isCreated) {
      this.subCategories = [];
      for (let i = 0; i < this.noOfColumns; i++) {
        this.columnDetails.push({
          name: "",
          category: "",
          subCategory: "",
          range: {
            min: "",
            max: "",
            hasDecimal: false
          }
        });
        this.subCategories.push([]);
        this.isNumberCategory.push(false);
        this.isDecimalCategory.push(false);
      }
    }
  }

  updateCategory(selectedCategory: string, columnIndex: number) {
    const index = this.categories.findIndex((x: any) => x.name === selectedCategory);
    if (index >= 0) {
      this.subCategories[columnIndex] = this.categories[index].categories;
      this.columnDetails[columnIndex].subCategory = "";
      this.columnDetails[columnIndex].range = {
        min: "",
        max: "",
        hasDecimal: false
      }
      this.selectedCategoryIndex = index;
      this.isNumberCategory[columnIndex] = false;
      this.isDecimalCategory[columnIndex] = false;
    }
  }

  updateSubCategory(selectedCategory: string, columnIndex: number) {
    const decimalCategories = ["float", "price"];
    const numberCategories = ["int", "bigInt", "float", "price"]
    this.isNumberCategory[columnIndex] = numberCategories.indexOf(selectedCategory) >= 0;
    this.isDecimalCategory[columnIndex] = decimalCategories.indexOf(selectedCategory) >= 0;
  }

  generateData() {
    this.submitted = true;
    if (this.form.form.valid) {
      this.spinner.show();
      setTimeout(() => {
        this.prepareData();
        this.downloadFile();
        this.spinner.hide();
      }, 2000);
    }
  }

  prepareData() {
    this.data = [];
    for (let i = 0; i < this.noOfRows; i++) {
      let data: any = { values: [] };
      this.columnDetails.forEach((column: any) => {
        data.values.push(this.serviceFacade.getData(column));
      });
      this.data.push(data);
      this.currentRow = i + 1;
    }
  }

  downloadFile() {
    const filename = 'data.csv';
    let csvData = this.convertToCSV();
    let blob = new Blob(['\ufeff' + csvData],
      { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') !=
      -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {

      // If Safari open in new window to
      // save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  convertToCSV() {
    let headerList = this.columnDetails.map((x: any) => x.name);
    let array = this.data;
    let str = '';
    let row = '';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        line += array[i]["values"][index].replace(/,/g, '') + ',';
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }
}
