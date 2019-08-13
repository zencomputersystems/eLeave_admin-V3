import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import * as _moment from 'moment';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
const moment = _moment;
import { getDataSet, reduce } from "iso3166-2-db";
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { APP_DATE_FORMATS, AppDateAdapter } from '../date.adapter';
import { LeaveAPIService } from '../leave-api.service';

/**
 * Manage holiday and rest day for employee
 * @export
 * @class ManageHolidayPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-manage-holiday',
    templateUrl: './manage-holiday.page.html',
    styleUrls: ['./manage-holiday.page.scss'],
    providers: [TitleCasePipe,
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ManageHolidayPage implements OnInit {

    /**
      * This is local property for Full Calendar Component
      * @type {FullCalendarComponent}
      * @memberof ManageHolidayPage
      */
    @ViewChild('calendar') calendar: FullCalendarComponent;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof ManageHolidayPage
     */
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, listYear];

    /**
     * Get data from user profile API
     * @type {*}
     * @memberof ManageHolidayPage
     */
    public list: any;

    /**
     * Get data from user profile API (with parameters)
     * @type {*}
     * @memberof ManageHolidayPage
     */
    public items: any;

    /** 
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof ManageHolidayPage
     */
    public events: EventInput[];

    /**
     * Show or hide edit profile
     * @type {boolean}
     * @memberof ManageHolidayPage
     */
    public editCalendar: boolean = false;

    /**
     * Calendar profile list from API
     * eg: { "calendar_guid": "string", "code": "string" }
     * @memberof ManageHolidayPage
     */
    public profileList;

    /**
     * Selected Calendar profile from list
     * @memberof ManageHolidayPage
     */
    public selectedCalendarProfile;

    /**
     * Requested personal profile from API 
     * Get API with calendar Id
     * @memberof ManageHolidayPage
     */
    public personalProfile;

    /**
     * Selected day name array list
     * @memberof ManageHolidayPage
     */
    public restDay = [];

    /**
     * Array list of Sunday - Saturday to show on select input
     * @type {string[]}
     * @memberof ManageHolidayPage
     */
    public weekdays: string[];

    /**
     * Array list for rest to patch to API
     * eg: { "fullname": "SATURDAY", "name": "SAT" }
     * @memberof ManageHolidayPage
     */
    public selectedWeekday = [];

    /**
     * Track calendar input of edit calendar form
     * @type {FormGroup}
     * @memberof ManageHolidayPage
     */
    public editCalendarForm: FormGroup;

    /**
     *  Track calendar input of add calendar form
     * @type {FormGroup}
     * @memberof ManageHolidayPage
     */
    public addCalendarForm: FormGroup;

    /**
     * Public holiday list from API
     * @memberof ManageHolidayPage
     */
    public countryList;

    /**
     * Region list of selected country
     * @memberof ManageHolidayPage
     */
    public countryRegion;

    /**
     * Show/hide input form of add new calendar profile
     * @type {boolean}
     * @memberof ManageHolidayPage
     */
    public addCalendar: boolean = false;

    /**
     * Show/hide of save button and calendar profile select input
     * @type {boolean}
     * @memberof ManageHolidayPage
     */
    public showEditForm: boolean = false;

    /**
     * Show/hide loading spinner
     * @type {boolean}
     * @memberof ManageHolidayPage
     */
    public showSpinner: boolean = true;

    /**
     * Value of Region ISO from selected region/states
     * @memberof ManageHolidayPage
     */
    public regionISO;

    /**
     * Value of selected Country ISO
     * @type {string}
     * @memberof ManageHolidayPage
     */
    public countryIso: string;

    /**
        * World public holiday from database npm i
        * @memberof ManageHolidayPage
        */
    public countryDB;

    /** 
     * Get Height of calendar when window resize to set in holiday view
     * @type {number}
     * @memberof ManageHolidayPage
     */
    public height: number;

    /**
     *Creates an instance of ManageHolidayPage.
     * @param {LeaveAPIService} leaveAPI
     * @param {FormBuilder} fb
     * @param {TitleCasePipe} titlecasePipe
     * @memberof ManageHolidayPage
     */
    constructor(private leaveAPI: LeaveAPIService, private fb: FormBuilder, private titlecasePipe: TitleCasePipe) {
    }

    ngOnInit() {
        window.dispatchEvent(new Event('resize'));
        this.countryDB = reduce(getDataSet(), "en");
        this.countryList = Object.keys(this.countryDB).map(key => this.countryDB[key]);
        this.countryList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.editCalendarForm = this.fb.group({
            calendarProfile: new FormControl('', Validators.required),
            dayControl: new FormControl(['']),
        });
        this.addCalendarForm = this.fb.group({
            profileName: new FormControl('', Validators.required),
        });
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
     * @memberof ManageHolidayPage
     */
    getPublicHolidayList() {
        this.showSpinner = true;
        this.leaveAPI.get_public_holiday_list().subscribe(
            (data: any[]) => {
                this.showSpinner = false;
                this.list = data;
                this.events = [];
                for (let i = 0; i < this.list.response.holidays.length; i++) {
                    this.createHolidayList(this.list.response.holidays[i].date.iso, this.list.response.holidays[i].name);
                }
                setTimeout(() => {
                    let calendarView = this.calendar.getApi();
                    calendarView.render();
                }, 100);
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    /**
     * Get calendar profile list from API
     * @memberof ManageHolidayPage
     */
    getProfileList() {
        this.leaveAPI.get_calendar_profile_list().subscribe(
            (data: any[]) => {
                this.profileList = data;
                this.showSpinner = false;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            })
    }

    /**
     * click save button to patch the calendar to selected calendar profile
     * @memberof ManageHolidayPage
     */
    saveData() {
        this.showSpinner = true;
        this.editCalendar = false;
        this.reformatHolidayObject(this.events);
        const body = {
            "calendar_guid": this.selectedCalendarProfile.calendar_guid,
            "data": {
                "code": this.selectedCalendarProfile.code,
                "holiday": this.events,
                "rest": this.selectedWeekday
            }
        }
        this.leaveAPI.patch_calendar_profile(body).subscribe(
            (data: any[]) => {
                this.showSpinner = false;
                this.restDay = [];
                this.selectedWeekday = [];
                this.editCalendarForm.reset();
                this.getProfileList();
                setTimeout(() => {
                    this.getPublicHolidayList();
                }, 100);
            })
    }

    /**
     * Select calendar profile to pass the calendar Id to API
     * Pass rest day value (eg: sat) to the select input to show initial value
     * @param {*} list
     * @memberof ManageHolidayPage
     */
    selectProfile(list) {
        this.showSpinner = true;
        this.selectedCalendarProfile = list;
        this.restDay = [];
        this.leaveAPI.get_personal_holiday_calendar(this.selectedCalendarProfile.calendar_guid).subscribe(
            (data: any) => {
                this.showSpinner = false;
                this.personalProfile = data;
                this.events = [];
                for (let i = 0; i < this.personalProfile.holiday.length; i++) {
                    this.createHolidayList(this.personalProfile.holiday[i].start, this.personalProfile.holiday[i].title);
                }
                setTimeout(() => {
                    let calendarView = this.calendar.getApi();
                    calendarView.render();
                }, 100);
                if (this.personalProfile["rest"] != undefined && Array.isArray(this.personalProfile.rest) == false) {
                    this.restDay.push(this.titlecasePipe.transform(this.personalProfile.rest.fullname));
                }
                if (this.personalProfile["rest"] != undefined && Array.isArray(this.personalProfile.rest) == true) {
                    for (let i = 0; i < this.personalProfile.rest.length; i++) {
                        this.restDay.push(this.titlecasePipe.transform(this.personalProfile.rest[i].fullname));
                    }
                }
            })
    }

    /**
     * Edit public holiday date & show day name according changed date
     * @param {*} value
     * @param {*} index
     * @memberof ManageHolidayPage
     */
    dateChanged(value, index) {
        this.events[index].start = moment(value).format('YYYY-MM-DD');
        this.events[index].end = moment(value).format('YYYY-MM-DD');
        this.events[index].day = this.getWeekDay(new Date(value));
    }

    /**
     * Create a rest day array list
     * Check or uncheck weekday make changes in rest day array list
     * @param {string} day
     * @memberof ManageHolidayPage
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
     * @memberof ManageHolidayPage
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
     * @memberof ManageHolidayPage
     */
    callParamAPI(year, month) {
        this.showSpinner = true;
        this.editCalendar = true;
        this.addCalendar = false;
        const params = { 'country': this.countryIso, 'location': this.regionISO, 'year': year, 'month': month, };
        this.leaveAPI.get_public_holiday_list(params).subscribe(
            (data: any[]) => {
                this.showSpinner = false;
                this.items = data;
                this.events = [];
                for (let j = 0; j < this.items.response.holidays.length; j++) {
                    this.createHolidayList(this.items.response.holidays[j].date.iso, this.items.response.holidays[j].name);
                }
            })
    }

    /**
     * Push objects to array of event holidays
     * @param {*} dateIso
     * @param {*} name
     * @memberof ManageHolidayPage
     */
    createHolidayList(dateIso, name) {
        this.events.push({
            "start": moment(dateIso).format('YYYY-MM-DD'),
            "end": moment(dateIso).format('YYYY-MM-DD'),
            "title": name,
            "day": this.getWeekDay(new Date(dateIso)),
            "allDay": true,
            "backgroundColor": "#283593",
            "borderColor": "#283593"
        });
    }

    /**
     * Arrange object according body required of API 
     * POST / PATCH calendar profile
     * @param {*} holiday
     * @memberof ManageHolidayPage
     */
    reformatHolidayObject(holiday) {
        for (let i = 0; i < this.events.length; i++) {
            delete holiday[i].allDay;
            delete holiday[i].backgroundColor;
            delete holiday[i].borderColor;
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
     * @memberof ManageHolidayPage
     */
    postData() {
        this.showSpinner = true;
        this.reformatHolidayObject(this.events);
        const newProfile = {
            "code": this.addCalendarForm.get('profileName').value,
            "holiday": this.events,
            "rest": this.selectedWeekday
        }
        this.leaveAPI.post_calendar_profile(newProfile).subscribe(
            response => {
                this.showSpinner = false;
                this.getProfileList();
            });
        this.restDay = [];
        this.selectedWeekday = [];
        this.addCalendarForm.reset();
        setTimeout(() => {
            this.getPublicHolidayList();
        }, 100);
    }

    /**
     * Calculate height
     * @param {*} event
     * @memberof ManageHolidayPage
     */
    onResize(event) {
        this.height = (event.target.innerHeight - 153) - (5 / 100)
    }

}