import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from "@fullcalendar/core";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { EmployeeTreeview } from "./employee-treeview.service";
import { AssignCalendarAPIService } from "./assign-calendar-api.service";

/**
 * Assign Calendar Page
 * Admin assign employee's calendar profile in this page
 * @export
 * @class AssignCalendarPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-assign-calendar',
    templateUrl: './assign-calendar.component.html',
    styleUrls: ['./assign-calendar.component.scss'],
})
export class AssignCalendarPage implements OnInit {

    /**
      * This is local property for Full Calendar Component
      * @type {FullCalendarComponent}
      * @memberof CalendarViewPage
      */
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    /**
     * Calendar profile list that show in options of selection
     * @type {*}
     * @memberof AssignCalendarPage
     */
    public calendarList: any;

    /**
   * Users list that show in options of selection
   * @type {*}
   * @memberof AssignCalendarPage
   */
    public userList: any;

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
     * Click to show dropdown of treeview checkbox list
     * @type {boolean}
     * @memberof AssignCalendarPage
     */
    public showTreeDropdown: boolean = false;

    /**
     * Show treeview selected value after close dropdown
     * @type {boolean}
     * @memberof AssignCalendarPage
     */
    public showSelectedTree: boolean = false;

    /**
     * Enable or disable submit button
     * @type {boolean}
     * @memberof AssignCalendarPage
     */
    public disabledSubmitButton: boolean = true;

    /**
     *Creates an instance of AssignCalendarPage.
     * @param {AssignCalendarAPIService} assignCalendarAPI
     * @param {MatSnackBar} snackBar
     * @param {EmployeeTreeview} treeview
     * @memberof AssignCalendarPage
     */
    constructor(private assignCalendarAPI: AssignCalendarAPIService, private treeview: EmployeeTreeview) {
    }

    ngOnInit() {
        this.assignCalendarForm = new FormGroup({
            user: new FormArray([]),
            calendar: new FormControl('', Validators.required)
        })
        this.assignCalendarAPI.get_user_list().subscribe(
            data => {
                this.userList = data;
            });
        this.assignCalendarAPI.get_calendar_profile_list().subscribe(
            data => {
                this.calendarList = data;
            });
        setTimeout(() => {
            let calendar = this.calendarComponent.getApi();
            calendar.render();
        }, 100);
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
        this.disabledButton();
        this.assignCalendarAPI.get_personal_holiday_calendar(calendarId).subscribe(
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
            if (array[j].employeeName === obj) {
                return j;
            }
        }
        return 0;
    }

    /**
     * Disable or enable the submit button
     * @memberof AssignCalendarPage
     */
    disabledButton() {
        if (this.assignCalendarForm.controls.calendar.value != null && this.assignCalendarForm.controls.user.value.length > 0) {
            this.disabledSubmitButton = false;
        } else { this.disabledSubmitButton = true; }
    }

    /**
     * To assign calendar profile of selected employee to API
     * @memberof AssignCalendarPage
     */
    submitData() {
        for (let i = 0; i < this.assignCalendarForm.controls.user.value.length; i++) {
            if (this.checkIdExist(this.userList, this.assignCalendarForm.controls.user.value[i]) != 0) {
                const index: number = this.checkIdExist(this.userList, this.assignCalendarForm.controls.user.value[i]);
                this.employeeList.push(this.userList[index].userId);
            }
        }
        this.assignCalendarAPI.patch_assign_calendar_profile({
            "user_guid": this.employeeList,
            "calendar_guid": this.selectedCalendarId
        }).subscribe(response => {
            this.assignCalendarForm.reset();
            this.events = [];
            this.employeeList = [];
            this.showSelectedTree = false;
            this.showSpinner = false;
            this.treeview.checklistSelection.clear();
            this.assignCalendarAPI.openSnackBar('submitted successfully');
        }, error => {
            this.assignCalendarAPI.openSnackBar('submitted unsuccessfully');
            window.location.href = '/login';
        });
    }



    /**
     * Closed div after clicked outside of div
     * Push all items to array if they have checked
     * Clear array if no item checked
     * @param {*} event
     * @memberof AssignCalendarPage
     */
    clickOutside(event) {
        if (!event.target.className.includes("material-icons") && !event.target.className.includes("mat-form-field-infix") && !event.target.className.includes("inputDropdown")) {
            this.showTreeDropdown = false;
            this.showSelectedTree = true;
            this.disabledButton();
        }
        for (let i = 0; i < this.treeview.checklistSelection.selected.length; i++) {
            if (this.treeview.checklistSelection.selected[i].level == 2 && this.assignCalendarForm.controls.user.value.indexOf(this.treeview.checklistSelection.selected[i].item) === -1) {
                this.assignCalendarForm.controls.user.value.push(this.treeview.checklistSelection.selected[i].item);
                this.disabledButton();
            }
        }
        if (this.treeview.checklistSelection.selected.length === 0) {
            this.assignCalendarForm.controls.user.value.length = 0;
        }
    }

}