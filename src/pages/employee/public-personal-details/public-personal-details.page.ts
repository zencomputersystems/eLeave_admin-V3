import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-public-personal-details',
    templateUrl: './public-personal-details.page.html',
    styleUrls: ['./public-personal-details.page.scss'],
})
export class PublicPersonalDetailsPage implements OnInit {

    public list: any;
    public employmentlist: any;
    public setAsFavourite = [];
    public numOfArray: boolean = false;
    public showSpinner: boolean = true;

    // public removeList: any;
    // public showHeader: boolean = true;
    // public progressPercentage: number = 80;

    get personalList() {
        return this.list;
    }
    get employmentPersonalList() {
        return this.employmentlist;
    }

    constructor(private apiService: APIService) {
    }


    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                // this.removeList = this.list.personalDetail.emergencyContactNumber.contacts;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            },
            () => {
                const userId = this.list.id;
                this.apiService.get_employment_details(userId).subscribe(
                    data => {
                        this.showSpinner = false;
                        this.employmentlist = data;
                    }
                )

            }
        );


    }


    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else { this.numOfArray = true; }
        // this.numOfArray = true;
    };


}
