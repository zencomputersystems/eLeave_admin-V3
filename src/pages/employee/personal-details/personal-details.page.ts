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
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
const moment = _moment;

@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.page.html',
    styleUrls: ['./personal-details.page.scss']
})
export class PersonalDetailsPage implements OnInit {

    public list: any;
    public removeList: any;
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public accessToken: any;
    public showEditProfile: boolean = false;
    public showEditContact: boolean = false;
    public selectedGender: string;
    public selectedMaritalStatus: string;
    public selectedAddress: string;
    public raceValue: string;
    public religionValue: string;
    public nationalityValue: string;
    public phoneNum: string;
    public workPhoneNum: string;
    public nric: string;
    public firstEmailAdd: string;
    public secondEmailAdd: string;
    public addLine1: string;
    public addLine2: string;
    public postcode: string;
    public city: string;
    public state: string;
    public country: string;
    private _datatoUpdate: any;
    private _date: FormGroup;
    private _reformatDate: string;
    // private date = new Date((new Date().getTime() - 3888000000));
    get personalList() {
        return this.list;
    }
    get dateForm(): FormGroup {
        return this._date;
    }

    constructor(private apiService: APIService,
        private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.removeList = this.list.personalDetail.emergencyContactNumber.contacts;
                this._date = this._formBuilder.group({
                    firstPicker: ['', Validators.required]
                });
                this._date = new FormGroup({
                    firstPicker: new FormControl(new Date(this.list.personalDetail.dob)),
                })
                this._reformatDate = moment(this._date.value.firstPicker).format('YYYY-MM-DD');
                this.selectedGender = this.list.personalDetail.gender;
                this.selectedMaritalStatus = this.list.personalDetail.maritalStatus;
                this.raceValue = this.list.personalDetail.race;
                this.religionValue = this.list.personalDetail.religion;
                this.nationalityValue = this.list.personalDetail.nationality;
                this.phoneNum = this.list.personalDetail.phoneNumber;
                this.workPhoneNum = this.list.personalDetail.workPhoneNumber;
                this.firstEmailAdd = this.list.personalDetail.emailAddress;
                this.secondEmailAdd = this.list.personalDetail.workEmailAddress;
                this.addLine1 = this.list.personalDetail.residentialAddress1;
                this.addLine2 = this.list.personalDetail.residentialAddress2;
                this.postcode = this.list.personalDetail.postcode;
                this.city = this.list.personalDetail.city;
                this.state = this.list.personalDetail.state;
                this.country = this.list.personalDetail.country;
                this.nric = this.list.personalDetail.nric;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    clickToHideHeader() {
        this.showHeader = false;
    }

    removeContact(index: number) {
        this.removeList.splice(index, 1);
        this.patchData();
    }
    genderChanged(event) {
        this.selectedGender = event.value;
    }
    maritalStatusChanged(event) {
        this.selectedMaritalStatus = event.value;
    }
    onDateChange(): void {
        if (!this._date.value.firstPicker || this._date.status === 'INVALID') {
        } else {
            this._reformatDate = moment(this._date.value.firstPicker).format('YYYY-MM-DD');
        }
    }
    patchData() {
        this.showEditProfile = false;
        this.showEditContact = false;
        this._datatoUpdate = {
            "id": this.list.id,
            "nickname": 'wantan',
            "nric": this.nric.toString(),
            "dob": this._reformatDate,
            "gender": genderStatus[this.selectedGender],
            "maritalStatus": maritalStatus[this.selectedMaritalStatus],
            "race": this.raceValue,
            "religion": this.religionValue,
            "nationality": this.nationalityValue,
            "phoneNumber": this.phoneNum.toString(),
            "workPhoneNumber": this.workPhoneNum.toString(),
            "emailAddress": this.firstEmailAdd,
            "workEmailAddress": this.secondEmailAdd,
            "address1": this.addLine1,
            "address2": this.addLine2,
            "postcode": this.postcode.toString(),
            "city": this.city,
            "state": this.state,
            "country": this.country,
            "emergencyContact": {
                "contacts": this.removeList
            },
            // "education": {
            //     "educationDetail": [
            //         {
            //             "qualificationLevel": "Matriculation",
            //             "major": "Life Science",
            //             "university": "KMNS",
            //             "year": "2007-2008"
            //         },
            //         {
            //             "qualificationLevel": "Bachelor Degree",
            //             "major": "Biotechnology",
            //             "university": "UKM",
            //             "year": "2008-2011"
            //         }
            //     ]
            // },
            // "family": {
            //     "spouse": [
            //         {
            //             "spouseName": "My Spouse Name",
            //             "spouseIdentificationNumber": "kjhgf876543hgf"
            //         }
            //     ],
            //     "child": [
            //         {
            //             "childName": "this is child Name",
            //             "childIdentificationNumber": "HGF654GHJ"
            //         },
            //         {
            //             "childName": "this is child 2 name",
            //             "childIdentificationNumber": "789GBNM789"
            //         }
            //     ]
            // }
        };

        this.apiService.patch_personal_details(this._datatoUpdate).subscribe(
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
