import { Component, OnInit, ViewChild } from '@angular/core';
import * as _moment from 'moment';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Subscription } from 'rxjs';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { APIService } from 'src/services/shared-service/api.service';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
const moment = _moment;

@Component({
    selector: 'app-manage-holiday',
    templateUrl: './manage-holiday.page.html',
    styleUrls: ['./manage-holiday.page.scss'],
    providers: [NgbTooltipConfig]
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
     * Track start date value and validation
     * @private
     * @type {FormGroup}
     * @memberof PersonalPage
     */
    private _date: FormGroup;

    /**
     * Return start date value
     * @readonly
     * @type {FormGroup}
     * @memberof PersonalPage
     */
    get dateForm(): FormGroup {
        return this._date;
    }

    //     public eventRender: function(info) {
    //     var tooltip = new Tooltip(info.el, {
    //         title: info.event.extendedProps.description,
    //         placement: 'top',
    //         trigger: 'hover',
    //         container: 'body'
    //     });
    // }


    /**
     *Creates an instance of CalendarViewPage.
     * @param {APIService} apiService
     * @memberof CalendarViewPage
     */
    constructor(private apiService: APIService, config: NgbTooltipConfig, private _formBuilder: FormBuilder
    ) {
        config.placement = 'top';
        config.triggers = 'click';
        config.container = 'body';
    }

    ngOnInit() {
        this.subscription = this.apiService.get_public_holiday_list().subscribe(
            (data: any[]) => {
                this.list = data;
                this.events = [];
                for (let i = 0; i < this.list.response.holidays.length; i++) {
                    this._date = this._formBuilder.group({ datepicker: ['', Validators.required] });
                    this._date = new FormGroup({
                        datepicker: new FormControl(new Date(this.list.response.holidays[i].date.iso)),
                    })
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
                console.log(this.list, this.events);
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
     * format date using moment library
     * @param {*} date
     * @memberof CalendarViewPage
     */
    editDateFormat(date) {
        this.events = date;
        for (let i = 0; i < date.length; i++) {
            this.events[i].start = (moment(date[i].start).format('YYYY-MM-DD'));
            this.events[i].end = moment(date[i].end).format('YYYY-MM-DD');
            this.events[i].day = this.getWeekDay(new Date(date[i].start));
            this.events[i].allDay = true;
        }
        setTimeout(() => {
            let calendarView = this.calendar.getApi();
            calendarView.render();
        }, 100);
    }

    /**
     * Method to get day of the week from a given date
     * @param {*} date
     * @returns
     * @memberof CalendarViewPage
     */
    getWeekDay(date) {
        //Create an array containing each day, starting with Sunday.
        const weekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        //Use the getDay() method to get the day.
        const day = date.getDay();
        //Return the element that corresponds to that index.
        return weekdays[day];
    }


    deleteHoliday(index) {
        this.events.splice(index, 1);
        console.log(this.events);
    }

    saveData(){

    }

}