import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { faker } from '@faker-js/faker';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Test Data Generator';
  noOfColumns = 0;
  isCreated = false;
  columnDetails: any = [];
  categories: any = [];
  selectedCategoryIndex: any;
  @ViewChild('dataForm') form: NgForm;
  submitted: boolean;
  noOfRows = 1;
  data: any = [];

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
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
      for (let i = 0; i < this.noOfColumns; i++) {
        this.columnDetails.push({
          name: "",
          category: "",
          subCategory: "",
          range: {
            min: "",
            max: ""
          }
        });
      }
    }
  }

  updateCategory(selectedCategory: string, columnIndex: number) {
    const index = this.categories.findIndex((x: any) => x.name === selectedCategory);
    if (index >= 0) {
      this.columnDetails[columnIndex].subCategory = "";
      this.selectedCategoryIndex = index;
    }
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
      let data: any = {};
      this.columnDetails.forEach((column: any) => {
        data.name = column.name;
        data.value = faker.company.name();
      });
      this.data.push(data);
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
        line += array[i]["value"].replace(/,/g, '') + ',';
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }
}
