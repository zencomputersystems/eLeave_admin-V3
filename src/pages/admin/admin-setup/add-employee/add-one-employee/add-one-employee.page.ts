import { Component, OnInit } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-one-employee',
    templateUrl: './add-one-employee.page.html',
    styleUrls: ['./add-one-employee.page.scss'],
})
export class AddOneEmployeePage implements OnInit {

    public designationList: any;
    public invitationForm: FormGroup;

    constructor(private http: Http, public dialogAddOneEmployee: MatDialogRef<AddOneEmployeePage>,) {

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

    sendInvitation(){
        console.log(this.invitationForm.value);
        this.dialogAddOneEmployee.close();
    }

}
