import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-employee-profile',
    templateUrl: './employee-profile.page.html',
    styleUrls: ['./employee-profile.page.scss'],
})
export class EmployeeProfilePage implements OnInit {

    public list: any;
    public userId: string;
    public employmentlist: any;
    public setAsFavourite = [];
    public numOfArray: boolean = false;
    private subscription: Subscription = new Subscription();

    get personalList() {
        return this.list;
    }
    get employmentPersonalList() {
        return this.employmentlist;
    }

    constructor(private apiService: APIService) {
    }

    ngOnInit() {
        this.subscription = this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.userId = this.list.id;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            },
            () => {
                const userId = this.list.id;
                this.subscription = this.apiService.get_employment_details(userId).subscribe(
                    data => {
                        this.employmentlist = data;
                    }
                )
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else {
            this.numOfArray = true;
        }
    };

}
