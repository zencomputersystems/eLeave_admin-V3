export enum DayType {
    'Full Day',
    'Half Day',
    'Quarter Day'
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
const moment = _moment;

@Component({
    selector: 'app-apply-leave',
    templateUrl: './apply-leave.page.html',
    styleUrls: ['./apply-leave.page.scss'],
})
export class ApplyLeavePage implements OnInit {

    public entitlement: any;
    public daysAvailable: string = '';
    public daysCount: number = 0;
    public showAddIcon: boolean = true;
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    public calendarEvents: EventInput[] = [
        { title: 'Wesak Day', start: new Date('05-12-2019'), end: new Date('05-16-2019'), allDay: true }
    ];
    public minDate: string;
    public maxDate: string;
    private _userList: any;
    private _leaveTypeName: string;
    private _dateArray: any;
    private _leaveTypeId: string;
    private reformatDateFrom: string;
    private reformatDateTo: string;
    private _index: string = '0';
    private _firstForm = [];
    private _secondForm = [];
    private _thirdForm = [];
    private _firstFormIndex = [];
    private _secondFormIndex = [];
    private _thirdFormIndex = [];
    private _arrayList = [];
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    get dayTypes(): FormArray {
        return this.applyLeaveForm.get('dayTypes') as FormArray;
    }

    applyLeaveForm = new FormGroup({
        dayTypes: new FormArray([
            new FormGroup({
                name: new FormControl('0'),
                selectArray: new FormArray([
                    new FormControl(['0']),
                    new FormControl(''),
                ]),
                status: new FormControl([false])
            })
        ]),
        leaveTypes: new FormControl('', Validators.required),
        firstPicker: new FormControl('', Validators.required),
        secondPicker: new FormControl('', Validators.required),
        inputReason: new FormControl('', Validators.required),
    });


    constructor(private apiService: APIService,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.applyLeaveForm.patchValue({
                    leaveTypes: params.type,
                });
                this.daysAvailable = params.balance;
                this._leaveTypeId = params.id;
                console.log(params, this.applyLeaveForm);
            });


        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this._userList = data;
                this.entitlement = this._userList.entitlementDetail;
                console.log('entitlement', this.entitlement);
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
        setTimeout(() => {
            let calendarApi = this.calendarComponent.getApi();
            calendarApi.render();
        }, 100);
    }

    postData() {
        ///////////////// Changed POST data according server body /////////////////////
        const applyLeaveData = {
            "leaveTypeID": this._leaveTypeId,
            "startDate": this.reformatDateFrom,
            "endDate": this.reformatDateTo,
            "dayType": Number(this.dayTypes.value[this._index].name),
            "halfDay": this.dayTypes.value[this._index].selectArray[1],
            "reason": this.applyLeaveForm.value.inputReason
        }
        console.log(applyLeaveData);

        this.apiService.post_user_apply_leave(applyLeaveData).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
                this.clearArrayList();
            },
            response => {
                console.log("PATCH call in error", response);
            });
        this.setEvent(this._leaveTypeName, this.applyLeaveForm.value.firstPicker, new Date((this.applyLeaveForm.value.secondPicker).setDate((this.applyLeaveForm.value.secondPicker).getDate() + 1)));
    }

    clearArrayList() {
        this.applyLeaveForm = new FormGroup({
            dayTypes: new FormArray([
                new FormGroup({
                    name: new FormControl('0'),
                    selectArray: new FormArray([
                        new FormControl(['0']),
                        new FormControl(''),
                    ]),
                    status: new FormControl([false])
                })
            ]),
            leaveTypes: new FormControl('', Validators.required),
            firstPicker: new FormControl('', Validators.required),
            secondPicker: new FormControl('', Validators.required),
            inputReason: new FormControl('', Validators.required),
        });
        this._arrayList = [];
        this._firstForm = [];
        this._secondForm = [];
        this._thirdForm = [];
        this._firstFormIndex = [];
        this._secondFormIndex = [];
        this._thirdFormIndex = [];
    }

    onDateChange(): void {
        if (!this.applyLeaveForm.value.firstPicker || !this.applyLeaveForm.value.secondPicker) {
        } else {
            this.reformatDateFrom = moment(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this.reformatDateTo = moment(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
            this.getWeekDays(this.applyLeaveForm.value.firstPicker, this.applyLeaveForm.value.secondPicker);
            this.dayTypes.patchValue([{ selectArray: [this._dateArray] }]);
        }
    }

    // function to calculate weekdays
    getWeekDays(first, last) {
        if (first > last) return -1;
        var start = new Date(first.getTime());
        var end = new Date(last.getTime());
        this.daysCount = 0;
        this._dateArray = [];
        while (start <= end) {
            if (start.getDay() != 0 && start.getDay() != 6) {
                this.daysCount++;
                this._dateArray.push(new Date(start));
            }
            start.setDate(start.getDate() + 1);
        }
        return [this.daysCount, this._dateArray];
    }

    // get event from server that postData()
    setEvent(name: string, sdt, edt) {
        if (name && sdt && edt) {
            this.calendarEvents = this.calendarEvents.concat({
                title: name,
                start: sdt,
                end: edt,
                allDay: true
            })
        }
    }
    getValueFrom(event: MatDatepickerInputEvent<string>): string {
        return this.minDate = moment(event.value).format('YYYY-MM-DD');
    }
    getValueTo(event: MatDatepickerInputEvent<string>): string {
        const toDate: string = moment(event.value).format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

    dayTypesChanged(event, index) {
        this._index = index;
        this.showAddIcon = true;
        if (event.value == '1') {
            this.open(index);
        }
    }

    open(index) {
        if (this._arrayList.length === 0) {
            for (let j = 0; j < this.dayTypes.controls[index].value.selectArray[0].length; j++) {
                this._arrayList.push(false);
            }
        }
        const selected = (this.dayTypes.controls[index].value.status).splice(0, 1, this._arrayList);
        this.dayTypes.controls[index].patchValue([{ status: selected }]);
        if (index == 0) {
            for (let j = 0; j < this._secondFormIndex.length; j++) {
                const selected = (this.dayTypes.controls[0].value.status[0]).splice(this._secondFormIndex[j], 1, true);
                this.dayTypes.controls[0].patchValue([{ status: selected }]);
            }
            for (let j = 0; j < this._thirdFormIndex.length; j++) {
                const selected1 = (this.dayTypes.controls[0].value.status[0]).splice(this._thirdFormIndex[j], 1, true);
                this.dayTypes.controls[0].patchValue([{ status: selected1 }]);
            }
        } if (index == 1) {
            for (let j = 0; j < this._firstFormIndex.length; j++) {
                const selected = (this.dayTypes.controls[1].value.status[0]).splice(this._firstFormIndex[j], 1, true);
                this.dayTypes.controls[1].patchValue([{ status: selected }]);
            }
            for (let j = 0; j < this._thirdFormIndex.length; j++) {
                const selected1 = (this.dayTypes.controls[1].value.status[0]).splice(this._thirdFormIndex[j], 1, true);
                this.dayTypes.controls[1].patchValue([{ status: selected1 }]);
            }
        } if (index == 2) {
            for (let j = 0; j < this._firstFormIndex.length; j++) {
                const selected = (this.dayTypes.controls[2].value.status[0]).splice(this._firstFormIndex[j], 1, true);
                this.dayTypes.controls[2].patchValue([{ status: selected }]);
            }
            for (let j = 0; j < this._secondFormIndex.length; j++) {
                const selected1 = (this.dayTypes.controls[2].value.status[0]).splice(this._secondFormIndex[j], 1, true);
                this.dayTypes.controls[2].patchValue([{ status: selected1 }]);
            }
        }
    }

    halfDaySelectionChanged(selectedDate, index) {
        if (index) {
            const list = this._dateArray;
            const value = this.daysCount - (selectedDate.value.length * 0.5);
            console.log('half Day selected1', selectedDate.value);
            console.log('index1:', index);
        } else {
            const list2 = this._dateArray;
            const value = this.daysCount - (selectedDate.value.length * 0.5);
            console.log('half Day selected2', selectedDate.value);
            console.log('index2:', index);
        }
    }

    valueSelected(selectArrayList, selectArray, i, indexj) {
        if (i == 0) {
            this._firstForm.push(selectArray);
            this._firstFormIndex.push(indexj);
        } if (i == 1) {
            this._secondForm.push(selectArray);
            this._secondFormIndex.push(indexj);
        } if (i == 2) {
            this._thirdForm.push(selectArray);
            this._thirdFormIndex.push(indexj);
        }
    }

    timeSlotChanged(event, i) {
        this._index = i;
        const selected = (this.dayTypes.controls[this._index].value.selectArray).splice(1, 1, event.value);
        this.dayTypes.controls[i].patchValue([{ selectArray: selected }]);
    }

    addFormField() {
        if (this.dayTypes.controls.length < Object.keys(DayType).length / 2) {
            this.dayTypes.push(new FormGroup({
                name: new FormControl('0'),
                selectArray: new FormArray([new FormControl(this._dateArray), new FormControl('AM')]),
                status: new FormControl([false])
            }));
        } else {
            this.showAddIcon = false;
            alert("No other option");
        }
    }

    getIndex(leave) {
        this.daysAvailable = leave.balanceDays;
        this._leaveTypeId = leave.leaveTypeId;
        this._leaveTypeName = leave.leaveTypeName;
    }

}
