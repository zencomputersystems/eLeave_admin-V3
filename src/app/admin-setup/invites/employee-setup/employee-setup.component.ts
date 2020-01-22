import { Component, OnInit, HostBinding } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AdminInvitesApiService } from '../admin-invites-api.service';
import * as _moment from 'moment';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { LeaveApiService } from '../../leave-setup/leave-api.service';
import { FormControl, Validators } from '@angular/forms';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../leave-setup/date.adapter';
import { genderStatus, maritalStatus } from './employee-setup.service';
import { RoleApiService } from '../../role-management/role-api.service';
import { ChangeStatusConfimationComponent } from './change-status-confimation/change-status-confimation.component';
import { DeleteCalendarConfirmationComponent } from '../../leave-setup/delete-calendar-confirmation/delete-calendar-confirmation.component';
import { personal, employment } from './employee-setup-data';
import { SharedService } from '../../leave-setup/shared.service';

/**
 *
 * Employee Setup Page
 * @export
 * @class EmployeeSetupComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employee-setup',
    templateUrl: './employee-setup.component.html',
    styleUrls: ['./employee-setup.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class EmployeeSetupComponent implements OnInit {

    /**
     * set menu is open or close by assign new class
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    @HostBinding('class.menuOverlay') menuOpen: boolean = false;

    /**
     * Get user profile list from API
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public list: any;

    /**
     * Show spinner during loading
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showSpinner: boolean = true;

    /**
     * mode on/off
     * @type {string}
     * @memberof EmployeeSetupComponent
     */
    public mode: string = 'OFF';

    /**
     * mode is checked or not
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public modeValue: boolean = false;

    /**
     * user info personal-details
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public personalDetails: any;

    /**
     * birthdate form control
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public birthOfDate: any;

    /**
     * user info employment details
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public employmentDetails: any;

    /**
     * date of join form control
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public dateOfJoin: any;

    /**
     * date of confirm form control
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public dateOfConfirm: any;

    /**
     * date of resign form control
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public dateOfResignation: any;

    /**
     * role profile list from API
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public roleList: any;

    /**
     * calendar profile list from API
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public calendarList: any;

    /**
     * working hour profile list from API
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public workingList: any;

    /**
     * leave entitlement list from API
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public entitlementList: any;

    /**
     * get selected id
     * @type {string}
     * @memberof EmployeeSetupComponent
     */
    public id: string;

    /**
     * get selected user id
     * @type {string}
     * @memberof EmployeeSetupComponent
     */
    public userId: string;

    /**
     * day available for selected employee & leave type & leave entitled
     * @type {number}
     * @memberof EmployeeSetupComponent
     */
    // public dayAvailable: number[] = [];

    /**
     * clicked index 
     * @type {number}
     * @memberof EmployeeSetupComponent
     */
    public clickedIndex: number = 0;

    /**
     * calendar guid
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public calendarValue: any;

    /**
     * working hour guid
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public workingValue: any;

    /**
     * entitlement guid
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public entitlementValue: any = [];

    /**
     * role guid
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public roleValue: any;

    /**
     * entitlement id
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public addEntitlement: any = [];

    /** 
     * active/inactive status from endpoint
     * @type {string}
     * @memberof EmployeeSetupComponent
     */
    public employeeStatus: string;

    /**
     * individual button clicked or not
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public individualButton: boolean = true;

    /**
     * bulk import button clicked or not
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public bulkButton: boolean = false;

    /**
     * toggle status of employee
     * active/inactive
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public status: boolean;

    /** 
     * company list get from endpoint
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public companyList: any;

    /**
     * department list from master endpoint
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public departmentList: any;

    /**
     * checkbox value of inactive filter
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public inactive: boolean = false;

    /**
     * checkbox value of active filter
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public active: boolean = false;

    /**
     * show personal content after clicked expand
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showPersonal: boolean = true;

    /**
     * show employment content after clicked expand
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showEmploy: boolean = false;

    /**
     * show assign calendar,etc content after clicked expand
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showCalendar: boolean = false;

    /**
     * show role content after clicked expand
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showRole: boolean = false;

    /**
     * show others information of contacts & family info & education
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showOthers: boolean = false;

    /**
     * get paginator config
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public config: any;

    /**
     * show all company list
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showall: boolean = false;

    /**
     * show less company list
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showViewLessButton: boolean = false;

    /**
     * show all department list
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showAllDepartment: boolean = false;

    /**
     * show less department
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public showLessDepartment: boolean = false;

    /**
     * need to remove exsiting leave entitlement or vice versa
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public remove: boolean;

    /**
     * clicked user leave entitlement id
     * @type {string}
     * @memberof EmployeeSetupComponent
     */
    public userLeaveEntitled: string;

    /**
     * selected company guid
     * @private
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    private _selectedCompany: any = [];

    /**
     * selected department name
     * @private
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    private _selectedDepartment: any = [];

    /**
     *Creates an instance of EmployeeSetupComponent.
     * @param {AdminInvitesApiService} inviteAPI access invite API
     * @param {LeaveApiService} leaveApi
     * @param {RoleApiService} roleAPI access role manegement api service
     * @param {SharedService} _sharedService
     * @memberof EmployeeSetupComponent
     */
    constructor(public inviteAPI: AdminInvitesApiService, private leaveApi: LeaveApiService, public roleAPI: RoleApiService, private _sharedService: SharedService) {
    }

    /**
     * initial method to get endpoint list
     * @memberof EmployeeSetupComponent
     */
    async ngOnInit() {
        this.endPoint();
        let roleData = await this.roleAPI.get_role_profile_list().toPromise()
        this.roleList = roleData;
        let calendarData = await this.inviteAPI.get_calendar_profile_list().toPromise();
        this.calendarList = calendarData;
        let workingData = await this.inviteAPI.get_working_hour_profile_list().toPromise();
        this.workingList = workingData;
        let entitlement = await this.leaveApi.get_leavetype_entitlement().toPromise();
        this.entitlementList = entitlement;
        let company = await this.leaveApi.get_company_list().toPromise();
        this.companyList = company;
        for (let i = 0; i < this.companyList.length; i++) {
            this.companyList[i]['checked'] = false;
        }
        let department = await this.inviteAPI.get_departmet_list().toPromise();
        this.departmentList = department;
        for (let i = 0; i < this.departmentList.length; i++) {
            this.departmentList[i]['checked'] = false;
        }
    }

    /**
     * Get user profile list from API
     * @memberof EmployeeSetupComponent
     */
    async endPoint() {
        let data = await this.inviteAPI.apiService.get_user_profile_list().toPromise();
        this.showSpinner = false;
        this.list = data;
        this.config = {
            itemsPerPage: 7,
            currentPage: 1,
            totalItems: this.list.length
        }
        this.getUserId(this.list[0], 0, 1);
    }

    /**
     * get emitted value to patch to user-info employement-details API
     * @param {*} event
     * @memberof EmployeeSetupComponent
     */
    receiveData(event) {
        if (this.mode = 'OFF') {
            this.employmentDetails.employmentDetail.branch = event[0];
            this.employmentDetails.employmentDetail.section = event[1];
            this.employmentDetails.employmentDetail.department = event[2];
            this.employmentDetails.employmentDetail.costcentre = event[3];
            this.patchEmploymentDetails();
        }
    }

    /**
     * get clicked user id
     * @param {*} item
     * @param {number} index
     * @param {number} p
     * @memberof EmployeeSetupComponent
     */
    getUserId(item: any, index: number, p: number) {
        this.clickedIndex = ((p - 1) * 7) + index;
        this.employeeStatus = this.list[this.clickedIndex].status;
        if (this.employeeStatus == 'Active') {
            this.status = true;
        } else {
            this.status = false;
        }
        this.id = item.id;
        this.userId = item.userId;
        this.inviteAPI.get_admin_user_info('personal-details', this.id).subscribe(data => {
            this.personalDetails = data;
            this.getPersonalDetails();

        })
        this.inviteAPI.get_admin_user_info('employment-detail', this.id).subscribe(data => {
            this.employmentDetails = data;
            this.getEmploymentDetails();
        })
        this.leaveApi.get_entilement_details(this.userId).subscribe(data => {
            if (data.length > 0) {
                this.addEntitlement = [];
                for (let i = 0; i < data.length; i++) {
                    this.addEntitlement.push({ "leavetype": data[i].LEAVE_TYPE_GUID, "userLeaveEntitlement": data[i].USER_LEAVE_ENTITLEMENT_GUID, "balance": data[i].BALANCE_DAYS });
                }
            }
        })
        this.inviteAPI.apiService.get_user_profile_details(this.userId).subscribe(data => {
            this.calendarValue = data.calendarId;
            this.roleValue = data.roleId;
            this.workingValue = data.workingHoursId;
        })
    }

    /**
     * get personal details of DOB
     * @memberof EmployeeSetupComponent
     */
    getPersonalDetails() {
        if (this.personalDetails.personalDetail != undefined) {
            this.birthOfDate = new FormControl((this.personalDetails.personalDetail.dob), Validators.required);
            this.personalDetails.personalDetail.dob = _moment(this.personalDetails.personalDetail.dob).format('DD-MM-YYYY');
        } else {
            this.personalDetails.personalDetail = personal;
        }
    }

    /**
     * get employment details of Dates
     * @memberof EmployeeSetupComponent
     */
    getEmploymentDetails() {
        if (this.employmentDetails.employmentDetail != undefined) {
            this.dateOfJoin = new FormControl((this.employmentDetails.employmentDetail.dateOfJoin), Validators.required);
            this.employmentDetails.employmentDetail.dateOfJoin = _moment(this.employmentDetails.employmentDetail.dateOfJoin).format('DD-MM-YYYY');
            this.dateOfConfirm = new FormControl((this.employmentDetails.employmentDetail.dateOfConfirmation), Validators.required);
            this.employmentDetails.employmentDetail.dateOfConfirmation = _moment(this.employmentDetails.employmentDetail.dateOfConfirmation).format('DD-MM-YYYY');
            this.dateOfResignation = new FormControl((this.employmentDetails.employmentDetail.dateOfResignation), Validators.required);
            this.employmentDetails.employmentDetail.dateOfResignation = _moment(this.employmentDetails.employmentDetail.dateOfResignation).format('DD-MM-YYYY');
        } else {
            this.employmentDetails.employmentDetail = employment;
        }
    }

    /**
     * assign employee to a selected leave entitlement
     * get day balance value
     * @param {*} leaveTypeId
     * @param {*} leaveEntitlementId
     * @memberof EmployeeSetupComponent
     */
    async getLeaveTypeEntitlementId(leaveTypeId: string, leaveEntitlementId: string, index: number) {
        // POST and create directly
        const data = {
            "userId": [this.userId], "leaveTypeId": leaveTypeId, "leaveEntitlementId": leaveEntitlementId
        }
        let res = await this.leaveApi.post_leave_entitlement(data).toPromise();
        if (res.successList.length != 0) {
            let val = await this.leaveApi.get_entilement_details(this.userId).toPromise();
            for (let i = 0; i < val.length; i++) {
                if (val[i].USER_LEAVE_ENTITLEMENT_GUID == this.userLeaveEntitled && this.remove === true) {
                    let remove = await this.inviteAPI.delete_user_leave_entitlement(this.userLeaveEntitled).toPromise();
                    this.spliceEntitlement(i, leaveTypeId, val);
                }
                if (this.remove === false) {
                    this.spliceEntitlement(index, leaveTypeId, val);
                }
            }
        }
    }

    /**
     * splice method
     * @param {number} index
     * @param {string} leaveTypeId
     * @param {*} val
     * @memberof EmployeeSetupComponent
     */
    spliceEntitlement(index: number, leaveTypeId: string, val) {
        this.addEntitlement.splice(index, 1, { "leavetype": leaveTypeId, "userLeaveEntitlement": val[val.length - 1].USER_LEAVE_ENTITLEMENT_GUID, "balance": val[val.length - 1].BALANCE_DAYS });
    }

    /**
     * change selection detection
     * @param {*} list
     * @param {string} userEntitled
     * @memberof EmployeeSetupComponent
     */
    async changeLeaveEntitlement(list, userEntitled: string) {
        if (list[list.length - 1].balance == 0) {
            this.remove = false;
        } else {
            this.remove = true;
            this.userLeaveEntitled = userEntitled;
        }
    }

    /**
     * add new form of entitlement
     * @memberof EmployeeSetupComponent
     */
    addNewEntitlement() {
        this.addEntitlement.push({ "leavetype": "", "userLeaveEntitlement": "", "balance": 0 });
    }

    /**
     * delete form of entitlement
     * @param {number} index
     * @memberof EmployeeSetupComponent
     */
    async deleteEntitlement(index: number) {
        let response = await this.inviteAPI.delete_user_leave_entitlement(this.addEntitlement[index].userLeaveEntitlement).toPromise().then(() => {
            this.leaveApi.openSnackBar('Selected leave entitlement was deleted', true);
            this.addEntitlement.splice(index, 1);
        }).catch(err => {
            this.leaveApi.openSnackBar('Error occurred', false);
        });
    }

    /**
     * toggle edit mode on/off
     * @param {*} evt
     * @memberof EmployeeSetupComponent
     */
    toggleMode(evt) {
        if (evt.detail.checked === true) {
            this.mode = 'ON';
            this.modeValue = true;
            this.inviteAPI.popUp.open(EditModeDialogComponent, {
                data: 'employee',
                height: "333.3px",
                width: "383px"
            });
        } else {
            this.mode = 'OFF';
            this.modeValue = false;
            if (this.showOthers == false) {
                this.patchPersonalDetails();
            }
            // this.patchEmploymentDetails();
            this.assignProfile();
            this.leaveApi.openSnackBar('Edit mode disabled. Good job!', true);
        }
        this._sharedService.emitChange(this.mode);
    }

    /**
     * toggle to change employee status (active/inactive)
     * @param {*} event
     * @param {string} name
     * @memberof EmployeeSetupComponent
     */
    async toggleStatus(event, name: string, userId: string) {
        if (event.currentTarget.checked == false) {
            const dialog = this.inviteAPI.popUp.open(ChangeStatusConfimationComponent, {
                data: { name: name, status: 'Activate' },
                height: "285px",
                width: "360px"
            });
            let result = await dialog.afterClosed().toPromise();
            if (result === 'Activate') {
                this.employeeStatus = 'Active';
                this.status = true;
                let res = await this.inviteAPI.post_activate_user_info(this.userId, {
                    "roleProfileId": this.roleValue,
                    "workingHoursId": this.workingValue,
                    "calendarId": this.calendarValue
                }).toPromise();
                let list = await this.inviteAPI.apiService.get_user_profile_list().toPromise();
                this.list = list;
                this.getUserId(this.list[this.clickedIndex], this.clickedIndex, this.config.currentPage);
                this.mode = 'ON';
                this.modeValue = true;
                this.leaveApi.openSnackBar(name + ' become Active', true);
            }
        } else {
            const dialog = this.inviteAPI.popUp.open(ChangeStatusConfimationComponent, {
                data: { name: name, status: 'Deactivate', userId: userId },
                height: "395px",
                width: "395px"
            });
            let result = await dialog.afterClosed().toPromise();
            if (result === 'Deactivate') {
                this.employeeStatus = 'Inactive';
                this.status = false;
                await this.inviteAPI.disable_user({
                    "user_guid": this.userId,
                    "resign_date": _moment(new Date()).format('YYYY-MM-DD'),
                }).toPromise();
                let data = await this.inviteAPI.apiService.get_user_profile_list().toPromise();
                this.list = data;
                this.leaveApi.openSnackBar(name + ' become Inactive', true);
            }
        }
    }

    /**
     * patch personal details
     * @memberof EmployeeSetupComponent
     */
    async patchPersonalDetails() {
        if (this.personalDetails.personalDetail != undefined) {
            this.personalDetails.personalDetail.nric = (this.personalDetails.personalDetail.nric).toString();
            this.personalDetails.personalDetail.dob = _moment(this.birthOfDate.value).format('YYYY-MM-DD');
            this.personalDetails.personalDetail.gender = this.personalDetails.personalDetail.gender;
            this.personalDetails.personalDetail.maritalStatus = this.personalDetails.personalDetail.maritalStatus;
            this.personalDetails.personalDetail.postcode = Number(this.personalDetails.personalDetail.postcode);
            let res = await this.inviteAPI.patch_admin_personal_user_info(this.personalDetails.personalDetail, this.id).toPromise();
            this.personalDetails.personalDetail = res;
            this.getPersonalDetails();
        }
    }

    /**
     * patch employment details to endpoint
     * @memberof EmployeeSetupComponent
     */
    async patchEmploymentDetails() {
        if (this.employmentDetails.employmentDetail != undefined) {
            this.employmentDetails.employmentDetail.employeeId = (this.employmentDetails.employmentDetail.employeeId).toString();
            this.employmentDetails.employmentDetail.incomeTaxNumber = (this.employmentDetails.employmentDetail.incomeTaxNumber).toString();
            this.employmentDetails.employmentDetail.dateOfJoin = _moment(this.dateOfJoin.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.dateOfResignation = _moment(this.dateOfResignation.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.dateOfConfirmation = _moment(this.dateOfConfirm.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.bankAccountNumber = (this.employmentDetails.employmentDetail.bankAccountNumber).toString();
            this.employmentDetails.employmentDetail.epfNumber = (this.employmentDetails.employmentDetail.epfNumber).toString();
            delete this.employmentDetails.employmentDetail["yearOfService"];
            let resp = await this.inviteAPI.patch_admin_employment_user_info(this.employmentDetails.employmentDetail, this.id).toPromise();
            this.employmentDetails.employmentDetail = resp;
            this.getEmploymentDetails();
        }
    }

    /**
     * output from others-information 
     * @param {*} event
     * @memberof EmployeeSetupComponent
     */
    value(event) {
        this.personalDetails.personalDetail.emergencyContact = event[0];
        this.personalDetails.personalDetail.family.spouse = event[1];
        this.personalDetails.personalDetail.family.child = event[2];
        this.personalDetails.personalDetail.education = event[3];
        this.personalDetails.personalDetail.certification = event[4];
        this.patchPersonalDetails();
    }

    /**
     * save assigned profile of calendar profile, working hour & user role
     * @memberof EmployeeSetupComponent
     */
    async assignProfile() {
        let data = await this.leaveApi.patch_assign_calendar_profile({
            "user_guid": [this.userId], "calendar_guid": this.calendarValue
        }).toPromise();

        let workingData = await this.leaveApi.patch_user_working_hours({
            "user_guid": [this.userId], "working_hours_guid": this.workingValue
        }).toPromise();

        let roleData = await this.roleAPI.patch_user_profile({
            "user_guid": [this.userId], "role_guid": this.roleValue
        }).toPromise();
    }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof EmployeeSetupComponent
     */
    filter(text: any) {
        if (text && text.trim() != '') {
            this.list = this.list.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof EmployeeSetupComponent
     */
    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.endPoint();
            this.active = false;
            this.inactive = false;
        } else {
            this.filter(text.srcElement.value);
        }
    }

    /**
     * clicked on comapany checkbox
     * @param {*} index
     * @memberof EmployeeSetupComponent
     */
    clickedCompanyCheckbox(index) {
        setTimeout(() => {
            if (this.companyList[index].checked) {
                this._selectedCompany.push(this.companyList[index].TENANT_COMPANY_GUID);
            } else {
                const i = this._selectedCompany.indexOf(this.companyList[index].TENANT_COMPANY_GUID);
                this._selectedCompany.splice(i, 1);
            }
        }, 500);
    }

    /**
     * clicked on department checkbox
     * @param {number} index
     * @memberof EmployeeSetupComponent
     */
    clickedDepartmentCheckbox(index: number) {
        setTimeout(() => {
            if (this.departmentList[index].checked) {
                this._selectedDepartment.push(this.departmentList[index].DEPARTMENT);
            } else {
                const i = this._selectedDepartment.indexOf(this.departmentList[index].DEPARTMENT);
                this._selectedDepartment.splice(i, 1);
            }
        }, 500);
    }

    /**
     * click button to filter all selected company, department, active/inactive, etc
     * @memberof EmployeeSetupComponent
     */
    async filterValue() {
        let data = await this.inviteAPI.apiService.get_user_profile_list().toPromise();
        this.list = data;

        if (this.active == true) {
            this.statusFiltered('Active', this.list);
        }
        if (this.inactive == true) {
            this.statusFiltered('Inactive', this.list);
        }
        for (let i = 0; i < this._selectedCompany.length; i++) {
            this.companyFiltered(this._selectedCompany[i], this.list);
        }
        for (let i = 0; i < this._selectedDepartment.length; i++) {
            this.departmentFiltered(this._selectedDepartment[i], this.list);
        }
    }

    /**
     * filter selected status of employee (active/inactive)
     * @param {string} text
     * @param {*} list
     * @memberof EmployeeSetupComponent
     */
    statusFiltered(text: string, list) {
        this.list = list.filter((item: any) => {
            return (item.status.indexOf(text) > -1);
        })
    }

    /**
     * filter selected company
     * @param {string} companyId
     * @param {*} items
     * @memberof EmployeeSetupComponent
     */
    companyFiltered(companyId: string, items: any) {
        this.list = items.filter((item: any) => {
            return (item.companyId.toUpperCase().indexOf(companyId.toUpperCase()) > -1);
        })
    }

    /**
     * filter selected department
     * @param {string} departmentName
     * @param {*} list
     * @memberof EmployeeSetupComponent
     */
    departmentFiltered(departmentName: string, list) {
        this.list = list.filter((item: any) => {
            return (item.department.toLowerCase().indexOf(departmentName.toLowerCase()) > -1);
        })
    }

    /**
     * delete employee
     * @param {string} name
     * @param {string} userId
     * @memberof EmployeeSetupComponent
     */
    async deleteEmployee(name: string, userId: string) {
        const dialogRef = this.inviteAPI.popUp.open(DeleteCalendarConfirmationComponent, {
            data: { name: name, value: userId, desc: "'s employee profile" },
            height: "195px",
            width: "270px"
        });
        let val = await dialogRef.afterClosed().toPromise();
        if (val === userId) {
            this.inviteAPI.delete_user(userId).toPromise();
            this.leaveApi.openSnackBar('Selected employee profile was deleted', true);
            this.endPoint();
        }
    }
}
