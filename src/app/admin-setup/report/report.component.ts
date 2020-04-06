import { Component, OnInit, HostBinding } from '@angular/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../leave-setup/date.adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl } from '@angular/forms';
import { LeaveApiService } from '../leave-setup/leave-api.service';
import { APIService } from 'src/services/shared-service/api.service';
import { ReportApiService } from './report-api.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as _moment from 'moment';
import { Platform } from '@ionic/angular';

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
  public selectedUserId: string[] = [];

  /**
   * main checkbox of employee list
   * @type {boolean}
   * @memberof ReportComponent
   */
  public listMain: boolean;

  /** 
   * profile picture details
   * @type {*}
   * @memberof ReportComponent
   */
  public url: any;

  /**
   * selected number of users
   * @type {number}
   * @memberof ReportComponent
   */
  public selectedNum: number = 0;

  /**
   * selected company id
   * @type {string}
   * @memberof ReportComponent
   */
  public companyId: string;

  /**
   * selected department name
   * @type {string}
   * @memberof ReportComponent
   */
  public departmentName: string;

  /**
   * selected branch name
   * @type {string}
   * @memberof ReportComponent
   */
  public branchName: string;

  /**
   * selected cost centre name
   * @type {string}
   * @memberof ReportComponent
   */
  public costCentreName: string;

  /**
   * small spinner
   * @type {boolean}
   * @memberof ReportComponent
   */
  public showSpinner: boolean;

  /**
   * filtered table details according the selected user
   * @type {any[]}
   * @memberof ReportComponent
   */
  public arrayDetails: any[] = [];

  /**
   * values of group
   * @type {*}
   * @memberof ReportComponent
   */
  public groupValue: any;

  /**
   * key values of group
   * @type {*}
   * @memberof ReportComponent
   */
  public groupKey: any;

  /**
   * name of group
   * @type {string}
   * @memberof ReportComponent
   */
  public name: string;

  /**
   * form control array value of selected group
   * @type {string}
   * @memberof ReportComponent
   */
  public selectedName: string;

  /**
   * list of selected group index
   * @type {number[]}
   * @memberof ReportComponent
   */
  // public selectedIndex: number[] = [];

  /**
   * show/hide group selection
   * @type {boolean}
   * @memberof ReportComponent
   */
  public showGroupSelection: boolean = true;

  /**
   * searchbar key up value
   * @private
   * @type {string}
   * @memberof ReportComponent
   */
  private _character: string;

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
   * @param {Platform} reportPlatform
   * @memberof ReportComponent
   */
  constructor(private leaveAPI: LeaveApiService, private api: APIService, private reportAPI: ReportApiService, public reportPlatform: Platform) {
    this.api.get_profile_pic('all').subscribe(data => {
      this.url = data;
    })
  }

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
    const zip = new JSZip();
    for (let i = 0; i < this.groupValue.length; i++) {
      const doc = new jsPDF('l', 'mm', 'a4');
      doc.setFontSize(9);
      doc.text(5, 7, title + ' - ' + this.groupKey[i]);
      doc.text(5, 11, 'From ' + _moment(this.firstPicker.value).format('DD MMM YYYY') + ' to ' + _moment(this.secondPicker.value).format('DD MMM YYYY'));
      doc.autoTable({
        headStyles: { fillColor: [67, 66, 93], fontSize: 7.5, minCellWidth: 2 },
        bodyStyles: { fontSize: 7.5, minCellWidth: 10 },
        margin: { top: 13, left: 5, right: 5, bottom: 5 },
        showHead: 'everyPage',
        body: this.groupValue[i],
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
      let convertFileType = doc.output('blob');
      zip.file(title + ' - ' + this.groupKey[i] + '.pdf', convertFileType, { base64: true });
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, title + '_PDF' + ".zip");
    });
  }

  /**
   * download report in CSV
   * @param {string} title
   * @param {*} fields
   * @memberof ReportComponent
   */
  saveCSV(title: string, fields) {
    const zip = new JSZip();
    for (let i = 0; i < this.groupValue.length; i++) {
      const json2csvParser = new Parser({ fields, unwind: ['leaveDetail', 'leaveDetail.leaveDetail'] });
      const csv = json2csvParser.parse(this.groupValue[i]);
      const blob = new Blob([csv], { type: "text/plain" });
      zip.file(title + ' - ' + this.groupKey[i] + '.csv', blob, { base64: true });
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, title + '_CSV' + ".zip");
    });
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
      if (this._character != null) {
        this.filterSearchbar(this._character);
      }
      if (this.companyId != null) {
        let company = this.userList.filter((item: any) => {
          if (item.companyId !== null) {
            return (item.companyId.toLowerCase().indexOf(this.companyId.toLowerCase()) > -1);
          }
        })
        this.userList = company;
      }
      if (this.departmentName != null) {
        let department = this.userList.filter((item: any) => {
          if (item.department !== null) {
            return (item.department.toLowerCase().indexOf(this.departmentName.toLowerCase()) > -1);
          }
        })
        this.userList = department;
      }
      if (this.branchName != null) {
        let branch = this.userList.filter((object: any) => {
          if (object.branch !== null) {
            return (object.branch.toLowerCase().indexOf(this.branchName.toLowerCase()) > -1);
          }
        })
        this.userList = branch;
      }
      if (this.costCentreName != null) {
        let costCentre = this.userList.filter((costCentreItem: any) => {
          if (costCentreItem.costcentre !== null) {
            return (costCentreItem.costcentre.toLowerCase().indexOf(this.costCentreName.toLowerCase()) > -1);
          }
        })
        this.userList = costCentre;
      }
      this.filterSpinner = false;
    });
  }

  /**
   * select company to filter department
   * @param {string} guid
   * @memberof ReportComponent
   */
  selectedCompany(guid: string) {
    this.companyId = guid;
    this.leaveAPI.get_company_details(guid).subscribe(list => {
      this.departmentList = list.departmentList;
    })
    this.userNameList();
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
    this._character = character;
    this.userNameList();
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
    if (this.indeterminate || this.listMain) {
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
        item.isChecked = this.listMain;
        if (item.isChecked) {
          this.hideImg.push(true);
          this.selectedNum++;
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
    this.selectedNum = 0;
    this.selectedUserId = [];
    this.userList.map(item => {
      if (item.isChecked) {
        checkedNo++;
        this.selectedNum++;
        this.selectedUserId.push(item.userId);
        this.hideImg.push(true);
      }
    });
    if (checkedNo > 0 && checkedNo < totalLength) {
      this.indeterminate = true;
      this.listMain = false;
    } else if (checkedNo == totalLength) {
      this.listMain = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = false;
      this.listMain = false;
    }
  }

  /**
   * produce group report table from selected table type
   * @memberof ReportComponent
   */
  produceGroupReport(groupName: string, name: string) {
    this.showSpinner = true;
    this.name = name;
    this._selectedLeaveTypesList = [];
    for (let i = 0; i < this.leaveTypes.length; i++) {
      if (this.leaveTypes[i].isChecked === true) {
        this._selectedLeaveTypesList.push(this.leaveTypes[i].LEAVE_TYPE_GUID);
      }
    }
    this.reportAPI.get_bundle_report(this.selects).subscribe(value => {
      this.tableDetails = value;
      this.arrayDetails = [];
      for (let i = 0; i < this.tableDetails.length; i++) {
        if (this.selectedUserId.includes(this.tableDetails[i].userGuid)) {
          this.arrayDetails.push(this.tableDetails[i]);
        }
      }
      this.filter();
      let data = require('lodash').groupBy(this.arrayDetails, groupName);
      this.groupValue = Object.values(data);
      this.groupValue.splice(0, 0, this.arrayDetails);
      this.groupKey = Object.keys(data);
      this.groupKey.splice(0, 0, 'All');
      if (groupName === 'all') {
        this.groupValue.splice(1, 1);
        this.groupKey.splice(1, 1);
      }
      console.log('afterValue', this.groupValue);
      console.log('afterkey', this.groupKey);
      this.showSpinner = false;
      this.clickedProduce = true;
      this.selectedName = this.groupKey[0];
      for (let j = 0; j < this.groupValue.length; j++) {
        for (let i = 0; i < this.groupValue[j].length; i++) {
          this.groupValue[j][i]["no"] = i + 1;
        }
      }
      console.log(this.groupValue);
      this.showSelectTable(0);
    });
  }

  /**
   * show selected table from 
   * company/department/branch/cost centre
   * @param {number} index
   * @memberof ReportComponent
   */
  showSelectTable(index: number) {
    this.arrayDetails = this.groupValue[index];
    // for (let i = 0; i < this.arrayDetails.length; i++) {
    //   this.arrayDetails[i]["no"] = i + 1;
    // }
  }

  /**
   * filter date range from selected table
   * @memberof ReportComponent
   */
  filter() {
    if (this.selects == 'apply-on-behalf' || this.selects == 'approval-override') {
      let selectedMembers = this.arrayDetails.filter(
        m => new Date(m.applicationDate) >= this.firstPicker.value && new Date(m.applicationDate) <= this.secondPicker.value
      );
      this.arrayDetails = selectedMembers;
    }
    if (this.selects == 'entitlement-claim') {
      let selectedMembers = this.arrayDetails.filter(
        claim => new Date(claim.applyDate) >= this.firstPicker.value && new Date(claim.applyDate) <= this.secondPicker.value
      );
      this.arrayDetails = selectedMembers;
    }
    if (this.selects == 'leave-taken') {
      const newLeaveDetails = [];
      this.arrayDetails.filter(
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
    if (this.selects == 'leave-adjustment') {
      let adjustment = this.arrayDetails.filter(
        adjust =>
          new Date(adjust.adjustDate) >= this.firstPicker.value && new Date(adjust.adjustDate) <= this.secondPicker.value
      )
      this.arrayDetails = adjustment;
    }
    if (this.selects == 'leave-cancellation' || this.selects == 'leave-rejected') {
      let selectedMembers = this.arrayDetails.filter(
        value => new Date(value.startDate) >= this.firstPicker.value && new Date(value.endDate) <= this.secondPicker.value
      );
      this.arrayDetails = selectedMembers;
    }
    if (this.selects == 'employee-master-list') {
      let filteredEmployee = this.arrayDetails.filter(
        items => new Date(items.joinDate) >= this.firstPicker.value && new Date(items.joinDate) <= this.secondPicker.value
      );
      this.arrayDetails = filteredEmployee;
    }
    if (this.selects != 'leave-entitlement' && this.selects != 'leave-taken') {
      for (let i = this.arrayDetails.length - 1; i >= 0; --i) {
        if (!this._selectedLeaveTypesList.includes(this.arrayDetails[i].leaveTypeId)) {
          this.arrayDetails.splice(i, 1);
        }
      }
    } else {
      for (let i = this.arrayDetails.length - 1; i >= 0; --i) {
        for (let k = this.arrayDetails[i].leaveDetail.length - 1; k >= 0; --k) {
          if (!this._selectedLeaveTypesList.includes(this.arrayDetails[i].leaveDetail[k].leaveTypeId)) {
            this.arrayDetails[i].leaveDetail.splice(k, 1);
            if (this.arrayDetails[i].leaveDetail.length == 0) {
              this.arrayDetails.splice(i, 1);
            }
          }
        }
      }
    }
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
    this.listMain = false;
    this.indeterminate = false;
    this.selectedNum = 0;
    document.querySelector('ion-searchbar').getInputElement().then((searchInput) => {
      searchInput.value = '';
      this.keyUpSearchbar('');
    });
  }

}
