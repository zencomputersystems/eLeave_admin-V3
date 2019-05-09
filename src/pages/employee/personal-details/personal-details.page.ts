import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { genderStatus, maritalStatus } from './personal-details.service';
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
    private _date: FormGroup;
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
                this._date = new FormGroup({
                    firstPicker: new FormControl(new Date(this.items.personalDetail.dob))
                })
                this.initContact();
                this.initSpouse();
                this.initChild();
                this.initEducation();
            },
            error => {
                if (error.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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

    patchData() {
        this.showEditProfile = false;
        this.subscription = this.apiService.patch_personal_details(this.data()).subscribe(
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
        return {
            "id": this.items.id,
            "nickname": 'wantan',
            "nric": this.items.personalDetail.nric.toString(),
            "dob": moment(this._date.value.firstPicker).format('YYYY-MM-DD'),
            "gender": genderStatus[this.items.personalDetail.gender],
            "maritalStatus": maritalStatus[this.items.personalDetail.maritalStatus],
            "race": this.items.personalDetail.race,
            "religion": this.items.personalDetail.religion,
            "nationality": this.items.personalDetail.nationality,
            "phoneNumber": this.items.personalDetail.phoneNumber.toString(),
            "workPhoneNumber": this.items.personalDetail.workPhoneNumber.toString(),
            "emailAddress": this.items.personalDetail.emailAddress,
            "workEmailAddress": this.items.personalDetail.workEmailAddress,
            "address1": this.items.personalDetail.residentialAddress1.toString(),
            "address2": this.items.personalDetail.residentialAddress2.toString(),
            "postcode": this.items.personalDetail.postcode.toString(),
            "city": this.items.personalDetail.city,
            "state": this.items.personalDetail.state,
            "country": this.items.personalDetail.country,
            "emergencyContact": { "contacts": this.removeItems },
            "education": { "educationDetail": this.eduList },
            "family": {
                "spouse": this.spouseItems,
                "child": this.childItems
            }
        };
    }


}
