import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogSubmitConfirmationComponent } from './dialog-submit-confirmation/dialog-submit-confirmation.component';
import { Router } from '@angular/router';
import { YearEndClosingApiService } from './year-end-closing-api.service';
import { LeaveApiService } from '../leave-setup/leave-api.service';

/**
 * year end closing page
 * @export
 * @class YearEndClosingComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-year-end-closing',
  templateUrl: './year-end-closing.component.html',
  styleUrls: ['./year-end-closing.component.scss']
})
export class YearEndClosingComponent implements OnInit {

  /**
   * pending list from API approval-override
   * @type {*}
   * @memberof YearEndClosingComponent
   */
  public pendingList: any;

  /**
   * get current year from today date
   * @type {*}
   * @memberof YearEndClosingComponent
   */
  public currentDate: any = new Date();

  /**
   * array year list for current year & prev year
   * @type {number[]}
   * @memberof YearEndClosingComponent
   */
  public yearList: number[] = [];

  /**
   * selected year
   * @type {number}
   * @memberof YearEndClosingComponent
   */
  public selected: number;

  /**
   * show loading spinner
   * @type {boolean}
   * @memberof YearEndClosingComponent
   */
  public showSpinner: boolean = true;

  /**
   * show list of company
   * @type {*}
   * @memberof YearEndClosingComponent
   */
  public companyName: any;

  /**
   * get the pending total number
   * @type {number}
   * @memberof YearEndClosingComponent
   */
  public pendingTotal: number;

  /**
   * index selected
   * @type {number}
   * @memberof YearEndClosingComponent
   */
  public clickedIndex: number;

  /**
   *Creates an instance of YearEndClosingComponent.
   * @param {MatDialog} dialog to open material dialog
   * @param {YearEndClosingApiService} yearEndApi
   * @param {LeaveApiService} leaveApi
   * @memberof YearEndClosingComponent
   */
  constructor(public dialog: MatDialog, private yearEndApi: YearEndClosingApiService, private leaveApi: LeaveApiService) { }

  /**
   * initial method to get pending list
   * @memberof YearEndClosingComponent
   */
  async ngOnInit() {
    this.pendingList = await this.yearEndApi.get_approval_override_list().toPromise();
    this.currentDate = this.currentDate.getFullYear();
    this.yearList.push(this.currentDate);
    this.yearList.push(this.currentDate - 1);
    this.companyName = await this.leaveApi.get_company_list().toPromise();
    this.clickedIndex = 0;
    this.pendingTotal = await this.yearEndApi.get_approval_override_by_company(this.companyName[this.clickedIndex].TENANT_COMPANY_GUID).toPromise();
    this.showSpinner = false;
  }

  /**
   * clicked company name to show details
   * @param {*} item
   * @param {number} index
   * @memberof YearEndClosingComponent
   */
  async clickedCompany(item: any, index: number) {
    this.clickedIndex = index;
    this.pendingTotal = await this.yearEndApi.get_approval_override_by_company(item.TENANT_COMPANY_GUID).toPromise();
  }

  /**
   * pop up dialog for confirm process
   * @memberof YearEndClosingComponent
   */
  showDialog() {
    const dialogRef = this.dialog.open(DialogSubmitConfirmationComponent, {
      data: { value: this.selected },
      height: "285px",
      width: "383px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === this.selected) {
        this.yearEndApi.post_year_end_closing(this.selected).subscribe(res => {
          this.selected = null;
        });
        this.yearEndApi.snackbar('Year End Closing submitted successfully', true);
      }
    });
  }

}
