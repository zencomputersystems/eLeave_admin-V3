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
    private _date: FormGroup;
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

    getContactInit() {
        const contact = this.list.personalDetail.emergencyContactNumber.contacts;
        if (contact !== undefined && !(contact instanceof Array)) {
            this.contactList.push(contact);
            for (let i = 0; i < this.contactList.length; i++) {
                this.showEditContact.push(false);
            }
        }
        else if (contact !== undefined && (contact instanceof Array)) {
            this.contactList = (contact);
            for (let i = 0; i < this.contactList.length; i++) {
                this.showEditContact.push(false);
            }
        }
        else {
            this.contactList = contact;
        }
    }

    getSpouseInit() {
        const spouse = this.list.personalDetail.family.spouse;
        if (spouse !== undefined && !(spouse instanceof Array)) {
            this.displayFamily = true;
            this.spouseList.push(spouse);
            for (let i = 0; i < this.spouseList.length; i++) {
                this.showEditSpouse.push(false);
            }
        } else if (spouse !== undefined && (spouse instanceof Array)) {
            this.displayFamily = true;
            this.spouseList = (spouse);
            for (let i = 0; i < this.spouseList.length; i++) {
                this.showEditSpouse.push(false);
            }
        } else {
            this.displayFamily = false;
            this.spouseList = spouse;
        }
    }

    getChildInit() {
        const child = this.list.personalDetail.family.child;
        if (child !== undefined && !(child instanceof Array)) {
            this.displayFamily = true;
            this.childList.push(child);
            for (let i = 0; i < this.childList.length; i++) {
                this.showEditChild.push(false);
            }
        } else if (child !== undefined && (child instanceof Array)) {
            this.displayFamily = true;
            this.childList = (child);
            for (let i = 0; i < this.childList.length; i++) {
                this.showEditChild.push(false);
            }
        } else {
            this.childList = child;
        }
    }

    getEducationInit() {
        const education = this.list.personalDetail.education.educationDetail;
        if (education !== undefined && !(education instanceof Array)) {
            this.displayEducation = true;
            this.educationList.push(education);
            for (let i = 0; i < this.educationList.length; i++) {
                this.showEditEducation.push(false);
            }
        } else if (education !== undefined && (education instanceof Array)) {
            this.displayEducation = true;
            this.educationList = (education);
            for (let i = 0; i < this.educationList.length; i++) {
                this.showEditEducation.push(false);
            }
        } else {
            this.displayEducation = false;
            this.educationList = education;
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
                this._subscription = this.apiService.get_personal_details().subscribe(
                    (data: any[]) => {
                        this.list = data;
                    });
            },
            response => {
                if (response.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    bindingData() {
        return {
            "id": this.list.id,
            "nickname": this.list.personalDetail.nickname,
            "nric": this.list.personalDetail.nric.toString(),
            "dob": moment(this._date.value.datepicker).format('YYYY-MM-DD'),
            "gender": genderStatus[this.list.personalDetail.gender],
            "maritalStatus": maritalStatus[this.list.personalDetail.maritalStatus],
            "race": this.list.personalDetail.race,
            "religion": this.list.personalDetail.religion,
            "nationality": this.list.personalDetail.nationality,
            "phoneNumber": this.list.personalDetail.phoneNumber.toString(),
            "emailAddress": this.list.personalDetail.emailAddress,
            "workPhoneNumber": this.list.personalDetail.workPhoneNumber,
            "workEmailAddress": this.list.personalDetail.workEmailAddress,
            "address1": this.list.personalDetail.residentialAddress1.toString(),
            "address2": this.list.personalDetail.residentialAddress2.toString(),
            "postcode": this.list.personalDetail.postcode.toString(),
            "city": this.list.personalDetail.city,
            "state": this.list.personalDetail.state,
            "country": this.list.personalDetail.country,
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

    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else {
            this.numOfArray = true;
        }
    };


}
