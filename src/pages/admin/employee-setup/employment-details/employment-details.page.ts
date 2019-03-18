import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-employment-details',
    templateUrl: './employment-details.page.html',
    styleUrls: ['./employment-details.page.scss'],
})
export class EmploymentDetailsPage implements OnInit {
    public personalDataList: any;
    public showHeader: boolean = true;
    public progressPercentage: number = 80;

    get personalList() {
        return this.personalDataList;
    }

    constructor(private apiService: APIService) {
    }


    ngOnInit() {
        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this.personalDataList = data;
            }
        );
    }

    ionViewWillEnter() {
    }

    clickToHideHeader() {
        this.showHeader = false;
    }

}
