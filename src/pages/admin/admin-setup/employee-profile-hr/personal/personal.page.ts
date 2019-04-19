import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-personal',
    templateUrl: './personal.page.html',
    styleUrls: ['./personal.page.scss'],
})
export class PersonalPage implements OnInit {

    public list: any;
    public removeList: any;
    public numOfArray: boolean = false;

    get personalList() {
        return this.list;
    }

    constructor(private apiService: APIService) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.removeList = this.list.personalDetail.emergencyContactNumber.contacts;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    removeContact(index: number) {
        this.list.personalDetail.emergencyContactNumber.contacts.splice(index, 1);
    }

    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else {
            this.numOfArray = true;
        }
    };


}
