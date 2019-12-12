import { Component, OnInit, HostBinding } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../leave-setup/date.adapter';
import { MenuController } from '@ionic/angular';
import { LeaveApiService } from '../leave-setup/leave-api.service';


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
     * Local property for leave entitlement details
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    public entitlement: any;

    /**
     * Get calendar id from user profile API & request data from calendar API
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    // public calendarId: string;

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
     * Local property for show or hide Add icon
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    // public showAddIcon: boolean = true;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof ApplyOnBehalfComponent
     */
    // public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

    /**
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof ApplyOnBehalfComponent
     */
    // public calendarEvents: EventInput[];

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
     * show/hide the tree view 
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    // public showTreeDropdown: boolean = false;

    /**
     * show selected tree value after clicked outside the div
     * @type {boolean}
     * @memberof ApplyOnBehalfComponent
     */
    // public showSelectedTree: boolean = false;

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
    public showSpinner: boolean = true;

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
     * company Id get from selected company list
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    // private _selectedCompanyId: string;

    /**
     * user guid from selected employee (option == 1)
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    // private guid: string;
    /**
     * selected user id
     * @private
     * @type {string[]}
     * @memberof ApplyOnBehalfComponent
     */
    private _employeeId: string[] = [];

    /**
     * Local private property for value get from API
     * @private
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    private _userList: any;

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
     * Date selected for 2nd day types selection 
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _secondForm = [];

    /**
     * Date selected for 3rd day types selection 
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _thirdForm = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 1st day types selection
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _firstFormIndex = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 2nd day types selection
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _secondFormIndex = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 3rd day types selection
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _thirdFormIndex = [];

    /**
     * Disable date option list (true/false)
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _arrayList = [];

    /**
     * AM/PM for 1st day types selection
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    // private _slot1: string;

    /**
     * AM/PM for 2nd day types selection
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    // private _slot2: string;

    /**
     * AM/PM for 3rd day types selection
     * @private
     * @type {string}
     * @memberof ApplyOnBehalfComponent
     */
    // private _slot3: string;

    /**
     * {startDate: "YYYY-MM-DD 00:00:00", endDate: "YYYY-MM-DD 00:00:00", dayType: number, slot: string, quarterDay: string}
     * Object for 1st day types selection
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _objSlot1 = [];

    /**
     * Object for 2nd day types selection
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _objSlot2 = [];

    /**
     * Object for 3rd day types selection
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    // private _objSlot3 = [];

    /**
     * Data collected from (_objSlot1, _objSlot2, _objSlot3) POST to apply leave API
     * @private
     * @memberof ApplyOnBehalfComponent
     */
    private _arrayDateSlot = [];

    /**
     * details list from companyId
     * @private
     * @type {*}
     * @memberof ApplyOnBehalfComponent
     */
    private _company: any;

    /**
     * This is local property for Full Calendar Component
     * @type {FullCalendarComponent}
     * @memberof ApplyOnBehalfComponent
     */
    // @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    /**
     * get day types of form array
     * @readonly
     * @type {FormArray}
     * @memberof ApplyOnBehalfComponent
     */
    // get dayTypes(): FormArray {
    //     return this.applyLeaveForm.get('dayTypes') as FormArray;
    // }

    /**
     *Creates an instance of ApplyOnBehalfComponent.
     * @param {LeaveApiService} leaveAPI
     * @param {APIService} apiService
     * @param {MenuController} menu
     * @memberof ApplyOnBehalfComponent
     */
    constructor(private leaveAPI: LeaveApiService, private apiService: APIService, private menu: MenuController) {
        this.applyLeaveForm = new FormGroup({
            leaveTypes: new FormControl({ value: '', disabled: false }, Validators.required),
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
        let list = await this.apiService.get_user_profile_list().toPromise();
        this._userList = list;
        this.showSpinner = false;
        this.leaveAPI.get_admin_leavetype().subscribe(leave => this.leaveTypes = leave)
        for (let i = 0; i < this._userList.length; i++) {
            if (this._userList[i].companyId != null) {
                let list = await this.leaveAPI.get_company_details(this._userList[i].companyId).toPromise();
                this._company = list;
                this._userList[i]["companyName"] = this._company.companyName;
            }
        }
    }

    /**
     * This method is used to form group for validation
     * @returns
     * @memberof ApplyOnBehalfComponent
     */
    // formGroup() {
    //     return new FormGroup({
    //         // company: new FormControl('', Validators.required),
    //         // userControl: new FormControl({ value: '', disabled: true }, Validators.required),
    //         // dayTypes: new FormArray([
    //         //     new FormGroup({
    //         //         name: new FormControl(0),
    //         //         selectArray: new FormArray([
    //         //             new FormControl(['0']),
    //         //             new FormControl(''),
    //         //         ]),
    //         //         status: new FormControl([false])
    //         //     })
    //         // ]),
    //         leaveTypes: new FormControl({ value: '', disabled: false }, Validators.required),
    //         firstPicker: new FormControl({ value: '', disabled: true }, Validators.required),
    //         secondPicker: new FormControl({ value: '', disabled: true }, Validators.required),
    //         inputReason: new FormControl('', Validators.required),
    //     });
    // }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof ApplyOnBehalfComponent
     */
    async filter(text: any) {
        if (text && text.trim() != '') {
            let name = this._userList.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            let department = this._userList.filter((value: any) => {
                return (value.department.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            let company = this._userList.filter((items: any) => {
                if (items.companyName != undefined) {
                    return (items.companyName.toLowerCase().indexOf(text.toLowerCase()) > -1)
                }
            })
            this.filteredUser = require('lodash').uniqBy(name.concat(department).concat(company), 'id');
            this.addShortCode();
        }
    }

    /**
     * push short code of leave type
     * @memberof ApplyOnBehalfComponent
     */
    async addShortCode() {
        for (let i = 0; i < this.filteredUser.length; i++) {
            let details = await this.leaveAPI.get_entilement_details(this.filteredUser[i].userId).toPromise();
            let array = new Array();
            for (let j = 0; j < details.length; j++) {
                array.push(details[j].ABBR);
            }
            if (this.filteredUser[i] != undefined) {
                if (array.length != 0) {
                    this.filteredUser[i]["shortCode"] = array.join();
                    this.filteredUser[i]["balance"] = '-';
                } else {
                    this.filteredUser[i]["shortCode"] = '-';
                    this.filteredUser[i]["balance"] = '-';
                }
            }
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
            this.filteredUser = [];
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
        if (isChecked && (this.headCheckbox || this.indeterminateVal)) {
            this.showCheckBox = [];
            this.filteredUser.map(value => { this.showCheckBox.push(true); });
        } else if (!isChecked && (this.headCheckbox || this.indeterminateVal)) {
            this.showCheckBox.splice(0, this.showCheckBox.length);
            this.filteredUser.map(item => { this.showCheckBox.push(true); });
        } else if (mouseIn && !isChecked && !this.indeterminateVal && !this.headCheckbox) {
            this.showCheckBox.splice(i, 1, true);
        } else {
            this.showCheckBox.splice(0, this.showCheckBox.length);
            this.filteredUser.map(item => { this.showCheckBox.push(false); });
        }
    }

    /**
     * check main checkbox to check all sub checkbox
     * @memberof ApplyOnBehalfComponent
     */
    headerCheckbox() {
        this.showCheckBox.splice(0, this.showCheckBox.length);
        setTimeout(() => {
            this.filteredUser.forEach(item => {
                item.isChecked = this.headCheckbox;
                if (item.isChecked) {
                    this.showCheckBox.push(true);
                } else {
                    this.showCheckBox.push(false);
                }
                // this.enableDisableSubmitButton();
            });
        })
    }

    /**
     * check sub checkbox to make changing in main checkbox (interminate/mainCheckBox)
     * @memberof ApplyOnBehalfComponent
     */
    contentCheckbox() {
        const totalLength = this.filteredUser.length;
        let checkedValue = 0;
        this.filteredUser.map(item => {
            if (item.isChecked) {
                checkedValue++;
                this.showCheckBox.push(true);
                this.getSelectedEmployee(item.userId, checkedValue);
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
        }
        // this.enableDisableSubmitButton();
    }

    /**
     * add balance of selected leave type
     * @memberof ApplyOnBehalfComponent
     */
    async addEntitlementBal() {
        for (let i = 0; i < this.filteredUser.length; i++) {
            let details = await this.leaveAPI.get_entilement_details(this.filteredUser[i].userId).toPromise();
            if (this.filteredUser[i] != undefined) {
                for (let j = 0; j < details.length; j++) {
                    if (this.leaveTypeId == details[j].LEAVE_TYPE_GUID) {
                        this.filteredUser[i]["entitled"] = details[j].ENTITLED_DAYS;
                        this.filteredUser[i]["balance"] = details[j].BALANCE_DAYS;
                    }
                    else {
                        this.filteredUser[i]["entitled"] = '-';
                        this.filteredUser[i]["balance"] = '-';
                    }
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
        const details = {};
        details['userId'] = this._employeeId;
        details['leaveDetails'] = applyLeaveData;

        this.leaveAPI.post_apply_leave_onBehalf(details).subscribe(
            response => {
                this.clearArrayList();
                this.leaveAPI.openSnackBar('You have submitted successfully', true);
                if (response.status === 401) {
                    this.leaveAPI.openSnackBar(response.message, false);
                }
            });
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
        for (let i = 0; i < this.filteredUser.length; i++) {
            if (this.filteredUser[i].isChecked) {
                this._employeeId.push(this.filteredUser[i].userId);
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
        this.dayName = [];
        this._employeeId = [];
        this.dateSelection = [];
        this.showCheckBox = [];
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
            if (this._firstForm.indexOf(this._dateArray[j]) < 0) {
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
     * This method is used to detect selection change of day types
     * @param {*} event
     * @param {*} index
     * @memberof ApplyOnBehalfComponent
     */
    // dayTypesChanged(event: any, index: any) {
    //     this._index = index;
    //     this.showAddIcon = true;
    //     if (event.value == '1') {
    //         this.open(index);
    //     }
    // }

    /**
     * This method is used to patch value to form control status
     * @param {number} i
     * @param {*} value
     * @param {boolean} disabled
     * @memberof ApplyOnBehalfComponent
     */
    // patchValueFunction(i: number, value: any, disabled: boolean) {
    //     for (let j = 0; j < value.length; j++) {
    //         const valueFirst = (this.dayTypes.controls[i].value.status[0]).splice(value[j], 1, disabled);
    //         this.dayTypes.controls[0].patchValue([{ status: valueFirst }]);
    //     }
    // }

    /**
     * This method is used to detect opened change of half day dates
     * @param {number} index
     * @memberof ApplyOnBehalfComponent
     */
    // open(index: number) {
    //     if (this._arrayList.length === 0) {
    //         for (let j = 0; j < this.dayTypes.controls[index].value.selectArray[0].length; j++) {
    //             this._arrayList.push(false);
    //         }
    //     }
    //     const selected = (this.dayTypes.controls[index].value.status).splice(0, 1, this._arrayList);
    //     this.dayTypes.controls[index].patchValue([{ status: selected }]);
    //     if (index == 0) {
    //         this.patchValueFunction(index, this._firstFormIndex, false);
    //         this.patchValueFunction(index, this._secondFormIndex, true);
    //         this.patchValueFunction(index, this._thirdFormIndex, true);
    //     } if (index == 1) {
    //         this.patchValueFunction(index, this._firstFormIndex, true);
    //         this.patchValueFunction(index, this._secondFormIndex, false);
    //         this.patchValueFunction(index, this._thirdFormIndex, true);
    //     } if (index == 2) {
    //         this.patchValueFunction(index, this._firstFormIndex, true);
    //         this.patchValueFunction(index, this._secondFormIndex, true);
    //         this.patchValueFunction(index, this._thirdFormIndex, false);
    //     }
    // }

    /**
     * This method is used to calculate days of leave apply
     * @param {*} date
     * @param {*} form
     * @memberof ApplyOnBehalfComponent
     */
    // calculate(date: any, form: any) {
    //     let missing = null;
    //     for (let i = 0; i < form.length; i++) {
    //         if (date.indexOf(form[i]) == -1) {
    //             missing = form[i];
    //             this.daysCount = this.daysCount + 0.5;
    //         }
    //     }
    //     if (!missing) { this.daysCount = this.daysCount - 0.5; }
    // }

    /**
     * This method is used to check duplicate start date
     * @param {*} obj
     * @param {*} list
     * @returns
     * @memberof ApplyOnBehalfComponent
     */
    // containsObject(obj: any, list: any) {
    //     for (let i = 0; i < list.length; i++) {
    //         if (list[i].startDate === obj.startDate) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    /**
     * This method is used to format body to be send to POST API
     * @param {*} form
     * @param {*} array
     * @param {string} slot
     * @memberof ApplyOnBehalfComponent
     */
    // postValueReformat(form: any, array: any, slot: string) {
    //     for (let j = 0; j < form.length; j++) {
    //         const obj = {
    //             "startDate": _moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
    //             "endDate": _moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
    //             "dayType": Number(this.dayTypes.controls[this._index].value.name),
    //             "slot": slot,
    //             "quarterDay": this.selectedQuarterHour,
    //         }
    //         if (this.containsObject(obj, array) === false) {
    //             array.push(obj);
    //         }
    //         if (obj.slot !== array[j].slot) {
    //             array.splice(j, 1, obj);
    //         }
    //     }
    // }

    /**
     * This method is used to calculate days when selected date options
     * @param {*} selectedDate
     * @param {number} index
     * @memberof ApplyOnBehalfComponent
     */
    // halfDaySelectionChanged(selectedDate: any, index: number) {
    //     if (index == 0) {
    //         this.calculate(selectedDate, this._firstForm);
    //         this._firstForm = selectedDate;
    //         this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
    //     }
    //     if (index == 1) {
    //         this.calculate(selectedDate, this._secondForm);
    //         this._secondForm = selectedDate;
    //         this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
    //     }
    //     if (index == 2) {
    //         this.calculate(selectedDate, this._thirdForm);
    //         this._thirdForm = selectedDate;
    //         this.postValueReformat(this._thirdForm, this._objSlot3, this._slot3);
    //     }
    //     this._arrayDateSlot = this._objSlot1.concat(this._objSlot2).concat(this._objSlot3);
    // }

    /**
     * This method is used to assign value of selected date option
     * @param {number} i
     * @param {number} indexj
     * @memberof ApplyOnBehalfComponent
     */
    // valueSelected(i: number, indexj: number) {
    //     if (i == 0) {
    //         const index = this._firstFormIndex.findIndex(item => item === indexj);
    //         if (index > -1) {
    //             this._firstFormIndex.splice(index, 1);
    //         } else {
    //             this._firstFormIndex.push(indexj);
    //         }
    //     } if (i == 1) {
    //         const index = this._secondFormIndex.findIndex(item => item === indexj);
    //         if (index > -1) {
    //             this._secondFormIndex.splice(index, 1);
    //         } else {
    //             this._secondFormIndex.push(indexj);
    //         }
    //     } if (i == 2) {
    //         const index = this._thirdFormIndex.findIndex(item => item === indexj);
    //         if (index > -1) {
    //             this._thirdFormIndex.splice(index, 1);
    //         } else {
    //             this._thirdFormIndex.push(indexj);
    //         }
    //     }
    // }

    /**
     * This method is used to get time slot AM/PM when detect change
     * @param {*} event
     * @param {*} i
     * @memberof ApplyOnBehalfComponent
     */
    // timeSlotChanged(event: any, i: any) {
    //     this._index = i;
    //     const selected = (this.dayTypes.controls[this._index].value.selectArray).splice(1, 1, event.value);
    //     this.dayTypes.controls[i].patchValue([{ selectArray: selected }]);
    //     if (i === 0) {
    //         this._slot1 = event.value;
    //         this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
    //     }
    //     if (i === 1) {
    //         this._slot2 = event.value;
    //         this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
    //     }
    //     if (i === 2) {
    //         this._slot3 = event.value;
    //         this.postValueReformat(this._thirdForm, this._objSlot3, this._slot3);
    //     }
    //     this._arrayDateSlot = this._objSlot1.concat(this._objSlot2).concat(this._objSlot3);
    // }

    /**
     * This method is used for add new form group after clicked add button
     * @memberof ApplyOnBehalfComponent
     */
    // addFormField() {
    //     if (this.dayTypes.controls.length < Object.keys(DayType).length / 2) {
    //         this.dayTypes.push(new FormGroup({
    //             name: new FormControl(0),
    //             selectArray: new FormArray([new FormControl(this._dateArray), new FormControl('')]),
    //             status: new FormControl([false])
    //         }));
    //     } else {
    //         this.showAddIcon = false;
    //         alert("No other option");
    //     }
    // }

    /**
     * pass selected companyId to get department list
     * @param {*} selectedCompanyId
     * @memberof ApplyOnBehalfComponent
     */
    // selectedCompany(selectedCompanyId) {
    //     this.departmentlist = [];
    //     this.leaveAPI.get_company_details(selectedCompanyId).subscribe(list => {
    //         this.applyLeaveForm.controls.userControl.enable();
    //         for (let i = 0; i < this.tree.dataSource.data.length; i++) {
    //             if (list.companyName == this.tree.dataSource.data[i].item) {
    //                 for (let j = 0; j < this.tree.dataSource.data[i].children.length; j++) {
    //                     this.departmentlist.push(this.tree.dataSource.data[i].children[j]);
    //                 }
    //             }
    //         }
    //     })
    // }

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
        for (let i = this.filteredUser.length - 1; i >= 0; --i) {
            if (this.filteredUser[i].isChecked == false || this.filteredUser[i].isChecked == undefined) {
                this.filteredUser.splice(i, 1);
            }
        }
    }

    /**
     * close treeview div & get the selected  value
     * @param {*} evt
     * @memberof ApplyOnBehalfComponent
     */
    // clickOutside(evt) {
    //     if (!evt.target.className.includes("material-icons") && !evt.target.className.includes("dropdownDiv") && !evt.target.className.includes("mat-form-field-infix")) {
    //         this.showTreeDropdown = false;
    //         this.showSelectedTree = true;
    //     }
    //     for (let i = 0; i < this.tree.checklistSelection.selected.length; i++) {
    //         if (this.tree.checklistSelection.selected[i].level == 2 && this._employeeTree.indexOf(this.tree.checklistSelection.selected[i].item) < 0) {
    //             this._employeeTree.push(this.tree.checklistSelection.selected[i].item);
    //         }
    //     }
    //     if (this.tree.checklistSelection.selected.length === 0) {
    //         this._employeeTree.length = 0;
    //     }
    // }

    /**
     * filter employee name that exist in user list
     * @param {*} array
     * @param {*} obj
     * @memberof ApplyOnBehalfComponent
     */
    // checkIdExist(array: any, obj: any) {
    //     for (let j = 0; j < array.length; j++) {
    //         if (array[j].employeeName === obj) {
    //             this._employeeId.push(this._userList[j].userId);
    //         }
    //     }
    // }

}
