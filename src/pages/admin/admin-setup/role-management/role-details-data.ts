export interface Selection {
    name: string;
    value?: string;
}

export const options: Selection[] = [
    { name: 'None' },
    { name: 'All Level', value: 'All' },
    { name: 'Company Level', value: 'Company' },
    { name: 'Division Level', value: 'Division' },
    { name: 'Branch Level', value: 'Branch' },
    { name: 'Department Level', value: 'Department' },
    { name: 'Branch Department Level', value: 'Branch Department' }
]

export const roleDetails: any = {
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
}