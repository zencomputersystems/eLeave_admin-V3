import { Component, OnInit } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
     * @param {Http} http
     * @param {MatDialogRef<AddOneEmployeePage>} dialogAddOneEmployee
     * @memberof AddOneEmployeePage
     */
    constructor(private http: Http, public dialogAddOneEmployee: MatDialogRef<AddOneEmployeePage>) {
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
        const header = new Headers();
        header.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        const options = new RequestOptions({ headers: header });
        return new Promise((resolve) => {
            this.http.get('http://zencore.zen.com.my:3000/api/designation', options)
                .pipe(map((response) => {
                    return response;
                })).subscribe(
                    (response) => {
                        resolve(response.json());
                        this.designationList = response.json();
                    },
                    (err) => {
                        if (err.status === 401) {
                            window.location.href = '/login';
                        }
                    }
                )
        })

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
