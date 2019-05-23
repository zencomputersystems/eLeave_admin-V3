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
import { Subscription } from 'rxjs';
import { DayType } from './apply-leave.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationPage } from './notification/notification.page';
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
    public applyLeaveForm: FormGroup;
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
    private subscription: Subscription = new Subscription();
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    get dayTypes(): FormArray {
        return this.applyLeaveForm.get('dayTypes') as FormArray;
    }

    constructor(private apiService: APIService,
        private route: ActivatedRoute, private snackBar: MatSnackBar) {
        this.applyLeaveForm = this.formGroup();
        route.queryParams
            .subscribe(params => {
                this.applyLeaveForm.patchValue({
                    leaveTypes: params.type,
                });
                this.daysAvailable = params.balance;
                this._leaveTypeId = params.id;
            });
    }

    ngOnInit() {

        this.subscription = this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this._userList = data;
                this.entitlement = this._userList.entitlementDetail;
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    formGroup() {
        return new FormGroup({
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

        this.subscription = this.apiService.post_user_apply_leave(applyLeaveData).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
                this.clearArrayList();
                this.openSnackBar('success');
            },
            response => {
                console.log("PATCH call in error", response);
                this.openSnackBar('fail');
                if(response.status === 401){
                    window.location.href = '/login';
                }
            });
        this.setEvent(this._leaveTypeName, this.applyLeaveForm.value.firstPicker, new Date((this.applyLeaveForm.value.secondPicker).setDate((this.applyLeaveForm.value.secondPicker).getDate() + 1)));
    }

    clearArrayList() {
        this.applyLeaveForm = this.formGroup();
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

    patchValueFunction(i: number, value: any, disabled: boolean) {
        for (let j = 0; j < value.length; j++) {
            const valueFirst = (this.dayTypes.controls[i].value.status[0]).splice(value[j], 1, disabled);
            this.dayTypes.controls[0].patchValue([{ status: valueFirst }]);
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
            this.patchValueFunction(index, this._firstFormIndex, false)
            this.patchValueFunction(index, this._secondFormIndex, true);
            this.patchValueFunction(index, this._thirdFormIndex, true);
        } if (index == 1) {
            this.patchValueFunction(index, this._firstFormIndex, true);
            this.patchValueFunction(index, this._secondFormIndex, false);
            this.patchValueFunction(index, this._thirdFormIndex, true);
        } if (index == 2) {
            this.patchValueFunction(index, this._firstFormIndex, true);
            this.patchValueFunction(index, this._secondFormIndex, true);
            this.patchValueFunction(index, this._thirdFormIndex, false);
        }
    }

    calculate(date, form) {
        let missing = null;
        for (let i = 0; i < form.length; i++) {
            if (date.indexOf(form[i]) == -1) {
                missing = form[i];
                this.daysCount = this.daysCount + 0.5;
            }
        }
        if (!missing) { this.daysCount = this.daysCount - 0.5; }
    }

    halfDaySelectionChanged(selectedDate, index) {
        if (index == 0) {
            this.calculate(selectedDate, this._firstForm);
            this._firstForm = selectedDate;
        }
        if (index == 1) {
            this.calculate(selectedDate, this._secondForm);
            this._secondForm = selectedDate;
        }
        if (index == 2) {
            this.calculate(selectedDate, this._thirdForm);
            this._thirdForm = selectedDate;
        }
    }

    valueSelected(i, indexj) {
        if (i == 0) {
            const index = this._firstFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._firstFormIndex.splice(index, 1);
            } else {
                this._firstFormIndex.push(indexj);
            }
        } if (i == 1) {
            const index = this._secondFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._secondFormIndex.splice(index, 1);
            } else {
                this._secondFormIndex.push(indexj);
            }
        } if (i == 2) {
            const index = this._thirdFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._thirdFormIndex.splice(index, 1);
            } else {
                this._thirdFormIndex.push(indexj);
            }
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

    openSnackBar(message: string) {
        this.snackBar.openFromComponent(NotificationPage, {
            duration: 2000,
            data: message
        });
    }

}
