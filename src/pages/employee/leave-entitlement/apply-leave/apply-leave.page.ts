export enum DayType {
    'Full Day',
    'Half Day',
    'Quarter Day'
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LeaveEntitlementPage } from '../leave-entitlement.page';
const moment = _moment;

@Component({
    selector: 'app-apply-leave',
    templateUrl: './apply-leave.page.html',
    styleUrls: ['./apply-leave.page.scss'],
})
export class ApplyLeavePage implements OnInit {

    public list: any;
    public employmentlist: any;
    public userList: any;
    public entitlement: any;
    public leaveTypeId: string;
    public types: string;
    public reason: string = '';
    public daysAvailable: string = '';
    public daysCount: string = '0';
    public dayTypes: string[] = ['0'];
    public fullDay: boolean = true;
    public showAddIcon: boolean = false;
    public halfDayOptionSelected: boolean;
    public disabledHalfDayDate: boolean = true;
    public timeSlot: string;
    public halfDaydates: string;
    public calendarVisible: boolean = true;
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    public calendarWeekends = true;
    public calendarEvents: EventInput[] = [
        { title: 'Event Now', start: new Date() }
    ];
    private date: FormGroup;
    // private dateto: FormGroup;
    private reasons: FormGroup;
    private minDate: string;
    private maxDate: string;
    private reformatDateFrom: string;
    private reformatDateTo: string;
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild(LeaveEntitlementPage) childReference: LeaveEntitlementPage;

    get personalList() {
        return this.list;
    }
    get employmentPersonalList() {
        return this.employmentlist;
    }
    get dateForm(): FormGroup {
        return this.date;
    }
    get minDateAllow(): string {
        return this.minDate;
    }
    get maxDateAllow(): string {
        return this.maxDate;
    }


    constructor(private apiService: APIService, private router: Router,
        private route: ActivatedRoute,
        private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.types = params.type;
                this.daysAvailable = params.balance;
                console.log(params);
            });

        this.date = this._formBuilder.group({
            firstPicker: ['', Validators.required],
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
                    this.router.navigate(['/login']);
                }
            }
        );
        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this.userList = data;
                this.entitlement = this.userList.entitlementDetail;
                console.log('entitlement', this.entitlement);
            }
        );
    }

    postData() {
        const applyLeaveData = {
            "leaveTypeID": this.leaveTypeId,
            "startDate": this.reformatDateFrom,
            "endDate": this.reformatDateTo,
            "dayType": Number(this.dayTypes),
            "halfDay": this.timeSlot,
            "reason": "Travel"
        }

        this.apiService.post_user_apply_leave(applyLeaveData).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
                // this.apiService.get_personal_details().subscribe(
                //     (data: any[]) => {
                //         this.list = data;
                //         console.log(this.list);
                //     }
                // );
            },
            response => {
                console.log("PATCH call in error", response);
            },
            () => {
                console.log("The PATCH observable is now completed.");
            });
    }

    onDateFromChange(): void {
        if (!this.date.value.firstPicker || this.date.status === 'INVALID' ||
            !this.date || !this.date.value.secondPicker) {
        } else {
            this.reformatDateFrom = moment(this.date.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this.reformatDateTo = moment(this.date.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    onDateToChange(): void {
        if (!this.date.value.secondPicker || this.date.status === 'INVALID' ||
            !this.date || !this.date.value.firstPicker) {
        } else {
            this.reformatDateFrom = moment(this.date.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this.reformatDateTo = moment(this.date.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
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

    dayTypesChanged(event) {
        this.showAddIcon = true;
        if (event.value === "0") {
            this.fullDay = true;
        } else if (event.value === "1") {
            this.fullDay = false;
            this.halfDayOptionSelected = true;
            this.disabledHalfDayDate = false;
        } else {
            this.fullDay = false;
        }
    }

    addFormField() {
        if (this.dayTypes.length < Object.keys(DayType).length / 2) {
            this.dayTypes.push('0');
            console.log(this.dayTypes);
        } else {
            this.showAddIcon = false;
            alert("No other option");
        }
    }

    calculateApplyLeaveDays() {

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

    // halfDaySelected(event) {
    //     if (event.detail.checked === true) {
    //         this.halfDayOptionSelected = true;
    //         this.disabledHalfDayDate = false;
    //     } else {
    //         this.halfDayOptionSelected = false;
    //         this.disabledHalfDayDate = true;
    //         this.halfDaydates = undefined;
    //         this.timeSlot = '';
    //     }
    // }
    getIndex(leave) {
        this.daysAvailable = leave.balanceDays;
        this.leaveTypeId = leave.leaveTypeId;
        console.log(leave, this.daysAvailable);
    }

    backToProfile() {
        this.router.navigate(['/main/employee-setup/leave-entitlement']);
    }

}
