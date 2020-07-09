import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from '../../../../../../src/services/shared-service/api.service';
import { AdminInvitesApiService } from '../../admin-invites-api.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../../src/app/admin-setup/leave-setup/date.adapter';
import { LeaveApiService } from '../../../../../../src/app/admin-setup/leave-setup/leave-api.service';
import { startWith, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

const configPatch = require("./parseDataFormat.json");

/**
 * Add One Employee Page
 * @export
 * @class AddOneEmployeeComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-add-one-employee',
    templateUrl: './add-one-employee.component.html',
    styleUrls: ['./add-one-employee.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class AddOneEmployeeComponent implements OnInit {

    /**
     * disabled button
     * @type {boolean}
     * @memberof AddOneEmployeeComponent
     */
    @Input() disabledEditMode?: boolean;

    /**
     * get employment details
     * @type {*}
     * @memberof AddOneEmployeeComponent
     */
    @Input() getDetails?: any;

    /**
     * emit employement details
     * @memberof AddOneEmployeeComponent
     */
    @Output() sendFormdata?= new EventEmitter();

    /**
     * close menu after add one user
     * @memberof AddOneEmployeeComponent
     */
    @Output() closeMenu = new EventEmitter();


    /**
     * side menu add individual details
     * @type {boolean}
     * @memberof AddOneEmployeeComponent
     */
    @Input() individual?: boolean;

    /**
     * form group for invitation
     * @type {FormGroup}
     * @memberof AddOneEmployeeComponent
     */
    public invitationForm;

    /**
     * show spinner during loading
     * @type {boolean}
     * @memberof AddOneEmployeeComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * company list from endpoint
     * @type {*}
     * @memberof AddOneEmployeeComponent
     */
    public companyList: any;

    /**
     * branch list from endpoint
     * @type {*}
     * @memberof AddOneEmployeeComponent
     */
    public branchList: any;

    /**
     * division list from endpoint
     * @type {*}
     * @memberof AddOneEmployeeComponent
     */
    public divisionList: any;

    /**
     * section list from endpoint
     * @type {*}
     * @memberof AddOneEmployeeComponent
     */
    public sectionList: any;

    /**
     * department list from endpoint
     * @type {*}
     * @memberof AddOneEmployeeComponent
     */
    public departmentList: any;

    /**
     * cost centre list from endpoint
     * @type {*}
     * @memberof AddOneEmployeeComponent
     */
    public costcentre: any;

    /**
     * form control of branch
     * @type {FormControl}
     * @memberof AddOneEmployeeComponent
     */
    public branchCtrl: FormControl;

    // /**
    //  * division form control 
    //  * @type {FormControl}
    //  * @memberof AddOneEmployeeComponent
    //  */
    // public divisionCtrl: FormControl;

    /**
     * section form control
     * @type {FormControl}
     * @memberof AddOneEmployeeComponent
     */
    public sectionCtrl: FormControl;

    /**
     * department form control
     * @type {FormControl}
     * @memberof AddOneEmployeeComponent
     */
    public departmentCtrl: FormControl;

    /**
     * cost centre form control
     * @type {FormControl}
     * @memberof AddOneEmployeeComponent
     */
    public costCentreCtrl: FormControl;

    /**
     * filtered branch list
     * @type {Observable<any[]>}
     * @memberof AddOneEmployeeComponent
     */
    public filteredBranch: Observable<any[]>;

    /**
     * filtered division list
     * @type {Observable<any[]>}
     * @memberof AddOneEmployeeComponent
     */
    public filteredDivision: Observable<any[]>;

    /**
     * filtered section list
     * @type {Observable<any[]>}
     * @memberof AddOneEmployeeComponent
     */
    public filteredSection: Observable<any[]>;

    /**
     * filtered department list
     * @type {Observable<any[]>}
     * @memberof AddOneEmployeeComponent
     */
    public filteredDepartment: Observable<any[]>;

    /**
     * filtered cost centre list
     * @type {Observable<any[]>}
     * @memberof AddOneEmployeeComponent
     */
    public filteredCostCentre: Observable<any[]>;

    /**
     * latest employee id from selected company
     * @type {string}
     * @memberof AddOneEmployeeComponent
     */
    public latestId: string;

    /**
     * create new option
     * @private
     * @memberof AddOneEmployeeComponent
     */
    private _question = 'Would you like to add "';

    /**
     *Creates an instance of AddOneEmployeeComponent.
     * @param {APIService} apiService
     * @param {AdminInvitesApiService} adminInvite
     * @memberof AddOneEmployeeComponent
     */
    constructor(private apiService: APIService, private adminInvite: AdminInvitesApiService,
        private leaveSetupService: LeaveApiService) {
        this.invitationForm = new FormGroup({
            company: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            id: new FormControl('', Validators.required),
            joinDate: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
        });
        this.branchCtrl = new FormControl({ value: '', disabled: true });
        // this.divisionCtrl = new FormControl({ value: '', disabled: true });
        this.sectionCtrl = new FormControl({ value: '', disabled: true });
        this.departmentCtrl = new FormControl({ value: '', disabled: true });
        this.costCentreCtrl = new FormControl({ value: '', disabled: true });
    }

    /**
     * get list from endpoint and set form control
     * @memberof AddOneEmployeeComponent
     */
    ngOnInit() {
        this.leaveSetupService.get_company_list().subscribe(list => this.companyList = list);
        this.apiService.get_master_list('branch').subscribe(list => {
            this.branchList = list;
            this.filteredBranch = this.branchCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(branch => branch ? this.filterList(branch, this.branchList) : this.branchList.slice())
                );
        });
        this.apiService.get_master_list('section').subscribe(list => {
            this.sectionList = list;
            this.filteredSection = this.sectionCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(section => section ? this.filterList(section, this.sectionList) : this.sectionList.slice())
                );
        });
        this.getValue();
    }

    /**
     * emit new value that changed
     * @param {SimpleChanges} changes
     * @memberof AddOneEmployeeComponent
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.disabledEditMode !== undefined) {
            if (changes.disabledEditMode.currentValue == false) {
                this.branchCtrl.enable();
                // this.divisionCtrl.enable();
                this.sectionCtrl.enable();
                this.departmentCtrl.enable();
                this.costCentreCtrl.enable();
            }
        }
        this.detailsChanges(changes);
    }

    /**
     * get selected compnay's latest employee id
     * @param {string} companyId
     * @memberof AddOneEmployeeComponent
     */
    getRecentId(companyId: string) {
        this.adminInvite.get_recent_employee_id(companyId).subscribe(item => {
            this.latestId = item;
        })
    }

    /**
     * changes of details
     * @param {*} changes
     * @memberof AddOneEmployeeComponent
     */
    detailsChanges(changes) {
        if (changes.getDetails) {
            if (this.getDetails.employmentDetail != undefined) {
                this.branchCtrl.patchValue(this.getDetails.employmentDetail.branch);
                this.sectionCtrl.patchValue(this.getDetails.employmentDetail.section);
                this.departmentCtrl.patchValue(this.getDetails.employmentDetail.department);
                this.costCentreCtrl.patchValue(this.getDetails.employmentDetail.costcentre);
            }
        }
    }

    /**
     * get list from master 'department' & 'costcentre'
     * @memberof AddOneEmployeeComponent
     */
    getValue() {
        this.apiService.get_master_list('department').subscribe(list => {
            this.departmentList = list;
            this.filteredDepartment = this.departmentCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(department => department ? this.filterList(department, this.departmentList) : this.departmentList.slice())
                );
        });
        this.apiService.get_master_list('costcentre').subscribe(list => {
            this.costcentre = list;
            this.filteredCostCentre = this.costCentreCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(cc => cc ? this.filterList(cc, this.costcentre) : this.costcentre.slice())
                );
        });
    }


    /**
     * filter (branch,section, costcentre, department) from the list
     * @param {string} name
     * @returns
     * @memberof AddOneEmployeeComponent
     */
    filterList(name: string, list: any) {
        let results = list.filter(state =>
            state[Object.keys(state)[0]].toLowerCase().indexOf(name.toLowerCase()) === 0);
        if (results.length < 1) {
            results = [{ [Object.keys(list[0])[0]]: this._question + name + '"?' }];
        }
        return results;
    }

    /** option selected from autocomplete
     * @param {*} option
     * @memberof AddOneEmployeeComponent
     */
    optionSelected(option, list, control) {
        if (option.value.indexOf(this._question) === 0) {
            let newState = option.value.substring(this._question.length).split('"?')[0];
            const key = Object.keys(list[0])[0];
            list.push({ [key]: newState });
            control.setValue(newState);
        }
        this.sendFormdata.emit([this.branchCtrl.value, this.sectionCtrl.value, this.departmentCtrl.value, this.costCentreCtrl.value]);
    }

    /**
     * click enter to save the new autocomplete value to list
     * @memberof AddOneEmployeeComponent
     */
    enter(control, list) {
        const value = control.value;
        if (!list.some(entry => entry === value)) {
            const key = Object.keys(list[0])[0];
            list.push({ [key]: value });
        }
        setTimeout(() => control.setValue(value));
        this.sendFormdata.emit([this.branchCtrl.value, this.sectionCtrl.value, this.departmentCtrl.value, this.costCentreCtrl.value]);
    }

    /**
     * Send invitation to employee
     * @memberof AddOneEmployeeComponent
     */
    sendInvitation() {
        this.showSmallSpinner = true;
        const data = [{
            "COMPANY": this.invitationForm.controls.company.value,
            "STAFF_EMAIL": this.invitationForm.controls.email.value,
            "STAFF_ID": this.invitationForm.controls.id.value,
            "FULLNAME": this.invitationForm.controls.name.value,
            "BRANCH": this.branchCtrl.value,
            "SECTION": this.sectionCtrl.value,
            // "DIVISION": this.divisionCtrl.value,
            "DEPARTMENT": this.departmentCtrl.value,
            "COST_CENTRE": this.costCentreCtrl.value,
            "JOIN_DATE": _moment(this.invitationForm.controls.joinDate.value).format('YYYY-MM-DD')
        }]
        this.create_user(data);
    }

    /**
     * post new user
     * @param {*} data
     * @memberof AddOneEmployeeComponent
     */
    async create_user(data) {
        this.adminInvite.post_userimport(data).subscribe(result => {
            this.showSmallSpinner = false;
            this.closeMenu.emit(true);
            for (let i = 0; i < result.length; i++) {
                if (result[i].data.length != 0 && result[i].category == 'Success') {
                    this.checkInfo(data);
                    this.leaveSetupService.openSnackBar('New employee profile was created successfully', true)
                    this.invitationForm.reset();
                    this.branchCtrl.reset();
                    // this.divisionCtrl.reset();
                    this.departmentCtrl.reset();
                    this.costCentreCtrl.reset();
                } if (result[i].data.length != 0 && result[i].category != 'Success') {
                    this.leaveSetupService.openSnackBar(result[i].message, false);
                }
            }
        }, error => {
            this.showSmallSpinner = false;
            this.leaveSetupService.openSnackBar(error.statusText, false);
        })
    }

    /**
     * To update newly created employee with standard form format
     * @param {*} newEmp New employee data
     * @memberof AddOneEmployeeComponent
     */
    async checkInfo(newEmp) {
        let empData;
        const empList = await this.adminInvite.apiService.get_user_profile_list().toPromise();
        newEmp.forEach(newEmpElement => {
            empData = empList.filter(empListItem => {
                if (empListItem.email === newEmpElement.STAFF_EMAIL) {
                    let compInfo = this.companyList.filter(compData => {
                        if (compData.NAME === newEmpElement.COMPANY) {
                            return compData;
                        }
                    })
                    empListItem.companyId = compInfo[0].TENANT_COMPANY_GUID;
                    empListItem.companyName = compInfo[0].NAME;
                    empListItem.joinDate = newEmpElement.JOIN_DATE;
                    empListItem.section = newEmpElement.SECTION;
                    configPatch.root.employmentDetail.employeeId = empListItem.staffNumber;
                    configPatch.root.employmentDetail.companyId = empListItem.companyId;
                    configPatch.root.employmentDetail.department = empListItem.department;
                    configPatch.root.employmentDetail.section = empListItem.section;
                    configPatch.root.employmentDetail.branch = empListItem.branch;
                    configPatch.root.employmentDetail.costcentre = empListItem.costcentre;
                    configPatch.root.employmentDetail.dateOfJoin = empListItem.joinDate;
                    configPatch.root.employmentDetail.section = empListItem.section;
                    configPatch.root.personalDetails.fullname = empListItem.employeeName;
                    configPatch.root.personalDetails.workEmailAddress = empListItem.email;
                    this.adminInvite.patch_admin_all_user_info(configPatch, empListItem.id).subscribe(ret => { });
                }
            })
        });
    }

}

