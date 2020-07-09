import { Platform } from '@ionic/angular';
import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../leave-setup/date.adapter';
import { LeaveApiService } from '../leave-setup/leave-api.service';
import { ReportApiService } from '../report/report-api.service';
import { APIService } from '../../../../src/services/shared-service/api.service';
import { map } from 'rxjs/operators';


/**
 * Apply Leave Page
 * @export
 * @class ApplyOnBehalfComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-apply-on-behalf',
    templateUrl: './apply-on-behalf.component.html',
    styleUrls: ['./apply-on-behalf.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ApplyOnBehalfComponent implements OnInit {

    /**
     * set menu is open or close by assign new class
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    @HostBinding('class.menuOverlay') menuOpened: boolean;

    /**
     * show/hide namelist
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    public showList: boolean[] = [];

    /**
     * Local property for leave entitlement details
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public entitlement: any;

    /**
     * Local property for leave day available
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    public daysAvailable: number = 0;

    /**
     * Local property for leave day applied
     * @type {number}
     * @memberof ApplyOnBehalfComponent
     */
    public daysCount: number = 0;

    /**
     * Local property for min. date range
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    public minDate: string;

    /**
     * Local property for max. date range
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    public maxDate: string;

    /**
     * Local property for leave form group
     * @type {FormGroup}
     * @memberof ApplyOnBehalfComponent
     */
    public applyLeaveForm: any;

    /**
     * Local property for leave type ID
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    public leaveTypeId: string;

    /**
     * radio button value
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    public radioOption: string = '1';

    /**
     * list of leave types
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public leaveTypes: any;

    /**
     * show loading spinner
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    public showSpinner: boolean;

    /**
     * filtered user from searchbar keyup
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public filteredUser: any;

    /**
     * header checkbox checked/unchecked
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    public headCheckbox: boolean;

    /**
     * value of indeterminate in main checkbox
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    public indeterminateVal: boolean;

    /**
     * hover value of show/hide checkbox
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    public showCheckBox: boolean[] = [];

    /**
     * date range selected
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public dateSelection: any;

    /**
     * am/pm button value
     * @type {boolean[]}
     * @memberof ApplyOnBehalfComponent
     */
    public amButton: boolean[] = [];

    /**
     * Q1 button clicked or not
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    public Q1Button: boolean[] = [];

    /**
     * Q2 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyOnBehalfComponent
     */
    public Q2Button: boolean[] = [];

    /**
     * Q3 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyOnBehalfComponent
     */
    public Q3Button: boolean[] = [];

    /**
     * Q4 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyOnBehalfComponent
     */
    public Q4Button: boolean[] = [];

    /**
     * day name value of each set
     * '0' = full day
     * '1' = half day
     * '2' = quarter day
     * @type {string[]}
     * @memberof ApplyOnBehalfComponent
     */
    public dayName: string[] = [];

    /**
     * half day value (am/pm)
     * @private
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    private _slot: any = [];

    /**
     * index of half day in dayName array
     * @type {number[]}
     * @memberof ApplyOnBehalfComponent
     */
    public halfDayIndex: number[] = [];

    /**
     * index of quarter day in dayName array
     * @type {number[]}
     * @memberof ApplyOnBehalfComponent
     */
    public quarterDayIndex: number[] = [];

    /**
     * selected user id
     * @private
     * @type {string[]}
     * @memberof ApplyOnBehalfComponent
     */
    private _employeeId: string[] = [];

    /**
     * Local private property for value get from API
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public _userList: any;

    /**
     * get report history for apply on behalf
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public reportDetails: any;

    /**
     * start date to end date range
     * @type {Date[]}
     * @memberof ApplyOnBehalfComponent
     */
    public dateRange: Date[];

    /**
     * employee list from 'leave-entitlement' report
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public employeeList: any;

    /**
     * uploaded file response from API
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public uploadedFile: any;

    /**
     * expand or collapse 
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    public expand: boolean;

    /**
     * Local private property to get number of day from a week
     * eg: sunday-saturday is 0-6
     * @private
     * @type {number}
     * @memberof ApplyOnBehalfComponent
     */
    private _weekDayNumber: number[] = [];
    /**
     * Local private property for selected date array list
     * @private
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    private _dateArray: any;

    /**
     * Local property for selected quarter hour value
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    private _selectedQuarterHour: string[] = [];

    /**
     * Local private property for start date
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    private _reformatDateFrom: string;

    /**
     * Local private property for end date
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    private _reformatDateTo: string;

    /**
     * Default index number for first day types selection
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    private _index: string = '0';

    /**
     * Date selected for 1st day types selection 
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    private _firstForm = [];

    /**
     * Data collected from (_objSlot1, _objSlot2, _objSlot3) POST to apply leave API
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    private _arrayDateSlot = [];

    /**
     *Creates an instance of ApplyOnBehalfComponent.
     * @param {LeaveApiService} leaveAPI
     * @param {ReportApiService} reportApi
     * @param {Platform} applyonbehalfPlatformApi 
     * @param {APIService} apiService
     * @memberof ApplyOnBehalfComponent
     */
    constructor(private leaveAPI: LeaveApiService, public reportApi: ReportApiService, public applyonbehalfPlatformApi: Platform, private apiService: APIService) {
        this.applyLeaveForm = new FormGroup({
            leaveTypes: new FormControl({ value: '', disabled: true }, Validators.required),
            firstPicker: new FormControl({ value: '', disabled: true }, Validators.required),
            secondPicker: new FormControl({ value: '', disabled: true }, Validators.required),
            inputReason: new FormControl('', Validators.required)
        });
    }

    /**
     * Initial method
     * Get user profile list from API
     * @memberof ApplyOnBehalfComponent
     */
    async ngOnInit() {
        this.showSpinner = true;
        (this.applyonbehalfPlatformApi.platforms().includes('tablet' || 'desktop')) ? console.log('is tab & web') : console.log('mobile app');
        this.leaveAPI.get_admin_leavetype().subscribe(leave => {
            this.leaveTypes = leave;
        })
        this.reportApi.get_bundle_report('leave-entitlement').subscribe(data => {
            this.employeeList = data;
            this.showSpinner = false;
        })
    }

    /**
     * get report history
     * @memberof ApplyOnBehalfComponent
     */
    showHistory() {
        this.reportApi.get_bundle_report('apply-on-behalf')
            .pipe(
                map(data => data.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()))
            )
            .subscribe(report => {
                this.reportDetails = report;
                this.reportDetails.forEach(element => {
                    const arr = new Array();
                    const dt = new Date(element.startDate);
                    const de = new Date(element.endDate);
                    while (dt <= de) {
                        arr.push(new Date(dt));
                        dt.setDate(dt.getDate() + 1);
                    }
                    this.dateRange = arr;
                    element["date"] = this.dateRange;
                });
                this.showList.push(...Array(this.reportDetails.length).fill(false));
            });
    }

    /**
     * expand or collapse user list in history slide-in menu 
     * @param {number} index
     * @memberof ApplyOnBehalfComponent
     */
    expandCollapse(index: number) {
        if (this.showList[index]) {
            this.showList.splice(index, 1, false);
        } else {
            this.showList.splice(index, 1, true);
        }
    }

    /**
     * get details of file after upload from local file
     * @param {*} files
     * @param {number} i
     * @returns
     * @memberof ApplyOnBehalfComponent
     */
    uploadEvent(document: any) {
        const fileToSave = document.item(0);
        let formData = new FormData();
        formData.append('file', fileToSave, fileToSave.name);
        this.apiService.post_file(formData).subscribe(res => {
            this.uploadedFile = res;
        });
    }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof ApplyOnBehalfComponent
     */
    async filter(text: any) {
        if (text && text.trim() != '') {
            let name = this.employeeList.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            let department = this.employeeList.filter((value: any) => {
                if (value.department != undefined) {
                    return (value.department.toLowerCase().indexOf(text.toLowerCase()) > -1);
                }
            })
            let company = this.employeeList.filter((items: any) => {
                if (items.companyName != undefined) {
                    return (items.companyName.toLowerCase().indexOf(text.toLowerCase()) > -1)
                }
            })
            this.employeeList = require('lodash').uniqBy(name.concat(department).concat(company), 'id');
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof ApplyOnBehalfComponent
     */
    changeDetails(text: any) {
        if (text === '') {
            this.ngOnInit();
        } else {
            this.filter(text);
        }
    }

    /**
     * mouse hover to show/hide checkbox
     * @param {number} i
     * @param {boolean} mouseIn
     * @param {boolean} isChecked
     * @memberof ApplyOnBehalfComponent
     */
    hoverInOut(i: number, mouseIn: boolean, isChecked: boolean) {
        if (this.headCheckbox || this.indeterminateVal) {
            this.showCheckBox = [];
            this.showCheckBox.push(...Array(this.employeeList.length).fill(true));
        } else if (mouseIn && !isChecked && !this.indeterminateVal && !this.headCheckbox) {
            this.showCheckBox.splice(i, 1, true);
        } else {
            this.showCheckBox.splice(0, this.showCheckBox.length);
            this.showCheckBox.push(...Array(this.employeeList.length).fill(false));
        }
    }

    /**
     * check main checkbox to check all sub checkbox
     * @memberof ApplyOnBehalfComponent
     */
    headerCheckbox() {
        this.showCheckBox.splice(0, this.showCheckBox.length);
        setTimeout(() => {
            this.employeeList.forEach(item => {
                item.isChecked = this.headCheckbox;
                if (item.isChecked) {
                    this.showCheckBox.push(true);
                } else {
                    this.showCheckBox.push(false);
                }
            });
        })
    }

    /**
     * check sub checkbox to make changing in main checkbox (interminate/mainCheckBox)
     * @memberof ApplyOnBehalfComponent
     */
    contentCheckbox() {
        const totalLength = this.employeeList.length;
        let checkedValue = 0;
        this.employeeList.map(item => {
            if (item.isChecked) {
                checkedValue++;
                this.showCheckBox.push(true);
                this.getSelectedEmployee(item.userGuid, checkedValue);
            }
        });
        if (checkedValue > 0 && checkedValue < totalLength) {
            this.indeterminateVal = true;
            this.headCheckbox = false;
        } else if (checkedValue == totalLength) {
            this.headCheckbox = true;
            this.indeterminateVal = false;
        } else {
            this.indeterminateVal = false;
            this.headCheckbox = false;
            this.applyLeaveForm.controls.leaveTypes.reset();
            this.daysAvailable = 0;
            this.applyLeaveForm.controls.leaveTypes.disable();
        }
    }

    /**
     * add balance of selected leave type
     * @memberof ApplyOnBehalfComponent
     */
    async addEntitlementBal(leaveTypeGuid: string) {
        for (let i = 0; i < this.employeeList.length; i++) {
            let details = await this.leaveAPI.get_entilement_details(this.employeeList[i].userGuid).toPromise();
            for (let j = 0; j < details.length; j++) {
                if (details[j].LEAVE_TYPE_GUID === leaveTypeGuid) {
                    this.employeeList[i]["entitled"] = details[j].ENTITLED_DAYS;
                    this.employeeList[i]["balance"] = details[j].BALANCE_DAYS;
                }
            }
        }
    }

    /**
     * This method is used to create consecutive date as an array list
     * @param {*} arrayValue
     * @returns
     * @memberof ApplyOnBehalfComponent
     */
    createConsecutiveDate(arrayValue) {
        let reformatDate = [];
        for (let j = 0; j < arrayValue.length; j++) {
            reformatDate.push(new Date(arrayValue[j]))
        }
        let arr = reformatDate,
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
     * @memberof ApplyOnBehalfComponent
     */
    postData() {
        let newArray = [];
        newArray = this._dateArray;
        newArray = newArray.filter(val => !this._firstForm.includes(val));
        let result = this.createConsecutiveDate(newArray);
        for (let j = 0; j < result.length; j++) {
            if (result[j] !== undefined) {
                const minMax = this.getMinMaxDate(result[j]);
                const remainingFullDay = {
                    "startDate": _moment(minMax[0]).format('YYYY-MM-DD HH:mm:ss'),
                    "endDate": _moment(minMax[1]).format('YYYY-MM-DD HH:mm:ss'),
                    "dayType": 0,
                    "slot": "",
                    "quarterDay": ""
                }
                this._arrayDateSlot.push(remainingFullDay);
            }
        }
        this.postDataHalfQuarter();
        const applyLeaveData = {
            "leaveTypeID": this.leaveTypeId,
            "reason": this.applyLeaveForm.value.inputReason,
            "data": this._arrayDateSlot
        }
        if (this.uploadedFile != undefined) {
            applyLeaveData['attachment'] = this.uploadedFile.filename
        } else { applyLeaveData['attachment'] = '' }
        const details = {};
        details['userId'] = this._employeeId;
        details['leaveDetails'] = applyLeaveData;

        this.leaveAPI.post_apply_leave_onBehalf(details).subscribe(
            response => {
                this.clearArrayList();
                if (JSON.parse(response._body)[0].valid === false) {
                    this.leaveAPI.openSnackBar(JSON.parse(response._body)[0].message[0], false);
                }
                if (JSON.parse(response._body)[0].valid === true) {
                    this.leaveAPI.openSnackBar('You have submitted successfully', true);
                }
            }, err => this.leaveAPI.openSnackBar('Failed to submit leave application', false));
    }

    /**
     * create object for half day & quarter day format to POST
     * @memberof ApplyOnBehalfComponent
     */
    postDataHalfQuarter() {
        this.dayName.forEach((dayVal, index) => {
            dayVal === '1' ? this.halfDayIndex.push(index) : null;
            dayVal === '2' ? this.quarterDayIndex.push(index) : null;
        });

        for (let i = 0; i < this.halfDayIndex.length; i++) {
            const remainingFullDay = {
                "startDate": _moment(this._dateArray[this.halfDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": _moment(this._dateArray[this.halfDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": 1,
                "slot": this._slot[this.halfDayIndex[i]],
                "quarterDay": ""
            }
            this._arrayDateSlot.push(remainingFullDay);
        }

        for (let i = 0; i < this.quarterDayIndex.length; i++) {
            const remainingFullDay = {
                "startDate": _moment(this._dateArray[this.quarterDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": _moment(this._dateArray[this.quarterDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": 2,
                "slot": "",
                "quarterDay": this._selectedQuarterHour[this.quarterDayIndex[i]]
            }
            this._arrayDateSlot.push(remainingFullDay);
        }
        console.log(this._arrayDateSlot);
        for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeList[i].isChecked) {
                this._employeeId.push(this.employeeList[i].userGuid);
            }
        }
    }

    /**
     * This method is used to clear all form value
     * @memberof ApplyOnBehalfComponent
     */
    clearArrayList() {
        this._dateArray = [];
        this._firstForm = [];
        this._arrayDateSlot = [];
        this._slot = [];
        this._selectedQuarterHour = [];
        this.quarterDayIndex = [];
        this.halfDayIndex = [];
        this.dayName = [];
        this._employeeId = [];
        this.dateSelection = [];
        this.showCheckBox = [];
        this.uploadedFile = null;
        this.headCheckbox = false;
        this.indeterminateVal = false;
        document.querySelector('ion-searchbar').getInputElement().then((searchInput) => {
            searchInput.value = '';
            this.changeDetails('');
        });
    }

    /**
     * This method is used to patch value of selected start date & end date
     * Calculate weekdays
     * @memberof ApplyOnBehalfComponent
     */
    onDateChange(): void {
        if (!this.applyLeaveForm.value.firstPicker || !this.applyLeaveForm.value.secondPicker) {
        } else {
            this._reformatDateFrom = _moment(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this._reformatDateTo = _moment(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
            this.getWeekDays(this.applyLeaveForm.value.firstPicker, this.applyLeaveForm.value.secondPicker, this._weekDayNumber);
            this.dateSelection = this._dateArray;
            this.dayName = [];
            this._slot = []; this._selectedQuarterHour = []; this._firstForm = [];
            for (let i = 0; i < this.dateSelection.length; i++) {
                this.dateSelection[i] = _moment(this.dateSelection[i]).format('DD MMMM YYYY');
                this.dayName.push("0");
                this.amButton.push(true);
                this.Q1Button.push(true);
                this.Q2Button.push(false);
                this.Q3Button.push(false);
                this.Q4Button.push(false);
            }
        }
    }

    /**
     * changed day(full/half/quarter day) selection
     * @param {*} event
     * @param {number} j
     * @memberof ApplyOnBehalfComponent
     */
    dayNameChanged(event: any, j: number) {
        if (this.dayName[j] == '1' && event.value == '0') {
            this.daysCount += 0.5;
        }
        if (this.dayName[j] == '2' && event.value == '0') {
            this.daysCount += 0.75;
        }
        if (this.dayName[j] == '2' && event.value == '1') {
            this.daysCount += 0.25;
        }
        if (this.dayName[j] == '0' && event.value == '1') {
            this.daysCount -= 0.50;
        }
        if (this.dayName[j] == '1' && event.value == '2') {
            this.daysCount -= 0.25;
        }
        if (this.dayName[j] == '0' && event.value == '2') {
            this.daysCount -= 0.75;
        }
        this.dayName.splice(j, 1, event.value);
        if (event.value == '1') {
            this._slot[j] = "AM";
            if (this._firstForm.indexOf(this._dateArray[j]) < 0) {
                this._firstForm.push(this._dateArray[j]);
            }
        }
        if (event.value === '2') {
            this._selectedQuarterHour[j] = "Q1";
            if (!(this._firstForm.includes(this._dateArray[j]))) {
                this._firstForm.push(this._dateArray[j]);
            }
        }
        if (event.value == '0') {
            const index = this._firstForm.indexOf(this._dateArray[j]);
            this._firstForm.splice(index, 1);
        }
    }

    /**
     * get am/pm or quarter value(Q1 to Q4)
     * @param {number} j
     * @param {string} buttonVal
     * @memberof ApplyOnBehalfComponent
     */
    getHalfQuarterValue(j: number, buttonVal: string) {
        if (buttonVal == 'AM' || buttonVal == 'PM') {
            this._slot[j] = buttonVal;
        } else {
            this._selectedQuarterHour[j] = buttonVal;
        }
    }

    /**
     * This method is used to calculate weekdays
     * @param {Date} first
     * @param {Date} last
     * @returns
     * @memberof ApplyOnBehalfComponent
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
     * @memberof ApplyOnBehalfComponent
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
     * @memberof ApplyOnBehalfComponent
     */
    getValueFrom(event: MatDatepickerInputEvent<string>): string {
        return this.minDate = _moment(event.value).format('YYYY-MM-DD');
    }

    /**
     * This method is used to set max. date of datepicker end date
     * @param {MatDatepickerInputEvent<string>} event
     * @returns {string}
     * @memberof ApplyOnBehalfComponent
     */
    getValueTo(event: MatDatepickerInputEvent<string>): string {
        const toDate: string = _moment(event.value).format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

    /**
     * get selected employee's user profile details
     * @param {string} name
     * @memberof ApplyOnBehalfComponent
     */
    getSelectedEmployee(userId: string, checkVal: number) {
        if (checkVal == 1) {
            this.radioOption = '1';
            this.leaveAPI.get_entilement_details(userId).subscribe(data => {
                this.entitlement = data;
                this.applyLeaveForm.controls.leaveTypes.enable();
            })
        } else {
            this.radioOption = '2';
        }
    }

    /**
     * delete unselected user
     * @memberof ApplyOnBehalfComponent
     */
    showCheckedUser() {
        for (let i = this.employeeList.length - 1; i >= 0; --i) {
            if (this.employeeList[i].isChecked == false || this.employeeList[i].isChecked == undefined) {
                this.employeeList.splice(i, 1);
            }
        }
    }

}
