import { Component, OnInit, HostBinding } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DashboardApiService } from './dashboard-api.service';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material';
import { DeleteCalendarConfirmationComponent } from '../admin-setup/leave-setup/delete-calendar-confirmation/delete-calendar-confirmation.component';

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

  /**
     * set menu is open or close by assign new class
     * @type {boolean}
     * @memberof DashboardComponent
     */
  @HostBinding('class.menuOverlay') menuOpen: boolean = false;

  /**
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
   * get joiner list
   * @type {*}
   * @memberof DashboardComponent
   */
  public joiners: any;

  /**
   * get leaver list
   * @type {*}
   * @memberof DashboardComponent
   */
  public leaver: any;

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
   * long leave reminder list
   * @type {*}
   * @memberof DashboardComponent
   */
  public longLeave: any;

  /**
   * clicked create new button
   * @type {boolean}
   * @memberof DashboardComponent
   */
  public createNew: boolean;

  /**
   * clicked announcement id
   * @type {string}
   * @memberof DashboardComponent
   */
  public announcementId: string;

  /**
   *Creates an instance of DashboardComponent.
   * @param {MenuController} menu
   * @param {DashboardApiService} dashboardAPI
   * @param {MatDialog} dialog open material dialog
   * @memberof DashboardComponent
   */
  constructor(private menu: MenuController, private dashboardAPI: DashboardApiService, public dialog: MatDialog) {
  }

  /**
   * get all API list from endpoint
   * @memberof DashboardComponent
   */
  async ngOnInit() {
    this.getHolidayList();
    this.getAnnouncementList();
    this.get_task_list();
    this.get_joiner_leaver_list();
    this.dashboardAPI.get_long_leave_reminder().subscribe(res => this.longLeave = res);
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
  async getHolidayList() {
    let details = await this.dashboardAPI.get_upcoming_holidays().toPromise();
    this.holidays = details;
    this.row = true;
    this.showSpinner = false;
    if (this.holidays.length != undefined) {
      for (let i = 0; i < this.holidays.length; i++) {
        this.holidays[i].day = this.getDayFromDate(new Date(this.holidays[i].start));
        this.holidays[i].start = (_moment(this.holidays[i].start).format('DD MMM YYYY'));
      }
    }
  }

  /**
   * get all announcement list
   * @memberof DashboardComponent
   */
  getAnnouncementList() {
    this.dashboardAPI.get_announcement_list().subscribe(list => {
      this.announcements = list;
      for (let i = 0; i < this.announcements.length; i++) {
        this.announcements[i].FROM_DATE = (_moment(this.announcements[i].FROM_DATE).format('DD MMM YYYY'));
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
   * get joiner & leaver list
   * @memberof DashboardComponent
   */
  async get_joiner_leaver_list() {
    let nameList = await this.dashboardAPI.upcoming_joiner().toPromise();
    this.joiners = nameList;
    for (let i = 0; i < this.joiners.length; i++) {
      this.joiners[i].JOIN_DATE = (_moment(this.joiners[i].JOIN_DATE).format('DD MMM YYYY'))
    }

    let leaver = await this.dashboardAPI.upcoming_leaver().toPromise();
    this.leaver = leaver;
    for (let i = 0; i < this.leaver.length; i++) {
      this.leaver[i].RESIGNATION_DATE = (_moment(this.leaver[i].RESIGNATION_DATE).format('DD MMM YYYY'))
    }
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
  onClickPublish(name: string) {
    let isChecked: number;
    if (this.checked === true) {
      isChecked = 1;
    } else {
      isChecked = 0;
    }
    const data = { "title": this.title, "message": this.message, "isPinned": isChecked };
    if (name === 'add') {
      this.dashboardAPI.post_announcement_list(data).subscribe(response => {
        this.getAnnouncementList();
        this.title = ''; this.message = ''; this.checked = false;
      });
    } else {
      data["announcementId"] = this.announcementId;
      this.dashboardAPI.patch_announcement(data).subscribe(res => this.getAnnouncementList())
    }
    this.menu.close('createAnnouncementDetails');
  }

  /**
   * data binding to clicked announcement
   * @param {*} data
   * @memberof DashboardComponent
   */
  editAnnouncement(data) {
    this.title = data.TITLE;
    this.message = data.MESSAGE;
    this.announcementId = data.ANNOUNCEMENT_GUID;
    if (data.IS_PINNED === 1) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }

  /**
   * delete annoucement dialog
   * @param {*} item
   * @memberof DashboardComponent
   */
  deleteAnnouncement(item) {
    const dialog = this.dialog.open(DeleteCalendarConfirmationComponent, {
      data: { name: 'this', value: item.ANNOUNCEMENT_GUID, desc: ' announcement' },
      height: "195px",
      width: "270px"
    });
    dialog.afterClosed().subscribe(result => {
      if (result === item.ANNOUNCEMENT_GUID) {
        this.dashboardAPI.delete_announcement_list(item.ANNOUNCEMENT_GUID).subscribe(response => {
          this.getAnnouncementList();
        })
      }
    });
  }
}
