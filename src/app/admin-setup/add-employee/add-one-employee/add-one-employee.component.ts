import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { APIService } from 'src/services/shared-service/api.service';
import { AdminInvitesApiService } from '../../invites/admin-invites-api.service';
import * as _moment from 'moment';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../leave-setup/date.adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
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
     * get designation list from API
     * @type {*}
     * @memberof AddOneEmployeeComponent
     */
    public designationList: any;

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
     *Creates an instance of AddOneEmployeeComponent.
     * @param {APIService} apiService
     * @param {MatDialogRef<AddOneEmployeeComponent>} dialogAddOneEmployee
     * @param {AdminInvitesApiService} adminInvite
     * @memberof AddOneEmployeeComponent
     */
    constructor(private apiService: APIService, public dialogAddOneEmployee: MatDialogRef<AddOneEmployeeComponent>, private adminInvite: AdminInvitesApiService) {
        this.invitationForm = new FormGroup({
            name: new FormControl('', Validators.required),
            IC: new FormControl('', Validators.required),
            id: new FormControl('', Validators.required),
            joinDate: new FormControl('', Validators.required),
            designation: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            phone: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {
        this.apiService.get_master_list('designation').subscribe(list => this.designationList = list)
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
            this.dialogAddOneEmployee.close();
        })

    }

}
