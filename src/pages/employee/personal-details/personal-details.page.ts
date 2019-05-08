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
import { Subscription } from 'rxjs';
const moment = _moment;

@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.page.html',
    styleUrls: ['./personal-details.page.scss']
})
export class PersonalDetailsPage implements OnInit {

    public list: any;
    public removeList: any = [];
    public spouseList: any = [];
    public childList: any = [];
    public educationList: any = [];
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public accessToken: any;
    public showSpinner: boolean = true;
    public showEditProfile: boolean = false;
    public showEditContact: boolean[] = [];
    public displayFamily: boolean = false;
    public displayEducation: boolean = false;
    public showEditSpouse: boolean[] = [];
    public showEditChild: boolean[] = [];
    public showEditEducation: boolean[] = [];
    public contactObj = { contactName: '', contactNumber: '' };
    public spouseObj = { spouseName: '', spouseIdentificationNumber: '' };
    public childObj = { childName: '', childIdentificationNumber: '' };
    public educationObj = { qualificationLevel: '', major: '', university: '', year: '' };
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
    private subscription: Subscription = new Subscription();

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
        this.subscription = this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.showSpinner = false;
                this.initContact();
                this.initSpouse();
                this.initChild();
                this.initEducation();
                this.modelBindingValue();
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    modelBindingValue() {
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
    }

    initContact() {
        if (this.list.personalDetail.emergencyContactNumber !== undefined) {
            if (this.list.personalDetail.emergencyContactNumber.contacts !== undefined && (typeof (this.removeList) == "object")) {
                if (!(this.list.personalDetail.emergencyContactNumber.contacts instanceof Array)) {
                    this.removeList.push(this.list.personalDetail.emergencyContactNumber.contacts);
                    for (let i = 0; i < this.removeList.length; i++) {
                        this.showEditContact.push(false);
                    }
                } else {
                    this.removeList = (this.list.personalDetail.emergencyContactNumber.contacts);
                    for (let i = 0; i < this.removeList.length; i++) {
                        this.showEditContact.push(false);
                    }
                }
            } else {
                this.removeList = this.list.personalDetail.emergencyContactNumber.contacts;
            }
        }
    }

    initSpouse() {
        if (this.list.personalDetail.family !== undefined) {
            if (this.list.personalDetail.family.spouse !== undefined && (typeof (this.spouseList) == "object")) {
                this.displayFamily = true;
                if (!(this.list.personalDetail.family.spouse instanceof Array)) {
                    this.spouseList.push(this.list.personalDetail.family.spouse);
                    for (let i = 0; i < this.spouseList.length; i++) {
                        this.showEditSpouse.push(false);
                    }
                } else {
                    this.spouseList = (this.list.personalDetail.family.spouse);
                    for (let i = 0; i < this.spouseList.length; i++) {
                        this.showEditSpouse.push(false);
                    }
                }
            } else {
                this.displayFamily = false;
                this.spouseList = this.list.personalDetail.family.spouse;
            }
        }
    }

    initChild() {
        if (this.list.personalDetail.family !== undefined) {
            if (this.list.personalDetail.family.child !== undefined && (typeof (this.childList) == "object")) {
                if (!(this.list.personalDetail.family.child instanceof Array)) {
                    this.childList.push(this.list.personalDetail.family.child);
                    for (let i = 0; i < this.childList.length; i++) {
                        this.showEditChild.push(false);
                    }
                } else {
                    this.childList = (this.list.personalDetail.family.child);
                    for (let i = 0; i < this.childList.length; i++) {
                        this.showEditChild.push(false);
                    }
                }
            } else {
                this.childList = this.list.personalDetail.family.child;
            }
        }
    }

    initEducation() {
        if (this.list.personalDetail.education !== undefined) {
            if (this.list.personalDetail.education.educationDetail !== undefined && (typeof (this.educationList) == "object")) {
                this.displayEducation = true;
                if (!(this.list.personalDetail.education.educationDetail instanceof Array)) {
                    this.educationList.push(this.list.personalDetail.education.educationDetail);
                    for (let i = 0; i < this.educationList.length; i++) {
                        this.showEditEducation.push(false);
                    }
                } else {
                    this.educationList = (this.list.personalDetail.education.educationDetail);
                    for (let i = 0; i < this.educationList.length; i++) {
                        this.showEditEducation.push(false);
                    }
                }
            } else {
                this.displayEducation = false;
                this.educationList = this.list.personalDetail.education.educationDetail;
            }
        }
    }

    addList(list, obj) {
        if (list === undefined) {
            list = [];
            list.push(obj);
        } else {
            list.push(obj);
        }
    }

    removeItem(index: number, list) {
        list.splice(index, 1);
        this.patchData();
    }

    editContact(index, booValue) {
        for (let i = 0; i < this.removeList.length; i++) {
            this.showEditContact.splice(index, 1, booValue);
        }
    }

    editSpouse(index, value) {
        for (let i = 0; i < this.spouseList.length; i++) {
            this.showEditSpouse.splice(index, 1, value);
            if (!value && (this.spouseList[i].spouseName == '' || this.spouseList[i].spouseIdentificationNumber == '')) {
                this.removeItem(i, this.spouseList);
            }
        }
    }

    editChild(index, value) {
        for (let i = 0; i < this.childList.length; i++) {
            this.showEditChild.splice(index, 1, value);
            if (!value && (this.childList[i].childName == '' || this.childList[i].childIdentificationNumber == '')) {
                this.removeItem(i, this.childList);
            }
        }
    }

    editEducationDetail(index, value) {
        for (let i = 0; i < this.educationList.length; i++) {
            this.showEditEducation.splice(index, 1, value);
            if (!value && (this.educationList[i].qualificationLevel == '' || this.educationList[i].major == '' || this.educationList[i].university == '' || this.educationList[i].year == '')) {
                this.removeItem(i, this.educationList);
            }
        }
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
        this.data();
        this.subscription = this.apiService.patch_personal_details(this._datatoUpdate).subscribe(
            (val) => {
                this.subscription = this.apiService.get_personal_details().subscribe(
                    (data: any[]) => {
                        this.list = data;
                    }
                );
            },
            response => {
                if (response.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    data() {
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
            "education": {
                "educationDetail": this.educationList
            },
            "family": {
                "spouse": this.spouseList,
                "child": this.childList
            }
        };
    }


}
