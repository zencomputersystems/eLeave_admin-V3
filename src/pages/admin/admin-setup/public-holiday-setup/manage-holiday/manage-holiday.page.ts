import { Component, OnInit, ViewChild } from '@angular/core';
import * as _moment from 'moment';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Subscription } from 'rxjs';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
const moment = _moment;

@Component({
    selector: 'app-manage-holiday',
    templateUrl: './manage-holiday.page.html',
    styleUrls: ['./manage-holiday.page.scss'],
    providers: [TitleCasePipe]
})
export class ManageHolidayPage implements OnInit {

    /**
      * This is local property for Full Calendar Component
      * @type {FullCalendarComponent}
      * @memberof CalendarViewPage
      */
    @ViewChild('calendar') calendar: FullCalendarComponent;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof CalendarViewPage
     */
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, listYear];

    /**
     * This local property is used to set subscription
     * @private
     * @type {Subscription}
     * @memberof LeavePlanningPage
     */
    private subscription: Subscription = new Subscription();

    /**
     * Get data from user profile API
     * @type {*}
     * @memberof CalendarViewPage
     */
    public list: any;

    /** 
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof CalendarViewPage
     */
    public events: EventInput[];

    /**
     * Show or hide edit profile
     * @type {boolean}
     * @memberof PersonalPage
     */
    public editDate: boolean = false;

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
     * Track calendar input
     * @type {FormGroup}
     * @memberof ManageHolidayPage
     */
    public calendarForm: FormGroup;

    /**
     *Creates an instance of CalendarViewPage.
     * @param {APIService} apiService
     * @memberof CalendarViewPage
     */
    constructor(private apiService: APIService, private fb: FormBuilder, private titlecasePipe: TitleCasePipe) {
    }

    ngOnInit() {

        this.calendarForm = this.fb.group({
            calendarProfile: new FormControl('', Validators.required),
            dayControl: new FormControl([''])
        });
        this.getPublicHolidayList();
        this.subscription = this.apiService.get_calendar_profile_list().subscribe(
            (data: any[]) => {
                this.profileList = data;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            })
    }

    /**
     * This method is used to destroy subscription
     * @memberof ApplyLeavePage
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
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
        this.subscription = this.apiService.get_public_holiday_list().subscribe(
            (data: any[]) => {
                this.list = data;
                this.events = [];
                for (let i = 0; i < this.list.response.holidays.length; i++) {
                    this.events.push({
                        "start": moment(this.list.response.holidays[i].date.iso).format('YYYY-MM-DD'),
                        "end": moment(this.list.response.holidays[i].date.iso).format('YYYY-MM-DD'),
                        "title": this.list.response.holidays[i].name,
                        "day": this.getWeekDay(new Date(this.list.response.holidays[i].date.iso)),
                        "description": this.list.response.holidays[i].description,
                        "allDay": true,
                        "backgroundColor": "#283593",
                        "borderColor": "#283593"
                    });
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
     * Delete public holiday before patch to API
     * @param {*} index
     * @memberof ManageHolidayPage
     */
    deleteHoliday(index) {
        this.events.splice(index, 1);
    }

    /**
     * click save button to patch the calendar to selected calendar profile
     * @memberof ManageHolidayPage
     */
    saveData() {
        console.log(this.events);
        this.editDate = false;
        const holiday = this.events;
        for (let i = 0; i < this.events.length; i++) {
            delete holiday[i].allDay;
            delete holiday[i].backgroundColor;
            delete holiday[i].borderColor;
            delete holiday[i].day;
            delete holiday[i].description;
        }

        for (let j = 0; j < this.restDay.length; j++) {
            let obj = {};
            obj["fullname"] = (this.restDay[j]).toUpperCase();
            obj["name"] = obj["fullname"].substring(0, 3);
            this.selectedWeekday.push(obj);
        }
        const body = {
            "calendar_guid": this.selectedCalendarProfile.calendar_guid,
            "data": {
                "code": this.selectedCalendarProfile.code,
                "holiday": holiday,
                "rest": this.selectedWeekday
            }
        }
        this.subscription = this.apiService.patch_calendar_profile(body).subscribe(
            (data: any[]) => {
                this.restDay = [];
                this.selectedWeekday = [];
                this.calendarForm.reset();
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
        this.selectedCalendarProfile = list;
        this.subscription = this.apiService.get_personal_holiday_calendar(this.selectedCalendarProfile.calendar_guid).subscribe(
            (data: any) => {
                this.personalProfile = data;
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
     * Edit title of the public holiday to update to API
     * @param {*} inputValue
     * @param {*} index
     * @memberof ManageHolidayPage
     */
    titleChanges(inputValue, index) {
        this.events[index].title = inputValue;
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
     * Update value of form control when open the mat-select input
     * @memberof ManageHolidayPage
     */
    open() {
        this.calendarForm.patchValue({ dayControl: this.restDay });
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

}