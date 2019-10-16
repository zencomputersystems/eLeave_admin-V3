import { Component, OnInit, ViewChild } from '@angular/core';
import * as _moment from 'moment';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
const moment = _moment;
import { getDataSet, reduce } from "iso3166-2-db";
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { APP_DATE_FORMATS, AppDateAdapter } from '../date.adapter';
import { ManageHolidayApiService } from './manage-holiday-api.service';
import { DeleteCalendarConfirmationComponent } from '../delete-calendar-confirmation/delete-calendar-confirmation.component';
import { trigger, transition, animate, style } from '@angular/animations'
import { MenuController } from '@ionic/angular';
import { EmployeeTreeviewService } from '../assign-calendar/employee-treeview.service';

/**
 * Manage holiday and rest day for employee
 * @export
 * @class ManageHolidayComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-manage-holiday',
    templateUrl: './manage-holiday.component.html',
    styleUrls: ['./manage-holiday.component.scss'],
    providers: [TitleCasePipe,
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                style({ transform: 'translateX(0)', opacity: 1 }),
                animate('300ms', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class ManageHolidayComponent implements OnInit {

    /**
      * This is local property for Full Calendar Component
      * @type {FullCalendarComponent}
      * @memberof ManageHolidayComponent
      */
    @ViewChild('calendar') calendar: FullCalendarComponent;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof ManageHolidayComponent
     */
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, listYear];

    /**
     * Get data from user profile API
     * @type {*}
     * @memberof ManageHolidayComponent
     */
    public list: any;

    /**
     * Get data from user profile API (with parameters)
     * @type {*}
     * @memberof ManageHolidayComponent
     */
    public items: any;

    /** 
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof ManageHolidayComponent
     */
    public events: EventInput[];

    /**
     * Show or hide edit profile
     * @type {boolean}
     * @memberof ManageHolidayComponent
     */
    public viewDetails: boolean = false;

    /**
     * show/hide delete calendar
     * @type {boolean}
     * @memberof ManageHolidayComponent
     */
    public deleteCalendar: boolean = false;

    /**
     * Calendar profile list from API
     * eg: { "calendar_guid": "string", "code": "string" }
     * @memberof ManageHolidayComponent
     */
    public profileList;

    /**
     * Selected Calendar profile from list
     * @memberof ManageHolidayComponent
     */
    public selectedCalendarProfile;

    /**
     * Requested personal profile from API 
     * Get API with calendar Id
     * @memberof ManageHolidayComponent
     */
    public personalProfile;

    /**
     * Selected day name array list
     * @memberof ManageHolidayComponent
     */
    public restDay = [];

    /**
     * Array list of Sunday - Saturday to show on select input
     * @type {string[]}
     * @memberof ManageHolidayComponent
     */
    public weekdays: string[];

    /**
     * Array list for rest to patch to API
     * eg: { "fullname": "SATURDAY", "name": "SAT" }
     * @memberof ManageHolidayComponent
     */
    public selectedWeekday = [];

    /**
     * Track calendar input of edit calendar form
     * @type {FormGroup}
     * @memberof ManageHolidayComponent
     */
    // public editCalendarForm: FormGroup;

    /**
     * Track calendar input of add calendar form
     * @type {*}
     * @memberof ManageHolidayComponent
     */
    public profileName: any;

    public dayControl: any;

    public yearDefault: any;

    /**
     * Public holiday list from API
     * @memberof ManageHolidayComponent
     */
    public countryList;

    /**
     * Region list of selected country
     * @memberof ManageHolidayComponent
     */
    public countryRegion;

    /**
     * Show/hide input form of add new calendar profile
     * @type {boolean}
     * @memberof ManageHolidayComponent
     */
    public addCalendar: boolean = false;

    /**
     * Show/hide of save button and calendar profile select input
     * @type {boolean}
     * @memberof ManageHolidayComponent
     */
    public showEditForm: boolean = false;

    /**
     * Show/hide loading spinner
     * @type {boolean}
     * @memberof ManageHolidayComponent
     */
    public showSpinner: boolean = true;

    /**
     * Value of Region ISO from selected region/states
     * @memberof ManageHolidayComponent
     */
    public regionISO;

    /**
     * Value of selected Country ISO
     * @type {string}
     * @memberof ManageHolidayComponent
     */
    public countryIso: string;

    /**
        * World public holiday from database npm i
        * @memberof ManageHolidayComponent
        */
    public countryDB;

    /**
     * end date
     * @type {*}
     * @memberof ManageHolidayComponent
     */
    public endDate: any;

    /**
     * get AM/PM slot
     * @type {*}
     * @memberof ManageHolidayComponent
     */
    public timeslot: any;

    /**
     * event show in calendar
     * @type {*}
     * @memberof ManageHolidayComponent
     */
    public leaveEvent: any;

    /** 
     * Get Height of calendar when window resize to set in holiday view
     * @type {number}
     * @memberof ManageHolidayComponent
     */
    public height: number;

    public assignedNames: any[] = [];

    public clickedIndex: number;

    public content: boolean = false;

    public slideInOut: boolean = false;

    public showAddIcon: boolean = false;

    public showSelectedTree: boolean = false;

    public showTreeDropdown: boolean = false;

    public assignCalendarForm: any;

    public employeeList: any[] = [];

    public userList: any;

    public menuNewHoliday: any = [];


    /**
     *Creates an instance of ManageHolidayComponent.
     * @param {LeaveAPIService} leaveAPI
     * @param {FormBuilder} fb
     * @param {TitleCasePipe} titlecasePipe
     * @memberof ManageHolidayComponent
     */
    constructor(private manageHolidayAPI: ManageHolidayApiService, private titlecasePipe: TitleCasePipe, private menu: MenuController, private treeview: EmployeeTreeviewService) {
    }

    ngOnInit() {
        // window.dispatchEvent(new Event('resize'));
        this.assignCalendarForm = new FormGroup({
            user: new FormArray([]),
        })
        this.countryDB = reduce(getDataSet(), "en");
        this.countryList = Object.keys(this.countryDB).map(key => this.countryDB[key]);
        this.countryList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.dayControl = new FormControl('');
        this.yearDefault = new FormControl(2019);
        this.profileName = new FormControl('', Validators.required);
        this.getPublicHolidayList();
        this.getProfileList();
    }

    /**
     * Method to get day of the week from a given date
     * @param {*} date
     * @returns
     * @memberof CalendarViewPage
     */
    getWeekDay(date) {
        //Create an array containing each day, starting with Sunday.
        this.weekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        //Use the getDay() method to get the day.
        const day = date.getDay();
        //Return the element that corresponds to that index.
        return this.weekdays[day];
    }

    /**
     * Get public holiday list from calendarific
     * @memberof ManageHolidayComponent
     */
    getPublicHolidayList() {
        this.showSpinner = true;
        this.content = false;
        this.manageHolidayAPI.get_public_holiday_list().subscribe(
            (data: any) => {
                this.showSpinner = false;
                this.content = true;
                this.list = data;
                this.events = [];
                this.leaveEvent = [];
                for (let i = 0; i < this.list.response.holidays.length; i++) {
                    this.createHolidayList(this.list.response.holidays[i].date.iso, this.list.response.holidays[i].name);
                }
                // this.manageHolidayAPI.get_calendar_onleave_list({ 'startdate ': '2019-01-01', 'enddate': '2019-12-31' }).subscribe(onLeaveList => {
                //     this.leaveEvent = this.events.concat(onLeaveList);
                //     this.getEmployeeLeaveList(this.leaveEvent);
                // })
            });
    }

    getAssignedList() {
        for (let i = 0; i < this.profileList.length; i++) {
            this.manageHolidayAPI.get_assigned_employee_list(this.profileList[i].calendar_guid).subscribe(employeeNum => {
                const list = employeeNum;
                this.profileList[i]["employee"] = list.length;
            })
        }
        this.manageHolidayAPI.get_user_list().subscribe(
            data => {
                this.userList = data;
            });
    }

    submitData() {
        for (let i = 0; i < this.assignCalendarForm.controls.user.value.length; i++) {
            if (this.checkIdExist(this.userList, this.assignCalendarForm.controls.user.value[i]) != 0) {
                const index: number = this.checkIdExist(this.userList, this.assignCalendarForm.controls.user.value[i]);
                if (!this.employeeList.includes(this.userList[index].userId)) {
                    this.employeeList.push(this.userList[index].userId);
                }
            }
        }
        this.search();
    }



    /**
     * Closed div after clicked outside of div
     * Push all items to array if they have checked
     * Clear array if no item checked
     * @param {*} event
     * @memberof AssignCalendarComponent
     */
    clickOutside(event, control) {
        if (!event.target.className.includes("material-icons") && !event.target.className.includes("mat-form-field-infix") && !event.target.className.includes("inputDropdown") && !event.target.className.includes("mat-checkbox-inner-container")) {
            this.showTreeDropdown = false;
            this.showSelectedTree = true;
            this.disabledButton();
            for (let i = 0; i < control.dataNodes.length; i++) {
                let flatNode = control.dataNodes[i].item;
                for (let j = 0; j < this.assignedNames.length; j++) {
                    if (flatNode === this.assignedNames[j].FULLNAME) {
                        this.treeview.todoLeafItemSelectionToggle(control.dataNodes[i]);
                        this.treeview.checklistSelection.isSelected(control.dataNodes[i]);
                    }
                }
            }
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

        if (control !== undefined) {
            for (let i = 0; i < control.dataNodes.length; i++) {
                let flatNode = control.dataNodes[i].item;
                for (let j = 0; j < this.assignedNames.length; j++) {
                    if (flatNode === this.assignedNames[j].FULLNAME) {
                        this.treeview.todoLeafItemSelectionToggle(control.dataNodes[i]);
                        this.treeview.checklistSelection.isSelected(control.dataNodes[i]);
                    }
                }
            }
        }

    }

    checkIdExist(array: any, obj: any) {
        for (let j = 0; j < array.length; j++) {
            if (array[j].employeeName === obj) {
                return j;
            }
        }
        return 0;
    }

    disabledButton() {
        if (this.viewDetails && this.showAddIcon) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * display onleave & public holiday event in calendar
     * @param {*} list
     * @memberof ManageHolidayComponent
     */
    // getEmployeeLeaveList(list: any) {
    //     for (let i = 0; i < list.length; i++) {
    //         if (list[i].CODE != undefined) {
    //             this.leaveEvent[i].start = moment(list[i].START_DATE).format('YYYY-MM-DD');
    //             this.leaveEvent[i].end = moment(list[i].END_DATE).add(1, "days").format("YYYY-MM-DD");
    //             this.leaveEvent[i].title = list[i].FULLNAME + ' ' + '(' + (list[i].CODE) + ')';
    //             this.checkAllDay(list, i);
    //         } else {
    //             this.leaveEvent[i].start = (moment(list[i].start).format('YYYY-MM-DD'));
    //             this.leaveEvent[i].end = moment(list[i].end).format('YYYY-MM-DD');
    //             this.leaveEvent[i].allDay = true;
    //         }
    //     }
    //     setTimeout(() => {
    //         let calendarView = this.calendar.getApi();
    //         calendarView.render();
    //     }, 100);
    // }

    /**
     * check either is all day or half day
     * @param {*} list
     * @param {number} index
     * @memberof ManageHolidayComponent
     */
    // checkAllDay(list: any, index: number) {
    //     if (list[index].TIME_SLOT) {
    //         this.leaveEvent[index].allDay = false;
    //     } else {
    //         this.leaveEvent[index].allDay = true;
    //     }
    // }

    /**
     * Get calendar profile list from API
     * @memberof ManageHolidayComponent
     */
    getProfileList() {
        this.manageHolidayAPI.get_calendar_profile_list().subscribe(
            (data: any[]) => {
                this.profileList = data;
                this.getAssignedList();
                this.showSpinner = false;
                this.content = true;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            })
    }

    /**
     * click save button to patch the calendar to selected calendar profile
     * @memberof ManageHolidayComponent
     */
    saveData() {
        // this.showSpinner = true;
        // this.content = false;
        this.viewDetails = false;
        this.showAddIcon = false;
        this.slideInOut = false;
        this.clickedIndex = null;
        this.reformatHolidayObject(this.events);
        const body = {
            "calendar_guid": this.selectedCalendarProfile.calendar_guid,
            "year": (new Date()).getFullYear(),
            "data": {
                "code": this.selectedCalendarProfile.code,
                "holiday": this.events,
                "rest": this.selectedWeekday
            }
        }
        this.manageHolidayAPI.patch_calendar_profile(body).subscribe(
            (data: any[]) => {
                this.restDay = [];
                this.dayControl.reset();
                this.selectedWeekday = [];
                this.getProfileList();
            })
        this.manageHolidayAPI.patch_assign_calendar_profile({
            "user_guid": this.employeeList,
            "calendar_guid": this.selectedCalendarProfile.calendar_guid
        }).subscribe(response => {
            this.assignCalendarForm.reset();
            this.events = [];
            this.employeeList = [];
            this.showSelectedTree = false;
            this.showSpinner = false;
            this.treeview.checklistSelection.clear();
            this.getAssignedList();
        });
    }

    search() {
        const fullname = [];
        for (let j = 0; j < this.assignedNames.length; j++) {
            fullname.push(this.assignedNames[j].FULLNAME);
        }
        for (let i = 0; i < this.assignCalendarForm.controls.user.value.length; i++) {
            if (!fullname.includes(this.assignCalendarForm.controls.user.value[i])) {
                this.assignedNames.push({ FULLNAME: this.assignCalendarForm.controls.user.value[i] });
            }
        }
    }

    /**
     * Select calendar profile to pass the calendar Id to API
     * Pass rest day value (eg: sat) to the select input to show initial value
     * @param {*} list
     * @memberof ManageHolidayComponent
     */
    selectProfile(list, index) {
        // this.showSpinner = true;
        // this.content = false;
        this.slideInOut = false;
        this.selectedCalendarProfile = list;
        this.clickedIndex = index;
        this.restDay = [];
        this.manageHolidayAPI.get_personal_holiday_calendar(this.selectedCalendarProfile.calendar_guid, (new Date()).getFullYear()).subscribe(
            (data: any) => {
                // this.showSpinner = false;
                // this.content = true;
                this.personalProfile = data;
                // console.log('data', this.personalProfile);
                this.viewDetails = true;
                this.slideInOut = true;
                this.events = [];
                for (let i = 0; i < this.personalProfile.holiday.length; i++) {
                    this.createHolidayList(this.personalProfile.holiday[i].start, this.personalProfile.holiday[i].title);
                }
                if (this.personalProfile["rest"] != undefined && Array.isArray(this.personalProfile.rest) == false) {
                    this.restDay.push(this.titlecasePipe.transform(this.personalProfile.rest.fullname));
                }
                if (this.personalProfile["rest"] != undefined && Array.isArray(this.personalProfile.rest) == true) {
                    for (let i = 0; i < this.personalProfile.rest.length; i++) {
                        this.restDay.push(this.titlecasePipe.transform(this.personalProfile.rest[i].fullname));
                    }
                }
                this.dayControl.setValue(this.restDay);
            })
        this.manageHolidayAPI.get_assigned_employee_list(this.profileList[index].calendar_guid).subscribe(namelist => {
            this.assignedNames = namelist;
        })
    }

    clickedCalendar(list, index) {
        this.clickedIndex = index;
        this.selectProfile(list, index);
    }


    /**
     * Edit public holiday date & show day name according changed date
     * @param {*} value
     * @param {*} index
     * @memberof ManageHolidayComponent
     */
    dateChanged(value, index) {
        this.events[index].start = moment(value).format('YYYY-MM-DD');
        // this.events[index].str = moment(value).format('DD-MM-YYYY');
        this.events[index].end = moment(value).format('YYYY-MM-DD');
        // this.events[index].title = moment(value).format('YYYY-MM-DD');
        // this.events[index].holidayName = moment(value).format('YYYY-MM-DD');
        this.events[index].day = this.getWeekDay(new Date(value));
    }

    /**
     * Create a rest day array list
     * Check or uncheck weekday make changes in rest day array list
     * @param {string} day
     * @memberof ManageHolidayComponent
     */
    restDaySelected(day: string) {
        if (this.checkObjectExist(day, this.restDay) === false) {
            this.restDay.push(day);
        } else {
            const indexes: number = this.restDay.indexOf(day);
            this.restDay.splice(indexes, 1);
        }
    }

    /**
     * To check whether the object is exist in array or not
     * @param {*} obj
     * @param {*} array
     * @returns
     * @memberof ManageHolidayComponent
     */
    checkObjectExist(obj: any, array: any) {
        for (let j = 0; j < array.length; j++) {
            if (array[j] === obj) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get public holiday list from API by passing parameters of:-
     * country, location, year and month (optional)
     * @param {*} year
     * @param {*} month
     * @memberof ManageHolidayComponent
     */
    callParamAPI(year) {
        // this.showSpinner = true;
        // this.content = false;
        // this.editCalendar = true;
        this.addCalendar = false;
        const params = { 'country': this.countryIso, 'location': this.regionISO, 'year': year };
        this.manageHolidayAPI.get_public_holiday_list(params).subscribe(
            (data: any[]) => {
                // this.showSpinner = false;
                // this.content = true;
                this.items = data;
                this.events = [];
                for (let j = 0; j < this.items.response.holidays.length; j++) {
                    this.createHolidayList(this.items.response.holidays[j].date.iso, this.items.response.holidays[j].name);
                }
            })
    }

    /**
     * Push objects to array of event holidays
     * @param {string} dateIso
     * @param {string} name
     * @memberof ManageHolidayComponent
     */
    createHolidayList(dateIso: string, name: string) {
        this.events.push({
            "start": moment(dateIso).format('YYYY-MM-DD'),
            "end": moment(dateIso).format('YYYY-MM-DD'),
            "title": name,
            "holidayName": name,
            "day": this.getWeekDay(new Date(dateIso)),
        });
    }

    addNewPH(title, start) {
        this.menuNewHoliday.push({
            "start": moment(start).format('YYYY-MM-DD'),
            "end": moment(start).format('YYYY-MM-DD'),
            "title": title,
            "holidayName": title,
            "day": this.getWeekDay(new Date(start))
        })
    }

    menuDateChanged(value, i) {
        this.menuNewHoliday[i].start = moment(value).format('YYYY-MM-DD');
        this.menuNewHoliday[i].end = moment(value).format('YYYY-MM-DD');
        this.menuNewHoliday[i].day = this.getWeekDay(new Date(value));
    }

    combineEvent() {
        Array.prototype.push.apply(this.events, this.menuNewHoliday);
        this.menu.close('addHolidayDetails');
        this.menuNewHoliday = [];
    }

    /**
     * Arrange object according body required of API 
     * POST / PATCH calendar profile
     * @param {*} holiday
     * @memberof ManageHolidayComponent
     */
    reformatHolidayObject(holiday) {
        for (let i = 0; i < this.events.length; i++) {
            delete holiday[i].day;
        }

        for (let j = 0; j < this.restDay.length; j++) {
            let obj = {};
            obj["fullname"] = (this.restDay[j]).toUpperCase();
            obj["name"] = obj["fullname"].substring(0, 3);
            this.selectedWeekday.push(obj);
        }
    }

    /**
     * POST/create new calendar to endpoint API
     * @memberof ManageHolidayComponent
     */
    postData() {
        this.showSpinner = true;
        this.content = false;
        this.reformatHolidayObject(this.events);
        this.callParamAPI(this.yearDefault.value);
        const newProfile = {
            "code": this.profileName.value,
            "filter": {
                "year": this.yearDefault.value,
                "country": this.countryIso,
                "region": this.regionISO
            },
            "holiday": this.events,
            "rest": this.selectedWeekday
        }
        console.log(newProfile);
        this.manageHolidayAPI.post_calendar_profile(newProfile).subscribe(
            response => {
                this.showSpinner = false;
                this.content = true;
                this.getProfileList();
            });
        this.menu.close('createCalendarDetails');
        this.countryIso = '';
        this.countryIso = '';
        this.restDay = [];
        this.dayControl.reset();
        this.selectedWeekday = [];
        this.profileName.reset();
    }

    /**
     * Delete the calendar profile after confirm by admin
     * @memberof ManageHolidayComponent
     */
    deleteCalendarProfile(item) {
        const dialog = this.manageHolidayAPI.displayDialog.open(DeleteCalendarConfirmationComponent, {
            data: { name: item.code, value: item.calendar_guid, desc: ' calendar profile' },
            height: "195px",
            width: "249px"
        });
        dialog.afterClosed().subscribe(result => {
            if (result === item.calendar_guid) {
                this.manageHolidayAPI.delete_calendar_profile(item.calendar_guid).subscribe(response => {
                    // this.manageHolidayAPI.notification('deleted successfully ');
                    this.getProfileList();
                })
            }
            // this.showSpinner = false;
            // this.content = true;
            // this.editCalendarForm.reset();
            // setTimeout(() => { this.getPublicHolidayList(); }, 100);
        });
    }

    /**
     * confirmation pop up when clicked delete PH item 
     * @param {number} index
     * @param {*} event
     * @param {string} title
     * @memberof ManageHolidayComponent
     */
    deletePH(index: number, event: any, title: string) {
        const popup = this.manageHolidayAPI.displayDialog.open(DeleteCalendarConfirmationComponent, {
            data: { name: title, value: index, desc: ' from holiday list' },
            height: "195px",
            width: "249px"
        });
        popup.afterClosed().subscribe(result => {
            if (result == index && result != undefined) {
                setTimeout(() => {
                    event.splice(index, 1);
                }, 1000);
            }
        });
    }

    deleteEmployee(index: number, name: string) {
        const popup = this.manageHolidayAPI.displayDialog.open(DeleteCalendarConfirmationComponent, {
            data: { name: name, value: index, desc: ' from assigned employee list' },
            height: "195px",
            width: "249px"
        });
        popup.afterClosed().subscribe(response => {
            if (response == index && response != undefined) {
                setTimeout(() => {
                    this.assignedNames.splice(index, 1);
                }, 1000);
            }
        });
    }

}