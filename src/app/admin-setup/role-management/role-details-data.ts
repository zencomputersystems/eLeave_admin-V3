
/**
 * interface of selection option
 * @export
 * @interface Selection
 */
export interface Selection {
    /**
     * name of selection item
     * @type {string}
     * @memberof Selection
     */
    name: string;

    /**
     * option value of selection item
     * @type {string}
     * @memberof Selection
     */
    value?: string;
}

/**
 * constant of option for selection
 * @export
 * @constant options
 */
export const options: Selection[] = [
    { name: '-- None --' },
    { name: 'All Level', value: 'All' },
    { name: 'Company Level', value: 'Company' },
    { name: 'Division Level', value: 'Division' },
    { name: 'Branch Level', value: 'Branch' },
    { name: 'Department Level', value: 'Department' },
    { name: 'Branch Department Level', value: 'Branch Department' }
]

/**
 * constant of role details
 * @export
 * @constant roleDetails
 */
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