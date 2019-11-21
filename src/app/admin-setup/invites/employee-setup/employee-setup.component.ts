import { Component, OnInit } from '@angular/core';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AdminInvitesApiService } from '../admin-invites-api.service';
import * as _moment from 'moment';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { LeaveApiService } from '../../leave-setup/leave-api.service';
import { FormControl, Validators } from '@angular/forms';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../leave-setup/date.adapter';
import { genderStatus, maritalStatus } from './employee-setup.service';
import { RoleApiService } from '../../role-management/role-api.service';
import { MenuController } from '@ionic/angular';
import { ChangeStatusConfimationComponent } from './change-status-confimation/change-status-confimation.component';
import { DeleteCalendarConfirmationComponent } from '../../leave-setup/delete-calendar-confirmation/delete-calendar-confirmation.component';

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
    public dateOfResign: any;

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
    public dayAvailable: number = 0;

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
    public entitlementValue: any;

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
    public addEntitlement: any = [0];

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
     * @param {MenuController} menu
     * @param {AdminInvitesApiService} inviteAPI
     * @param {MatDialog} popUp
     * @param {LeaveApiService} leaveApi
     * @param {RoleApiService} roleAPI
     * @memberof EmployeeSetupComponent
     */
    constructor(private menu: MenuController, private inviteAPI: AdminInvitesApiService, public popUp: MatDialog, private leaveApi: LeaveApiService, public roleAPI: RoleApiService) {
    }

    /**
     * initial method to get endpoint list
     * @memberof EmployeeSetupComponent
     */
    ngOnInit() {
        this.endPoint();
        this.inviteAPI.get_role_profile_list().subscribe(list => {
            this.roleList = list;
        })
        this.inviteAPI.get_calendar_profile_list().subscribe(list => {
            this.calendarList = list;
        })
        this.inviteAPI.get_working_hour_profile_list().subscribe(list => {
            this.workingList = list;
        })
        this.leaveApi.get_leavetype_entitlement().subscribe(list => {
            this.entitlementList = list;
        })
        this.leaveApi.get_company_list().subscribe(company => {
            this.companyList = company;
            for (let i = 0; i < this.companyList.length; i++) {
                this.companyList[i]['checked'] = false;
            }
        });
        this.inviteAPI.get_departmet_list().subscribe(list => {
            this.departmentList = list;
            for (let i = 0; i < this.departmentList.length; i++) {
                this.departmentList[i]['checked'] = false;
            }
        })
    }

    /**
     * Get user profile list from API
     * @memberof EmployeeSetupComponent
     */
    endPoint() {
        this.inviteAPI.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.showSpinner = false;
                this.list = data;
                this.config = {
                    itemsPerPage: 7,
                    currentPage: 1,
                    totalItems: this.list.length
                }
                this.getUserId(this.list[0], 0, 1);
            });
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
        this.inviteAPI.get_requested_user_profile(this.userId).subscribe(data => {
            this.calendarValue = data.calendarId;
            this.roleValue = data.roleId;
            this.workingValue = data.workingHoursId;
            this.entitlementValue = data.entitlementDetail[0].leaveTypeId;
            this.dayAvailable = data.entitlementDetail[0].balanceDays;
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
            this.dateOfResign = new FormControl((this.employmentDetails.employmentDetail.dateOfResign), Validators.required);
            this.employmentDetails.employmentDetail.dateOfResign = _moment(this.employmentDetails.employmentDetail.dateOfResign).format('DD-MM-YYYY');
        }

    }

    /**
     * assign employee to a selected leave entitlement
     * get day balance value
     * @param {*} leaveTypeId
     * @param {*} leaveEntitlementId
     * @memberof EmployeeSetupComponent
     */
    getLeaveTypeEntitlementId(leaveTypeId, leaveEntitlementId) {
        // POST and create directly
        const data = {
            "userId": [this.userId], "leaveTypeId": leaveTypeId, "leaveEntitlementId": leaveEntitlementId
        }
        this.leaveApi.post_leave_entitlement(data).subscribe(res => {
            console.log('res', res);
        })
        this.leaveApi.get_entilement_details(this.userId).subscribe(val => {
            console.log('entitledetails', val);
            for (let i = 0; i < val.length; i++) {
                if (val[i].LEAVE_TYPE_GUID == leaveTypeId) {
                    this.dayAvailable = val[i].BALANCE_DAYS;
                }
            }
        })
        console.log(leaveTypeId, leaveEntitlementId);
    }

    /**
     * add new form of entitlement
     * @memberof EmployeeSetupComponent
     */
    addNewEntitlement() {
        this.addEntitlement.push(0);
    }

    /**
     * delete form of entitlement
     * @param {number} index
     * @memberof EmployeeSetupComponent
     */
    deleteEntitlement(index: number) {
        this.addEntitlement.splice(index, 1);
    }

    /**
     * toggle edit mode on/off
     * @param {*} evt
     * @memberof EmployeeSetupComponent
     */
    toggleMode(evt) {
        if (evt.detail.checked === true) {
            this.mode = 'ON';
            this.popUp.open(EditModeDialogComponent, {
                data: 'employee',
                height: "354.3px",
                width: "383px"
            });
        } else {
            this.mode = 'OFF';
            this.patchPersonalDetails();
            this.patchEmploymentDetails();
            this.assignProfile();
            this.inviteAPI.showSnackbar('Edit mode disabled. Good job!', true);
        }
    }

    /**
     * toggle to change employee status (active/inactive)
     * @param {*} event
     * @param {string} name
     * @memberof EmployeeSetupComponent
     */
    toggleStatus(event, name: string) {
        if (event.currentTarget.checked == false) {
            const dialog = this.popUp.open(ChangeStatusConfimationComponent, {
                data: { name: name, status: 'Active' },
                height: "195px",
                width: "249px"
            });
            dialog.afterClosed().subscribe(result => {
                if (result === 'Active') {
                    this.employeeStatus = 'Active';
                    this.status = true;
                    this.inviteAPI.showSnackbar(name + ' become Active', true);
                }
            });
        } else {
            const dialog = this.popUp.open(ChangeStatusConfimationComponent, {
                data: { name: name, status: 'Inactive' },
                height: "195px",
                width: "249px"
            });
            dialog.afterClosed().subscribe(result => {
                if (result === 'Inactive') {
                    this.employeeStatus = 'Inactive';
                    this.status = false;
                    this.inviteAPI.disable_user({
                        "user_guid": this.userId,
                        "resign_date": _moment(new Date()).format('YYYY-MM-DD'),
                    }).subscribe(response => {
                        this.endPoint();
                        this.inviteAPI.showSnackbar(name + ' become Inactive', true);
                    })
                }
            });
        }
    }

    /**
     * patch personal details
     * @memberof EmployeeSetupComponent
     */
    patchPersonalDetails() {
        if (this.personalDetails.personalDetail != undefined) {
            this.personalDetails.personalDetail.nric = (this.personalDetails.personalDetail.nric).toString();
            this.personalDetails.personalDetail.dob = _moment(this.birthOfDate.value).format('YYYY-MM-DD');
            this.personalDetails.personalDetail.gender = genderStatus[this.personalDetails.personalDetail.gender];
            this.personalDetails.personalDetail.maritalStatus = maritalStatus[this.personalDetails.personalDetail.maritalStatus];
            this.inviteAPI.patch_admin_personal_user_info(this.personalDetails.personalDetail, this.id).subscribe(res => {
                this.personalDetails.personalDetail = res;
                this.getPersonalDetails();
                this.personalDetails.personalDetail.gender = genderStatus[this.personalDetails.personalDetail.gender];
                this.personalDetails.personalDetail.maritalStatus = maritalStatus[this.personalDetails.personalDetail.maritalStatus];
            });
        }
    }

    /**
     * patch employment details to endpoint
     * @memberof EmployeeSetupComponent
     */
    patchEmploymentDetails() {
        if (this.employmentDetails.employmentDetail != undefined) {
            this.employmentDetails.employmentDetail.employeeId = (this.employmentDetails.employmentDetail.employeeId).toString();
            this.employmentDetails.employmentDetail.incomeTaxNumber = (this.employmentDetails.employmentDetail.incomeTaxNumber).toString();
            this.employmentDetails.employmentDetail.dateOfJoin = _moment(this.dateOfJoin.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.dateOfResign = _moment(this.dateOfResign.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.dateOfConfirmation = _moment(this.dateOfConfirm.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.bankAccountNumber = (this.employmentDetails.employmentDetail.bankAccountNumber).toString();
            this.inviteAPI.patch_admin_employment_user_info(this.employmentDetails.employmentDetail, this.id).subscribe(resp => {
                this.employmentDetails.employmentDetail = resp;
                this.getEmploymentDetails();
            });
        }
    }

    /**
     * get changed value output
     * @param {*} event
     * @memberof EmployeeSetupComponent
     */
    getChangedValue(event) {
        console.log('updated', event);
    }

    /**
     * save assigned profile of calendar profile, working hour & user role
     * @memberof EmployeeSetupComponent
     */
    assignProfile() {
        this.leaveApi.patch_assign_calendar_profile({
            "user_guid": [this.userId], "calendar_guid": this.calendarValue
        }).subscribe(data => console.log(data));

        this.leaveApi.patch_user_working_hours({
            "user_guid": [this.userId], "working_hours_guid": this.workingValue
        }).subscribe(data => console.log(data));

        this.roleAPI.patch_user_profile({
            "user_guid": [this.userId], "role_guid": this.roleValue
        }).subscribe(data => console.log(data));
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
     * close menu 
     * @param {*} event
     * @memberof EmployeeSetupComponent
     */
    eventOutput(event) {
        this.menu.close('addNewEmployeeDetails');
        this.inviteAPI.showSnackbar('New employee profiles was created successfully', true);
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
        let data = await this.inviteAPI.get_user_profile_list().toPromise();
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
    deleteEmployee(name: string, userId: string) {
        const dialogRef = this.popUp.open(DeleteCalendarConfirmationComponent, {
            data: { name: name, value: userId, desc: "'s employee profile" },
            height: "195px",
            width: "249px"
        });
        dialogRef.afterClosed().subscribe(val => {
            if (val === userId) {
                this.inviteAPI.delete_user(userId).subscribe(response => {
                    this.inviteAPI.showSnackbar('Selected employee profile was deleted', true);
                    this.endPoint();
                })
            }
        });
    }
}
