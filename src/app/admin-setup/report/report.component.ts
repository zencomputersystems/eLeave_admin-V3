import { Component, OnInit, HostBinding } from '@angular/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../leave-setup/date.adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl } from '@angular/forms';
import { LeaveApiService } from '../leave-setup/leave-api.service';
import { APIService } from 'src/services/shared-service/api.service';
import { MenuController } from '@ionic/angular';

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
    * set menu is open or close by assign new class
    * @type {boolean}
    * @memberof ReportComponent
    */
  @HostBinding('class.menuOverlay') menuOpened: boolean;

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
   * company list from endpoint
   * @type {*}
   * @memberof ReportComponent
   */
  public companyList: any;

  /**
   * department list from master list endpoint
   * @type {*}
   * @memberof ReportComponent
   */
  public departmentList: any;

  /**
   * branch list from master list endpoint
   * @type {*}
   * @memberof ReportComponent
   */
  public branchList: any;

  /**
   * cost centre list from master list endpoint
   * @type {*}
   * @memberof ReportComponent
   */
  public costcentre: any;

  /**
   * list depends on selections 
   * @type {string}
   * @memberof ReportComponent
   */
  public selection: string = 'noSelection';

  /**
   * filtered company list
   * @type {*}
   * @memberof ReportComponent
   */
  public filteredCompany: any;

  /**
   * filtered department list
   * @type {*}
   * @memberof ReportComponent
   */
  public filteredDepartment: any;

  /**
   * filtered branch list
   * @type {*}
   * @memberof ReportComponent
   */
  public filteredBranch: any;

  /**
   * filtered cost centre list
   * @type {*}
   * @memberof ReportComponent
   */
  public filteredCostCentre: any;

  /**
   * company list ngmodel value
   * @type {string}
   * @memberof ReportComponent
   */
  public companyValue: string = 'Nothing Selected';

  /**
   * department list ngmodel value
   * @type {string}
   * @memberof ReportComponent
   */
  public departmentValue: string = 'Nothing Selected';

  /**
   * branch list ngmodel value
   * @type {string}
   * @memberof ReportComponent
   */
  public branchValue: string = 'Nothing Selected';

  /**
   * costcentre list ngmodel value
   * @type {string}
   * @memberof ReportComponent
   */
  public costCentreValue: string = 'Nothing Selected';

  /**
   * show/hide table
   * @type {boolean}
   * @memberof ReportComponent
   */
  public show: boolean = false;

  /**
   *Creates an instance of ReportComponent.
   * @param {LeaveApiService} leaveAPI
   * @param {APIService} api
   * @param {MenuController} menu access menu controller
   * @memberof ReportComponent
   */
  constructor(private leaveAPI: LeaveApiService, private api: APIService, public menu: MenuController) { }

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
    this.leaveAPI.get_company_list().subscribe(data => this.companyList = data);
    this.api.get_master_list('branch').subscribe(data => this.branchList = data);
    this.api.get_master_list('costcentre').subscribe(data => this.costcentre = data);
  }

  /**
   * get all user list
   * @memberof ReportComponent
   */
  userNameList(guid?: string) {
    this.filterSpinner = true;
    this.api.get_user_profile_list().subscribe(list => {
      this.userList = list;
      for (let i = 0; i < this.userList.length; i++) {
        this.userList[i]["isChecked"] = false;
        this.userList[i]["disabled"] = false;
      }
      if (guid != null) {
        this.filterCompany(guid);
      }
      this.filterSpinner = false;
    });
  }

  /**
   * filter user list from selected company
   * @param {string} guid
   * @memberof ReportComponent
   */
  filterCompany(guid: string) {
    let company = this.userList.filter((item: any) => {
      if (item.companyId !== null) {
        return (item.companyId.toLowerCase().indexOf(guid.toLowerCase()) > -1);
      }
    })
    this.filteredCompany = company;
  }

  /**
   * select company to filter department
   * @param {string} guid
   * @memberof ReportComponent
   */
  selectedCompany(guid: string) {
    this.selection = "company";
    this.leaveAPI.get_company_details(guid).subscribe(list => {
      this.departmentList = list.departmentList;
    })
    this.userNameList(guid);
  }

  /**
   * select department to filter list
   * @param {string} departmentname
   * @memberof ReportComponent
   */
  selectedDepartment(departmentname: string) {
    this.selection = "department";
    let department = this.filteredCompany.filter((item: any) => {
      if (item.department !== null) {
        return (item.department.toLowerCase().indexOf(departmentname.toLowerCase()) > -1);
      }
    })
    this.filteredDepartment = department;
  }

  /**
   * select branch to filter list
   * @param {string} branchName
   * @memberof ReportComponent
   */
  selectedBranch(branchName: string) {
    this.selection = "branch";
    if (this.departmentValue !== 'Nothing Selected' && this.companyValue !== 'Nothing Selected') {
      let branch = this.filteredDepartment.filter((item: any) => {
        if (item.branch !== null) {
          return (item.branch.toLowerCase().indexOf(branchName.toLowerCase()) > -1);
        }
      })
      this.filteredBranch = branch;
    } else if (this.departmentValue == 'Nothing Selected') {
      let branch = this.filteredCompany.filter((list: any) => {
        if (list.branch !== null) {
          return (list.branch.toLowerCase().indexOf(branchName.toLowerCase()) > -1);
        }
      })
      this.filteredBranch = branch;
    } else {
      let branch = this.userList.filter((object: any) => {
        if (object.branch !== null) {
          return (object.branch.toLowerCase().indexOf(branchName.toLowerCase()) > -1);
        }
      })
      this.filteredBranch = branch;
    }
  }

  /**
   * select cost centre to filter list
   * @param {string} name
   * @memberof ReportComponent
   */
  selectedCostCentre(name: string) {
    this.selection = "costcentre";
    if (this.departmentValue !== 'Nothing Selected' && this.companyValue !== 'Nothing Selected') {
      let costCentre = this.filteredDepartment.filter((val: any) => {
        if (val.costcentre !== null) {
          return (val.costcentre.toLowerCase().indexOf(name.toLowerCase()) > -1);
        }
      })
      this.filteredCostCentre = costCentre;
    } else if (this.departmentValue == 'Nothing Selected') {
      let costCentreVal = this.filteredCompany.filter((items: any) => {
        if (items.costcentre !== null) {
          return (items.costcentre.toLowerCase().indexOf(name.toLowerCase()) > -1);
        }
      })
      this.filteredCostCentre = costCentreVal;
    } else {
      let costCentre = this.userList.filter((costCentreItem: any) => {
        if (costCentreItem.costcentre !== null) {
          return (costCentreItem.costcentre.toLowerCase().indexOf(name.toLowerCase()) > -1);
        }
      })
      this.filteredCostCentre = costCentre;
    }
  }

  /**
     * Filter text key in from searchbar 
     * @param {*} character
     * @memberof ReportComponent
     */
  async filterSearchbar(character: any) {
    this.filterSpinner = true;
    if (character && character.trim() != '') {
      let employeeName = this.userList.filter((item: any) => {
        return (item.employeeName.toLowerCase().indexOf(character.toLowerCase()) > -1);
      })
      let id = this.userList.filter((values: any) => {
        return (values.staffNumber.toLowerCase().indexOf(character.toLowerCase()) > -1);
      })
      this.userList = require('lodash').uniqBy(employeeName.concat(id), 'id');
      this.filterSpinner = false;
    }
  }

  /**
   * To filter entered text
   * @param {*} character
   * @memberof ReportComponent
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
    if (this.indeterminate) {
      this.hideImg = [];
      this.hideImg.push(...Array(this.userList.length).fill(true));
    } else if (isIn && !isChecked && !this.indeterminate) {
      this.hideImg.splice(index, 1, true);
    } else {
      this.hideImg.splice(0, this.hideImg.length);
      this.hideImg.push(...Array(this.userList.length).fill(false));
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
        if (item.isChecked) {
          this.hideImg.push(true);
        } else {
          this.hideImg.push(false);
        }
      });
    })
  }

  /**
   * check sub checkbox to make changing in main checkbox (interminate)
   * @memberof ReportComponent
   */
  contentList(itemId) {
    const totalLength = this.userList.length;
    let checkedNo = 0;
    this.userList.map(item => {
      if (item.isChecked) {
        checkedNo++;
        this.hideImg.push(true);
      }
      if (item.id !== itemId) {
        item.disabled = !item.disabled;
      }
    });
    if (checkedNo > 0 && checkedNo < totalLength) {
      this.indeterminate = true;
    } else {
      this.indeterminate = false;
    }
  }

}
