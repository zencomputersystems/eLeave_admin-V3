import { Component, OnInit } from '@angular/core';
import { RolesAPIService } from '../role-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarNotificationPage } from '../../public-holiday-setup/snackbar-notification/snackbar-notification';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-role-rights',
    templateUrl: './role-rights.page.html',
    styleUrls: ['./role-rights.page.scss'],
})
export class RoleRightsPage implements OnInit {

    public profileDetails: any;
    public showSpinner: boolean = true;
    public showSmallSpinner: boolean = false;
    public showInput: boolean = false;
    public showContent: boolean = false;
    public isIndeterminate: boolean[] = [false, false, false];
    public mainCheckbox: boolean[] = [false, false, false];
    public viewReportList: any;
    public getLeaveSetupKey: any;
    public getLeaveMngtKey: any;
    public getProfileMngtKey: any;
    public getCalendarKey = [];
    public getReportKey = [];
    public inputFormControl: any;
    private _roleId: string;
    private _body: any = {};

    constructor(private roleAPi: RolesAPIService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
        route.params.subscribe(params => { this._roleId = params.id; });
        this.inputFormControl = new FormGroup({
            rolename: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
        })
        this.viewReportList = [
            { name: 'None' },
            { name: 'All Level', value: 'All' },
            { name: 'Company Level', value: 'Company' },
            { name: 'Division Level', value: 'Division' },
            { name: 'Branch Level', value: 'Branch' },
            { name: 'Department Level', value: 'Department' },
            { name: 'Branch Department Level', value: 'Branch Department' }]
    }


    ngOnInit() {
        if (this.route.routeConfig.path.includes('create-new-role')) {
            this.showInput = true;
            this.profileDetails = {
                "code": "",
                "description": "",
                "property": {
                    "allowLeaveSetup": {
                        "allowLeaveTypeSetup": {
                            "value": false
                        },
                        "allowLeaveEntitlementSetup": {
                            "value": false
                        },
                        "allowApprovalGroupSetup": {
                            "value": false
                        },
                        "allowYearEndClosingSetup": {
                            "value": false
                        }
                    },
                    "allowViewReport": {
                        "value": false,
                        "level": ""
                    },
                    "allowViewCalendar": {
                        "value": false,
                        "level": ""
                    },
                    "allowLeaveManagement": {
                        "allowLeaveAdjustmant": {
                            "value": false,
                            "level": ""
                        },
                        "allowApplyOnBehalf": {
                            "value": false,
                            "level": ""
                        },
                        "allowApprovalOverride": {
                            "value": false,
                            "level": ""
                        }
                    },
                    "allowProfileManagement": {
                        "allowViewProfile": {
                            "value": false,
                            "level": ""
                        },
                        "allowEditProfile": {
                            "value": false,
                            "level": ""
                        },
                        "allowChangePassword": {
                            "value": false,
                            "level": ""
                        },
                        "allowProfileAdmin": {
                            "value": false,
                            "level": ""
                        }
                    }
                }
            };
            this.getInit();
        } else {
            this.roleAPi.get_role_details_profile(this._roleId).subscribe(data => {
                this.profileDetails = data;
                this.inputFormControl.patchValue({
                    rolename: this.profileDetails.code,
                    description: this.profileDetails.description
                });
                this.showSmallSpinner = false;
                this.getInit();
            },
                error => {
                    if (error) {
                        window.location.href = '/login';
                    }
                });
        }
    }

    getInit() {
        this.showSpinner = false;
        this.showContent = true;
        this.getLeaveSetupKey = Object.keys(this.profileDetails.property.allowLeaveSetup).map(key => this.profileDetails.property.allowLeaveSetup[key]);
        this.getLeaveMngtKey = Object.keys(this.profileDetails.property.allowLeaveManagement).map(value => this.profileDetails.property.allowLeaveManagement[value]);
        this.getProfileMngtKey = Object.keys(this.profileDetails.property.allowProfileManagement).map(value => this.profileDetails.property.allowProfileManagement[value]);
        this.getCalendarKey.push(this.profileDetails.property.allowViewCalendar);
        this.getReportKey.push(this.profileDetails.property.allowViewReport);
        this.checkEvent(this.getLeaveSetupKey, 0);
        this.checkEvent(this.getReportKey);
        this.checkEvent(this.getLeaveMngtKey, 1);
        this.checkEvent(this.getCalendarKey);
        this.checkEvent(this.getProfileMngtKey, 2);
    }

    checkMaster(list, index: number) {
        setTimeout(() => {
            list.forEach(obj => {
                obj.value = this.mainCheckbox[index];
            });
        })
    }

    checkEvent(list: any, masterIndex?: number, index?: number) {
        const totalItems = list.length;
        let checked = 0;
        list.map(obj => {
            if (obj.value) checked++
            if (!obj.value && index > -1) { list[index].level = '' }
        });
        if (checked > 0 && checked < totalItems) {
            this.isIndeterminate[masterIndex] = true;
            this.mainCheckbox[masterIndex] = false;
        } else if (checked == totalItems) {
            this.mainCheckbox[masterIndex] = true;
            this.isIndeterminate[masterIndex] = false;
        } else {
            this.isIndeterminate[masterIndex] = false;
            this.mainCheckbox[masterIndex] = false;
        }
    }

    patchData() {
        const body = {
            "role_guid": this._roleId,
            "data": this._body
        };
        this.roleAPi.patch_role_profile(body).subscribe(response => {
            this.showSmallSpinner = false;
            this.openSnackBar('saved successfully');
        }, error => {
            this.openSnackBar('saved unsuccessfully');
            window.location.href = '/login';
        });
    }

    save() {
        this._body["code"] = this.inputFormControl.value.rolename;
        this._body["description"] = this.inputFormControl.value.description;
        this._body["property"] = this.profileDetails.property;
        if (this.showInput === true) {
            this.roleAPi.post_role_profile(this._body).subscribe(response => {
                this.showSmallSpinner = false;
                this.openSnackBar('saved successfully');
            }, error => {
                this.openSnackBar('saved unsuccessfully');
                window.location.href = '/login';
            });
        } else {
            this.patchData();
        }
    }

    openSnackBar(message: string) {
        this.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 2500,
            data: message
        });
    }

}