import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "src/services/shared-service/api.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from "@fullcalendar/core";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarNotificationPage } from "../snackbar-notification/snackbar-notification";
/**
 * Assign Calendar Page
 * Admin assign employee's calendar profile in this page
 * @export
 * @class AssignCalendarPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-assign-calendar',
    templateUrl: './assign-calendar.page.html',
    styleUrls: ['./assign-calendar.page.scss'],
})
export class AssignCalendarPage implements OnInit {

    /**
      * This is local property for Full Calendar Component
      * @type {FullCalendarComponent}
      * @memberof CalendarViewPage
      */
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    /**
     * Users list that show in options of selection
     * @type {*}
     * @memberof AssignCalendarPage
     */
    public userList: any;

    /**
     * Calendar profile list that show in options of selection
     * @type {*}
     * @memberof AssignCalendarPage
     */
    public calendarList: any;

    /**
     * Array list of selected employees ID
     * @type {any[]}
     * @memberof AssignCalendarPage
     */
    public employeeList: any[] = [];

    /**
     * Value of selected ID
     * @type {string}
     * @memberof AssignCalendarPage
     */
    public selectedCalendarId: string;

    /**
     * Track value and validity of user and calendar select input
     * @type {FormGroup}
     * @memberof AssignCalendarPage
     */
    public assignCalendarForm: FormGroup;

    /**
     * Show/hide loading spinner
     * @type {boolean}
     * @memberof ManageHolidayPage
     */
    public showSpinner: boolean = false;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof CalendarViewPage
     */
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, listYear];

    /**
     * Events that show in Calendar
     * @type {EventInput[]}
     * @memberof AssignCalendarPage
     */
    public events: EventInput[];

    /**
     *Creates an instance of AssignCalendarPage.
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar
     * @memberof AssignCalendarPage
     */
    constructor(private apiService: APIService, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.assignCalendarForm = new FormGroup({
            user: new FormControl('', Validators.required),
            calendar: new FormControl('', Validators.required),
        });

        this.apiService.get_user_profile_list().subscribe(
            list => {
                this.userList = list;
            });

        this.apiService.get_calendar_profile_list().subscribe(
            data => {
                this.calendarList = data;
            });
        setTimeout(() => {
            let calendar = this.calendarComponent.getApi();
            calendar.render();
        }, 100);
    }

    /** 
     * To get selected user/users from list 
     * @param {*} userId
     * @memberof AssignCalendarPage
     */
    employeeSelected(userId) {
        if (this.checkIdExist(this.employeeList, userId) === 1) {
            const index: number = this.employeeList.indexOf(userId);
            this.employeeList.splice(index, 1);
        } else {
            this.employeeList.push(userId);
        }
    }

    /**
     * To get selected calendar ID
     * Show events in calendar
     * @param {*} calendarId
     * @memberof AssignCalendarPage
     */
    calendarSelected(calendarId) {
        this.showSpinner = true;
        this.selectedCalendarId = calendarId;
        this.apiService.get_personal_holiday_calendar(calendarId).subscribe(
            (data: any) => {
                this.events = data.holiday;
                for (let i = 0; i < this.events.length; i++) {
                    this.events['allDay'] = true;
                    this.events["backgroundColor"] = "#c2185b";
                    this.events["borderColor"] = "#c2185b";
                }
                this.showSpinner = false;
            })
    }

    /**
     * check ID exist or not in array list
     * @param {*} array
     * @param {*} obj
     * @returns
     * @memberof AssignCalendarPage
     */
    checkIdExist(array: any, obj: any) {
        for (let j = 0; j < array.length; j++) {
            if (array[j] === obj) {
                return 1;
            }
        }
        return 0;
    }

    /**
     * To assign calendar profile of selected employee to API
     * @memberof AssignCalendarPage
     */
    submitData() {
        const body = {
            "user_guid": this.employeeList,
            "calendar_guid": this.selectedCalendarId
        }
        this.apiService.patch_assign_calendar_profile(body).subscribe(
            response => {
                this.assignCalendarForm.reset();
                this.events = [];
                this.openSnackBar('successfully');
            }, error => {
                this.openSnackBar('unsuccessfully');
                window.location.href = '/login';
            }
        );
    }

    /**
     * Display message after submitted calendar profile
     * @param {string} message
     * @memberof AssignCalendarPage
     */
    openSnackBar(message: string) {
        this.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 2500,
            data: message
        });
    }
}