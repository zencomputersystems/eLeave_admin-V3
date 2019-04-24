import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as _moment from 'moment';
import { genderStatus, maritalStatus } from '../employee-profile.service';
const moment = _moment;

@Component({
    selector: 'app-personal',
    templateUrl: './personal.page.html',
    styleUrls: ['./personal.page.scss'],
})
export class PersonalPage implements OnInit {

    public list: any;
    public removeList: any;
    public numOfArray: boolean = false;
    public editProfile: boolean = false;
    public showEditContact: boolean[] = [];
    public name: string;
    public nickname: string;
    public personalPhoneValue: string;
    public personalEmailValue: string;
    public workPhoneValue: string;
    public workEmailValue: string;
    public nric: string;
    public genderValue: string;
    public maritalStatusValue: string;
    public religionValue: string;
    public raceValue: string;
    public nationalityValue: string;
    public addLine1: string;
    public addLine2: string;
    public postcode: string;
    public city: string;
    public state: string;
    public country: string;
    private _date: FormGroup;
    private _reformatDate: string;

    get dateForm(): FormGroup {
        return this._date;
    }
    get personalList() {
        return this.list;
    }

    constructor(private apiService: APIService, private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                console.log(this.list);
                this.removeList = this.list.personalDetail.emergencyContactNumber.contacts;
                if (this.removeList !== undefined) {
                    for (let i = 0; i < this.removeList.length; i++) {
                        this.showEditContact.push(false);
                    }
                }
                this._date = this._formBuilder.group({
                    datepicker: ['', Validators.required]
                });
                this._date = new FormGroup({
                    datepicker: new FormControl(new Date(this.list.personalDetail.dob)),
                })
                this.name = this.list.employeeName;
                this.nickname = this.list.personalDetail.nickname;
                this._reformatDate = moment(this._date.value.firstPicker).format('YYYY-MM-DD');
                this.nric = this.list.personalDetail.nric;
                this.genderValue = this.list.personalDetail.gender;
                this.maritalStatusValue = this.list.personalDetail.maritalStatus;
                this.raceValue = this.list.personalDetail.race;
                this.religionValue = this.list.personalDetail.religion;
                this.nationalityValue = this.list.personalDetail.nationality;
                this.personalPhoneValue = this.list.personalDetail.phoneNumber;
                this.personalEmailValue = this.list.personalDetail.emailAddress;
                this.workEmailValue = this.list.personalDetail.workEmailAddress;
                this.workPhoneValue = this.list.personalDetail.workPhoneNumber;
                this.addLine1 = this.list.personalDetail.residentialAddress1;
                this.addLine2 = this.list.personalDetail.residentialAddress2;
                this.postcode = this.list.personalDetail.postcode;
                this.city = this.list.personalDetail.city;
                this.state = this.list.personalDetail.state;
                this.country = this.list.personalDetail.country;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    patchAllData() {
        this.editProfile = false;
        // this.showEditContact = false;
        const toPatchData = {
            "id": this.list.id,
            "employeeName": this.name,
            "nickname": this.nickname,
            "nric": this.nric.toString(),
            "dob": this._reformatDate,
            "gender": genderStatus[this.genderValue],
            "maritalStatus": maritalStatus[this.maritalStatusValue],
            "race": this.raceValue,
            "religion": this.religionValue,
            "nationality": this.nationalityValue,
            "phoneNumber": this.personalPhoneValue.toString(),
            "emailAddress": this.personalEmailValue,
            "workPhoneNumber": this.workPhoneValue,
            "workEmailAddress": this.workEmailValue,
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

        this.apiService.patch_personal_details(toPatchData).subscribe(
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

    removeContact(index: number) {
        this.removeList.splice(index, 1);
    }

    editContact(index, value) {
        for (let i = 0; i < this.removeList.length; i++) {
            this.showEditContact.splice(index, 1, value);
            if (!value && (this.removeList[i].contactName == '' || this.removeList[i].contactNumber == '')) {
                this.removeContact(i);
            }
        }
    }
    addInput() {
        this.removeList.push({ contactName: '', contactNumber: '' });
    }

    dateChange(): void {
        if (this._date.value.datepicker || this._date.status === 'VALID') {
            this._reformatDate = moment(this._date.value.datepicker).format('YYYY-MM-DD');
        }
    }

    gender(event) {
        this.genderValue = event.value;
    }

    maritalStatus(event) {
        this.maritalStatusValue = event.value;
    }

    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else {
            this.numOfArray = true;
        }
    };


}
