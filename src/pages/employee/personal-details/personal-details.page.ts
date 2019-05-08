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

    public items: any;
    public removeItems: any = [];
    public spouseItems: any = [];
    public childItems: any = [];
    public eduList: any = [];
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public showSpinner: boolean = true;
    public showEditProfile: boolean = false;
    public showEditContact: boolean[] = [];
    public showFamily: boolean = false;
    public showEducation: boolean = false;
    public displayEditSpouse: boolean[] = [];
    public displayEditChild: boolean[] = [];
    public displayEditEdu: boolean[] = [];
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
        return this.items;
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
                this.items = data;
                this.showSpinner = false;
                this._date = this._formBuilder.group({ firstPicker: ['', Validators.required] });
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
        this._date = new FormGroup({
            firstPicker: new FormControl(new Date(this.items.personalDetail.dob))
        })
        this._reformatDate = moment(this._date.value.firstPicker).format('YYYY-MM-DD');
        this.selectedGender = this.items.personalDetail.gender;
        this.selectedMaritalStatus = this.items.personalDetail.maritalStatus;
        this.raceValue = this.items.personalDetail.race;
        this.religionValue = this.items.personalDetail.religion;
        this.nationalityValue = this.items.personalDetail.nationality;
        this.phoneNum = this.items.personalDetail.phoneNumber;
        this.workPhoneNum = this.items.personalDetail.workPhoneNumber;
        this.firstEmailAdd = this.items.personalDetail.emailAddress;
        this.secondEmailAdd = this.items.personalDetail.workEmailAddress;
        this.addLine1 = this.items.personalDetail.residentialAddress1;
        this.addLine2 = this.items.personalDetail.residentialAddress2;
        this.postcode = this.items.personalDetail.postcode;
        this.city = this.items.personalDetail.city;
        this.state = this.items.personalDetail.state;
        this.country = this.items.personalDetail.country;
        this.nric = this.items.personalDetail.nric;
    }

    initContact() {
        if ((this.items.personalDetail.emergencyContactNumber.contacts instanceof Array) && this.items.personalDetail.emergencyContactNumber.contacts !== undefined) {
            this.removeItems = (this.items.personalDetail.emergencyContactNumber.contacts);
            for (let i = 0; i < this.removeItems.length; i++) {
                this.showEditContact.push(false);
            }
        }
        else if (!(this.items.personalDetail.emergencyContactNumber.contacts instanceof Array) && this.items.personalDetail.emergencyContactNumber.contacts !== undefined) {
            this.removeItems.push(this.items.personalDetail.emergencyContactNumber.contacts);
            for (let i = 0; i < this.removeItems.length; i++) {
                this.showEditContact.push(false);
            }
        }
        else {
            this.removeItems = this.items.personalDetail.emergencyContactNumber.contacts;
        }
    }

    initSpouse() {
        if ((this.items.personalDetail.family.spouse instanceof Array) && this.items.personalDetail.family.spouse !== undefined) {
            this.showFamily = true;
            this.spouseItems = (this.items.personalDetail.family.spouse);
            for (let i = 0; i < this.spouseItems.length; i++) {
                this.displayEditSpouse.push(false);
            }
        }
        else if (!(this.items.personalDetail.family.spouse instanceof Array) && this.items.personalDetail.family.spouse !== undefined) {
            this.showFamily = true;
            this.spouseItems.push(this.items.personalDetail.family.spouse);
            for (let i = 0; i < this.spouseItems.length; i++) {
                this.displayEditSpouse.push(false);
            }
        } else {
            this.showFamily = false;
            this.spouseItems = this.items.personalDetail.family.spouse;
        }
    }

    initChild() {
        if ((this.items.personalDetail.family.child instanceof Array) && this.items.personalDetail.family.child !== undefined) {
            this.showFamily = true;
            this.childItems = (this.items.personalDetail.family.child);
            for (let i = 0; i < this.childItems.length; i++) {
                this.displayEditChild.push(false);
            }
        }
        else if (!(this.items.personalDetail.family.child instanceof Array) && this.items.personalDetail.family.child !== undefined) {
            this.showFamily = true;
            this.childItems.push(this.items.personalDetail.family.child);
            for (let i = 0; i < this.childItems.length; i++) {
                this.displayEditChild.push(false);
            }
        } else {
            this.childItems = this.items.personalDetail.family.child;
        }
    }

    initEducation() {
        if ((this.items.personalDetail.education.educationDetail instanceof Array) && this.items.personalDetail.education.educationDetail !== undefined) {
            this.showEducation = true;
            this.eduList = (this.items.personalDetail.education.educationDetail);
            for (let j = 0; j < this.eduList.length; j++) {
                this.displayEditEdu.push(false);
            }
        }
        else if (!(this.items.personalDetail.education.educationDetail instanceof Array) && this.items.personalDetail.education.educationDetail !== undefined) {
            this.showEducation = true;
            this.eduList.push(this.items.personalDetail.education.educationDetail);
            for (let j = 0; j < this.eduList.length; j++) {
                this.displayEditEdu.push(false);
            }
        } else {
            this.showEducation = false;
            this.eduList = this.items.personalDetail.education.educationDetail;
        }
    }

    addList(data: any, item: Object) {
        if (data !== undefined) {
            data.push(item);
            this.getObject(data, item);
        } else {
            data = [];
            data.push(item);
            this.getObject(data, item);
        }
    }

    getObject(list, obj) {
        if (obj === this.contactObj) { this.removeItems = list; }
        if (obj === this.spouseObj) { this.spouseItems = list; }
        if (obj === this.childObj) { this.childItems = list; }
        if (obj === this.educationObj) { this.eduList = list; }
    }


    removeItem(index: number, list: any) {
        list.splice(index, 1);
        this.patchData();
    }

    editContact(i: number, booValue: boolean) {
        for (let j = 0; j < this.removeItems.length; j++) {
            this.showEditContact.splice(i, 1, booValue);
        }
    }

    editSpouse(i: number, value: boolean) {
        for (let j = 0; j < this.spouseItems.length; j++) {
            this.displayEditSpouse.splice(i, 1, value);
            if ((this.spouseItems[j].spouseName == '' || this.spouseItems[j].spouseIdentificationNumber == '') && !value) {
                this.removeItem(j, this.spouseItems);
            }
        }
    }

    editChild(i: number, value: boolean) {
        for (let j = 0; j < this.childItems.length; j++) {
            this.displayEditChild.splice(i, 1, value);
            if ((this.childItems[j].childName == '' || this.childItems[j].childIdentificationNumber == '') && !value) {
                this.removeItem(j, this.childItems);
            }
        }
    }

    editEducation(i: number, value: boolean) {
        for (let j = 0; j < this.eduList.length; j++) {
            this.displayEditEdu.splice(i, 1, value);
            if ((this.eduList[j].qualificationLevel == '' || this.eduList[j].major == '' || this.eduList[j].university == '' || this.eduList[j].year == '') && !value) {
                this.removeItem(j, this.eduList);
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
                        this.items = data;
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
            "id": this.items.id,
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
            "emergencyContact": { "contacts": this.removeItems },
            "education": { "educationDetail": this.eduList },
            "family": {
                "spouse": this.spouseItems,
                "child": this.childItems
            }
        };
    }


}
