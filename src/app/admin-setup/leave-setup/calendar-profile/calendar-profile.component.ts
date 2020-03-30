import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import { EventInput } from '@fullcalendar/core';
import { Validators, FormControl } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { getDataSet, reduce } from "iso3166-2-db";
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { APP_DATE_FORMATS, AppDateAdapter } from '../date.adapter';
import { CalendarProfileApiService } from './calendar-profile-api.service';
import { DeleteCalendarConfirmationComponent } from '../delete-calendar-confirmation/delete-calendar-confirmation.component';
import { trigger, transition, animate, style } from '@angular/animations'
import { MenuController, PopoverController } from '@ionic/angular';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';
import { SharedService } from '../shared.service';
import { WorkingHourApiService } from '../working-hour/working-hour-api.service';
import { ConfirmationWindowComponent } from '../../../global/confirmation-window/confirmation-window.component';

/**
 * Manage holiday and rest day for employee
 * @export
 * @class CalendarProfileComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-calendar-profile',
    templateUrl: './calendar-profile.component.html',
    styleUrls: ['./calendar-profile.component.scss'],
    providers: [TitleCasePipe,
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('200ms', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                style({ transform: 'translateX(0)', opacity: 1 }),
                animate('200ms', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class CalendarProfileComponent implements OnInit {

    /**
     * Get data from user profile API
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    public list: any;

    /** 
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof CalendarProfileComponent
     */
    public events: EventInput[];

    /**
     * Calendar profile list from API
     * eg: { "calendar_guid": "string", "code": "string" }
     * @memberof CalendarProfileComponent
     */
    public profileList;

    /**
     * Selected day name array list
     * @memberof CalendarProfileComponent
     */
    public restDay = [];

    /**
     * Array list of Sunday - Saturday to show on select input
     * @type {string[]}
     * @memberof CalendarProfileComponent
     */
    public weekdays: string[];

    /**
     * Track calendar input of add calendar form
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    public profileName: any;

    /**
     * Track day selection
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    public dayControl: any;

    /**
     * Track year input form control
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    public yearDefault: any;

    /**
     * Public holiday list from API
     * @memberof CalendarProfileComponent
     */
    public countryList;

    /**
     * Region list of selected country
     * @memberof CalendarProfileComponent
     */
    public countryRegion;

    /**
     * Show/hide loading spinner
     * @type {boolean}
     * @memberof CalendarProfileComponent
     */
    public showSpinner: boolean = true;

    /**
     * Value of Region ISO from selected region/states
     * @memberof CalendarProfileComponent
     */
    public regionISO;

    /**
     * Value of selected Country ISO
     * @type {string}
     * @memberof CalendarProfileComponent
     */
    public countryIso: string;

    /**
     * World public holiday from database npm i
     * @memberof CalendarProfileComponent
     */
    public countryDB;

    /**
     * get the names assigned name list under the calendar
     * @type {any[]}
     * @memberof CalendarProfileComponent
     */
    public assignedNames: any[] = [];

    /**
     * clicked calendar profile index
     * @type {number}
     * @memberof CalendarProfileComponent
     */
    public clickedIndex: number = 0;

    /**
     * show/hide content
     * @type {boolean}
     * @memberof CalendarProfileComponent
     */
    public content: boolean = false;

    /**
     * animation slide in or out
     * @type {boolean}
     * @memberof CalendarProfileComponent
     */
    public slideInOut: boolean = false;

    /**
     * new holiday array list
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    public menuNewHoliday: any = [];

    /**
     * Track selected country in selection form field
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    public country: any;

    /**
     * track region selection in form field
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    public region: any;

    /**
     * toggle button value
     * @type {string}
     * @memberof CalendarProfileComponent
     */
    public modeValue: string = 'OFF';

    /**
     * employee list of assigned employee
     * @private
     * @type {any[]}
     * @memberof CalendarProfileComponent
     */
    private _employeeList: any[] = [];

    /**
     * user list from endpoint
     * @private
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    private _userList: any;

    /**
     * Array list for rest to patch to API
     * eg: { "fullname": "SATURDAY", "name": "SAT" }
     * @private
     * @memberof CalendarProfileComponent
     */
    private _selectedWeekday = [];

    /**
     * Selected Calendar profile from list
     * @private
     * @memberof CalendarProfileComponent
     */
    private _selectedCalendarProfile;

    /**
     * Requested personal profile from API 
     * Get API with calendar Id
     * @private
     * @memberof CalendarProfileComponent
     */
    private _personalProfile;

    /**
     * Get data from user profile API (with parameters)
     * @private
     * @type {*}
     * @memberof CalendarProfileComponent
     */
    private _items: any;

    /**
     * Bind value of checkbox status(appear) as indeterminate
     * @type {boolean}
     * @memberof CalendarProfileComponent
     */
    public isIndeterminate: boolean;


    /**
     * Bind value of checkbox status(appear) as all checked
     * @type {boolean}
     * @memberof CalendarProfileComponent
     */
    public masterCheck: boolean;


    /**
     * Get list of default profiles
     * @memberof CalendarProfileComponent
     */
    public defaultProfileLists; 

    /**
     * Bind profile object that is defined as default calendar profile
     * @memberof CalendarProfileComponent
     */
    public defaultProfileItem;
    /**
     *Creates an instance of CalendarProfileComponent.
     * @param {CalendarProfileApiService} calendarProfileAPI
     * @param {TitleCasePipe} titlecasePipe
     * @param {SharedService} sharedService shared service for toggle value & constructor menu, dialog
     * @memberof CalendarProfileComponent
     */
    constructor(private calendarProfileAPI: CalendarProfileApiService, private titlecasePipe: TitleCasePipe, public sharedService: SharedService,
        private whApi: WorkingHourApiService, private calPopoverController: PopoverController) {
    }

    /**
     * initial method to get list and set form control
     * @memberof CalendarProfileComponent
     */
    ngOnInit() {
        this.countryDB = reduce(getDataSet(), "en");
        this.countryList = Object.keys(this.countryDB).map(key => this.countryDB[key]);
        this.countryList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.dayControl = this.country = this.region = new FormControl('');
        this.yearDefault = new Date().getFullYear();
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
        this.weekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        const day = date.getDay();
        return this.weekdays[day];
    }

    /**
     * Get public holiday list from calendarific
     * @memberof CalendarProfileComponent
     */
    getPublicHolidayList() {
        this.showSpinner = true;
        this.content = false;
        this.calendarProfileAPI.get_public_holiday_list().subscribe(
            (data: any) => {
                this.showSpinner = false;
                this.content = true;
                this.list = data;
                this.events = [];
                for (let i = 0; i < this.list.response.holidays.length; i++) {
                    this.createHolidayList(this.list.response.holidays[i].date.iso, this.list.response.holidays[i].name, this.events);
                }
            });
    }

    /**
     * get assigned user list from requested calendar ID 
     * @memberof CalendarProfileComponent
     */
    getAssignedList() {
        this.calendarProfileAPI.get_user_list().subscribe(
            data => {
                this._userList = data;
            });
    }

    /**
     * get dragged user id 
     * @param {number} i
     * @memberof CalendarProfileComponent
     */
    async getDragUserId(i: number) {
        if (this.checkNameExist(this._userList, this.assignedNames[i].fullname) != 0) {
            const index: number = this.checkNameExist(this._userList, this.assignedNames[i].fullname);
            if (!this._employeeList.includes(this._userList[index].userId)) {
                await this._employeeList.push(this._userList[index].userId);
            }
        }
    }

    /**
     * check either the user name is exist or vice versa
     * @param {*} array
     * @param {*} obj
     * @returns
     * @memberof CalendarProfileComponent
     */
    checkNameExist(array: any, obj: any) {
        for (let j = 0; j < array.length; j++) {
            if (array[j].employeeName === obj) {
                return j;
            }
        }
        return 0;
    }

    /**
     * patch employee after drag n drop to calendar profile
     * @param {*} event
     * @param {*} list
     * @memberof CalendarProfileComponent
     */
    async onDrop(event, list) {
        for (let i = 0; i < this.assignedNames.length; i++) {
            if (event.data === this.assignedNames[i].fullname) {
                this.getDragUserId(i);
                let res = await this.calendarProfileAPI.patch_assign_calendar_profile({
                    "user_guid": this._employeeList,
                    "calendar_guid": list.calendar_guid
                }).toPromise();
                if (res[0].USER_INFO_GUID == undefined) {
                    this.calendarProfileAPI.notification(res.status, false);
                }
                this.assignedNames.splice(i, 1);
                this._employeeList = [];
                this.getAssignedList();
                this.profileList = await this.calendarProfileAPI.get_calendar_profile_list().toPromise();
            }
        }
    }

    /**
     * Get calendar profile list from API
     * @memberof CalendarProfileComponent
     */
    getProfileList() {
        this.calendarProfileAPI.get_calendar_profile_list().subscribe(
            (data: any[]) => {
                this.profileList = Object.assign(data);
                this.selectProfile(this.profileList[0], this.clickedIndex);
                this.getAssignedList();
                this.getDefaultProfile();
                this.showSpinner = false;
                this.content = true;
            })
            
    }

    /**
     * click save button to patch the calendar to selected calendar profile
     * @memberof CalendarProfileComponent
     */
    saveData() {
        this.slideInOut = false;
        this.clickedIndex = 0;
        this.reformatHolidayObject(this.events);
        const body = {
            "calendar_guid": this._selectedCalendarProfile.calendar_guid,
            "year": (new Date()).getFullYear(),
            "data": {
                "code": this._selectedCalendarProfile.code,
                "holiday": this.events,
                "rest": this._selectedWeekday
            }
        }
        this.calendarProfileAPI.patch_calendar_profile(body).subscribe(
            (data: any) => {
                if (data[0].CALENDAR_GUID != undefined) {
                    this.restDay = this._selectedWeekday = [];
                    this.dayControl.reset();
                    this.getProfileList();
                    this.calendarProfileAPI.notification('Edit mode disabled. Good job!', true);
                } else {
                    this.calendarProfileAPI.notification(data.status, false);
                }
            }, err => {
                this.calendarProfileAPI.notification(JSON.parse(err._body).status, false);
            })
    }


    /**
     * Select calendar profile to pass the calendar Id to API
     * Pass rest day value (eg: sat) to the select input to show initial value
     * @param {*} list
     * @memberof CalendarProfileComponent
     */
    async selectProfile(list, index) {
        this.slideInOut = false;
        this._selectedCalendarProfile = list;
        this.clickedIndex = index;
        this.restDay = [];
        let data = await this.calendarProfileAPI.get_personal_holiday_calendar(this._selectedCalendarProfile.calendar_guid, (new Date()).getFullYear()).toPromise();
        this._personalProfile = data;
        this.slideInOut = true;
        this.events = [];
        if (this._personalProfile.holiday != undefined) {
            for (let i = 0; i < this._personalProfile.holiday.length; i++) {
                this.createHolidayList(this._personalProfile.holiday[i].start, this._personalProfile.holiday[i].title, this.events);
            }
            if (this._personalProfile.holiday instanceof Array == false) {
                this.createHolidayList(this._personalProfile.holiday.start, this._personalProfile.holiday.title, this.events);
            }
        }
        if (this._personalProfile["rest"] != undefined && Array.isArray(this._personalProfile.rest) == false) {
            this.restDay.push(this.titlecasePipe.transform(this._personalProfile.rest.fullname));
        }
        if (this._personalProfile["rest"] != undefined && Array.isArray(this._personalProfile.rest) == true) {
            for (let i = 0; i < this._personalProfile.rest.length; i++) {
                this.restDay.push(this.titlecasePipe.transform(this._personalProfile.rest[i].fullname));
            }
        }
        this.dayControl.setValue(this.restDay);
        let namelist = await this.calendarProfileAPI.get_assigned_employee_list(this.profileList[index].calendar_guid).toPromise();
        this.assignedNames = namelist;
        for (let i = 0; i < this.assignedNames.length; i++) {
            this.assignedNames[i]["content"] = this.assignedNames[i].fullname;
            this.assignedNames[i]["effectAllowed"] = "copyMove";
            this.assignedNames[i]["disable"] = false;
            this.assignedNames[i]["handle"] = true;
        }
    }

    /**
     * Edit public holiday date & show day name according changed date
     * @param {*} value
     * @param {*} index
     * @memberof CalendarProfileComponent
     */
    dateChanged(value, index) {
        this.events[index].start = _moment(value).format('YYYY-MM-DD');
        this.events[index].end = _moment(value).format('YYYY-MM-DD');
        this.events[index].day = this.getWeekDay(new Date(value));
    }

    /**
     * Create a rest day array list
     * Check or uncheck weekday make changes in rest day array list
     * @param {string} day
     * @memberof CalendarProfileComponent
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
     * @memberof CalendarProfileComponent
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
     * @memberof CalendarProfileComponent
     */
    async callParamAPI(year) {
        const params = { 'country': this.countryIso, 'location': this.regionISO, 'year': year };
        this._items = await this.calendarProfileAPI.get_public_holiday_list(params).toPromise();
        this.events = [];
        for (let j = 0; j < this._items.response.holidays.length; j++) {
            this.createHolidayList(this._items.response.holidays[j].date.iso, this._items.response.holidays[j].name, this.events);
        }
    }

    /**
     * Push objects to array of event holidays
     * @param {string} dateIso
     * @param {string} name
     * @memberof CalendarProfileComponent
     */
    createHolidayList(dateIso: string, name: string, list: any) {
        list.push({
            "start": _moment(dateIso).format('YYYY-MM-DD'),
            "end": _moment(dateIso).format('YYYY-MM-DD'),
            "title": name,
            "holidayName": name,
            "day": this.getWeekDay(new Date(dateIso)),
        });
    }

    /**
     * date in menu changed
     * @param {*} value
     * @param {*} i
     * @memberof CalendarProfileComponent
     */
    menuDateChanged(value, i) {
        this.menuNewHoliday[i].start = _moment(value).format('YYYY-MM-DD');
        this.menuNewHoliday[i].end = _moment(value).format('YYYY-MM-DD');
        this.menuNewHoliday[i].day = this.getWeekDay(new Date(value));
    }

    /**
     * add new PH to the original event list
     * @memberof CalendarProfileComponent
     */
    combineEvent() {
        Array.prototype.push.apply(this.events, this.menuNewHoliday);
        this.calendarProfileAPI.notification('New public holiday(s) was added successfully.', true);
        this.sharedService.menu.close('addHolidayDetails');
        this.menuNewHoliday = [];
    }

    /**
     * Arrange object according body required of API 
     * POST / PATCH calendar profile
     * @param {*} holiday
     * @memberof CalendarProfileComponent
     */
    reformatHolidayObject(holiday) {
        for (let i = 0; i < this.events.length; i++) {
            delete holiday[i].day;
        }
        for (let j = 0; j < this.restDay.length; j++) {
            let obj = {};
            obj["fullname"] = (this.restDay[j]).toUpperCase();
            obj["name"] = obj["fullname"].substring(0, 3);
            this._selectedWeekday.push(obj);
        }
    }

    /**
     * toggle on/off of edit mode
     * @param {*} event
     * @memberof CalendarProfileComponent
     */
    toggleEvent(event) {
        if (event.detail.checked === true) {
            this.modeValue = 'ON';
            this.calendarProfileAPI.displayDialog.open(EditModeDialogComponent, {
                data: 'calendar',
                height: "343.3px",
                width: "383px"
            });
        } else {
            this.modeValue = 'OFF'
            this.saveData();
        }
        this.sharedService.emitChange(this.modeValue);
    }

    /**
     * POST/create new calendar to endpoint API
     * @memberof CalendarProfileComponent
     */
    async postData() {
        this.showSpinner = true;
        this.content = false;
        this.clickedIndex = 0;
        this.reformatHolidayObject(this.events);
        await this.callParamAPI(this.yearDefault);
        const newProfile = {
            "code": this.profileName.value,
            "filter": {
                "year": this.yearDefault,
                "country": this.countryIso,
                "region": this.regionISO
            },
            "holiday": this.events,
            "rest": this._selectedWeekday
        }
        this.calendarProfileAPI.post_calendar_profile(newProfile).subscribe(response => {
            if (response[0].CALENDAR_DETAILS_GUID != undefined) {
                this.calendarProfileAPI.notification('New calendar profile was created successfully.', true);
                this.showSpinner = false;
                this.content = true;
                this.profileName.reset();
                this.country.reset();
                this.region.reset();
                this.countryIso = this.regionISO = '';
                this.restDay = this._selectedWeekday = [];
                this.dayControl.reset();
                this.getProfileList();
            } else {
                this.calendarProfileAPI.notification(response.status, false);
                this.showSpinner = false;
                this.content = true;
            }
        }, catchErr => {
            this.calendarProfileAPI.notification(JSON.parse(catchErr._body).status, false);
        });
        // this.getProfileList();
    }

    /**
     * Delete the calendar profile after confirm by admin
     * @memberof CalendarProfileComponent
     */
    async deleteCalendarProfile(item) {
        const dialog = this.calendarProfileAPI.displayDialog.open(DeleteCalendarConfirmationComponent, {
            data: { name: item.code, value: item.calendar_guid, desc: ' calendar profile' },
            height: "195px",
            width: "270px"
        });
        let result = await dialog.afterClosed().toPromise();
        if (result === item.calendar_guid) {
            this.calendarProfileAPI.delete_calendar_profile(item.calendar_guid).subscribe(response => {
                if (response[0].CALENDAR_GUID != undefined) {
                    this.getProfileList();
                    this.slideInOut = false;
                    this.clickedIndex = 0;
                    this.dayControl.reset();
                    this.restDay = [];
                    this.calendarProfileAPI.notification('Calendar profile was deleted.', true);
                } else {
                    this.calendarProfileAPI.notification(response.status, false);
                }
            }, error => {
                this.calendarProfileAPI.notification(JSON.parse(error._body).status, false);
            })
        }
    }

    /**
     * confirmation pop up when clicked delete PH item 
     * @param {number} index
     * @param {*} event
     * @param {string} title
     * @memberof CalendarProfileComponent
     */
    deletePH(index: number, event: any, title: string) {
        const popup = this.calendarProfileAPI.displayDialog.open(DeleteCalendarConfirmationComponent, {
            data: { name: title, value: index, desc: ' from holiday list' },
            height: "195px",
            width: "270px"
        });
        popup.afterClosed().subscribe(result => {
            if (result == index && result != undefined) {
                event.splice(index, 1);
                this.calendarProfileAPI.notification('Public holiday was deleted.', true);
            }
        });
    }

    /**
     * This method is to check all the checkbox of assigned employees
     * @memberof CalendarProfileComponent
     */
    checkAllAssignedEmployees() {
        setTimeout(()=> {
            this.assignedNames.forEach(obj => {
                obj.isChecked = this.masterCheck;
            }) 
        });
    }


    /**
     * This method is to check the select all checkbox status either the all 
     * assigned employees is checked, some of assigned employees is check
     * or none of employees is checked. 
     * @memberof CalendarProfileComponent
     */
    checkAssignedEmployeeEvent() {
        const totalItems = this.assignedNames.length;
        let checked = 0;
        this.assignedNames.map(obj => {
            if (obj.isChecked) checked++;
        });
        if (checked > 0 && checked < totalItems) {
            //If even one item is checked but not all
            this.isIndeterminate = true;
            this.masterCheck = false;
        } else if (checked == totalItems) {
            //If all are checked
            this.masterCheck = true;
            this.isIndeterminate = false;
        } else {
            //If none is checked
            this.isIndeterminate = false;
            this.masterCheck = false;
        }
    }


    /**
     * This method is to assign selected employees from the checkbox into selected calendar profile
     * @param {*} profile_guid This parameter will pass calendar profile's guid
     * @memberof CalendarProfileComponent
     */
    async reassignToOtherProfile(profile_guid) {
        this._employeeList = this.assignedNames.filter(list => list.isChecked === true).map(function (o) { return o.user_guid; });
        let res = await this.calendarProfileAPI.patch_assign_calendar_profile({
            "user_guid": this._employeeList,
            "calendar_guid": profile_guid
        }).toPromise();
        if (res[0].USER_INFO_GUID == undefined) {
            this.calendarProfileAPI.notification(res.status, false);
        }
        this.assignedNames = this.assignedNames.filter(list => list.isChecked !== true);
        this._employeeList = [];
        this.getAssignedList();
        this.profileList = await this.calendarProfileAPI.get_calendar_profile_list().toPromise();
    }

    /**
     * This method is to get default profile frop API then match it with current array objects
     * @memberof CalendarProfileComponent
     */
    async getDefaultProfile() {
        this.defaultProfileLists = await this.whApi.get_default_profile().toPromise();
        this.profileList.forEach(item => {
            if (item.calendar_guid === this.defaultProfileLists[0].CALENDAR_PROFILE_GUID) {
                item.isDefault = true;
                this.defaultProfileItem = item;
            } else {
                item.isDefault = false;
            } 
        });
    }

    /**
     * Change default status of calendar profile 
     * @param {*} willChange
     * @param {*} item
     * @memberof CalendarProfileComponent
     */
    async changeDefaultCalendarProfile(willChange, item) {
        if (this.defaultProfileItem !== {}) {
            const calPopover = await this.calPopoverController.create({
                component: ConfirmationWindowComponent,
                componentProps: {
                    type: 'calendar',
                    currDefaultProfile: this.defaultProfileItem,
                    newDefaultProfile: item
                },
                cssClass: 'confirmation-popover'
            });

            calPopover.onDidDismiss().then(ret => {
                if (ret.data === true) {
                    this.whApi.post_profile_default('calendar', item.calendar_guid).subscribe(
                        data => {
                            this.getProfileList();
                        }
                    );
                }
            })
            return await calPopover.present();

        }
    }
}