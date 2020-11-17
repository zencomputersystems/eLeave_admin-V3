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
   * show small loading spinner in closing year selection
   * @type {boolean}
   * @memberof YearEndClosingComponent
   */
  public showSmallSpinner: boolean = false;

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
   * policy details from API
   * @type {*}
   * @memberof YearEndClosingComponent
   */
  public policy: any;

  /**
   * label of the company selected
   * @type {string}
   * @memberof YearEndClosingComponent
   */
  public labelCompany: string;

  /**
   * selected company id
   * @type {string}
   * @memberof YearEndClosingComponent
   */
  public companyId: string;

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
    try {
      this.pendingList = await this.yearEndApi.get_approval_override_list().toPromise();
      this.companyName = await this.leaveApi.get_company_list().toPromise();
      this.companyName.sort(function (a, b) {
        var x = a.NAME.toLowerCase();
        var y = b.NAME.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
      this.clickedCompany(this.companyName[0], 0);
      this.labelCompany = this.companyName[0].NAME;
      this.showSpinner = false;
    } catch (error) {
      this.showSpinner = false;
    }
  }

  /**
   * clicked company name to show details
   * @param {*} item
   * @param {number} index
   * @memberof YearEndClosingComponent
   */
  async clickedCompany(item: any, index: number) {
    this.companyId = item.TENANT_COMPANY_GUID;
    this.showSmallSpinner = true;
    this.clickedIndex = index;
    this.pendingTotal = await this.yearEndApi.get_approval_override_by_company(item.TENANT_COMPANY_GUID).toPromise();
    this.labelCompany = item.NAME;
    let list = await this.yearEndApi.get_company_year_end().toPromise();
    this.policy = list;
    this.yearList = list[index].YEAR_END_LIST;
    if (this.yearList.length !== 0) {
      this.selected = this.yearList[0];
    }
    this.showSmallSpinner = false;
  }

  /**
   * pop up dialog for confirm process
   * @memberof YearEndClosingComponent
   */
  showDialog() {
    const dialogRef = this.dialog.open(DialogSubmitConfirmationComponent, {
      disableClose: true,
      data: { value: this.selected },
      height: "285px",
      width: "383px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === this.selected) {
        this.yearEndApi.post_year_end_closing(this.selected, this.companyId).subscribe(res => {
          this.selected = null;
          this.companyId = null;
          this.yearEndApi.snackbar('Year End Closing submitted successfully', true);
        }, fail => this.yearEndApi.snackbar('Failed to submit year end closing', false)
        );
      }
    });
  }

}
