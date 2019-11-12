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
const moment = _moment;

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
     * side menu add individual details
     * @type {boolean}
     * @memberof AddOneEmployeeComponent
     */
    @Input() individual?: boolean;

    /**
     * emit changed employment value
     * @memberof AddOneEmployeeComponent
     */
    @Output() changedValue?= new EventEmitter();

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
            name: new FormControl('', Validators.required),
            IC: new FormControl('', Validators.required),
            id: new FormControl('', Validators.required),
            joinDate: new FormControl('', Validators.required),
            designation: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            phone: new FormControl('', Validators.required),
        });
        this.branchCtrl = new FormControl();
        this.divisionCtrl = new FormControl();
        this.sectionCtrl = new FormControl();
        this.departmentCtrl = new FormControl();
        this.costCentreCtrl = new FormControl();
    }

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
     * emit new value that changed
     * @param {SimpleChanges} changes
     * @memberof AddOneEmployeeComponent
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.disabledEditMode !== undefined) {
            if (changes.disabledEditMode.currentValue == true) {
                this.changedValue.emit(this.getDetails);
            }
        }
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

    /** option selected from branch
     * @param {*} option
     * @memberof AddOneEmployeeComponent
     */
    optionSelected(option) {
        if (option.value.indexOf(this._question) === 0) {
            let newState = option.value.substring(this._question.length).split('"?')[0];
            this.branchList.push({ 'BRANCH': newState });
            this.branchCtrl.setValue(newState);
        }
    }

    /**
     * option selected from section
     * @param {*} option
     * @memberof AddOneEmployeeComponent
     */
    optionSectionSelected(option) {
        console.log('optionSelected:', option.value);
        if (option.value.indexOf(this._question) === 0) {
            let newState = option.value.substring(this._question.length).split('"?')[0];
            this.sectionList.push({ 'SECTION': newState });
            this.sectionCtrl.setValue(newState);
        }
    }

    /**
     * option selected from department
     * @param {*} option
     * @memberof AddOneEmployeeComponent
     */
    optionDepartmentSelected(option) {
        console.log('optionSelected:', option.value);
        if (option.value.indexOf(this._question) === 0) {
            let newState = option.value.substring(this._question.length).split('"?')[0];
            this.departmentList.push({ 'DEPARTMENT': newState });
            this.departmentCtrl.setValue(newState);
        }
    }

    /**
     * option of cost centre selected
     * @param {*} option
     * @memberof AddOneEmployeeComponent
     */
    optionCCSelected(option) {
        console.log('optionSelected:', option.value);
        if (option.value.indexOf(this._question) === 0) {
            let newState = option.value.substring(this._question.length).split('"?')[0];
            this.costcentre.push({ 'COSTCENTRE': newState });
            this.costCentreCtrl.setValue(newState);
        }
    }

    /**
     * click enter to save the new branch value to list
     * @memberof AddOneEmployeeComponent
     */
    enter() {
        const value = this.branchCtrl.value;
        if (!this.branchList.some(entry => entry === value)) {
            this.branchList.push({ 'BRANCH': value });
        }
        setTimeout(() => this.branchCtrl.setValue(value));
    }

    /**
     *  click enter to save the new section value to list
     * @memberof AddOneEmployeeComponent
     */
    enterSection() {
        const value = this.sectionCtrl.value;
        if (!this.sectionList.some(entry => entry === value)) {
            this.sectionList.push({ 'SECTION': value });
        }
        setTimeout(() => this.sectionCtrl.setValue(value));
    }

    /**
     *  click enter to save the new department value to list
     * @memberof AddOneEmployeeComponent
     */
    enterDepartment() {
        const value = this.sectionCtrl.value;
        if (!this.departmentList.some(entry => entry === value)) {
            this.departmentList.push({ 'DEPARTMENT': value });
        }
        setTimeout(() => this.departmentCtrl.setValue(value));
    }

    /**
     * click enter to save the new cost centre value to list
     * @memberof AddOneEmployeeComponent
     */
    enterCC() {
        const value = this.costCentreCtrl.value;
        if (!this.costcentre.some(entry => entry === value)) {
            this.costcentre.push({ 'COSTCENTRE': value });
        }
        setTimeout(() => this.costCentreCtrl.setValue(value));
    }

    /**
     * Send invitation to employee
     * @memberof AddOneEmployeeComponent
     */
    sendInvitation() {
        this.showSmallSpinner = true;
        const data = [{
            "STAFF_EMAIL": this.invitationForm.controls.email.value,
            "STAFF_ID": this.invitationForm.controls.id.value,
            "FULLNAME": this.invitationForm.controls.name.value,
            "DESIGNATION": this.invitationForm.controls.designation.value,
            "JOIN_DATE": moment(this.invitationForm.controls.joinDate.value).format('YYYY-MM-DD')
        }]
        this.adminInvite.post_userimport(data).subscribe(data => {
            this.showSmallSpinner = false;
            // this.dialogAddOneEmployee.close();
        })

    }

}
