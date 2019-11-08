import { Component, OnInit } from '@angular/core';
import { DeleteListConfirmationComponent } from '../delete-list-confirmation/delete-list-confirmation.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AdminInvitesApiService } from '../admin-invites-api.service';
import { DateDialogComponent } from '../date-dialog/date-dialog.component';
import * as _moment from 'moment';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { LeaveApiService } from '../../leave-setup/leave-api.service';
import { FormControl, Validators } from '@angular/forms';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../leave-setup/date.adapter';
import { genderStatus, maritalStatus } from '../../employee-profile-hr/employee-profile.service';
import { RoleApiService } from '../../role-management/role-api.service';
import { MenuController } from '@ionic/angular';
import { ChangeStatusConfimationComponent } from './change-status-confimation/change-status-confimation.component';
const moment = _moment;

/**
 *
 * Invite List Page
 * @export
 * @class InviteListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-invite-list',
    templateUrl: './invite-list.component.html',
    styleUrls: ['./invite-list.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class InviteListComponent implements OnInit {

    /**
     * Get user profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public list: any;

    /**
     * Show spinner during loading
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public showSpinner: boolean = true;

    /**
     * current page of paginator
     * @type {number}
     * @memberof InviteListComponent
     */
    public p: number;

    /**
     * mode on/off
     * @type {string}
     * @memberof InviteListComponent
     */
    public mode: string = 'OFF';

    /**
     * user info personal-details
     * @type {*}
     * @memberof InviteListComponent
     */
    public personalDetails: any;

    /**
     * birthdate form control
     * @type {*}
     * @memberof InviteListComponent
     */
    public birthOfDate: any;

    /**
     * user info employment details
     * @type {*}
     * @memberof InviteListComponent
     */
    public employmentDetails: any;

    /**
     * date of join form control
     * @type {*}
     * @memberof InviteListComponent
     */
    public dateOfJoin: any;

    /**
     * date of confirm form control
     * @type {*}
     * @memberof InviteListComponent
     */
    public dateOfConfirm: any;

    /**
     * date of resign form control
     * @type {*}
     * @memberof InviteListComponent
     */
    public dateOfResign: any;

    /**
     * role profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public roleList: any;

    /**
     * calendar profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public calendarList: any;

    /**
     * working hour profile list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public workingList: any;

    /**
     * leave entitlement list from API
     * @type {*}
     * @memberof InviteListComponent
     */
    public entitlementList: any;

    /**
     * get selected user id
     * @type {string}
     * @memberof InviteListComponent
     */
    public userId: string;

    /**
     * day available for selected employee & leave type & leave entitled
     * @type {number}
     * @memberof InviteListComponent
     */
    public dayAvailable: number = 0;

    /**
     * clicked index 
     * @type {number}
     * @memberof InviteListComponent
     */
    public clickedIndex: number = 0;

    /**
     * calendar guid
     * @type {*}
     * @memberof InviteListComponent
     */
    public calendarValue: any;

    /**
     * working hour guid
     * @type {*}
     * @memberof InviteListComponent
     */
    public workingValue: any;

    /**
     * entitlement guid
     * @type {*}
     * @memberof InviteListComponent
     */
    public entitlementValue: any;

    /**
     * role guid
     * @type {*}
     * @memberof InviteListComponent
     */
    public roleValue: any;

    /**
     * entitlement id
     * @type {*}
     * @memberof InviteListComponent
     */
    public addEntitlement: any = [0];

    /** 
     * active/inactive status from endpoint
     * @type {string}
     * @memberof InviteListComponent
     */
    public employeeStatus: string;

    /**
     * individual button clicked or not
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public individualButton: boolean = true;

    /**
     * bulk import button clicked or not
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public bulkButton: boolean = false;

    /**
     * toggle status of employee
     * active/inactive
     * @type {boolean}
     * @memberof InviteListComponent
     */
    public status: boolean;

    /**
     *Creates an instance of InviteListComponent.
     * @param {MenuController} menu
     * @param {AdminInvitesApiService} inviteAPI
     * @param {MatDialog} popUp
     * @param {LeaveApiService} leaveApi
     * @param {RoleApiService} roleAPI
     * @memberof InviteListComponent
     */
    constructor(public menu: MenuController, private inviteAPI: AdminInvitesApiService, public popUp: MatDialog, private leaveApi: LeaveApiService, public roleAPI: RoleApiService) { }

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
    }

    /**
     * Get user profile list from API
     * @memberof InviteListComponent
     */
    endPoint() {
        this.inviteAPI.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.showSpinner = false;
                this.list = data;
                this.getUserId(this.list[0].userId, 0, 1);
            });
    }

    /**
     * get clicked user id
     * @param {string} userId
     * @param {number} index
     * @param {number} p
     * @memberof InviteListComponent
     */
    getUserId(userId: string, index: number, p: number) {
        if (p === undefined) {
            this.p = 1;
            p = 1;
        }
        this.clickedIndex = ((p - 1) * 7) + index;
        this.employeeStatus = this.list[this.clickedIndex].status;
        if (this.employeeStatus == 'Active') {
            this.status = true;
        } else {
            this.status = false;
        }
        this.userId = userId;
        this.inviteAPI.get_admin_user_info('personal-details', userId).subscribe(data => {
            this.personalDetails = data;
            this.getPersonalDetails();
        })
        this.inviteAPI.get_admin_user_info('employment-detail', userId).subscribe(data => {
            this.employmentDetails = data;
            this.getEmploymentDetails();
        })
        this.inviteAPI.get_requested_user_profile(userId).subscribe(data => {
            this.calendarValue = data.calendarId;
            this.roleValue = data.roleId;
            this.workingValue = data.workingHoursId;
            this.entitlementValue = data.entitlementDetail[0].leaveTypeId;
            this.dayAvailable = data.entitlementDetail[0].balanceDays;
        })
    }

    /**
     * get personal details of DOB
     * @memberof InviteListComponent
     */
    getPersonalDetails() {
        if (this.personalDetails.personalDetail != undefined) {
            this.birthOfDate = new FormControl((this.personalDetails.personalDetail.dob), Validators.required);
            this.personalDetails.personalDetail.dob = moment(this.personalDetails.personalDetail.dob).format('DD-MM-YYYY');
        }
    }

    /**
     * get employment details of Dates
     * @memberof InviteListComponent
     */
    getEmploymentDetails() {
        if (this.employmentDetails.employmentDetail != undefined) {
            this.dateOfJoin = new FormControl((this.employmentDetails.employmentDetail.dateOfJoin), Validators.required);
            this.employmentDetails.employmentDetail.dateOfJoin = moment(this.employmentDetails.employmentDetail.dateOfJoin).format('DD-MM-YYYY');
            this.dateOfConfirm = new FormControl((this.employmentDetails.employmentDetail.dateOfConfirmation), Validators.required);
            this.employmentDetails.employmentDetail.dateOfConfirmation = moment(this.employmentDetails.employmentDetail.dateOfConfirmation).format('DD-MM-YYYY');
            this.dateOfResign = new FormControl((this.employmentDetails.employmentDetail.dateOfResign), Validators.required);
            this.employmentDetails.employmentDetail.dateOfResign = moment(this.employmentDetails.employmentDetail.dateOfResign).format('DD-MM-YYYY');
        }

    }

    /**
     * assign employee to a selected leave entitlement
     * get day balance value
     * @param {*} leaveTypeId
     * @param {*} leaveEntitlementId
     * @memberof InviteListComponent
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
     * @memberof InviteListComponent
     */
    addNewEntitlement() {
        this.addEntitlement.push(0);
    }

    /**
     * delete form of entitlement
     * @param {number} index
     * @memberof InviteListComponent
     */
    deleteEntitlement(index: number) {
        this.addEntitlement.splice(index, 1);
    }

    /**
     * toggle edit mode on/off
     * @param {*} evt
     * @memberof InviteListComponent
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
                        "resign_date": moment(new Date()).format('YYYY-MM-DD'),
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
     * @memberof InviteListComponent
     */
    patchPersonalDetails() {
        if (this.personalDetails.personalDetail != undefined) {
            this.personalDetails.personalDetail.nric = (this.personalDetails.personalDetail.nric).toString();
            this.personalDetails.personalDetail.dob = moment(this.birthOfDate.value).format('YYYY-MM-DD');
            this.personalDetails.personalDetail.gender = genderStatus[this.personalDetails.personalDetail.gender];
            this.personalDetails.personalDetail.maritalStatus = maritalStatus[this.personalDetails.personalDetail.maritalStatus];
            this.inviteAPI.patch_admin_personal_user_info(this.personalDetails.personalDetail, this.userId).subscribe(res => {
                this.personalDetails.personalDetail = res;
                this.getPersonalDetails();
                this.personalDetails.personalDetail.gender = genderStatus[this.personalDetails.personalDetail.gender];
                this.personalDetails.personalDetail.maritalStatus = maritalStatus[this.personalDetails.personalDetail.maritalStatus];
            });
        }
    }

    /**
     * patch employment details to endpoint
     * @memberof InviteListComponent
     */
    patchEmploymentDetails() {
        if (this.employmentDetails.employmentDetail != undefined) {
            this.employmentDetails.employmentDetail.employeeId = (this.employmentDetails.employmentDetail.employeeId).toString();
            this.employmentDetails.employmentDetail.incomeTaxNumber = (this.employmentDetails.employmentDetail.incomeTaxNumber).toString();
            this.employmentDetails.employmentDetail.dateOfJoin = moment(this.dateOfJoin.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.dateOfResign = moment(this.dateOfResign.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.dateOfConfirmation = moment(this.dateOfConfirm.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.bankAccountNumber = (this.employmentDetails.employmentDetail.bankAccountNumber).toString();
            this.inviteAPI.patch_admin_employment_user_info(this.employmentDetails.employmentDetail, this.userId).subscribe(resp => {
                this.employmentDetails.employmentDetail = resp;
                this.getEmploymentDetails();
            });
        }
    }

    /**
     * save assigned profile of calendar profile, working hour & user role
     * @memberof InviteListComponent
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
     * @memberof InviteListComponent
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
     * @memberof InviteListComponent
     */
    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.endPoint();
        } else {
            this.filter(text.srcElement.value);
        }
    }

    /**
     * close menu 
     * @param {*} event
     * @memberof InviteListComponent
     */
    eventOutput(event) {
        this.menu.close('addNewEmployeeDetails');
        this.inviteAPI.showSnackbar('New employee profiles was created successfully', true);
    }

    /**
     * manage employee status 
     * @param {string} employeeName
     * @param {string} id
     * @param {string} name
     * @memberof InviteListComponent
     */
    setUserStatus(employeeName: string, id: string, name: string) {
        const deleteDialog = this.popUp.open(DeleteListConfirmationComponent, {
            data: { name: employeeName, value: id, action: name }
        });
        deleteDialog.afterClosed().subscribe(result => {
            if (result === id && name == 'delete') {
                this.showSpinner = true;
                this.inviteAPI.delete_user(id).subscribe(response => {
                    this.endPoint();
                })
            }
            if (result && name == 'disable') {
                this.disableUser(employeeName, id);
            }
        });
    }

    /**
     * disable user and set expiration date 
     * @param {string} employeeName
     * @param {string} id
     * @memberof InviteListComponent
     */
    disableUser(employeeName: string, id: string) {
        const disableDialog = this.popUp.open(DateDialogComponent, {
            data: { name: employeeName, value: id, action: name }
        });
        disableDialog.afterClosed().subscribe(value => {
            if (value) {
                this.showSpinner = true;
                this.inviteAPI.disable_user({
                    "user_guid": id,
                    "resign_date": moment(value).format('YYYY-MM-DD'),
                }).subscribe(response => {
                    this.endPoint();
                })
            }
        })
    }

}
