import { Component, OnInit } from '@angular/core';
import { RolesAPIService } from '../role-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    public isIndeterminateLeaveSetup: boolean;
    public isIndeterminateLeaveMngt: boolean;
    public isIndeterminateProfileMngt: boolean;
    public modelLeaveSetup: boolean;
    public modelLeaveMngtSetup: boolean;
    public modelProfileMngtSetup: boolean;
    public leaveSetupList: any;
    public viewReportList: any;
    public leaveManagementList: any;
    public profileManagementList: any;
    public reportList: any;
    public calendarList: any;
    public inputFormControl: any;
    private _roleId: string;

    constructor(private roleAPi: RolesAPIService, private route: ActivatedRoute) {
        route.params.subscribe(params => {
            this._roleId = params.id;
        });

        this.leaveSetupList = [
            { name: 'Leave Type Setup', isChecked: false },
            { name: 'Leave Entitlement Setup', isChecked: false },
            { name: 'Approval Group Setup', isChecked: false },
            { name: 'Year End Closing Setup', isChecked: false }];

        this.viewReportList = [
            { name: 'All Level', value: 'All' },
            { name: 'Company Level', value: 'Company' },
            { name: 'Division Level', value: 'Division' },
            { name: 'Branch Level', value: 'Branch' },
            { name: 'Department Level', value: 'Department' },
            { name: 'Branch Department Level', value: 'Branch Department' }]

        this.leaveManagementList = [
            { name: 'Leave Adjustmant', isChecked: false, level: 'All' },
            { name: 'Apply On Behalf', isChecked: false, level: 'All' },
            { name: 'Approval Override', isChecked: false, level: 'All' }]

        this.profileManagementList = [
            { name: 'View Profile', isChecked: false, level: 'All' },
            { name: 'Edit Profile', isChecked: false, level: 'All' },
            { name: 'Change Password', isChecked: false, level: 'All' },
            { name: 'Profile Admin', isChecked: false, level: 'All' },
        ]

        this.reportList = [
            { name: 'View Report', isChecked: false, level: 'All' }
        ]

        this.calendarList = [
            { name: 'View Calendar', isChecked: false, level: 'All' }
        ]

    }


    ngOnInit() {
        this.inputFormControl = new FormGroup({
            rolename: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
        })

        if (this.route.routeConfig.path.includes('create-new-role')) {
            this.showInput = true;
            this.showSpinner = false;
            this.showContent = true;
        } else {
            this.roleAPi.get_role_details_profile(this._roleId).subscribe(data => {
                this.profileDetails = data;
                console.log(this.profileDetails);
                this.showSpinner = false;
                this.showContent = true;
                this.leaveSetupList[0].isChecked = data.property.allowLeaveSetup.allowLeaveTypeSetup.value;
                this.leaveSetupList[1].isChecked = data.property.allowLeaveSetup.allowLeaveEntitlementSetup.value;
                this.leaveSetupList[2].isChecked = data.property.allowLeaveSetup.allowApprovalGroupSetup.value;
                this.leaveSetupList[3].isChecked = data.property.allowLeaveSetup.allowYearEndClosingSetup.value;

                this.profileManagementList[0].isChecked = data.property.allowProfileManagement.allowViewProfile.value;
                this.profileManagementList[1].isChecked = data.property.allowProfileManagement.allowEditProfile.value;
                this.profileManagementList[2].isChecked = data.property.allowProfileManagement.allowChangePassword.value;
                this.profileManagementList[3].isChecked = data.property.allowProfileManagement.allowProfileAdmin.value;

                this.profileManagementList[0].level = data.property.allowProfileManagement.allowViewProfile.level;
                this.profileManagementList[1].level = data.property.allowProfileManagement.allowEditProfile.level;
                this.profileManagementList[2].level = data.property.allowProfileManagement.allowChangePassword.level;
                this.profileManagementList[3].level = data.property.allowProfileManagement.allowProfileAdmin.level;

                this.leaveManagementList[0].isChecked = data.property.allowLeaveManagement.allowLeaveAdjustmant.value;
                this.leaveManagementList[1].isChecked = data.property.allowLeaveManagement.allowApplyOnBehalf.value;
                this.leaveManagementList[2].isChecked = data.property.allowLeaveManagement.allowApprovalOverride.value;

                this.leaveManagementList[0].level = data.property.allowLeaveManagement.allowLeaveAdjustmant.level;
                this.leaveManagementList[1].level = data.property.allowLeaveManagement.allowApplyOnBehalf.level;
                this.leaveManagementList[2].level = data.property.allowLeaveManagement.allowApprovalOverride.level;

                this.reportList[0].isChecked = data.property.allowViewReport.value;
                this.reportList[0].level = data.property.allowViewReport.level;

                this.calendarList[0].isChecked = data.property.allowViewCalendar.value;
                this.calendarList[0].level = data.property.allowViewCalendar.level;

                this.checkEvent(this.leaveSetupList, 'leaveSetup');
                this.checkEvent(this.reportList, 'reportView');
                this.checkEvent(this.leaveManagementList, 'leaveManagement');
                this.checkEvent(this.calendarList, 'calendarView');
                this.checkEvent(this.profileManagementList, 'profileManagement');
            },
                error => {
                    if (error) {
                        window.location.href = '/login';
                    }
                });
        }


    }

    checkMaster(list, ngModel) {
        if (ngModel === 'leaveSetup') {
            setTimeout(() => {
                list.forEach(obj => {
                    obj.isChecked = this.modelLeaveSetup;
                });
            })
        }
        if (ngModel === 'leaveManagement') {
            setTimeout(() => {
                list.forEach(obj => {
                    obj.isChecked = this.modelLeaveMngtSetup;
                });
            })
        }
        if (ngModel === 'profileManagement') {
            setTimeout(() => {
                list.forEach(obj => {
                    obj.isChecked = this.modelProfileMngtSetup;
                });
            })
        }
    }

    checkEvent(list: any, value: string) {
        const totalItems = list.length;
        let checked = 0;
        list.map(obj => {
            if (obj.isChecked) checked++;
        });
        if (value === 'leaveSetup') {
            if (checked > 0 && checked < totalItems) {
                //If even one item is checked but not all
                this.isIndeterminateLeaveSetup = true;
                this.modelLeaveSetup = false;
            } else if (checked == totalItems) {
                //If all are checked
                this.modelLeaveSetup = true;
                this.isIndeterminateLeaveSetup = false;
            } else {
                //If none is checked
                this.isIndeterminateLeaveSetup = false;
                this.modelLeaveSetup = false;
            }
        }
        if (value === 'leaveManagement') {
            if (checked > 0 && checked < totalItems) {
                //If even one item is checked but not all
                this.isIndeterminateLeaveMngt = true;
                this.modelLeaveMngtSetup = false;
            } else if (checked == totalItems) {
                //If all are checked
                this.modelLeaveMngtSetup = true;
                this.isIndeterminateLeaveMngt = false;
            } else {
                //If none is checked
                this.isIndeterminateLeaveMngt = false;
                this.modelLeaveMngtSetup = false;
            }
        }
        if (value === 'profileManagement') {
            if (checked > 0 && checked < totalItems) {
                //If even one item is checked but not all
                this.isIndeterminateProfileMngt = true;
                this.modelProfileMngtSetup = false;
            } else if (checked == totalItems) {
                //If all are checked
                this.modelProfileMngtSetup = true;
                this.isIndeterminateProfileMngt = false;
            } else {
                //If none is checked
                this.isIndeterminateProfileMngt = false;
                this.modelProfileMngtSetup = false;
            }
        }

    }

    save() {
        this.showSmallSpinner = true;

        if (this.showInput === true) {
            const body = {
                "allowLeaveSetup": {
                    "allowLeaveTypeSetup": {
                        "value": this.leaveSetupList[0].isChecked
                    },
                    "allowLeaveEntitlementSetup": {
                        "value": this.leaveSetupList[1].isChecked
                    },
                    "allowApprovalGroupSetup": {
                        "value": this.leaveSetupList[2].isChecked
                    },
                    "allowYearEndClosingSetup": {
                        "value": this.leaveSetupList[3].isChecked
                    }
                },
                "allowViewReport": {
                    "value": this.reportList[0].isChecked,
                    "level": this.reportList[0].level
                },
                "allowViewCalendar": {
                    "value": this.calendarList[0].isChecked,
                    "level": this.calendarList[0].level
                },
                "allowLeaveManagement": {
                    "allowLeaveAdjustmant": {
                        "value": this.leaveManagementList[0].isChecked,
                        "level": this.leaveManagementList[0].level
                    },
                    "allowApplyOnBehalf": {
                        "value": this.leaveManagementList[1].isChecked,
                        "level": this.leaveManagementList[1].level
                    },
                    "allowApprovalOverride": {
                        "value": this.leaveManagementList[2].isChecked,
                        "level": this.leaveManagementList[2].level
                    }
                },
                "allowProfileManagement": {
                    "allowViewProfile": {
                        "value": this.profileManagementList[0].isChecked,
                        "level": this.profileManagementList[0].level
                    },
                    "allowEditProfile": {
                        "value": this.profileManagementList[1].isChecked,
                        "level": this.profileManagementList[1].level
                    },
                    "allowChangePassword": {
                        "value": this.profileManagementList[2].isChecked,
                        "level": this.profileManagementList[2].level
                    },
                    "allowProfileAdmin": {
                        "value": this.profileManagementList[3].isChecked,
                        "level": this.profileManagementList[3].level
                    }
                }
            }
            const data = {
                'code': this.inputFormControl.value.rolename,
                'description': this.inputFormControl.value.description,
                'property': body
            }
            this.roleAPi.post_role_profile(data).subscribe(response => this.showSmallSpinner = false)
        } else {
            const body = {
                "role_guid": this._roleId,
                "data": {
                    "code": this.profileDetails.code,
                    "description": this.profileDetails.description,
                    "property": {
                        "allowLeaveSetup": {
                            "allowLeaveTypeSetup": {
                                "value": this.leaveSetupList[0].isChecked
                            },
                            "allowLeaveEntitlementSetup": {
                                "value": this.leaveSetupList[1].isChecked
                            },
                            "allowApprovalGroupSetup": {
                                "value": this.leaveSetupList[2].isChecked
                            },
                            "allowYearEndClosingSetup": {
                                "value": this.leaveSetupList[3].isChecked
                            }
                        },
                        "allowViewReport": {
                            "value": this.reportList[0].isChecked,
                            "level": this.reportList[0].level
                        },
                        "allowViewCalendar": {
                            "value": this.calendarList[0].isChecked,
                            "level": this.calendarList[0].level
                        },
                        "allowLeaveManagement": {
                            "allowLeaveAdjustmant": {
                                "value": this.leaveManagementList[0].isChecked,
                                "level": this.leaveManagementList[0].level
                            },
                            "allowApplyOnBehalf": {
                                "value": this.leaveManagementList[1].isChecked,
                                "level": this.leaveManagementList[1].level
                            },
                            "allowApprovalOverride": {
                                "value": this.leaveManagementList[2].isChecked,
                                "level": this.leaveManagementList[2].level
                            }
                        },
                        "allowProfileManagement": {
                            "allowViewProfile": {
                                "value": this.profileManagementList[0].isChecked,
                                "level": this.profileManagementList[0].level
                            },
                            "allowEditProfile": {
                                "value": this.profileManagementList[1].isChecked,
                                "level": this.profileManagementList[1].level
                            },
                            "allowChangePassword": {
                                "value": this.profileManagementList[2].isChecked,
                                "level": this.profileManagementList[2].level
                            },
                            "allowProfileAdmin": {
                                "value": this.profileManagementList[3].isChecked,
                                "level": this.profileManagementList[3].level
                            }
                        }
                    }
                }
            };
            this.roleAPi.patch_role_profile(body).subscribe(response => {
                console.log(response);
                this.showSmallSpinner = false;
            });
        }

    }

}