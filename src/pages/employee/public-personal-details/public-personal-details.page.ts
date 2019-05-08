import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-public-personal-details',
    templateUrl: './public-personal-details.page.html',
    styleUrls: ['./public-personal-details.page.scss'],
})
export class PublicPersonalDetailsPage implements OnInit {

    public list: any;
    public personalItem: any;
    public personalName: string;
    public setAsFavourite = [];
    public numOfArray: boolean = false;
    public showSpinner: boolean = true;
    private _guid: string;
    private _subscription: Subscription = new Subscription();

    get personalList() {
        return this.list;
    }

    constructor(private apiService: APIService, private route: ActivatedRoute,
        public router: Router) {
        route.queryParams
            .subscribe((params) => {
                this._guid = params.GUID;
                this._subscription = this.apiService.get_user_profile_details(this._guid).subscribe(
                    (data: any[]) => {
                        this.showSpinner = false;
                        this.list = data;
                    },
                    error => {
                        if (error.status === 401) {
                            window.location.href = '/login';
                        }
                    },
                );
            });
    }


    ngOnInit() {
        this._subscription = this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.personalItem = data;
                this.personalName = this.personalItem.employeeName;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }


    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else { this.numOfArray = true; }
        // this.numOfArray = true;
    };

}
