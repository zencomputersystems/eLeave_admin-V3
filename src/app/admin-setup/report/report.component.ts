import { Component, OnInit, HostBinding } from '@angular/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../leave-setup/date.adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl } from '@angular/forms';
import { LeaveApiService } from '../leave-setup/leave-api.service';
import { APIService } from 'src/services/shared-service/api.service';
import { ReportApiService } from './report-api.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as _moment from 'moment';
const { Parser } = require('json2csv');

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
   * selection value of report types
   * @type {string}
   * @memberof ReportComponent
   */
  public selects: string;

  /**
   * requested report table details
   * @type {*}
   * @memberof ReportComponent
   */
  public tableDetails: any;

  /**
   * clicked produce report button 
   * @type {boolean}
   * @memberof ReportComponent
   */
  public clickedProduce: boolean;

  /**
   * selected user id
   * @type {string}
   * @memberof ReportComponent
   */
  public selectedUserId: string;

  /**
   * leave types list that have been selected
   * @private
   * @type {string[]}
   * @memberof ReportComponent
   */
  private _selectedLeaveTypesList: string[] = [];

  /**
   *Creates an instance of ReportComponent.
   * @param {LeaveApiService} leaveAPI
   * @param {APIService} api
   * @param {ReportApiService} reportAPI
   * @memberof ReportComponent
   */
  constructor(private leaveAPI: LeaveApiService, private api: APIService, private reportAPI: ReportApiService) { }

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
   * download report in pdf
   * @param {*} title
   * @param {*} headerKey
   * @memberof ReportComponent
   */
  savePDF(title, headerKey) {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(9);
    doc.text(5, 7, title);
    doc.text(5, 11, 'From ' + _moment(this.firstPicker.value).format('DD MMM YYYY') + ' to ' + _moment(this.secondPicker.value).format('DD MMM YYYY'));
    doc.autoTable({
      headStyles: { fillColor: [67, 66, 93], fontSize: 7.5, minCellWidth: 2 },
      bodyStyles: { fontSize: 7.5, minCellWidth: 10 },
      margin: { top: 13, left: 5, right: 5, bottom: 5 },
      showHead: 'everyPage',
      body: this.tableDetails,
      columns: headerKey,
      didParseCell: (data) => {
        if (title === 'Leave Entitlement Summary' || title === 'Leave Taken History') {
          let type = '', start = '', end = '', days = '', approved = '', remark = '', takenLeaveType = '',
            entitled = '', carried = '', forfeited = '', taken = '', pending = '', balance = '';
          for (let i = 0; i < data.table.body.length; i++) {
            for (let j = 0; j < data.table.body[i].raw.leaveDetail.length; j++) {
              if (data.row.index === i && data.section === 'body') {
                if (title === 'Leave Entitlement Summary') {
                  if (data.column.index === 4) {
                    type += data.table.body[i].raw.leaveDetail[j].leaveTypeName + '\n';
                    data.cell.text = type;
                  }
                  if (data.column.index === 5) {
                    entitled += data.table.body[i].raw.leaveDetail[j].entitledDays + '\n';
                    data.cell.text = entitled;
                  }
                  if (data.column.index === 6) {
                    carried += data.table.body[i].raw.leaveDetail[j].carriedForward + '\n';
                    data.cell.text = carried;
                  }
                  if (data.column.index === 7) {
                    forfeited += data.table.body[i].raw.leaveDetail[j].forfeited + '\n';
                    data.cell.text = forfeited;
                  }
                  if (data.column.index === 8) {
                    taken += data.table.body[i].raw.leaveDetail[j].taken + '\n';
                    data.cell.text = taken;
                  }
                  if (data.column.index === 9) {
                    pending += data.table.body[i].raw.leaveDetail[j].pending + '\n';
                    data.cell.text = pending;
                  }
                  if (data.column.index === 10) {
                    balance += data.table.body[i].raw.leaveDetail[j].balance + '\n';
                    data.cell.text = balance;
                  }
                }
                if (title === 'Leave Taken History') {
                  if (data.column.index === 3) {
                    takenLeaveType += data.table.body[i].raw.leaveDetail[j].leaveTypeName + '\n';
                    data.cell.text = takenLeaveType;
                  }
                  if (data.column.index === 4) {
                    start += data.table.body[i].raw.leaveDetail[j].startDate + '\n';
                    data.cell.text = start;
                  }
                  if (data.column.index === 5) {
                    end += data.table.body[i].raw.leaveDetail[j].endDate + '\n';
                    data.cell.text = end;
                  }
                  if (data.column.index === 6) {
                    days += (data.table.body[i].raw.leaveDetail[j].noOfDays) + '\n';
                    data.cell.text = days
                  }
                  if (data.column.index === 7) {
                    approved += data.table.body[i].raw.leaveDetail[j].approveBy + '\n';
                    data.cell.text = approved;
                  }
                  if (data.column.index === 8) {
                    remark += data.table.body[i].raw.leaveDetail[j].remarks + '\n';
                    data.cell.text = remark;
                  }
                }
              }
            }
          }
        }
      }
    })
    doc.save(title + '.pdf')
  }

  /**
   * download report in CSV
   * @param {string} title
   * @param {*} fields
   * @memberof ReportComponent
   */
  saveCSV(title: string, fields) {
    const json2csvParser = new Parser({ fields, unwind: ['leaveDetail', 'leaveDetail.leaveDetail'] });
    const csv = json2csvParser.parse(this.tableDetails);
    const blob = new Blob([csv], { type: "text/plain" });
    const csvFile = window.document.createElement("a");
    csvFile.href = window.URL.createObjectURL(blob);
    csvFile.download = title + ".csv";
    document.body.appendChild(csvFile);
    csvFile.click();
    document.body.removeChild(csvFile);
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
  checkSubLeaveTypes(id: string) {
    const total = this.leaveTypes.length;
    let checkedNumber = 0;
    this.leaveTypes.map(value => {
      if (value.isChecked) {
        checkedNumber++;
      }
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
        this.selectedUserId = item.userId;
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

  /**
   * produce individual report from selected user and table type
   * @memberof ReportComponent
   */
  produceIndividualReport() {
    this._selectedLeaveTypesList = [];
    for (let i = 0; i < this.leaveTypes.length; i++) {
      if (this.leaveTypes[i].isChecked === true) {
        this._selectedLeaveTypesList.push(this.leaveTypes[i].LEAVE_TYPE_GUID);
      }
    }
    console.log(this._selectedLeaveTypesList);
    this.reportAPI.get_individual_report(this.selectedUserId, this.selects).subscribe(data => {
      this.tableDetails = data;
      this.filter();
    });
  }

  /**
   * produce group report table from selected table type
   * @memberof ReportComponent
   */
  produceGroupReport() {
    this.reportAPI.get_bundle_report(this.selects).subscribe(value => {
      this.tableDetails = value;
      this.filter();
    });
  }

  /**
   * filter date range from selected table
   * @memberof ReportComponent
   */
  filter() {
    if (this.selects == 'apply-on-behalf') {
      let selectedMembers = this.tableDetails.filter(
        m => new Date(m.applicationDate) >= this.firstPicker.value && new Date(m.applicationDate) <= this.secondPicker.value
      );
      this.tableDetails = selectedMembers;
    }
    if (this.selects == 'leave-taken') {
      const newLeaveDetails = [];
      this.tableDetails.filter(
        m => {
          m.leaveDetail.filter(
            details => {
              if (new Date(details.startDate) >= this.firstPicker.value && new Date(details.endDate) <= this.secondPicker.value) {
                newLeaveDetails.push(details);
                m.leaveDetail = newLeaveDetails;
              }
            })
        }
      );
    }
    if (this.selects == 'leave-cancellation' || this.selects == 'leave-rejected') {
      let selectedMembers = this.tableDetails.filter(
        value => new Date(value.startDate) >= this.firstPicker.value && new Date(value.endDate) <= this.secondPicker.value
      );
      this.tableDetails = selectedMembers;
    }
    if (this.selects == 'employee-master-list') {
      let filteredEmployee = this.tableDetails.filter(
        items => new Date(items.joinDate) >= this.firstPicker.value && new Date(items.joinDate) <= this.secondPicker.value
      );
      this.tableDetails = filteredEmployee;
    }
    this.tableDetails.forEach((element, index) => {
      element["no"] = index + 1;
    });
  }

  /**
   * clear checkbox
   * @memberof ReportComponent
   */
  clearCheckbox() {
    this.leaveTypes.forEach(items => {
      items.isChecked = false;
    });

    this.userList.forEach(list => {
      list.isChecked = false;
    });
  }

}
