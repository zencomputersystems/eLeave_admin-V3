import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

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

    // public removeList: any;
    // public showHeader: boolean = true;
    // public progressPercentage: number = 80;

    get personalList() {
        return this.list;
    }
    get employmentPersonalList() {
        return this.employmentlist;
    }

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                console.log(this.list);
                // this.removeList = this.list.personalDetail.emergencyContactNumber.contacts;
            },
            response => {
                this.router.navigate(['login']);
            }
        );
        setTimeout(() => {
            const userId = this.list.id;
            this.apiService.get_employment_details(userId).subscribe(
                data => {
                    this.employmentlist = data;
                    console.log('employ:', this.employmentlist);
                }
            )
        }, 1000);

    }

    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else { this.numOfArray = true; }
        // this.numOfArray = true;
    };


}
