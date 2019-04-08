import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-employment-details',
    templateUrl: './employment-details.page.html',
    styleUrls: ['./employment-details.page.scss'],
})
export class EmploymentDetailsPage implements OnInit {
    public list: any;
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public userId: string;

    get personalList() {
        return this.list;
    }

    constructor(private apiService: APIService, private router: Router,
        private route: ActivatedRoute) {
    }


    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userId = params.id;
        });

        this.apiService.get_employment_details(this.userId).subscribe(
            data => {
                this.list = data;
            },
            error => {
                if (error) {
                    location.reload;
                    this.router.navigate(['/login']);
                }
            }
        )
    }

    clickToHideHeader() {
        this.showHeader = false;
    }

    /** will implement after edit profile UI ready */
    editDetails() {
        const data = {
            "id": this.list.id,
            "employeeNumber": this.list.employmentDetail.employeeNumber,
            "designation": this.list.employmentDetail.designation,
            "workLocation": this.list.employmentDetail.workLocation,
            "department": this.list.employmentDetail.department,
            "branch": "zz",
            "division": "xx",
            "reportingTo": this.list.employmentDetail.reportingTo,
            "employmentType": this.list.employmentDetail.employmentType,
            "employmentStatus": 0,
            "dateOfJoin": this.list.employmentDetail.dateOfJoin,
            "dateOfConfirmation": this.list.employmentDetail.dateOfConfirmation,
            "dateOfResign": this.list.employmentDetail.dateOfResign,
            "bankAccountName": this.list.employmentDetail.bankAccountName,
            "bankAccountNumber": this.list.employmentDetail.bankAccountNumber,
            "epfNumber": this.list.employmentDetail.epfNumber.toString(),
            "incomeTaxNumber": this.list.employmentDetail.incomeTaxNumber
        }

        this.apiService.patch_employment_details(data).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
                this.apiService.get_employment_details(this.userId).subscribe(
                    data => {
                        this.list = data;
                        console.log(this.list);
                    }
                )
            },
            response => {
                console.log("PATCH call in error", response);
            },
            () => {
                console.log("The PATCH observable is now completed.");
            });
    }

}
