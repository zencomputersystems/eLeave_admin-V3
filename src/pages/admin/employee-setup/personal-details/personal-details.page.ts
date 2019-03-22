export enum genderStatus {
    "Female",
    "Male"
}

export enum maritalStatus {
    "Single",
    "Married"
}

import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.page.html',
    styleUrls: ['./personal-details.page.scss'],
})
export class PersonalDetailsPage implements OnInit {

    public list: any;
    public removeList: any;
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public accessToken: any;
    private datatoUpdate;
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
            response => {
                this.router.navigate(['login']);
            }
        );
    }

    clickToHideHeader() {
        this.showHeader = false;
    }

    removeContact(index: number) {
        this.list.personalDetail.emergencyContactNumber.contacts.splice(index, 1);
    }

    /** will implement after edit profile UI ready */
    editProfileData() {
        this.datatoUpdate = {
            "id": this.list.id,
            "nickname": "Wantan",
            "nric": "44",
            "dob": this.list.personalDetail.dob,
            "gender": genderStatus[this.list.personalDetail.gender],
            "maritalStatus": maritalStatus[this.list.personalDetail.maritalStatus],
            "race": this.list.personalDetail.race,
            "religion": this.list.personalDetail.religion,
            "nationality": this.list.personalDetail.nationality,
            "phoneNumber": this.list.personalDetail.phoneNumber.toString(),
            "workPhoneNumber": this.list.personalDetail.workPhoneNumber.toString(),
            "emailAddress": this.list.personalDetail.emailAddress,
            "workEmailAddress": this.list.personalDetail.workEmailAddress,
            "address1": "this is address 1",
            "address2": "this is address 3",
            "postcode": "44444",
            "city": "Rawang",
            "state": "Kuala Lumpur",
            "country": "Indonesian",
            "emergencyContact": {
                "contacts": [
                    {
                        "contactName": "Contact 1",
                        "contactNumber": "09876543"
                    },
                    {
                        "contactName": "Contact 2",
                        "contactNumber": "87657654"
                    }
                ]
            },
            "education": {
                "educationDetail": [
                    {
                        "qualificationLevel": "Matriculation",
                        "major": "Life Science",
                        "university": "KMNS",
                        "year": "2007-2008"
                    },
                    {
                        "qualificationLevel": "Bachelor Degree",
                        "major": "Biotechnology",
                        "university": "UKM",
                        "year": "2008-2011"
                    }
                ]
            },
            "family": {
                "spouse": [
                    {
                        "spouseName": "My Spouse Name",
                        "spouseIdentificationNumber": "kjhgf876543hgf"
                    }
                ],
                "child": [
                    {
                        "childName": "this is child Name",
                        "childIdentificationNumber": "HGF654GHJ"
                    },
                    {
                        "childName": "this is child 2 name",
                        "childIdentificationNumber": "789GBNM789"
                    }
                ]
            }
        };

        this.apiService.patch_personal_details(this.datatoUpdate).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
                this.apiService.get_personal_details().subscribe(
                    (data: any[]) => {
                        this.list = data;
                        console.log(this.list);
                    }
                );
            },
            response => {
                console.log("PATCH call in error", response);
            },
            () => {
                console.log("The PATCH observable is now completed.");
            });
    }


}
