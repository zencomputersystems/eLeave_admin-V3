import { Component, OnInit } from '@angular/core';
import { PersonalDetailsService } from 'src/services/employee-setup/personal-details.service.';

@Component({
    selector: 'app-employment-details',
    templateUrl: './employment-details.page.html',
    styleUrls: ['./employment-details.page.scss'],
})
export class EmploymentDetailsPage implements OnInit {
    public list: any;
    public personalDataList: any;
    showHeader: boolean = true;
    progressPercentage: number = 80;

    constructor(private _personalDetailsService: PersonalDetailsService) { }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this._personalDetailsService.getPersonalDetailsList()
            .subscribe(() => {
                this.list = this._personalDetailsService.personalData;
                // this.personalDataList = this._personalDetailsService.personalData;
                this.personalDataList = this.list.source.value;
                for (let i = 0; i < this.personalDataList.length; i++) {
                    const a = this.personalDataList[i];
                }
            });
    }

    clickToHideHeader() {
        this.showHeader = false;
    }

}
