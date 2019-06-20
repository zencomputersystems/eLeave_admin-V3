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
import { IonSelect } from '@ionic/angular';
const moment = _moment;

@Component({
    selector: 'app-manage-holiday',
    templateUrl: './manage-holiday.page.html',
    styleUrls: ['./manage-holiday.page.scss'],
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


    public profileList;

    public profile;

    public value;

    public restDay;

    public weekdays: string[];

    public calendarForm: FormGroup = new FormGroup({
        calendarProfile: new FormControl('', Validators.required),
        dayControl: new FormControl('', Validators.required),
    });;

    @ViewChild('mySelect') selectRef: IonSelect;

    /**
     *Creates an instance of CalendarViewPage.
     * @param {APIService} apiService
     * @memberof CalendarViewPage
     */
    constructor(private apiService: APIService, private fb: FormBuilder) {
    }

    ngOnInit() {

        // this.calendarForm = this.fb.group({
        //     dayControl: [this.restDay.fullname]
        // });

        this.subscription = this.apiService.get_calendar_profile_list().subscribe(
            (data: any[]) => {
                this.profileList = data;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            })

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


    deleteHoliday(index) {
        this.events.splice(index, 1);
        console.log(this.events);
    }

    saveData() {
        console.log(this.events);
        console.log('id', this.profile);
        this.editDate = false;
        let holiday = this.events;
        for (let i = 0; i < this.events.length; i++) {
            delete holiday[i].allDay;
            delete holiday[i].backgroundColor;
            delete holiday[i].borderColor;
            delete holiday[i].day;
            delete holiday[i].description;
        }
        console.log('holiday', holiday);
        const body = {
            "calendar_guid": this.profile.calendar_guid,
            "data": {
                "code": this.profile.code,
                "holiday": holiday,
                "rest": this.restDay
            }
        }
        this.subscription = this.apiService.patch_calendar_profile(body).subscribe(
            (data: any[]) => {
                console.log(data);
            },
            () => {
                console.log('success');
            })
    }

    selectProfile(list) {
        this.profile = list;
        this.subscription = this.apiService.get_personal_holiday_calendar(this.profile.calendar_guid).subscribe(
            (data: any) => {
                this.restDay = data.rest;
                console.log(this.restDay);
            })
    }

    addEvent(value, index) {
        this.events[index].start = moment(value).format('YYYY-MM-DD');
        this.events[index].end = moment(value).format('YYYY-MM-DD');
        this.events[index].day = this.getWeekDay(new Date(value));
    }

    onSearchChange(inputValue, index) {
        this.events[index].title = inputValue;
    }

    restDaySelected(index, day) {
        console.log(index, day);
    }

}