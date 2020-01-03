import { Component, OnInit } from '@angular/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../leave-setup/date.adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl } from '@angular/forms';
import { LeaveApiService } from '../leave-setup/leave-api.service';
import { APIService } from 'src/services/shared-service/api.service';

/**
 * history report page
 * @export
 * @class ReportComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ReportComponent implements OnInit {

  /**
   * clicked individual button
   * @type {boolean}
   * @memberof ReportComponent
   */
  public individualButton: boolean = true;

  /**
   * clicked group button
   * @type {boolean}
   * @memberof ReportComponent
   */
  public groupButton: boolean = false;

  /** 
  * filter start date for report
  * @type {*}
  * @memberof ReportComponent
  */
  public firstPicker: any;

  /**
   * filter end date for report
   * @type {*}
   * @memberof ReportComponent
   */
  public secondPicker: any;

  /**
   * all leave types list
   * @type {*}
   * @memberof ReportComponent
   */
  public leaveTypes: any;

  /**
   * all users list
   * @type {*}
   * @memberof ReportComponent
   */
  public userList: any;

  /**
     * header checkbox checked/unchecked
     * @type {boolean}
     * @memberof ReportComponent
     */
  public mainListCheckbox: boolean;

  /**
   * value of indeterminate in main checkbox
   * @type {boolean}
   * @memberof ReportComponent
   */
  public indeterminate: boolean;

  /**
   * hover value of show/hide checkbox
   * @type {boolean}
   * @memberof ReportComponent
   */
  public hideImg: boolean[] = [];

  /**
     * Value of checkbox (either indeterminate or vice versa)
     * @type {boolean[]}
     * @memberof ReportComponent
     */
  public isInde: boolean;

  /**
   * Value of main checkbox (either true or vice versa)
   * @type {boolean[]}
   * @memberof ReportComponent
   */
  public isMain: boolean;

  /**
   * show spinner during request new list
   * @type {boolean}
   * @memberof ReportComponent
   */
  public filterSpinner: boolean;

  /**
   *Creates an instance of ReportComponent.
   * @param {LeaveApiService} leaveAPI
   * @param {APIService} api
   * @memberof ReportComponent
   */
  constructor(private leaveAPI: LeaveApiService, private api: APIService) { }

  /**
   * initial report
   * @memberof ReportComponent
   */
  ngOnInit() {
    const f = new Date(new Date().getFullYear(), 0, 1);
    const l = new Date(new Date().getFullYear(), 11, 31);
    this.firstPicker = new FormControl(f);
    this.secondPicker = new FormControl(l);
    this.leaveAPI.get_admin_leavetype().subscribe(data => {
      this.leaveTypes = data;
      for (let i = 0; i < this.leaveTypes.length; i++) {
        this.leaveTypes[i]["isChecked"] = false;
      }
    });
    this.userNameList();
  }

  /**
   * get all user list
   * @memberof ReportComponent
   */
  userNameList() {
    this.filterSpinner = true;
    this.api.get_user_profile_list().subscribe(list => {
      this.userList = list;
      for (let i = 0; i < this.userList.length; i++) {
        this.userList[i]["isChecked"] = false;
      }
      this.filterSpinner = false;
    });
  }

  /**
     * Filter text key in from searchbar 
     * @param {*} character
     * @memberof ApplyOnBehalfComponent
     */
  async filterSearchbar(character: any) {
    this.filterSpinner = true;
    if (character && character.trim() != '') {
      let employeeName = this.userList.filter((item: any) => {
        return (item.employeeName.toLowerCase().indexOf(character.toLowerCase()) > -1);
      })
      let id = this.userList.filter((item: any) => {
        return (item.staffNumber.toLowerCase().indexOf(character.toLowerCase()) > -1);
      })
      this.userList = require('lodash').uniqBy(employeeName.concat(id), 'id');
      this.filterSpinner = false;
    }
  }

  /**
   * To filter entered text
   * @param {*} character
   * @memberof ApplyOnBehalfComponent
   */
  keyUpSearchbar(character: any) {
    if (character === '') {
      this.userNameList();
    } else {
      this.filterSearchbar(character);
    }
  }

  /**
   * get main checkbox value
   * @memberof ReportComponent
   */
  checkLeaveTypes() {
    setTimeout(() => {
      this.leaveTypes.forEach(item => {
        item.isChecked = this.isMain;
      });
    })
  }

  /**
     * detect checkbox is Indeterminate or not
     * detect main checkbox value
     * @param {*} list
     * @param {number} [masterIndex]
     * @param {number} [index]
     * @memberof ReportComponent
     */
  checkSubLeaveTypes() {
    const total = this.leaveTypes.length;
    let checkedNumber = 0;

    this.leaveTypes.map(value => {
      if (value.isChecked)
        checkedNumber++;
    });
    if (checkedNumber > 0 && checkedNumber < total) {
      this.isInde = true;
      this.isMain = false;
    } else if (checkedNumber == total) {
      this.isMain = true;
      this.isInde = false;
    } else {
      this.isInde = false;
      this.isMain = false;
    }
  }

  /**
     * mouse hover to show/hide checkbox
     * @param {number} index
     * @param {boolean} isIn
     * @param {boolean} isChecked
     * @memberof ReportComponent
     */
  hoverValue(index: number, isIn: boolean, isChecked: boolean) {
    if (isChecked && (this.mainListCheckbox || this.indeterminate)) {
      this.hideImg = [];
      this.userList.map(value => { this.hideImg.push(true); });
    } else if (!isChecked && (this.mainListCheckbox || this.indeterminate)) {
      this.hideImg.splice(0, this.hideImg.length);
      this.userList.map(item => { this.hideImg.push(true); });
    } else if (isIn && !isChecked && !this.indeterminate && !this.mainListCheckbox) {
      this.hideImg.splice(index, 1, true);
    } else {
      this.hideImg.splice(0, this.hideImg.length);
      this.userList.map(item => { this.hideImg.push(false); });
    }
  }

  /**
   * check main checkbox to check all sub checkbox
   * @memberof ReportComponent
   */
  headerList() {
    this.hideImg.splice(0, this.hideImg.length);
    setTimeout(() => {
      this.userList.forEach(item => {
        item.isChecked = this.mainListCheckbox;
        if (item.isChecked) {
          this.hideImg.push(true);
        } else {
          this.hideImg.push(false);
        }
      });
    })
  }

  /**
   * check sub checkbox to make changing in main checkbox (interminate/mainCheckBox)
   * @memberof ReportComponent
   */
  contentList() {
    const totalLength = this.userList.length;
    let checkedNo = 0;
    this.userList.map(item => {
      if (item.isChecked) {
        checkedNo++;
        this.hideImg.push(true);
      }
    });
    if (checkedNo > 0 && checkedNo < totalLength) {
      this.indeterminate = true;
      this.mainListCheckbox = false;
    } else if (checkedNo == totalLength) {
      this.mainListCheckbox = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = false;
      this.mainListCheckbox = false;
    }
  }

}
