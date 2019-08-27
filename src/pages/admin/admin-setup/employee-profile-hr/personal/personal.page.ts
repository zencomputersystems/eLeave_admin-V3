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
 * @class PersonalPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-personal',
    templateUrl: './personal.page.html',
    styleUrls: ['./personal.page.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class PersonalPage implements OnInit {

    /**
     * input value from employee-profile (requested userId details)
     * @type {*}
     * @memberof PersonalPage
     */
    @Input() public personalList: any;

    /**
     * Empty array to save emergency contact
     * @type {*}
     * @memberof PersonalPage
     */
    public contactList: any = [];

    /**
     * Empty array to save spouse details
     * @type {*}
     * @memberof PersonalPage
     */
    public spouseList: any = [];

    /**
     * Empty array to save child details
     * @type {*}
     * @memberof PersonalPage
     */
    public childList: any = [];

    /**
     * Empty array to save education details
     * @type {*}
     * @memberof PersonalPage
     */
    public educationList: any = [];

    /**
     * Show or hide edit profile
     * @type {boolean}
     * @memberof PersonalPage
     */
    public editProfile: boolean = false;

    /**
     * Show or hide family details
     * Default is hide if no info to show
     * @type {boolean}
     * @memberof PersonalPage
     */
    public displayFamily: boolean = false;

    /**
     * Show or hide education details
     * Default is hide if no info to show
     * @type {boolean}
     * @memberof PersonalPage
     */
    public displayEducation: boolean = false;

    /**
     * Show edit emergency contact form field
     * @type {boolean[]}
     * @memberof PersonalPage
     */
    public showEditContact: boolean[] = [];

    /**
     * Show edit spouse form field
     * @type {boolean[]}
     * @memberof PersonalPage
     */
    public showEditSpouse: boolean[] = [];

    /**
     * Show edit child form field
     * @type {boolean[]}
     * @memberof PersonalPage
     */
    public showEditChild: boolean[] = [];

    /**
     * Show edit education form field
     * @type {boolean[]}
     * @memberof PersonalPage
     */
    public showEditEducation: boolean[] = [];

    /**
     * Object format of emergency contact
     * @memberof PersonalPage
     */
    public contactObj = { contactName: '', contactNumber: '' };

    /**
     * Object format of spouse details
     * @memberof PersonalPage
     */
    public spouseObj = { spouseName: '', spouseIdentificationNumber: '' };

    /**
     * Object format of child details
     * @memberof PersonalPage
     */
    public childObj = { childName: '', childIdentificationNumber: '' };

    /**
     * Object format of education details
     * @memberof PersonalPage
     */
    public educationObj = { qualificationLevel: '', major: '', university: '', year: '' };

    /**
     * form control of birthdate
     * @type {*}
     * @memberof PersonalPage
     */
    public date: any;

    /**
     *Creates an instance of PersonalPage.
     * @param {APIService} apiService
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
     */
    removeItem(index: number, list: any) {
        list.splice(index, 1);
        this.patchAllData();
    }

    /**
     * Update personal details to API
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
     * @memberof PersonalPage
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
