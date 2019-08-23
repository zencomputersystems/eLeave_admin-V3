import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../date.adapter';
import { DayType } from './apply-on-behalf.service';
import { LeaveAPIService } from '../leave-api.service';
import { EmployeeTreeview } from '../assign-calendar/employee-treeview.service';
const moment = _moment;
/**
 * Apply Leave Page
 * @export
 * @class ApplyLeavePage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-apply-on-behalf',
    templateUrl: './apply-on-behalf.page.html',
    styleUrls: ['./apply-on-behalf.page.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ApplyOnBehalfPage implements OnInit {
    /**
     * Local property for leave entitlement details
     * @type {*}
     * @memberof ApplyLeavePage
     */
    public entitlement: any;

    /**
     * Get calendar id from user profile API & request data from calendar API
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public calendarId: string;

    /**
     * Local property for leave day available
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public daysAvailable: string = '';

    /**
     * Local property for leave day applied
     * @type {number}
     * @memberof ApplyLeavePage
     */
    public daysCount: number = 0;

    /**
     * Local property for show or hide Add icon
     * @type {boolean}
     * @memberof ApplyLeavePage
     */
    public showAddIcon: boolean = true;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof ApplyLeavePage
     */
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

    /**
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof ApplyLeavePage
     */
    public calendarEvents: EventInput[];

    /**
     * Local property for min. date range
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public minDate: string;

    /**
     * Local property for max. date range
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public maxDate: string;

    /**
     * Local property for leave form group
     * @type {FormGroup}
     * @memberof ApplyLeavePage
     */
    public applyLeaveForm: any;

    /**
     * Local property for selected quarter hour value
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public selectedQuarterHour: string = '';

    /**
     * Local property for leave type ID
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public leaveTypeId: string;

    /**
     * company list from API
     *
     * @type {*}
     * @memberof ApplyOnBehalfPage
     */
    public companyList: any;


    /**
     * department list get from selected company
     * @type {*}
     * @memberof ApplyOnBehalfPage
     */
    public departmentlist: any = [];

    /**
     * show/hide the tree view 
     * @type {boolean}
     * @memberof ApplyOnBehalfPage
     */
    public showTreeDropdown: boolean = false;

    /**
     * show selected tree value after clicked outside the div
     * @type {boolean}
     * @memberof ApplyOnBehalfPage
     */
    public showSelectedTree: boolean = false;

    /**
     * radio button value
     * @type {string}
     * @memberof ApplyOnBehalfPage
     */
    public radioOption: string = '1';

    /**
     * list of leave types
     * @type {*}
     * @memberof ApplyOnBehalfPage
     */
    public leaveTypes: any;

    /**
     * show loading spinner
     * @type {boolean}
     * @memberof ApplyOnBehalfPage
     */
    public showSpinner: boolean = false;

    /**
     * company Id get from selected company list
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfPage
     */
    private _selectedCompanyId: string;


    /**
     * selected tree item
     * @private
     * @type {*}
     * @memberof ApplyOnBehalfPage
     */
    private _employeeTree: any = [];

    /**
     * user guid from selected employee (option == 1)
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfPage
     */
    private guid: string;
    /**
     * selected user id
     * @private
     * @type {string[]}
     * @memberof ApplyOnBehalfPage
     */
    private _employeeId: string[] = [];

    /**
     * Local private property for value get from API
     * @private
     * @type {*}
     * @memberof ApplyLeavePage
     */
    private _userList: any;

    /**
     * Local private property to get number of day from a week
     * eg: sunday-saturday is 0-6
     * @private
     * @type {number}
     * @memberof ApplyLeavePage
     */
    private _weekDayNumber: number[] = [];
    /**
     * Local private property for selected date array list
     * @private
     * @type {*}
     * @memberof ApplyLeavePage
     */
    private _dateArray: any;

    /**
     * Local private property for start date
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _reformatDateFrom: string;

    /**
     * Local private property for end date
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _reformatDateTo: string;

    /**
     * Default index number for first day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _index: string = '0';

    /**
     * Date selected for 1st day types selection 
     * @private
     * @memberof ApplyLeavePage
     */
    private _firstForm = [];

    /**
     * Date selected for 2nd day types selection 
     * @private
     * @memberof ApplyLeavePage
     */
    private _secondForm = [];

    /**
     * Date selected for 3rd day types selection 
     * @private
     * @memberof ApplyLeavePage
     */
    private _thirdForm = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 1st day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _firstFormIndex = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 2nd day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _secondFormIndex = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 3rd day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _thirdFormIndex = [];

    /**
     * Disable date option list (true/false)
     * @private
     * @memberof ApplyLeavePage
     */
    private _arrayList = [];

    /**
     * AM/PM for 1st day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _slot1: string;

    /**
     * AM/PM for 2nd day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _slot2: string;

    /**
     * AM/PM for 3rd day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _slot3: string;

    /**
     * {startDate: "YYYY-MM-DD 00:00:00", endDate: "YYYY-MM-DD 00:00:00", dayType: number, slot: string, quarterDay: string}
     * Object for 1st day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _objSlot1 = [];

    /**
     * Object for 2nd day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _objSlot2 = [];

    /**
     * Object for 3rd day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _objSlot3 = [];

    /**
     * Data collected from (_objSlot1, _objSlot2, _objSlot3) POST to apply leave API
     * @private
     * @memberof ApplyLeavePage
     */
    private _arrayDateSlot = [];

    /**
     * This is local property for Full Calendar Component
     * @type {FullCalendarComponent}
     * @memberof ApplyLeavePage
     */
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    get dayTypes(): FormArray {
        return this.applyLeaveForm.get('dayTypes') as FormArray;
    }

    /**
     *Creates an instance of ApplyOnBehalfPage.
     * @param {LeaveAPIService} leaveAPI
     * @param {EmployeeTreeview} tree
     * @param {APIService} apiService
     * @memberof ApplyOnBehalfPage
     */
    constructor(private leaveAPI: LeaveAPIService, private tree: EmployeeTreeview, private apiService: APIService) {
        this.applyLeaveForm = this.formGroup();
    }

    /**
     * Initial method
     * Get user profile list from API
     * @memberof ApplyLeavePage
     */
    ngOnInit() {
        this.leaveAPI.get_company_list().subscribe(
            list => this.companyList = list);
        this.apiService.get_user_profile_list().subscribe(list =>
            this._userList = list
        )
        setTimeout(() => {
            let calendarApi = this.calendarComponent.getApi();
            calendarApi.render();
        }, 100);
        this.leaveAPI.get_admin_leavetype().subscribe(leave =>
            this.leaveTypes = leave
        )
    }

    /**
     * This method is used to form group for validation
     * @returns
     * @memberof ApplyLeavePage
     */
    formGroup() {
        return new FormGroup({
            company: new FormControl('', Validators.required),
            userControl: new FormControl({ value: '', disabled: true }, Validators.required),
            dayTypes: new FormArray([
                new FormGroup({
                    name: new FormControl(0),
                    selectArray: new FormArray([
                        new FormControl(['0']),
                        new FormControl(''),
                    ]),
                    status: new FormControl([false])
                })
            ]),
            leaveTypes: new FormControl({ value: '', disabled: true }, Validators.required),
            firstPicker: new FormControl({ value: '', disabled: true }, Validators.required),
            secondPicker: new FormControl({ value: '', disabled: true }, Validators.required),
            inputReason: new FormControl('', Validators.required),
        });
    }


    /**
     * This method is used to create consecutive date as an array list
     * @param {*} arrayValue
     * @returns
     * @memberof ApplyLeavePage
     */
    createConsecutiveDate(arrayValue) {
        let arr = arrayValue,
            i = 0,
            result = arr.reduce(function (stack, b) {
                var cur = stack[i],
                    a = cur ? cur[cur.length - 1] : 0;
                if (b - a > 86400000) {
                    i++;
                }
                if (!stack[i])
                    stack[i] = [];
                stack[i].push(b);
                return stack;
            }, []);
        return result;
    }

    /**
     * This method is used to post data to apply leave API 
     * @memberof ApplyLeavePage
     */
    postData() {
        let newArray = [];
        newArray = this._dateArray;
        newArray = newArray.filter(val => !this._firstForm.includes(val));
        newArray = newArray.filter(val => !this._secondForm.includes(val));
        newArray = newArray.filter(val => !this._thirdForm.includes(val));
        if (this.dayTypes.value[0].name !== 2) {
            let result = this.createConsecutiveDate(newArray);
            for (let i = 0; i < result.length; i++) {
                if (result[i] !== undefined) {
                    const minMax = this.getMinMaxDate(result[i]);
                    const remainingFullDay = {
                        "startDate": moment(minMax[0]).format('YYYY-MM-DD HH:mm:ss'),
                        "endDate": moment(minMax[1]).format('YYYY-MM-DD HH:mm:ss'),
                        "dayType": 0,
                        "slot": "",
                        "quarterDay": this.selectedQuarterHour
                    }
                    this._arrayDateSlot.push(remainingFullDay);
                }
            }
        }
        if (this.dayTypes.value[0].name == 2) {
            let result = this.createConsecutiveDate(newArray);
            for (let i = 0; i < result.length; i++) {
                if (result[i] !== undefined) {
                    const minMaxValue = this.getMinMaxDate(result[i]);
                    const remainingFullDay = {
                        "startDate": moment(minMaxValue[0]).format('YYYY-MM-DD HH:mm:ss'),
                        "endDate": moment(minMaxValue[1]).format('YYYY-MM-DD HH:mm:ss'),
                        "dayType": 2,
                        "slot": "",
                        "quarterDay": this.selectedQuarterHour
                    }
                    this._arrayDateSlot.push(remainingFullDay);
                }
            }
        }
        if (this.radioOption == '2') {
            for (let i = 0; i < this._employeeTree.length; i++) {
                this.checkIdExist(this._userList, this._employeeTree[i]);
            }
        }
        if (this.radioOption == '1') {
            this._employeeId.push(this.guid);
        }
        const applyLeaveData = {
            "leaveTypeID": this.leaveTypeId,
            "reason": this.applyLeaveForm.value.inputReason,
            "data": this._arrayDateSlot
        }
        const details = {};
        details['userId'] = this._employeeId;
        details['leaveDetails'] = applyLeaveData;

        this.leaveAPI.post_apply_leave_onBehalf(details).subscribe(
            response => {
                this.clearArrayList();
                this.showSelectedTree = false;
                this._employeeId = [];
                this.leaveAPI.openSnackBar('submitted successfully ');
                if (response.status === 401) {
                    window.location.href = '/login';
                    this.leaveAPI.openSnackBar('submitted unsuccessfully ' + response.message);
                }
            });
    }

    /**
     * This method is used to clear all form value
     * @memberof ApplyLeavePage
     */
    clearArrayList() {
        this.applyLeaveForm = this.formGroup();
        this._arrayList = [];
        this._firstForm = [];
        this._secondForm = [];
        this._thirdForm = [];
        this._firstFormIndex = [];
        this._secondFormIndex = [];
        this._thirdFormIndex = [];
        this._objSlot1 = [];
        this._objSlot2 = [];
        this._objSlot3 = [];
        this._arrayDateSlot = [];
        this.selectedQuarterHour = '';
        this.departmentlist = [];
        this._employeeTree = [];
    }

    /**
     * This method is used to patch value of selected start date & end date
     * Calculate weekdays
     * @memberof ApplyLeavePage
     */
    onDateChange(): void {
        if (!this.applyLeaveForm.value.firstPicker || !this.applyLeaveForm.value.secondPicker) {
        } else {
            this._reformatDateFrom = moment(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this._reformatDateTo = moment(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
            this.getWeekDays(this.applyLeaveForm.value.firstPicker, this.applyLeaveForm.value.secondPicker, this._weekDayNumber);
            this.dayTypes.patchValue([{ selectArray: [this._dateArray] }]);
        }
    }

    /**
     * This method is used to calculate weekdays
     * @param {Date} first
     * @param {Date} last
     * @returns
     * @memberof ApplyLeavePage
     */
    getWeekDays(first: Date, last: Date, dayNumber: number[]) {
        if (first > last) return -1;
        var start = new Date(first.getTime());
        var end = new Date(last.getTime());
        this.daysCount = 0;
        this._dateArray = [];
        while (start <= end) {
            if (!dayNumber.includes(start.getDay())) {
                this.daysCount++;
                this._dateArray.push(new Date(start));
            }
            start.setDate(start.getDate() + 1);
        }
        return [this.daysCount, this._dateArray];
    }

    /**
     * This method is used to get min. and max. date of each date array
     * @param {*} all_dates
     * @returns
     * @memberof ApplyLeavePage
     */
    getMinMaxDate(all_dates) {
        let max_dt = all_dates[0],
            max_dtObj = new Date(all_dates[0]);
        let min_dt = all_dates[0],
            min_dtObj = new Date(all_dates[0]);
        all_dates.forEach(function (dt, index) {
            if (new Date(dt) > max_dtObj) {
                max_dt = dt;
                max_dtObj = new Date(dt);
            }
            if (new Date(dt) < min_dtObj) {
                min_dt = dt;
                min_dtObj = new Date(dt);
            }
        });
        return [min_dt, max_dt];
    }

    /**
     * This method is used to set min. date of datepicker start date
     * @param {MatDatepickerInputEvent<string>} event
     * @returns {string}
     * @memberof ApplyLeavePage
     */
    getValueFrom(event: MatDatepickerInputEvent<string>): string {
        return this.minDate = moment(event.value).format('YYYY-MM-DD');
    }

    /**
     * This method is used to set max. date of datepicker end date
     * @param {MatDatepickerInputEvent<string>} event
     * @returns {string}
     * @memberof ApplyLeavePage
     */
    getValueTo(event: MatDatepickerInputEvent<string>): string {
        const toDate: string = moment(event.value).format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

    /**
     * This method is used to detect selection change of day types
     * @param {*} event
     * @param {*} index
     * @memberof ApplyLeavePage
     */
    dayTypesChanged(event: any, index: any) {
        this._index = index;
        this.showAddIcon = true;
        if (event.value == '1') {
            this.open(index);
        }
    }

    /**
     * This method is used to patch value to form control status
     * @param {number} i
     * @param {*} value
     * @param {boolean} disabled
     * @memberof ApplyLeavePage
     */
    patchValueFunction(i: number, value: any, disabled: boolean) {
        for (let j = 0; j < value.length; j++) {
            const valueFirst = (this.dayTypes.controls[i].value.status[0]).splice(value[j], 1, disabled);
            this.dayTypes.controls[0].patchValue([{ status: valueFirst }]);
        }
    }

    /**
     * This method is used to detect opened change of half day dates
     * @param {number} index
     * @memberof ApplyLeavePage
     */
    open(index: number) {
        if (this._arrayList.length === 0) {
            for (let j = 0; j < this.dayTypes.controls[index].value.selectArray[0].length; j++) {
                this._arrayList.push(false);
            }
        }
        const selected = (this.dayTypes.controls[index].value.status).splice(0, 1, this._arrayList);
        this.dayTypes.controls[index].patchValue([{ status: selected }]);
        if (index == 0) {
            this.patchValueFunction(index, this._firstFormIndex, false);
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

    /**
     * This method is used to calculate days of leave apply
     * @param {*} date
     * @param {*} form
     * @memberof ApplyLeavePage
     */
    calculate(date: any, form: any) {
        let missing = null;
        for (let i = 0; i < form.length; i++) {
            if (date.indexOf(form[i]) == -1) {
                missing = form[i];
                this.daysCount = this.daysCount + 0.5;
            }
        }
        if (!missing) { this.daysCount = this.daysCount - 0.5; }
    }

    /**
     * This method is used to check duplicate start date
     * @param {*} obj
     * @param {*} list
     * @returns
     * @memberof ApplyLeavePage
     */
    containsObject(obj: any, list: any) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].startDate === obj.startDate) {
                return true;
            }
        }
        return false;
    }

    /**
     * This method is used to format body to be send to POST API
     * @param {*} form
     * @param {*} array
     * @param {string} slot
     * @memberof ApplyLeavePage
     */
    postValueReformat(form: any, array: any, slot: string) {
        for (let j = 0; j < form.length; j++) {
            const obj = {
                "startDate": moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": Number(this.dayTypes.controls[this._index].value.name),
                "slot": slot,
                "quarterDay": this.selectedQuarterHour,
            }
            if (this.containsObject(obj, array) === false) {
                array.push(obj);
            }
            if (obj.slot !== array[j].slot) {
                array.splice(j, 1, obj);
            }
        }
    }

    /**
     * This method is used to calculate days when selected date options
     * @param {*} selectedDate
     * @param {number} index
     * @memberof ApplyLeavePage
     */
    halfDaySelectionChanged(selectedDate: any, index: number) {
        if (index == 0) {
            this.calculate(selectedDate, this._firstForm);
            this._firstForm = selectedDate;
            this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
        }
        if (index == 1) {
            this.calculate(selectedDate, this._secondForm);
            this._secondForm = selectedDate;
            this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
        }
        if (index == 2) {
            this.calculate(selectedDate, this._thirdForm);
            this._thirdForm = selectedDate;
            this.postValueReformat(this._thirdForm, this._objSlot3, this._slot3);
        }
        this._arrayDateSlot = this._objSlot1.concat(this._objSlot2).concat(this._objSlot3);
    }

    /**
     * This method is used to assign value of selected date option
     * @param {number} i
     * @param {number} indexj
     * @memberof ApplyLeavePage
     */
    valueSelected(i: number, indexj: number) {
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

    /**
     * This method is used to get time slot AM/PM when detect change
     * @param {*} event
     * @param {*} i
     * @memberof ApplyLeavePage
     */
    timeSlotChanged(event: any, i: any) {
        this._index = i;
        const selected = (this.dayTypes.controls[this._index].value.selectArray).splice(1, 1, event.value);
        this.dayTypes.controls[i].patchValue([{ selectArray: selected }]);
        if (i === 0) {
            this._slot1 = event.value;
            this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
        }
        if (i === 1) {
            this._slot2 = event.value;
            this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
        }
        if (i === 2) {
            this._slot3 = event.value;
            this.postValueReformat(this._thirdForm, this._objSlot3, this._slot3);
        }
        this._arrayDateSlot = this._objSlot1.concat(this._objSlot2).concat(this._objSlot3);
    }

    /**
     * This method is used for add new form group after clicked add button
     * @memberof ApplyLeavePage
     */
    addFormField() {
        if (this.dayTypes.controls.length < Object.keys(DayType).length / 2) {
            this.dayTypes.push(new FormGroup({
                name: new FormControl(0),
                selectArray: new FormArray([new FormControl(this._dateArray), new FormControl('')]),
                status: new FormControl([false])
            }));
        } else {
            this.showAddIcon = false;
            alert("No other option");
        }
    }

    /**
     * pass selected companyId to get department list
     * @param {*} selectedCompanyId
     * @memberof ApplyOnBehalfPage
     */
    selectedCompany(selectedCompanyId) {
        this.departmentlist = [];
        this.leaveAPI.get_company_details(selectedCompanyId).subscribe(list => {
            this.applyLeaveForm.controls.userControl.enable();
            for (let i = 0; i < this.tree.dataSource.data.length; i++) {
                if (list.companyName == this.tree.dataSource.data[i].item) {
                    for (let j = 0; j < this.tree.dataSource.data[i].children.length; j++) {
                        this.departmentlist.push(this.tree.dataSource.data[i].children[j]);
                    }
                }
            }
        })
    }

    /**
     * get selected employee's user profile details
     * @param {string} name
     * @memberof ApplyOnBehalfPage
     */
    getSelectedEmployee(name: string) {
        this.showSpinner = true;
        for (let i = 0; i < this._userList.length; i++) {
            if (this._userList[i].employeeName === name) {
                this.guid = this._userList[i].userId;
                this.apiService.get_user_profile_details(this.guid).subscribe(data => {
                    this.entitlement = data;
                    this.entitlement = data.entitlementDetail;
                    this.showSpinner = false;
                    this.applyLeaveForm.controls.leaveTypes.enable();
                })
            }
        }
    }

    /**
     * close treeview div & get the selected  value
     * @param {*} evt
     * @memberof ApplyOnBehalfPage
     */
    clickOutside(evt) {
        if (!evt.target.className.includes("material-icons") && !evt.target.className.includes("dropdownDiv") && !evt.target.className.includes("mat-form-field-infix")) {
            this.showTreeDropdown = false;
            this.showSelectedTree = true;
        }
        for (let i = 0; i < this.tree.checklistSelection.selected.length; i++) {
            if (this.tree.checklistSelection.selected[i].level == 2 && this._employeeTree.indexOf(this.tree.checklistSelection.selected[i].item) < 0) {
                this._employeeTree.push(this.tree.checklistSelection.selected[i].item);
            }
        }
        if (this.tree.checklistSelection.selected.length === 0) {
            this._employeeTree.length = 0;
        }
    }

    /**
     * filter employee name that exist in user list
     * @param {*} array
     * @param {*} obj
     * @memberof ApplyOnBehalfPage
     */
    checkIdExist(array: any, obj: any) {
        for (let j = 0; j < array.length; j++) {
            if (array[j].employeeName === obj) {
                this._employeeId.push(this._userList[j].userId);
            }
        }
    }

}
