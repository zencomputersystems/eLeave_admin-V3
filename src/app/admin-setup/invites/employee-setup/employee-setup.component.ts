import { roleDetails } from './../../role-management/role-details-data';
import { WorkingHourApiService } from './../../leave-setup/working-hour/working-hour-api.service';
import { CalendarProfileApiService } from './../../leave-setup/calendar-profile/calendar-profile-api.service';
import { Component, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AdminInvitesApiService } from '../admin-invites-api.service';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { APP_DATE_FORMATS, AppDateAdapter } from '../../leave-setup/date.adapter';
import { RoleApiService } from '../../role-management/role-api.service';
import { ChangeStatusConfimationComponent } from './change-status-confimation/change-status-confimation.component';
import { DeleteCalendarConfirmationComponent } from '../../leave-setup/delete-calendar-confirmation/delete-calendar-confirmation.component';
import { personal, employment } from './employee-setup-data';
import { SharedService } from '../../leave-setup/shared.service';
import { getDataSet, reduce } from "iso3166-2-db";
import { EventInput } from '@fullcalendar/core';
import { PopoverController } from '@ionic/angular';
import { SideMenuNavigationComponent } from '../../../../../src/app/side-menu-navigation/side-menu-navigation.component';
const dayjs = require('dayjs');
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
     * The length of calendar profile list from API
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public lengthCalendarList: any;

    /**
     * working hour profile list from API
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public workingList: any;

    /**
     * The length of working hour profile list from API
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public lengthWorkingList: any;

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
     * get url of profile picture
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public url: any;

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
     * Track calendar input of add calendar form
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public newProfileName: any;

    /**
     * Track day selection
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public newDayControl: any;

    /**
     * Track selected country in selection form field
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public calCountry: any;

    /**
     * track region selection in form field
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public calRegion: any;

    /**
     * Public holiday list from API
     * @memberof EmployeeSetupComponent
     */
    public calCountryList;

    /**
     * World public holiday from database npm i
     * @memberof EmployeeSetupComponent
     */
    public countrydata;

    /**
     * Region list of selected country
     * @memberof EmployeeSetupComponent
     */
    public calCountryRegion;

    /**
     * Value of selected Country ISO
     * @memberof EmployeeSetupComponent
     */
    public calCountryIso;

    /**
     * Value of Region ISO from selected region/states
     * @memberof EmployeeSetupComponent
     */
    public calRegionISO;

    /**
     * Array list of Sunday - Saturday to show on select input
     * @type {string[]}
     * @memberof EmployeeSetupComponent
     */
    public calWeekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    /**
     * Selected day name array list 
     * @memberof EmployeeSetupComponent
     */
    public calRestDay = [];

    /**
     * Track year input form control
     * @memberof EmployeeSetupComponent
     */
    public calDefaultYear = new Date().getFullYear();

    /**
     * Property for alias Event Input of Full Calendar Component
     * @private
     * @type {EventInput[]}
     * @memberof EmployeeSetupComponent
     */
    private holidayEvents: EventInput[];


    /**
     * Array list for rest to patch to API
     * eg: { "fullname": "SATURDAY", "name": "SAT" }
     * @private
     * @memberof CalendarProfileComponent
     */
    private selectedWeekday = [];

    public displayWorkingHour: boolean;


    /**
     * form group use in validate value
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public workingHourForm: any;

    /**
     * get the full day start time in utc format
     * @private
     * @memberof WorkingHourComponent
     */
    private _startTime;

    /**
     * get the full day end time in utc format
     * @private
     * @memberof WorkingHourComponent
     */
    private _endTime;

    /**
     * show/hide toggle button in timepicker
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public meridian: boolean = true;

    /**
     * show/hide arrow up & down in timepicker toggle button
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public spinners: boolean = false;

    /**
     * show loading small spinner when clicked submit button
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * details from requested id
     * @private
     * @type {*}
     * @memberof WorkingHourComponent
     */
    private _data: any = {};

    /**
     * True/false to set default working hour profile
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public defaultWHProfile: boolean = true;

    /**
     * True/false to set default calendar profile
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public defaultCalendarProfile: boolean = true;

    /**
     * True/false to set default rolw profile
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public defaultRoleProfile: boolean = true;

    /**
     * emit value to hide this page after clicked back button
     * @memberof WorkingHourComponent
     */
    // @Output() valueChange = new EventEmitter();

    /**
     * Bind length of roleList
     * @type {*}
     * @memberof EmployeeSetupComponent
     */
    public roleListLength: any;


    public newRoleForm: any;

    /**
     * input is blur or is clicked of personal details
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public isBlur: boolean = false;

    /**
     * input is clicked of assign calendar, working
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public isBlurAssign: boolean = false;

    /**
     * input is clicked of role profile
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public isBlurRole: boolean = false;

    /**
     * 
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public isBlurEmployment: boolean = false;

    /**
     * recent id from selected user according user company
     * @type {string}
     * @memberof EmployeeSetupComponent
     */
    public recentId: any;

    /**
     * To show arrow up or down icon for Name column
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public arrowDownName: boolean = true;

    /**
     * To show arrow up or down icon for Id column
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public arrowDownId: boolean = true;

    /**
     * selection of items per page 
     * @type {number}
     * @memberof EmployeeSetupComponent
     */
    public itemsPerPage = '10';

    /**
     * check snackbar open or not
     * @type {boolean}
     * @memberof EmployeeSetupComponent
     */
    public open: boolean;

    /**
     *Creates an instance of EmployeeSetupComponent.
     * @param {AdminInvitesApiService} inviteAPI access invite API
     * @param {RoleApiService} roleAPI access role manegement api service
     * @param {SharedService} _sharedService
     * @memberof EmployeeSetupComponent
     */
    constructor(public inviteAPI: AdminInvitesApiService, public roleAPI: RoleApiService, private _sharedService: SharedService, private calendarProfileAPI: CalendarProfileApiService,
        public employeeSetupPopover: PopoverController, private workingHourAPI: WorkingHourApiService, private sideMenuComponent: SideMenuNavigationComponent) {
        this.inviteAPI.apiService.get_profile_pic('all').subscribe(data => {
            this.url = data;
        });

        this.workingHourForm = new FormGroup({
            profileName: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            startpicker: new FormControl('', Validators.required),
            endpicker: new FormControl('', Validators.required),
            starthalfdayAMpicker: new FormControl('', Validators.required),
            endhalfdayAMpicker: new FormControl('', Validators.required),
            starthalfdayPMpicker: new FormControl('', Validators.required),
            endhalfdayPMpicker: new FormControl('', Validators.required),
            startQ1picker: new FormControl('', Validators.required),
            endQ1picker: new FormControl('', Validators.required),
            startQ2picker: new FormControl('', Validators.required),
            endQ2picker: new FormControl('', Validators.required),
            startQ3picker: new FormControl('', Validators.required),
            endQ3picker: new FormControl('', Validators.required),
            startQ4picker: new FormControl('', Validators.required),
            endQ4picker: new FormControl('', Validators.required),
        });

        this.newRoleForm = new FormGroup({
            roleName: new FormControl('', Validators.required),
            roleDescription: new FormControl('', Validators.required),
        });
    }

    /**
     * initial method to get endpoint list
     * @memberof EmployeeSetupComponent
     */
    async ngOnInit() {
        this.countrydata = reduce(getDataSet(), "en");
        this.calCountryList = Object.keys(this.countrydata).map(key => this.countrydata[key]);
        this.calCountryList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.newDayControl = this.calCountry = this.calRegion = new FormControl('');
        this.newProfileName = new FormControl('', Validators.required);
        this.getListPublicHolidays();
        this.displayWorkingHour = true;
        this.endPoint();
        let defaultProfileList = await this.workingHourAPI.get_default_profile().toPromise();
        let roleData = await this.roleAPI.get_role_profile_list().toPromise();
        this.roleList = roleData;
        this.roleList.forEach(roleItem => {
            roleItem.isDefault = (roleItem.role_guid === defaultProfileList[0].ROLE_PROFILE_GUID) ? true : false;
        });
        this.roleListLength = this.roleList.length;
        let calendarData = await this.inviteAPI.get_calendar_profile_list().toPromise();
        this.calendarList = calendarData;
        this.calendarList.forEach(calItem => {
            calItem.isDefault = (calItem.calendar_guid === defaultProfileList[0].CALENDAR_PROFILE_GUID) ? true : false;
        });
        this.lengthCalendarList = this.calendarList.length;
        let workingData = await this.inviteAPI.get_working_hour_profile_list().toPromise();
        this.workingList = workingData;
        this.workingList.forEach(whItem => {
            whItem.isDefault = (whItem.working_hours_guid === defaultProfileList[0].WORKING_HOURS_PROFILE_GUID) ? true : false;
        });
        this.lengthWorkingList = this.workingList.length;
        let entitlement = await this._sharedService.leaveApi.get_leavetype_entitlement().toPromise();
        this.entitlementList = entitlement;
        let company = await this._sharedService.leaveApi.get_company_list().toPromise();
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
     * change profile picture 
     * @param {*} file
     * @memberof EmployeeSetupComponent
     */
    submitProfilePic(file: any) {
        const fileToUpload = file.item(0);
        let formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.inviteAPI.apiService.post_file(formData).subscribe(res => {
            const data = { "userGuid": this.personalDetails.userId, "profilePictureFile": res.filename };
            this.inviteAPI.apiService.post_profile_pic(data).subscribe(response => {
                this.inviteAPI.apiService.get_profile_pic('all').subscribe(data => {
                    this.url = data;
                })
            })
        });
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
            itemsPerPage: Number(this.itemsPerPage),
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
        this.isBlurEmployment = true;
        this.employmentDetails.employmentDetail.branch = event[0];
        this.employmentDetails.employmentDetail.section = event[1];
        this.employmentDetails.employmentDetail.department = event[2];
        this.employmentDetails.employmentDetail.costcentre = event[3];
        this.employmentDetails.employmentDetail.companyId = event[4];
    }

    /**
     * get clicked user id
     * @param {*} item
     * @param {number} index
     * @param {number} p
     * @memberof EmployeeSetupComponent
     */
    getUserId(item: any, index: number, p: number) {
        this.clickedIndex = ((p - 1) * Number(this.itemsPerPage)) + index;
        this.employeeStatus = item.status;
        if (this.employeeStatus == 'Active') {
            this.status = true;
        } else {
            this.status = false;
        }
        this.id = item.id;
        this.userId = item.userId;
        this.inviteAPI.get_recent_employee_id(item.companyId).subscribe(list => {
            this.recentId = list;
        })
        this.inviteAPI.apiService.get_profile_pic('all').subscribe(data => this.url = data);
        this.inviteAPI.get_admin_user_info('personal-details', this.id).subscribe(data => {
            this.personalDetails = data;
            this.getPersonalDetails();
        })
        this.inviteAPI.get_admin_user_info('employment-detail', this.id).subscribe(data => {
            this.employmentDetails = data;
            this.getEmploymentDetails();
        })
        this._sharedService.leaveApi.get_entilement_details(this.userId).subscribe(data => {
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
            if (this.personalDetails.personalDetail.dob !== '') {
                this.personalDetails.personalDetail.dob = dayjs(this.personalDetails.personalDetail.dob).format('DD-MM-YYYY');
            }
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
            this.employmentDetails.employmentDetail.dateOfJoin = dayjs(this.employmentDetails.employmentDetail.dateOfJoin).format('DD-MM-YYYY');
            this.dateOfConfirm = new FormControl((this.employmentDetails.employmentDetail.dateOfConfirmation), Validators.required);
            this.employmentDetails.employmentDetail.dateOfConfirmation = dayjs(this.employmentDetails.employmentDetail.dateOfConfirmation).format('DD-MM-YYYY');
            this.dateOfResignation = new FormControl((this.employmentDetails.employmentDetail.dateOfResignation), Validators.required);
            this.employmentDetails.employmentDetail.dateOfResignation = dayjs(this.employmentDetails.employmentDetail.dateOfResignation).format('DD-MM-YYYY');
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
        let res = await this._sharedService.leaveApi.post_leave_entitlement(data).toPromise();
        if (res.successList.length != 0) {
            let val = await this._sharedService.leaveApi.get_entilement_details(this.userId).toPromise();
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
        let response = await this.inviteAPI.delete_user_leave_entitlement(this.addEntitlement[index].userLeaveEntitlement).toPromise();
        if (response[0] != undefined) {
            if (response[0].USER_GUID != undefined) {
                this._sharedService.leaveApi.openSnackBar('Selected leave entitlement was deleted', true);
                this.addEntitlement.splice(index, 1);
            }
        } else {
            this._sharedService.leaveApi.openSnackBar('Leave entitlement was failed to delete', false);
        }
    }

    /**
     * toggle edit mode on/off
     * @param {*} evt
     * @memberof EmployeeSetupComponent
     */
    async toggleMode(evt) {
        if (evt.detail.checked === true) {
            this.mode = 'ON';
            this.modeValue = true;
            this.inviteAPI.popUp.open(EditModeDialogComponent, {
                disableClose: true,
                data: 'employee',
                height: "333.3px",
                width: "383px"
            });
            this.sideMenuComponent.collapseMenu();
        } else {
            this.mode = 'OFF';
            this.modeValue = false;
            if (this.showOthers == false && this.isBlur == true) {
                await this.patchPersonalDetails();
            }
            if (this.isBlurEmployment === true) {
                await this.patchEmploymentDetails();
            }
            if (this.isBlurAssign === true) {
                await this.assignProfile();
            }
            if (this.isBlurRole === true) {
                await this.assignRole();
            }
            await this.endPoint();
            if (this.open === true) {
                this._sharedService.leaveApi.snackBarRef.afterDismissed().subscribe(info => {
                    this._sharedService.leaveApi.openSnackBar('Edit mode disabled. Good job!', true);
                    this.open = null;
                });
            } else {
                this._sharedService.leaveApi.openSnackBar('Edit mode disabled. Good job!', true);
            }
        }
        this._sharedService.emitChange(this.mode);
    }

    /**
     * show alert on change tab
     * @memberof EmployeeSetupComponent
     */
    showOthersEvent() {
        if (this.modeValue === true) {
            if (this.showOthers === true) { alert("Please toggle OFF edit mode to save before view other tab. Else the changing will be discarded") }
        }
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
                disableClose: true,
                data: { name: name, status: 'Activate' },
                height: "285px",
                width: "360px"
            });
            let result = await dialog.afterClosed().toPromise();
            if (result === 'Activate') {
                this.employeeStatus = 'Active';
                this.status = true;
                try {
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
                    this._sharedService.leaveApi.openSnackBar(name + ' become Active', true);
                }
                catch (err) {
                    this._sharedService.leaveApi.openSnackBar(JSON.parse(err._body).message[0].constraints.isNotEmpty, false);
                }
            }
        } else {
            const dialog = this.inviteAPI.popUp.open(ChangeStatusConfimationComponent, {
                disableClose: true,
                data: { name: name, status: 'Deactivate', userId: userId },
                height: "395px",
                width: "395px"
            });
            let result = await dialog.afterClosed().toPromise();
            if (result === 'Deactivate') {
                let value = await this.inviteAPI.disable_user({
                    "user_guid": this.userId,
                    "resign_date": dayjs(new Date()).format('YYYY-MM-DD'),
                }).toPromise();
                if (value[0] != undefined) {
                    if (value[0].USER_GUID != undefined) {
                        this.employeeStatus = 'Inactive';
                        this.status = false;
                        let data = await this.inviteAPI.apiService.get_user_profile_list().toPromise();
                        this.list = data;
                        this._sharedService.leaveApi.openSnackBar(name + ' become Inactive', true);
                    }
                }
                else {
                    this._sharedService.leaveApi.openSnackBar(name + ' was failed to deactivate', false);
                }
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
            if (this.birthOfDate.value !== '') {
                this.personalDetails.personalDetail.dob = dayjs(this.birthOfDate.value).format('YYYY-MM-DD');
            }
            this.personalDetails.personalDetail.gender = this.personalDetails.personalDetail.gender;
            this.personalDetails.personalDetail.maritalStatus = this.personalDetails.personalDetail.maritalStatus;
            if (this.personalDetails.personalDetail.postcode !== '') {
                this.personalDetails.personalDetail.postcode = Number(this.personalDetails.personalDetail.postcode);
            } else {
                this.personalDetails.personalDetail.postcode = null;
            }
            try {
                let res = await this.inviteAPI.patch_admin_personal_user_info(this.personalDetails.personalDetail, this.id).toPromise();
                this.getPersonalDetails();
                this.isBlur = false;
            }
            catch (error) {
                this.open = true;
                this._sharedService.leaveApi.openSnackBar(JSON.parse(error._body).message[0].constraints.isNotEmpty, false);
            }
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
            this.employmentDetails.employmentDetail.dateOfJoin = dayjs(this.dateOfJoin.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.dateOfResignation = dayjs(this.dateOfResignation.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.dateOfConfirmation = dayjs(this.dateOfConfirm.value).format('YYYY-MM-DD');
            this.employmentDetails.employmentDetail.bankAccountNumber = (this.employmentDetails.employmentDetail.bankAccountNumber).toString();
            this.employmentDetails.employmentDetail.epfNumber = (this.employmentDetails.employmentDetail.epfNumber).toString();
            delete this.employmentDetails.employmentDetail["yearOfService"];
            // let resp = await this.inviteAPI.patch_admin_employment_user_info(this.employmentDetails.employmentDetail, this.id).toPromise();
            // this.employmentDetails.employmentDetail = resp;
            // this.getEmploymentDetails();
            // this.isBlurEmployment = false;
            // if (resp.message != undefined) {
            //     if (resp.message.statusCode === 400) {
            //         this._sharedService.leaveApi.openSnackBar(resp.message.message, false);
            //     }
            // }
            try {
                let resp = await this.inviteAPI.patch_admin_employment_user_info(this.employmentDetails.employmentDetail, this.id).toPromise();
                this.employmentDetails.employmentDetail = resp;
                this.getEmploymentDetails();
                this.isBlurEmployment = false;
            }
            catch (error) {
                this.open = true;
                this._sharedService.leaveApi.openSnackBar(JSON.parse(error._body).message[0].constraints.isNotEmpty, false);
            }
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
     * save assigned profile of calendar profile, working hour
     * @memberof EmployeeSetupComponent
     */
    async assignProfile() {
        try {
            let data = await this._sharedService.leaveApi.patch_assign_calendar_profile({
                "user_guid": [this.userId],
                "calendar_guid": this.calendarValue
            }).toPromise();
            if (data[0] == undefined) {
                this.open = true;
                this._sharedService.leaveApi.openSnackBar("Failed to assign calendar profile", false);
            }
        } catch (errResponse) {
            this.open = true;
            this._sharedService.leaveApi.openSnackBar("Failed to assign calendar profile", false);
        }
        try {
            let workingData = await this._sharedService.leaveApi.patch_user_working_hours({
                "user_guid": [this.userId],
                "working_hours_guid": this.workingValue
            }).toPromise();
            if (workingData[0] == undefined) {
                this.open = true;
                this._sharedService.leaveApi.openSnackBar("Failed to assign working hour profile", false);
            }
        } catch (err) {
            this.open = true;
            this._sharedService.leaveApi.openSnackBar("Failed to assign working hour profile", false);
        }
        this.isBlurAssign = false;
    }

    /**
     * save assigned profile of user role
     * @memberof EmployeeSetupComponent
     */
    async assignRole() {
        try {
            let roleData = await this.roleAPI.patch_user_profile({
                "user_guid": [this.userId],
                "role_guid": this.roleValue
            }).toPromise();
            if (roleData[0] == undefined) {
                this.open = true;
                this._sharedService.leaveApi.openSnackBar('Failed to assign employee role', false);
            }
        } catch (err) {
            this.open = true;
            this._sharedService.leaveApi.openSnackBar("Failed to assign employee role", false);
        }
        this.isBlurRole = false;
    }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof EmployeeSetupComponent
     */
    filter(text: any) {
        if (text && text.trim() != '') {
            let name = this.list.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            let id = this.list.filter((item: any) => {
                if (item.staffNumber != undefined) {
                    return (item.staffNumber.indexOf(text) > -1);
                }
            })
            this.list = require('lodash').uniqBy(name.concat(id), 'userId');
        }
    }

    /**
     * Sort Name column after clicked arrow up or down icon
     * @param {boolean} booleanValue
     * @param {number} ascValue
     * @param {number} desValue
     * @memberof EmployeeSetupComponent
     */
    sortName(booleanValue: boolean, ascValue: number, desValue: number) {
        this.arrowDownName = booleanValue;
        this.list = this.list.slice(0);
        this.list.sort(function (a, b) {
            var x = a.employeeName.toLowerCase();
            var y = b.employeeName.toLowerCase();
            return x < y ? ascValue : x > y ? desValue : 0;
        });
    }

    /**
     * Sort Id column after clicked arrow up or down icon
     * @param {boolean} value
     * @param {number} asc
     * @param {number} des
     * @memberof EmployeeSetupComponent
     */
    sortId(value: boolean, asc: number, des: number) {
        this.arrowDownId = value;
        this.list = this.list.slice(0);
        this.list.sort(function (a, b) {
            var x = a.staffNumber;
            var y = b.staffNumber;
            return x < y ? asc : x > y ? des : 0;
        });
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
            disableClose: true,
            data: { name: name, value: userId, desc: "'s employee profile" },
            height: "195px",
            width: "270px"
        });
        let val = await dialogRef.afterClosed().toPromise();
        if (val === userId) {
            let result = await this.inviteAPI.delete_user(userId).toPromise();
            if (result[0] != undefined) {
                if (result[0].USER_GUID != undefined) {
                    this._sharedService.leaveApi.openSnackBar('Selected employee profile was deleted', true);
                    this.endPoint();
                }
            } else {
                this._sharedService.leaveApi.openSnackBar('Failed to delete employee profile', false);
            }
        }
    }

    /**
     * Create a rest day array list
     * Check or uncheck weekday make changes in rest day array list
     * @param {string} day
     * @memberof CalendarProfileComponent 
     */
    selectRestDay(day: string) {
        if (this.isObjectExist(day, this.calRestDay) === false) {
            this.calRestDay.push(day);
        } else {
            const indexes: number = this.calRestDay.indexOf(day);
            this.calRestDay.splice(indexes, 1);
        }
    }
    /**
     * To check whether the object is exist in array or not
     * @param {*} obj
     * @param {*} array
     * @returns
     * @memberof CalendarProfileComponent
     */
    isObjectExist(obj: any, array: any) {
        for (let j = 0; j < array.length; j++) {
            if (array[j] === obj) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get public holiday list from calendarific
     * @memberof EmployeeSetupComponent
     */
    getListPublicHolidays() {
        this.calendarProfileAPI.get_public_holiday_list().subscribe(((data: any) => {
            this.holidayEvents = [];
            for (let i = 0; i < data.response.holidays.length; i++) {
                this.createListHoliday(data.response.holidays[i].date.iso, data.response.holidays[i].name, this.holidayEvents);
            }
        }))
    }

    /**
     * Push objects to array of event holidays
     * @param {string} dateIso
     * @param {string} name
     * @memberof CalendarProfileComponent
     */
    createListHoliday(dateIso: string, name: string, list: any) {
        list.push({
            "start": dayjs(dateIso).format('YYYY-MM-DD'),
            "end": dayjs(dateIso).format('YYYY-MM-DD'),
            "title": name,
            "holidayName": name,
            "day": this.getWeekofDay(new Date(dateIso)),
        });
    }

    /**
     * Method to get day of the week from a given date
     * @param {*} date
     * @returns
     * @memberof CalendarViewPage
     */
    getWeekofDay(date) {
        this.calWeekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        const day = date.getDay();
        return this.calWeekdays[day];
    }

    /**
     * Arrange object according body required of API 
     * POST / PATCH calendar profile
     * @param {*} holiday
     * @memberof CalendarProfileComponent
     */
    holidayObjectReformation(holiday) {
        for (let i = 0; i < this.holidayEvents.length; i++) {
            delete holiday[i].day;
        }
        for (let j = 0; j < this.calRestDay.length; j++) {
            let obj = {};
            obj["fullname"] = (this.calRestDay[j]).toUpperCase();
            obj["name"] = obj["fullname"].substring(0, 3);
            this.selectedWeekday.push(obj);
        }
    }

    /**
     * POST/create new calendar to endpoint API
     * @memberof EmployeeSetupComponent
     */
    postCreateCalendarProfile() {
        this.showSpinner = true;
        this.getListPublicHolidays();
        this.holidayObjectReformation(this.holidayEvents);
        const newCalProfile = {
            "code": this.newProfileName.value,
            "filter": {
                "year": this.calDefaultYear,
                "country": this.calCountryIso,
                "region": this.calRegionISO
            },
            "holiday": this.holidayEvents,
            "rest": this.selectedWeekday
        }
        this.calendarProfileAPI.post_calendar_profile(newCalProfile).subscribe(data => {
            if (data[0].CALENDAR_DETAILS_GUID != undefined) {
                this.workingHourAPI.post_profile_default('calendar', data[0].CALENDAR_GUID).subscribe(data => { })
                this.calendarProfileAPI.notification('New calendar profile was created successfully.', true);
                this.showSpinner = false;
                this.newProfileName.reset();
                this.calCountry.reset();
                this.calRegion.reset();
                this.calCountryIso = this.calRegionISO = '';
                this.calRestDay = this.selectedWeekday = [];
                this.newDayControl.reset();
            } else {
                this.calendarProfileAPI.notification("Failed to create new calendar profile", false);
                this.showSpinner = false;
            }
        }, catchErr => {
            this.calendarProfileAPI.notification(JSON.parse(catchErr._body).error, false);
            this.showSpinner = false;
        });

    }

    /**
      * full day on changed
      * @param {*} date
      * @param {string} name
      * @memberof WorkingHourComponent
      */
    onChange(date, name: string) {
        if (date !== null) {
            if (name == 'start') {
                let timeStart = this.timeReformat(date);
                this._startTime = dayjs.utc(timeStart, "HH:mm");
            } else {
                let timeEnd = this.timeReformat(date);
                this._endTime = dayjs.utc(timeEnd, "HH:mm");
            }
            this.esCalculateTime(this._startTime, this._endTime);
        }
    }

    /**
     * format time to default endpoint format
     * @param {*} value
     * @returns
     * @memberof WorkingHourComponent
     */
    timeReformat(value) {
        return value.hour + ":" + (value.minute < 10 ? '0' : '') + value.minute
    }

    /**
     * calculate time to fill up half day & quarter day time
     * @param {*} str
     * @param {*} end
     * @memberof WorkingHourComponent
     */
    esCalculateTime(str, end) {
        if ((str && end) != undefined) {
            const d = dayjs.duration(end.diff(str));
            const s = dayjs.utc(+d).format('H:mm');
            if (s == "9:00") {
                this.workingHourForm.patchValue(
                    {
                        starthalfdayAMpicker: this.splitTime(dayjs(str).format("HH:mm")),
                        endhalfdayAMpicker: this.splitTime(dayjs(str).add(4, 'hours').format("HH:mm")),
                        starthalfdayPMpicker: this.splitTime(dayjs(end).subtract(4, 'hours').format("HH:mm")),
                        endhalfdayPMpicker: this.splitTime(dayjs(end).format("HH:mm")),
                        startQ1picker: this.splitTime(dayjs(str).format("HH:mm")),
                        endQ1picker: this.splitTime(dayjs(str).add(2, 'hours').format("HH:mm")),
                        startQ2picker: this.splitTime(dayjs(str).add(2, 'hours').format("HH:mm")),
                        endQ2picker: this.splitTime(dayjs(str).add(4, 'hours').format("HH:mm")),
                        startQ3picker: this.splitTime(dayjs(end).subtract(4, 'hours').format("HH:mm")),
                        endQ3picker: this.splitTime(dayjs(end).subtract(2, 'hours').format("HH:mm")),
                        startQ4picker: this.splitTime(dayjs(end).subtract(2, 'hours').format("HH:mm")),
                        endQ4picker: this.splitTime(dayjs(end).format("HH:mm"))
                    });
            } else {
                this.workingHourForm.patchValue(
                    {
                        starthalfdayAMpicker: null,
                        endhalfdayAMpicker: null,
                        starthalfdayPMpicker: null,
                        endhalfdayPMpicker: null,
                        startQ1picker: null,
                        endQ1picker: null,
                        startQ2picker: null,
                        endQ2picker: null,
                        startQ3picker: null,
                        endQ3picker: null,
                        startQ4picker: null,
                        endQ4picker: null
                    });
            }
        }
    }

    /**
     * split original time format
     * @param {*} time
     * @returns
     * @memberof WorkingHourComponent
     */
    splitTime(time) {
        return {
            "hour": Number((time.split(':'))[0]), "minute": Number((time.split(':'))[1])
        }
    }

    /**
     * get data before send to endpoint
     * @memberof WorkingHourComponent
     */
    postWorkingHourSetup(evt) {
        this.showSmallSpinner = true;
        this._data.code = this.workingHourForm.controls.profileName.value;
        this._data.description = this.workingHourForm.controls.description.value;
        Object.assign(this._data, {
            property: {
                fullday: {
                    start_time: this.timeReformat(this.workingHourForm.controls.startpicker.value),
                    end_time: this.timeReformat(this.workingHourForm.controls.endpicker.value)
                },
                halfday: {
                    AM: {
                        start_time: this.timeReformat(this.workingHourForm.controls.starthalfdayAMpicker.value),
                        end_time: this.timeReformat(this.workingHourForm.controls.endhalfdayAMpicker.value)
                    },
                    PM: {
                        start_time: this.timeReformat(this.workingHourForm.controls.starthalfdayPMpicker.value),
                        end_time: this.timeReformat(this.workingHourForm.controls.endhalfdayPMpicker.value)
                    }
                },
                quarterday: {
                    Q1: {
                        start_time: this.timeReformat(this.workingHourForm.controls.startQ1picker.value),
                        end_time: this.timeReformat(this.workingHourForm.controls.endQ1picker.value)
                    },
                    Q2: {
                        start_time: this.timeReformat(this.workingHourForm.controls.startQ2picker.value),
                        end_time: this.timeReformat(this.workingHourForm.controls.endQ2picker.value)
                    },
                    Q3: {
                        start_time: this.timeReformat(this.workingHourForm.controls.startQ3picker.value),
                        end_time: this.timeReformat(this.workingHourForm.controls.endQ3picker.value)
                    },
                    Q4: {
                        start_time: this.timeReformat(this.workingHourForm.controls.startQ4picker.value),
                        end_time: this.timeReformat(this.workingHourForm.controls.endQ4picker.value)
                    }
                }
            }
        });
        Object.keys(this._data.property.halfday).map(ampm => {
            Object.keys(this._data.property.halfday[ampm]).map(startend => {
                this._data.property.halfday[ampm][startend] = this._data.property.halfday[ampm][startend];
            })
        });
        Object.keys(this._data.property.quarterday).map(objKey => {
            Object.keys(this._data.property.quarterday[objKey]).map(endstart => {
                this._data.property.quarterday[objKey][endstart] = this._data.property.quarterday[objKey][endstart];
            })
        });
        this.esPatchWorkingHourSetup(this._data);
    }

    /**
     * update or create data of working hour profile
     * @param {*} body
     * @memberof WorkingHourComponent
     */
    esPatchWorkingHourSetup(body: any) {
        this.workingHourAPI.post_working_hours(body).subscribe(response => {
            if (response[0] != undefined) {
                this.workingHourAPI.post_profile_default('working-hour', response[0].WORKING_HOURS_GUID).subscribe(data => { })
                this.workingHourAPI.showPopUp('New working hour profile was created successfully', true);
                // this.esRefreshProfile(response[0].WORKING_HOURS_GUID);
            } else {
                this.workingHourAPI.showPopUp('Failed to create new working hour profile', false);
            }
            this.showSmallSpinner = false;
        }, err => {
            this.workingHourAPI.showPopUp(JSON.parse(err._body).statusText, false);
        })
    }


    /**
     * refresh saved data by sending back the editted working hour id 
     * @param {string} id
     * @memberof WorkingHourComponent
     */
    // esRefreshProfile(id: string) {
    //     this.valueChange.emit(id);
    // }

    /**
     * Event for checkbox to set default working hour profile
     * @param {*} evt
     * @memberof EmployeeSetupComponent
     */
    // setDefaultProfile(evt, type) {
    //     (type === 'working-hour') ?
    //         this.defaultWHProfile = evt.target.checked :
    //         (type === 'role') ?
    //             this.defaultRoleProfile = evt.target.checked :
    //             this.defaultCalendarProfile = evt.target.checked;
    // }

    /**
     * Create new role profile
     * @memberof EmployeeSetupComponent
     */
    createNewRole() {
        let newRoleDetails;
        newRoleDetails = roleDetails;
        newRoleDetails.code = this.newRoleForm.controls.roleName.value;
        newRoleDetails.description = this.newRoleForm.controls.roleDescription.value;
        this.roleAPI.post_role_profile(newRoleDetails).subscribe(ret => {
            if (ret[0].ROLE_GUID != undefined) {
                this.roleAPI.snackbarMsg('New role profile was created successfully', true);
                this.workingHourAPI.post_profile_default('role', ret[0].ROLE_GUID).subscribe(data => { })
            } else {
                this.roleAPI.snackbarMsg(ret.status, false);
            }
            this.showSmallSpinner = false;
            this.roleAPI.get_role_profile_list().subscribe(data => this.roleList = data);
        });
    }
}
