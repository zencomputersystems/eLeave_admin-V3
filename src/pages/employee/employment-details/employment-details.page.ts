export enum employeeStatus {
    "Probation",
    "Confirmed",
    "Terminated"
}

import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-employment-details',
    templateUrl: './employment-details.page.html',
    styleUrls: ['./employment-details.page.scss'],
})
export class EmploymentDetailsPage implements OnInit {
    public list: any;
    public status: string;
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public userId: string;
    public showSpinner: boolean = true;

    get personalList() {
        return this.list;
    }

    constructor(private apiService: APIService,
        private route: ActivatedRoute) {
    }


    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userId = params.id;
        });

        this.apiService.get_employment_details(this.userId).subscribe(
            data => {
                this.list = data;
                this.status = employeeStatus[this.list.employmentDetail.employmentStatus];
                this.showSpinner = false;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        )
    }

    clickToHideHeader() {
        this.showHeader = false;
    }

}
