import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { LeaveApiService } from "../leave-api.service";
import { APIService } from "../../../../../src/services/shared-service/api.service";
import { ReportApiService } from "../../report/report-api.service";
import { map } from "rxjs/operators";
import { LeaveEntitlementApiService } from "../leave-entitlement/leave-entitlement-api.service";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from "../date.adapter";
const dayjs = require('dayjs');

/**
 * leave adjusment page
 * @export
 * @class LeaveAdjustmentComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-adjustment',
    templateUrl: './leave-adjustment.component.html',
    styleUrls: ['./leave-adjustment.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class LeaveAdjustmentComponent implements OnInit {

    /**
     * validation group 
     * @type {*}
     * @memberof LeaveAdjustmentComponent
     */
    public adjustmentForm: any;

    /**
     * RL validation group
     * @type {*}
     * @memberof LeaveAdjustmentComponent
     */
    public replacementForm: any;

    /**
     * company list from API
     * @type {*}
     * @memberof LeaveAdjustmentComponent
     */
    public company: any;

    /**
     * department list from API
     * @type {*}
     * @memberof LeaveAdjustmentComponent
     */
    public department: any;

    /**
     * leavetype list from API
     * @type {*}
     * @memberof LeaveAdjustmentComponent
     */
    public leavetypeList: any;

    /**
     * filter users from selected company and department
     * @type {any[]}
     * @memberof LeaveAdjustmentComponent
     */
    public filteredUserItems: any[] = [];


    /**
     * enable/disable submit button according required item
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public disableSubmitButton: boolean = true;

    /**
     * value of main checkbox
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public mainCheckBox: boolean;

    /**
     * value of indeterminate in main checkbox
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public indeterminate: boolean;

    /**
     * hover value of show/hide checkbox
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public showCheckbox: boolean[] = [];

    /**
     * show/hide spinner when submit button is clicked
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * show/hide spinner when company & department selection is clicked
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public showSpinner: boolean = false;

    /**
     * show no result when user list is empty
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public showNoResult: boolean = false;

    /**
     * show select to view paragraph
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public showSelectToView: boolean = true;

    /**
     * show employee list
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public showList: boolean[] = [];

    /**
     * get url of profile picture
     * @type {*}
     * @memberof LeaveAdjustmentComponent
     */
    public url: any;

    /**
     * leave adjustment history
     * @type {*}
     * @memberof LeaveAdjustmentComponent
     */
    public history: any;

    /**
     * set as replacement leave adjustment
     * @type {boolean}
     * @memberof LeaveAdjustmentComponent
     */
    public isRL: boolean = false;

    public entitlementLeaveType: any;

    public datepicker: any;

    /**
     * selected company guid
     * @private
     * @type {string}
     * @memberof LeaveAdjustmentComponent
     */
    private _companyGUID: string;

    /**
     * user list from API
     * @private
     * @type {*}
     * @memberof LeaveAdjustmentComponent
     */
    private _userItems: any;

    /**
     * selected user details from user list
     * @private
     * @type {any[]}
     * @memberof LeaveAdjustmentComponent
     */
    private _selectedUser: any[] = [];

    /**
     * value of days with symbol add or minus
     * @private
     * @type {number}
     * @memberof LeaveAdjustmentComponent
     */
    private _numberOfDays: number;

    private _leavetypeEntitilment: any;

    private _allowedClaimUserList: any = [];

    private filteredClaimUserList: any = [];

    /**
     *Creates an instance of LeaveAdjustmentComponent.
     * @param {LeaveApiService} leaveSetupAPI
     * @param {APIService} apiService
     * @param {ReportApiService} reportApi
     * @param {LeaveEntitlementApiService} leaveEntitlementApi
     * @memberof LeaveAdjustmentComponent
     */
    constructor(private leaveSetupAPI: LeaveApiService, private apiService: APIService, public reportApi: ReportApiService, private leaveEntitlementApi: LeaveEntitlementApiService) {
        this.adjustmentForm = new FormGroup({
            company: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            leavetype: new FormControl('', Validators.required),
            reason: new FormControl('', Validators.required),
            noOfDay: new FormControl('', Validators.required),
            symbol: new FormControl('add', Validators.required)
        })

        this.replacementForm = new FormGroup({
            company: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            reason: new FormControl('', Validators.required),
            noOfDay: new FormControl('', Validators.required),
            symbol: new FormControl('add', Validators.required)
        })

        this.entitlementLeaveType = new FormArray([], Validators.required);
        this.datepicker = new FormArray([], Validators.required);

        this.apiService.get_profile_pic('all').subscribe(data => {
            this.url = data;
        })
    }

    /**
     * get initial list from API
     * @memberof LeaveAdjustmentComponent
     */
    async ngOnInit() {
        let list = await this.leaveSetupAPI.get_company_list().toPromise();
        this.company = list;
        let data = await this.leaveSetupAPI.get_admin_leavetype().toPromise();
        this.leavetypeList = data;
        this.reportApi.get_bundle_report('leave-adjustment').pipe(
            map(value => value.sort((x, y) => new Date(y.adjustDate).getTime() - new Date(x.adjustDate).getTime()))
        ).subscribe(data => this.history = data);
        let userlist = await this.apiService.get_user_profile_list().toPromise();
        this._userItems = userlist;
        let allEntitlementList = await this.leaveSetupAPI.get_leavetype_entitlement().toPromise();
        this._leavetypeEntitilment = allEntitlementList;
        this._allowedClaimUserList = [];
        for (let i = 0; i < this._leavetypeEntitilment.length; i++) {
            let data = await this.leaveEntitlementApi.get_leavetype_entitlement_id(this._leavetypeEntitilment[i].leaveEntitlementId).toPromise();
            if (data.PROPERTIES_XML.claimEntitlement) {
                this._allowedClaimUserList.push(this._leavetypeEntitilment[i]);
            }
        }
        for (let i = 0; i < this._userItems.length; i++) {
            this._userItems[i]["claimLeaveType"] = [];
            this._allowedClaimUserList.forEach(element => {
                element.userAttach.forEach(item => {
                    if (item.guid.indexOf(this._userItems[i].userId) > -1) {
                        this.filteredClaimUserList.push(this._userItems[i]);
                        this.filteredClaimUserList[this.filteredClaimUserList.length - 1].claimLeaveType.push({ "leaveTypeId": element.leaveTypeId, "leaveType": element.leaveType });
                    }
                });
            });
        }
        this.filteredClaimUserList = require('lodash').uniq(this.filteredClaimUserList);
    }

    /**
     * select company & pass company guid to get department list
     * @param {*} guid
     * @memberof LeaveAdjustmentComponent
     */
    companySelected(guid) {
        this._companyGUID = guid;
        this.leaveSetupAPI.get_company_details(guid).subscribe(list => {
            this.department = list.departmentList;
        })
    }

    /**
     * get user list from API
     * @param {*} name
     * @memberof LeaveAdjustmentComponent
     */
    async departmentSelected(name) {
        this.filteredUserItems = [];
        this.showSelectToView = false;
        this.showSpinner = true;
        // let list = await this.apiService.get_user_profile_list().toPromise();
        // this._userItems = list;
        this.showCheckbox.push(false);
        if (this.isRL === false) {
            this.filterUserList(this._userItems, name);
        }
        else {
            this.filterUserList(this.filteredClaimUserList, name);
        }
    }

    /**
     * get entitled leave balance from requested userID 
     * @param {*} leavetypeGUID
     * @memberof LeaveAdjustmentComponent
     */
    getLeaveEntitlement(leavetypeGUID: string) {
        for (let i = 0; i < this.filteredUserItems.length; i++) {
            this.filteredUserItems[i].leaveAbbr = '';
            this.getEntitlementDetails(leavetypeGUID, i)
        }
    }

    /**
     * get leave entitlement details
     * @param {string} leavetypeGUID
     * @memberof LeaveAdjustmentComponent
     */
    async getEntitlementDetails(leavetypeGUID: string, i: number) {
        let data = await this.leaveSetupAPI.get_entilement_details(this.filteredUserItems[i].userId).toPromise();
        for (let j = 0; j < data.length; j++) {
            if (data[j].LEAVE_TYPE_GUID === leavetypeGUID) {
                this.filteredUserItems[i].leaveAbbr = data[j].ENTITLED_DAYS;
                this.filteredUserItems[i].adjustment = data[j].ADJUSTMENT_DAYS;
            }
        }
    }

    // splice same index value 
    selectedLeaveType(leavetypeGuid: string, index: number) {
        const found = this.entitlementLeaveType.controls.some((el, i) => {
            if (el.userId === this.filteredUserItems[index].userId) {
                this.entitlementLeaveType.controls.splice(i, 1)
            }
        });
        if (!found) this.entitlementLeaveType.controls.push({ "leaveTypeId": leavetypeGuid, "userId": this.filteredUserItems[index].userId });
    }

    // splice same index value 
    selectedDate(event, indexes: number) {
        const foundDate = this.datepicker.controls.some((element, i) => {
            if (element.userId === this.filteredUserItems[indexes].userId) {
                this.datepicker.controls.splice(i, 1)
            }
        });
        if (!foundDate) this.datepicker.controls.push({ "date": event.value, "userId": this.filteredUserItems[indexes].userId });
    }

    /**
     * get user list to filter from selected compant & department
     * @param {*} userList
     * @param {string} name
     * @memberof LeaveAdjustmentComponent
     */
    async filterUserList(userList: any, name: string) {
        for (let i = 0; i < userList.length; i++) {
            this.filterByDepartment(userList, name, i);
        }
        if (this.filteredUserItems.length > 0) {
            this.showNoResult = false;
            this.filteredUserItems.sort(function (a, b) {
                var x = a.employeeName.toLowerCase();
                var y = b.employeeName.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });
        } else {
            this.showNoResult = true;
        }
    }


    /**
     * filter employee by deparment
     * @param {*} userList
     * @param {string} name
     * @param {number} i
     * @memberof LeaveAdjustmentComponent
     */
    filterByDepartment(userList: any, name: string, i: number) {
        if (userList[i].companyId === this._companyGUID) {
            if (name !== 'All') {
                this.filteredUserItems = userList.filter((item: any) => {
                    if (item.department != null) {
                        return (item.department.toLowerCase().indexOf(name.toLowerCase()) > -1);
                    }
                })
                this.showSpinner = false;
            } else {
                this.filteredUserItems.push(userList[i]);
                this.showSpinner = false;
            }
        }
    }

    /**
     * checking to enable/disable submit button
     * @memberof LeaveAdjustmentComponent
     */
    enableDisableSubmitButton() {
        if (this.isRL === false) {
            if (this.adjustmentForm.valid && (this.mainCheckBox || this.indeterminate)) {
                this.disableSubmitButton = false;
            } else {
                this.disableSubmitButton = true;
            }
        } else {
            if (this.replacementForm.valid && (this.mainCheckBox || this.indeterminate)) {
                this.disableSubmitButton = false;
            } else {
                this.disableSubmitButton = true;
            }
        }
    }

    /**
     * mouse hover to show/hide checkbox
     * @param {number} i
     * @param {boolean} mouseIn
     * @param {boolean} isChecked
     * @memberof LeaveAdjustmentComponent
     */
    hoverEvent(i: number, mouseIn: boolean, isChecked: boolean) {
        if (this.mainCheckBox || this.indeterminate) {
            this.showCheckbox = [];
            this.showCheckbox.push(...Array(this.filteredUserItems.length).fill(true));
        } else if (mouseIn && !isChecked && !this.indeterminate && !this.mainCheckBox) {
            this.showCheckbox.splice(i, 1, true);
        } else {
            this.showCheckbox.splice(0, this.showCheckbox.length);
            this.showCheckbox.push(...Array(this.filteredUserItems.length).fill(false));
        }
    }

    /**
     * check main checkbox to check all sub checkbox
     * @memberof LeaveAdjustmentComponent
     */
    mainCheckboxEvent() {
        this.showCheckbox.splice(0, this.showCheckbox.length);
        setTimeout(() => {
            this.filteredUserItems.forEach(item => {
                item.isChecked = this.mainCheckBox;
                if (item.isChecked) {
                    this.showCheckbox.push(true);
                } else {
                    this.showCheckbox.push(false);
                }
                this.enableDisableSubmitButton();
            });
        })
    }

    /**
     * check sub checkbox to make changing in main checkbox (interminate/mainCheckBox)
     * @memberof LeaveAdjustmentComponent
     */
    subEvent() {
        const totalLength = this.filteredUserItems.length;
        let ischecked = 0;
        this.filteredUserItems.map(item => {
            if (item.isChecked) {
                ischecked++;
                this.showCheckbox.push(true);
            }
        });
        if (ischecked > 0 && ischecked < totalLength) {
            this.indeterminate = true;
            this.mainCheckBox = false;
        } else if (ischecked == totalLength) {
            this.mainCheckBox = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = false;
            this.mainCheckBox = false;
        }
        this.enableDisableSubmitButton();
    }

    /**
     * get selected user from list
     * @memberof LeaveAdjustmentComponent
     */
    getCheckedUser() {
        if (this.isRL === false) {
            if (this.adjustmentForm.controls.symbol.value === 'remove') {
                this._numberOfDays = -this.adjustmentForm.controls.noOfDay.value;
            } else {
                this._numberOfDays = this.adjustmentForm.controls.noOfDay.value;
            }
        } else {
            if (this.replacementForm.controls.symbol.value === 'remove') {
                this._numberOfDays = -this.replacementForm.controls.noOfDay.value;
            } else {
                this._numberOfDays = this.replacementForm.controls.noOfDay.value;
            }
        }
        this.filteredUserItems.forEach((element, i) => {
            if (element.isChecked) {
                this._selectedUser.push(this.filteredUserItems[i].userId);
            }
        });
    }

    /**
    * expand or collapse user list in history slide-in menu 
    * @param {number} index
    * @memberof LeaveAdjustmentComponent
    */
    expandCollapseHistory(index: number) {
        if (this.showList[index]) {
            this.showList.splice(index, 1, false);
        } else {
            this.showList.splice(index, 1, true);
        }
    }

    onTabChanged(title) {
        if (title.index === 1) {
            this.isRL = true;
        } else {
            this.isRL = false;
        }
        this.adjustmentForm.patchValue({
            department: '',
        });
        this.filteredUserItems = [];
        this.mainCheckBox = false;
        this.indeterminate = false;
    }

    /**
     * patch the leave adjustment day to API
     * @memberof LeaveAdjustmentComponent
     */
    patchLeaveNumber() {
        this.getCheckedUser();
        if (this.isRL === false) {
            const data = {
                "leaveTypeId": this.adjustmentForm.controls.leavetype.value,
                "noOfDays": this._numberOfDays,
                "userId": this._selectedUser,
                "reason": this.adjustmentForm.controls.reason.value
            };
            this.leaveSetupAPI.patch_leave_adjustment(data).subscribe(response => {
                if (response.successList.length != 0) {
                    this.leaveSetupAPI.openSnackBar('You have submitted successfully', true);
                    this.showSmallSpinner = false;
                    this.filteredUserItems = [];
                    this._selectedUser = [];
                    this.filteredUserItems.forEach(element => {
                        element.isChecked = false;
                    });
                    this.enableDisableSubmitButton();
                    this.reportApi.get_bundle_report('leave-adjustment').pipe(
                        map(date => date.sort((a, b) => new Date(b.adjustDate).getTime() - new Date(a.adjustDate).getTime()))
                    ).subscribe(data => this.history = data);
                } else {
                    this.leaveSetupAPI.openSnackBar('Failed to submit request', false);
                }
            }, error => {
                this.showSmallSpinner = false;
                this.filteredUserItems = [];
                this._selectedUser = [];
                this.filteredUserItems.forEach(el => {
                    el.isChecked = false;
                });
                this.enableDisableSubmitButton();
                this.leaveSetupAPI.openSnackBar('Failed to submit request', false);
            });
        } else {
            this.entitlementLeaveType.controls.filter(o1 => this.datepicker.controls.some(o2 => {
                if (o1.userId === o2.userId) {
                    o1["expiredDate"] = dayjs(o2.date).format('YYYY-MM-DD');
                    o1["noOfDays"] = this._numberOfDays;
                    o1["reason"] = this.replacementForm.controls.reason.value
                }
            }));
            this.leaveSetupAPI.post_entitlement_claim({ "data": this.entitlementLeaveType.controls }).
                subscribe(res => {
                    if (res.data.length != 0) {
                        this.leaveSetupAPI.openSnackBar('You have submitted successfully', true);
                        this.filteredUserItems = [];
                        this._selectedUser = [];
                        this.filteredUserItems.forEach(element => {
                            element.isChecked = false;
                        });
                        this.enableDisableSubmitButton();
                    } else {
                        this.leaveSetupAPI.openSnackBar('Failed to submit request', false);
                    }
                    this.showSmallSpinner = false;
                    this.entitlementLeaveType.controls = [];
                    this.datepicker.controls = [];
                }, fail => {
                    this.showSmallSpinner = false;
                    this.entitlementLeaveType.controls = [];
                    this.datepicker.controls = [];
                    this.filteredUserItems = [];
                    this._selectedUser = [];
                    this.filteredUserItems.forEach(el => {
                        el.isChecked = false;
                    });
                    this.enableDisableSubmitButton();
                    this.leaveSetupAPI.openSnackBar('Failed to submit request', false);
                })
        }
    }


}