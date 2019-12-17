/**
 * constant of entitlement details
 * @export
 * @constant entitlementData
 */
export const entitlementData: any =
{
    "code": "",
    "description": "",
    "leavetype_id": "",
    "property": {
        "applyInAdvance": false,
        "applyNextYear": false,
        "claimEntitlement": false,
        "applyFractionUnit": false,
        "includeOtherLeaveType": "",
        "attachmentRequired": false,
        "excludeDayType": {
            "isExcludeHoliday": false,
            "isExcludeRestDay": false
        },
        "applyBeforeProperties": {
            "numberOfDays": 3,
            "isAllowShortNotice": {
                "isCheck": false,
                "textValue": "SHORT NOTICE APPLICATION"
            },
            "excludeDayType": {
                "isExcludeHoliday": false,
                "isExcludeRestDay": false
            },
            "markAsEmergency": false
        },
        "applyWithinProperties": {
            "numberOfDays": 0,
            "isAllowBackdated": {
                "isCheck": false,
                "textValue": "BACK DATE APPLICATION"
            },
            "excludeDayType": {
                "isExcludeHoliday": false,
                "isExcludeRestDay": false
            }
        },
        "isAllowAppliedMoreThanBalance": {
            "isCheck": false,
            "textValue": "UNPAID LEAVE"
        },
        "isAllowAfterJoinDate": {
            "isCheck": false,
            "textValue": ""
        },
        "isAllowLeaveCancelAfterDate": {
            "isCheck": false,
            "textValue": "Leave cancellation"
        },
        "isLimitApplicationToCarryForward": {
            "isCheck": false,
            "textValue": "Bring Forward Leave"
        },
        "maxDayPerLeave": 0,
        "leaveEntitlementType": "Entitled in full",
        "leaveEntitlementRounding": "Round Up 0.5",
        "levels": {
            "leaveEntitlement": {
                "id": 1,
                "serviceYearFrom": 0,
                "serviceYearTo": 4,
                "entitledDays": 14,
                "carryForward": 3
            }
        }
    }
}
