import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as _moment from 'moment';
import { genderStatus, maritalStatus } from '../employee-profile.service';
import { Subscription } from 'rxjs';
const moment = _moment;

@Component({
    selector: 'app-personal',
    templateUrl: './personal.page.html',
    styleUrls: ['./personal.page.scss'],
})
export class PersonalPage implements OnInit {

    public list: any;
    public contactList: any = [];
    public spouseList: any = [];
    public childList: any = [];
    public educationList: any = [];
    public numOfArray: boolean = false;
    public editProfile: boolean = false;
    public displayFamily: boolean = false;
    public displayEducation: boolean = false;
    public showEditContact: boolean[] = [];
    public showEditSpouse: boolean[] = [];
    public showEditChild: boolean[] = [];
    public showEditEducation: boolean[] = [];
    public contactObj = { contactName: '', contactNumber: '' };
    public spouseObj = { spouseName: '', spouseIdentificationNumber: '' };
    public childObj = { childName: '', childIdentificationNumber: '' };
    public educationObj = { qualificationLevel: '', major: '', university: '', year: '' };
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
    private _subscription: Subscription = new Subscription();

    get dateForm(): FormGroup {
        return this._date;
    }
    get personalList() {
        return this.list;
    }

    constructor(private apiService: APIService, private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this._subscription = this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.getContactInit();
                this.getSpouseInit();
                this.getChildInit();
                this.getEducationInit();
                this._date = this._formBuilder.group({ datepicker: ['', Validators.required] });
                this._date = new FormGroup({
                    datepicker: new FormControl(new Date(this.list.personalDetail.dob)),
                })
                this.initValue();
            },
            error => {
                if (error.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    initValue() {
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
    }

    getContactInit() {
        if (this.list.personalDetail.emergencyContactNumber.contacts !== undefined && !(this.list.personalDetail.emergencyContactNumber.contacts instanceof Array)) {
            this.contactList.push(this.list.personalDetail.emergencyContactNumber.contacts);
            for (let i = 0; i < this.contactList.length; i++) {
                this.showEditContact.push(false);
            }
        }
        else if (this.list.personalDetail.emergencyContactNumber.contacts !== undefined && (this.list.personalDetail.emergencyContactNumber.contacts instanceof Array)) {
            this.contactList = (this.list.personalDetail.emergencyContactNumber.contacts);
            for (let i = 0; i < this.contactList.length; i++) {
                this.showEditContact.push(false);
            }
        }
        else {
            this.contactList = this.list.personalDetail.emergencyContactNumber.contacts;
        }
    }

    getSpouseInit() {
        if (this.list.personalDetail.family.spouse !== undefined && !(this.list.personalDetail.family.spouse instanceof Array)) {
            this.displayFamily = true;
            this.spouseList.push(this.list.personalDetail.family.spouse);
            for (let i = 0; i < this.spouseList.length; i++) {
                this.showEditSpouse.push(false);
            }
        } else if (this.list.personalDetail.family.spouse !== undefined && (this.list.personalDetail.family.spouse instanceof Array)) {
            this.displayFamily = true;
            this.spouseList = (this.list.personalDetail.family.spouse);
            for (let i = 0; i < this.spouseList.length; i++) {
                this.showEditSpouse.push(false);
            }
        } else {
            this.displayFamily = false;
            this.spouseList = this.list.personalDetail.family.spouse;
        }
    }

    getChildInit() {
        if (this.list.personalDetail.family.child !== undefined && !(this.list.personalDetail.family.child instanceof Array)) {
            this.displayFamily = true;
            this.childList.push(this.list.personalDetail.family.child);
            for (let i = 0; i < this.childList.length; i++) {
                this.showEditChild.push(false);
            }
        } else if (this.list.personalDetail.family.child !== undefined && (this.list.personalDetail.family.child instanceof Array)) {
            this.displayFamily = true;
            this.childList = (this.list.personalDetail.family.child);
            for (let i = 0; i < this.childList.length; i++) {
                this.showEditChild.push(false);
            }
        } else {
            this.childList = this.list.personalDetail.family.child;
        }
    }

    getEducationInit() {
        if (this.list.personalDetail.education.educationDetail !== undefined && !(this.list.personalDetail.education.educationDetail instanceof Array)) {
            this.displayEducation = true;
            this.educationList.push(this.list.personalDetail.education.educationDetail);
            for (let i = 0; i < this.educationList.length; i++) {
                this.showEditEducation.push(false);
            }
        } else if (this.list.personalDetail.education.educationDetail !== undefined && (this.list.personalDetail.education.educationDetail instanceof Array)) {
            this.displayEducation = true;
            this.educationList = (this.list.personalDetail.education.educationDetail);
            for (let i = 0; i < this.educationList.length; i++) {
                this.showEditEducation.push(false);
            }
        } else {
            this.displayEducation = false;
            this.educationList = this.list.personalDetail.education.educationDetail;
        }
    }

    addList(list, obj) {
        if (list === undefined) {
            list = [];
            list.push(obj);
            this.objectList(list, obj);
        } else {
            list.push(obj);
            this.objectList(list, obj);
        }
    }

    objectList(addList, object) {
        if (object === this.contactObj) { this.contactList = addList; }
        if (object === this.spouseObj) { this.spouseList = addList; }
        if (object === this.childObj) { this.childList = addList; }
        if (object === this.educationObj) { this.educationList = addList; }
    }

    removeItem(index: number, list: any) {
        list.splice(index, 1);
        this.patchAllData();
    }

    patchAllData() {
        this.editProfile = false;
        this._subscription = this.apiService.patch_personal_details(this.bindingData()).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
            },
            response => {
                if (response.status === 401) {
                    window.location.href = '/login';
                }
            },
            () => {
                this._subscription = this.apiService.get_personal_details().subscribe(
                    (data: any[]) => {
                        this.list = data;
                    });
            });
    }

    bindingData() {
        return {
            "id": this.list.id,
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
            "emergencyContact": { "contacts": this.contactList },
            "education": { "educationDetail": this.educationList },
            "family": {
                "spouse": this.spouseList,
                "child": this.childList
            }
        };
    }

    editContact(index, value) {
        for (let i = 0; i < this.contactList.length; i++) {
            this.showEditContact.splice(index, 1, value);
            if (!value && (this.contactList[i].contactName == '' || this.contactList[i].contactNumber == '')) {
                this.removeItem(i, this.contactList);
            }
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

    editEducation(index, value) {
        for (let i = 0; i < this.educationList.length; i++) {
            this.showEditEducation.splice(index, 1, value);
            if (!value && (this.educationList[i].qualificationLevel == '' || this.educationList[i].major == '' || this.educationList[i].university == '' || this.educationList[i].year == '')) {
                this.removeItem(i, this.educationList);
            }
        }
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
