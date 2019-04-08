import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

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

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.removeList = this.list.personalDetail.emergencyContactNumber.contacts;
            },
            error => {
                if (error) {
                    location.reload;
                    this.router.navigate(['/login']);
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
