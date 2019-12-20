import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from 'src/services/shared-service/api.service';
import { AdminInvitesApiService } from '../../admin-invites-api.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/admin-setup/leave-setup/date.adapter';
import { LeaveApiService } from 'src/app/admin-setup/leave-setup/leave-api.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

    /**
     * division form control 
     * @type {FormControl}
     * @memberof AddOneEmployeeComponent
     */
    public divisionCtrl: FormControl;

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
    constructor(private apiService: APIService, private adminInvite: AdminInvitesApiService, private leaveSetupService: LeaveApiService) {
        this.invitationForm = new FormGroup({
            company: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            // IC: new FormControl('', Validators.required),
            id: new FormControl('', Validators.required),
            joinDate: new FormControl('', Validators.required),
            // designation: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            // phone: new FormControl('', Validators.required),
        });
        this.branchCtrl = new FormControl({ value: '', disabled: true });
        this.divisionCtrl = new FormControl({ value: '', disabled: true });
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
                    map(branch => branch ? this.filterBranch(branch) : this.branchList.slice())
                );
        });
        this.apiService.get_master_list('section').subscribe(list => {
            this.sectionList = list;
            this.filteredSection = this.sectionCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(section => section ? this.filterSection(section) : this.sectionList.slice())
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
            this.toggleOnToOff(changes);
            if (changes.disabledEditMode.currentValue == false) {
                this.branchCtrl.enable();
                this.divisionCtrl.enable();
                this.sectionCtrl.enable();
                this.departmentCtrl.enable();
                this.costCentreCtrl.enable();
            }
        }
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
     * getChangeFormValue
     * Branch, division, section, department, costcentre
     * @param {SimpleChanges} changes
     * @memberof AddOneEmployeeComponent
     */
    toggleOnToOff(changes: SimpleChanges) {
        if (changes.disabledEditMode.currentValue == true && changes.disabledEditMode.previousValue == false) {
            const data = [];
            data.push(this.branchCtrl.value);
            data.push(this.divisionCtrl.value);
            data.push(this.sectionCtrl.value);
            data.push(this.departmentCtrl.value);
            data.push(this.costCentreCtrl.value);
            this.sendFormdata.emit(data);
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
                    map(department => department ? this.filterDepartment(department) : this.departmentList.slice())
                );
        });
        this.apiService.get_master_list('costcentre').subscribe(list => {
            this.costcentre = list;
            this.filteredCostCentre = this.costCentreCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(cc => cc ? this.filterCC(cc) : this.costcentre.slice())
                );
        });
    }


    /**
     * filter branch from the list
     * @param {string} name
     * @returns
     * @memberof AddOneEmployeeComponent
     */
    filterBranch(name: string) {
        let results = this.branchList.filter(state =>
            state.BRANCH.toLowerCase().indexOf(name.toLowerCase()) === 0);
        if (results.length < 1) {
            results = [{ 'BRANCH': this._question + name + '"?' }];
        }
        return results;
    }

    /**
     * filter section from the list
     * @param {string} name
     * @returns
     * @memberof AddOneEmployeeComponent
     */
    filterSection(name: string) {
        let results = this.sectionList.filter(state =>
            state.SECTION.toLowerCase().indexOf(name.toLowerCase()) === 0);
        if (results.length < 1) {
            results = [{ 'SECTION': this._question + name + '"?' }];
        }
        return results;
    }

    /**
     * filter department from the list
     * @param {string} name
     * @returns
     * @memberof AddOneEmployeeComponent
     */
    filterDepartment(name: string) {
        let results = this.departmentList.filter(state =>
            state.DEPARTMENT.toLowerCase().indexOf(name.toLowerCase()) === 0);
        if (results.length < 1) {
            results = [{ 'DEPARTMENT': this._question + name + '"?' }];
        }
        return results;
    }

    /**
     * filter cost centre from the list
     * @param {string} name
     * @returns
     * @memberof AddOneEmployeeComponent
     */
    filterCC(name: string) {
        let results = this.costcentre.filter(state =>
            state.COSTCENTRE.toLowerCase().indexOf(name.toLowerCase()) === 0);
        if (results.length < 1) {
            results = [{ 'COSTCENTRE': this._question + name + '"?' }];
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
            "DIVISION": this.divisionCtrl.value,
            "DEPARTMENT": this.departmentCtrl.value,
            "COST_CENTRE": this.costCentreCtrl.value,
            "JOIN_DATE": _moment(this.invitationForm.controls.joinDate.value).format('YYYY-MM-DD')
        }]
        this.adminInvite.post_userimport(data).subscribe(data => {
            this.showSmallSpinner = false;
            this.closeMenu.emit(true);
            // this.dialogAddOneEmployee.close();
        })

    }

}
