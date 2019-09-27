import { Component, OnInit, Input } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';
import { genderStatus, maritalStatus } from '../employee-profile.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../leave-setup/date.adapter';
import { FormControl, Validators } from '@angular/forms';
const moment = _moment;

/**
 * Personal Page
 * @export
 * @class PersonalComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
    styleUrls: ['./personal.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class PersonalComponent implements OnInit {

    /**
     * input value from employee-profile (requested userId details)
     * @type {*}
     * @memberof PersonalComponent
     */
    @Input() public personalList: any;

    /**
     * Empty array to save emergency contact
     * @type {*}
     * @memberof PersonalComponent
     */
    public contactList: any = [];

    /**
     * Empty array to save spouse details
     * @type {*}
     * @memberof PersonalComponent
     */
    public spouseList: any = [];

    /**
     * Empty array to save child details
     * @type {*}
     * @memberof PersonalComponent
     */
    public childList: any = [];

    /**
     * Empty array to save education details
     * @type {*}
     * @memberof PersonalComponent
     */
    public educationList: any = [];

    /**
     * Show or hide edit profile
     * @type {boolean}
     * @memberof PersonalComponent
     */
    public editProfile: boolean = false;

    /**
     * Show or hide family details
     * Default is hide if no info to show
     * @type {boolean}
     * @memberof PersonalComponent
     */
    public displayFamily: boolean = false;

    /**
     * Show or hide education details
     * Default is hide if no info to show
     * @type {boolean}
     * @memberof PersonalComponent
     */
    public displayEducation: boolean = false;

    /**
     * Show edit emergency contact form field
     * @type {boolean[]}
     * @memberof PersonalComponent
     */
    public showEditContact: boolean[] = [];

    /**
     * Show edit spouse form field
     * @type {boolean[]}
     * @memberof PersonalComponent
     */
    public showEditSpouse: boolean[] = [];

    /**
     * Show edit child form field
     * @type {boolean[]}
     * @memberof PersonalComponent
     */
    public showEditChild: boolean[] = [];

    /**
     * Show edit education form field
     * @type {boolean[]}
     * @memberof PersonalComponent
     */
    public showEditEducation: boolean[] = [];

    /**
     * Object format of emergency contact
     * @memberof PersonalComponent
     */
    public contactObj = { contactName: '', contactNumber: '' };

    /**
     * Object format of spouse details
     * @memberof PersonalComponent
     */
    public spouseObj = { spouseName: '', spouseIdentificationNumber: '' };

    /**
     * Object format of child details
     * @memberof PersonalComponent
     */
    public childObj = { childName: '', childIdentificationNumber: '' };

    /**
     * Object format of education details
     * @memberof PersonalComponent
     */
    public educationObj = { qualificationLevel: '', major: '', university: '', year: '' };

    /**
     * form control of birthdate
     * @type {*}
     * @memberof PersonalComponent
     */
    public date: any;

    /**
     *Creates an instance of PersonalComponent.
     * @param {APIService} apiService
     * @memberof PersonalComponent
     */
    constructor(private apiService: APIService) {
    }

    ngOnInit() {
        if (this.personalList) {
            this.getContactInit();
            this.getSpouseInit();
            this.getChildInit();
            this.getEducationInit();
            this.date = new FormControl((this.personalList.personalDetail.dob), Validators.required);
            this.personalList.personalDetail.dob = moment(this.personalList.personalDetail.dob).format('DD-MM-YYYY');
        }
    }

    /**
     * To show emergency contact info
     * @memberof PersonalComponent
     */
    getContactInit() {
        const contact = this.personalList.personalDetail.emergencyContact.contacts;
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

    /**
     * To show spouse info
     * @memberof PersonalComponent
     */
    getSpouseInit() {
        const spouse = this.personalList.personalDetail.family.spouse;
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

    /**
     * To show child info
     * @memberof PersonalComponent
     */
    getChildInit() {
        const child = this.personalList.personalDetail.family.child;
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

    /**
     * To show education info
     * @memberof PersonalComponent
     */
    getEducationInit() {
        const education = this.personalList.personalDetail.education.educationDetail;
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

    /**
     * To create new form field input
     * @param {*} list
     * @param {*} obj
     * @memberof PersonalComponent
     */
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

    /**
     * Show required object format of each details 
     * @param {*} addList
     * @param {*} object
     * @memberof PersonalComponent
     */
    objectList(addList, object) {
        if (object === this.contactObj) { this.contactList = addList; }
        if (object === this.spouseObj) { this.spouseList = addList; }
        if (object === this.childObj) { this.childList = addList; }
        if (object === this.educationObj) { this.educationList = addList; }
    }
    /**
     * Remove item from clicked list
     * @param {number} index
     * @param {*} list
     * @memberof PersonalComponent
     */
    removeItem(index: number, list: any) {
        list.splice(index, 1);
        this.patchAllData();
    }

    /**
     * Update personal details to API
     * @memberof PersonalComponent
     */
    patchAllData() {
        this.editProfile = false;
        this.apiService.patch_personal_details(this.bindingData()).subscribe(
            (val) => {
                this.apiService.get_user_profile_details(this.personalList.userId).subscribe(data => {
                    this.personalList = data;
                    this.personalList.personalDetail.dob = moment(this.personalList.personalDetail.dob).format('DD-MM-YYYY');
                })
            },
            response => {
                if (response.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    /**
     * body content that need to POST to API 
     * @returns
     * @memberof PersonalComponent
     */
    bindingData() {
        return {
            "id": this.personalList.id,
            "nickname": this.personalList.personalDetail.nickname,
            "nric": this.personalList.personalDetail.nric.toString(),
            "dob": moment(this.date.value).format('YYYY-MM-DD'),
            "gender": genderStatus[this.personalList.personalDetail.gender],
            "maritalStatus": maritalStatus[this.personalList.personalDetail.maritalStatus],
            "race": this.personalList.personalDetail.race,
            "religion": this.personalList.personalDetail.religion,
            "nationality": this.personalList.personalDetail.nationality,
            "phoneNumber": this.personalList.personalDetail.phoneNumber.toString(),
            "emailAddress": this.personalList.personalDetail.emailAddress,
            "workPhoneNumber": this.personalList.personalDetail.workPhoneNumber.toString(),
            "workEmailAddress": this.personalList.personalDetail.workEmailAddress,
            "address1": this.personalList.personalDetail.address1.toString(),
            "address2": this.personalList.personalDetail.address2.toString(),
            "postcode": this.personalList.personalDetail.postcode.toString(),
            "city": this.personalList.personalDetail.city,
            "state": this.personalList.personalDetail.state,
            "country": this.personalList.personalDetail.country,
            "emergencyContact": { "contacts": this.contactList },
            "education": { "educationDetail": this.educationList },
            "family": {
                "spouse": this.spouseList,
                "child": this.childList
            }
        };
    }

    /**
     * Edit emergency contact 
     * @param {*} index
     * @param {*} value
     * @memberof PersonalComponent
     */
    editContact(index, value) {
        for (let i = 0; i < this.contactList.length; i++) {
            this.showEditContact.splice(index, 1, value);
            if (!value && (this.contactList[i].contactName == '' || this.contactList[i].contactNumber == '')) {
                this.removeItem(i, this.contactList);
            }
        }
    }

    /**
     * Edit spouse details
     * @param {*} index
     * @param {*} value
     * @memberof PersonalComponent
     */
    editSpouse(index, value) {
        for (let i = 0; i < this.spouseList.length; i++) {
            this.showEditSpouse.splice(index, 1, value);
            if (!value && (this.spouseList[i].spouseName == '' || this.spouseList[i].spouseIdentificationNumber == '')) {
                this.removeItem(i, this.spouseList);
            }
        }
    }

    /**
     * Edit child details
     * @param {*} index
     * @param {*} value
     * @memberof PersonalComponent
     */
    editChild(index, value) {
        for (let i = 0; i < this.childList.length; i++) {
            this.showEditChild.splice(index, 1, value);
            if (!value && (this.childList[i].childName == '' || this.childList[i].childIdentificationNumber == '')) {
                this.removeItem(i, this.childList);
            }
        }
    }

    /**
     * Edit education details
     * @param {*} index
     * @param {*} value
     * @memberof PersonalComponent
     */
    editEducation(index, value) {
        for (let i = 0; i < this.educationList.length; i++) {
            this.showEditEducation.splice(index, 1, value);
            if (!value && (this.educationList[i].qualificationLevel == '' || this.educationList[i].major == '' || this.educationList[i].university == '' || this.educationList[i].year == '')) {
                this.removeItem(i, this.educationList);
            }
        }
    }

}
