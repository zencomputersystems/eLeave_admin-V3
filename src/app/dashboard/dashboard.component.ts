import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DashboardApiService } from './dashboard-api.service';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material';
import { DeleteCalendarConfirmationComponent } from '../admin-setup/leave-setup/delete-calendar-confirmation/delete-calendar-confirmation.component';
const moment = _moment;

/**
 * Dashboard page
 * @export
 * @class DashboardComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /*
   * show/hide row content in dashboard
   * @type {boolean}
   * @memberof DashboardComponent
   */
  public row: boolean = false;

  /**
   * show/hide loading spinner
   * @type {boolean}
   * @memberof DashboardComponent
   */
  public showSpinner: boolean = true;

  /**
     * upcoming holiday list
     * @type {*}
     * @memberof DashboardComponent
     */
  public holidays: any;

  /**
     * announcements list
     * @type {*}
     * @memberof DashboardComponent
     */
  public announcements: any;

  /**
     * show all holiday 
     * @type {boolean}
     * @memberof DashboardComponent
     */
  public showall: boolean = false;

  /**
   * show holiday view less button
   * @type {boolean}
   * @memberof DashboardComponent
   */
  public showViewLessButton: boolean = false;

  /**
   * show all announcements
   * @type {boolean}
   * @memberof DashboardComponent
   */
  public showallannouncement: boolean = false;

  /**
   * click to view less message 
   * @type {boolean}
   * @memberof DashboardComponent
   */
  public viewLessAnnouncement: boolean = false;

  /**
     * task list
     * @type {*}
     * @memberof DashboardComponent
     */
  public tasks: any;

  /**
   * ngmodel of create announcement editor
   * @type {string}
   * @memberof DashboardComponent
   */
  public message: string;

  /**
   * title of the announcement
   * @type {string}
   * @memberof DashboardComponent
   */
  public title: string = null;

  /**
   * checkbox is checked or vice versa
   * @type {boolean}
   * @memberof DashboardComponent
   */
  public checked: boolean = false;

  /**
   *Creates an instance of DashboardComponent.
   * @param {MenuController} menu
   * @param {DashboardApiService} dashboardAPI
   * @memberof DashboardComponent
   */
  constructor(private menu: MenuController, private dashboardAPI: DashboardApiService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getHolidayList();
    this.getAnnouncementList();
    this.get_task_list();
  }

  /**
     * get day of the search Date
     * @param {Date} date
     * @returns
     * @memberof DashboardComponent
     */
  getDayFromDate(date: Date) {
    const weekdays = new Array(
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    );
    const day = date.getDay();
    return weekdays[day];
  }

  /**
     * get holiday list from endpoint
     * @memberof DashboardComponent
     */
  getHolidayList() {
    this.dashboardAPI.get_upcoming_holidays().subscribe(details => {
      this.holidays = details;
      this.row = true;
      this.showSpinner = false;
      for (let i = 0; i < this.holidays.length; i++) {
        this.holidays[i].day = this.getDayFromDate(new Date(this.holidays[i].start));
        this.holidays[i].start = (moment(this.holidays[i].start).format('DD MMM YYYY'));
      }
    })
  }

  /**
   * get all announcement list
   * @memberof DashboardComponent
   */
  getAnnouncementList() {
    this.dashboardAPI.get_announcement_list().subscribe(list => {
      this.announcements = list;
      for (let i = 0; i < this.announcements.length; i++) {
        this.announcements[i].FROM_DATE = (moment(this.announcements[i].FROM_DATE).format('DD MMM YYYY'));
      }
      const data = this.announcements;
      const is_pinned = 1;
      data.sort(function (x, y) { return x.IS_PINNED == is_pinned ? -1 : y == is_pinned ? 1 : 0; });
    })
  }

  /**
    * get pending task list
    * @memberof DashboardComponent
    */
  get_task_list() {
    this.dashboardAPI.get_task_list().subscribe(data => {
      this.tasks = data;
    })
  }

  /**
     * method to approve clicked leave transaction GUID
     * @param {string} leaveGUID
     * @memberof DashboardComponent
     */
  approveLeave(leaveGUID: string) {
    this.dashboardAPI.post_approve_list({ "id": leaveGUID }).subscribe(response => {
      this.get_task_list();
    })
  }

  /**
   * method to reject clicked leave transaction GUID
   * @param {*} leave_transaction_guid
   * @memberof DashboardComponent
   */
  rejectLeave(leave_transaction_guid) {
    this.dashboardAPI.post_reject_list({ "id": leave_transaction_guid }).subscribe(response => {
      this.get_task_list();
    })
  }


  /**
   * create new announcement
   * @memberof DashboardComponent
   */
  onClickPublish() {
    let isChecked: number;
    if (this.checked === true) {
      isChecked = 1;
    } else {
      isChecked = 0;
    }
    const data = { "title": this.title, "message": this.message, "isPinned": isChecked };
    this.dashboardAPI.post_announcement_list(data).subscribe(response => {
      this.getAnnouncementList();
      this.menu.close('createAnnouncementDetails');
    });
  }

  deleteAnnouncement(item) {
    const dialog = this.dialog.open(DeleteCalendarConfirmationComponent, {
      data: { name: 'this', value: item.ANNOUNCEMENT_GUID, desc: ' announcement' },
      height: "195px",
      width: "249px"
    });
    dialog.afterClosed().subscribe(result => {
      if (result === item.ANNOUNCEMENT_GUID) {
        this.dashboardAPI.delete_announcement_list(item.ANNOUNCEMENT_GUID).subscribe(response => {
          console.log(response);
          this.getAnnouncementList();
        })
      }
    });
  }
}