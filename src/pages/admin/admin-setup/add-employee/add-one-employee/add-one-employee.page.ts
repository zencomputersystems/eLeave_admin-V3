import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { APIService } from 'src/services/shared-service/api.service';
/**
 * Add One Employee Page
 * @export
 * @class AddOneEmployeePage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-add-one-employee',
    templateUrl: './add-one-employee.page.html',
    styleUrls: ['./add-one-employee.page.scss'],
})
export class AddOneEmployeePage implements OnInit {

    /**
     * get designation list from API
     * @type {*}
     * @memberof AddOneEmployeePage
     */
    public designationList: any;

    /**
     * form group for invitation
     * @type {FormGroup}
     * @memberof AddOneEmployeePage
     */
    public invitationForm;

    /**
     *Creates an instance of AddOneEmployeePage.
     * @param {APIService} apiService
     * @param {MatDialogRef<AddOneEmployeePage>} dialogAddOneEmployee
     * @memberof AddOneEmployeePage
     */
    constructor(private apiService: APIService, public dialogAddOneEmployee: MatDialogRef<AddOneEmployeePage>) {
        this.invitationForm = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            id: new FormControl('', Validators.required),
            firstPicker: new FormControl('', Validators.required),
            designation: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {
        this.apiService.get_master_list('designation').subscribe(list => this.designationList = list)
    }

    /**
     * Send invitation to employee
     * @memberof AddOneEmployeePage
     */
    sendInvitation() {
        console.log(this.invitationForm.value);
        this.dialogAddOneEmployee.close();
    }

}
