import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.page.html',
    styleUrls: ['./personal-details.page.scss'],
})
export class PersonalDetailsPage implements OnInit {

    public personalDataList: any = {};
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public accessToken: any;


    get personalList() {
        return this.personalDataList;
    }

    constructor(private apiService: APIService) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            response => this.personalDataList = response.json()
        );
    }

    clickToHideHeader() {
        this.showHeader = false;
    }

    removeContact(index: number) {
        this.personalDataList.personalDetail.emergencyContactNumber.contacts.splice(index, 1);
    }



}
