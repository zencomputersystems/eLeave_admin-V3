import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
const moment = _moment;

@Component({
    selector: 'app-apply-leave',
    templateUrl: './apply-leave.page.html',
    styleUrls: ['./apply-leave.page.scss'],
})
export class ApplyLeavePage implements OnInit {

    public list: any;
    public employmentlist: any;
    public reason: string;
    public days: string;
    public halfDayButtonSelected: boolean;
    public disabledHalfDayDate: boolean;
    public timeSlot: string;
    public calendarVisible: boolean = true;
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    public calendarWeekends = true;
    public calendarEvents: EventInput[] = [
        { title: 'Event Now', start: new Date() }
    ];
    private datefrom: FormGroup;
    private dateto: FormGroup;
    private reasons: FormGroup;
    private minDate: string;
    private maxDate: string;
    private today: string;
    private reformatDateFrom: string;
    private reformatDateTo: string;
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;


    get personalList() {
        return this.list;
    }
    get employmentPersonalList() {
        return this.employmentlist;
    }
    get dateFromForm(): FormGroup {
        return this.datefrom;
    }
    get dateToForm(): FormGroup {
        return this.dateto;
    }
    get minDateAllow(): string {
        return this.minDate;
    }
    get maxDateAllow(): string {
        return this.maxDate;
    }
    get reasonForm(): FormGroup {
        return this.reasons;
    }
    // get todayDate(): string {
    //     return this.today;
    // }


    constructor(private apiService: APIService, private router: Router,
        private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        // this.today = moment(new Date()).format('YYYY-MM-DD');
        // this.maxDate = this.minDate;
        this.datefrom = this._formBuilder.group({
            firstPicker: ['', Validators.required]
        });
        this.dateto = this._formBuilder.group({
            secondPicker: ['', Validators.required]
        });
        this.reasons = this._formBuilder.group({
            inputReason: ['', Validators.required]
        })
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                console.log(this.list);
            },
            error => {
                if (error) {
                    location.reload;
                    this.router.navigate(['/login']);
                }
            }
        );

        // this.someMethod();

    }

    onDateFromChange(): void {
        if (!this.datefrom.value.firstPicker || this.datefrom.status === 'INVALID' ||
            !this.dateto || !this.dateto.value.secondPicker || this.dateto.status === 'INVALID') {
        } else {
            this.reformatDateFrom = moment(this.datefrom.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this.reformatDateTo = moment(this.dateto.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    onDateToChange(): void {
        if (!this.dateto.value.secondPicker || this.dateto.status === 'INVALID' ||
            !this.datefrom || !this.datefrom.value.firstPicker || this.datefrom.status === 'INVALID') {
        } else {
            this.reformatDateFrom = moment(this.datefrom.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this.reformatDateTo = moment(this.dateto.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    getValueFrom(event: MatDatepickerInputEvent<string>): string {
        return this.minDate = moment(event.value).add(1, 'days').format('YYYY-MM-DD');
    }
    getValueTo(event: MatDatepickerInputEvent<string>): string {
        const toDate: string = moment(event.value).subtract(1, 'days').format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

    someMethod() {
        let calendarApi = this.calendarComponent.getApi();
        calendarApi.next();
        console.log(calendarApi);
    }

    handleDateClick(arg) {
        if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
            this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
                title: 'New Event',
                start: arg.date,
                allDay: arg.allDay
            })
        }
    }

    halfDaySelected(event) {
        if (event.detail.checked === true) {
            this.halfDayButtonSelected = true;
        } else {
            this.halfDayButtonSelected = false;
            this.disabledHalfDayDate = true;
            this.timeSlot = '';
        }
    }

    backToProfile() {
        this.router.navigate(['/main/employee-setup/leave-entitlement']);
    }

}
