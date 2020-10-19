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
        "applyInAdvance": true,
        "applyNextYear": false,
        "claimEntitlement": false,
        "applyFractionUnit": true,
        "includeOtherLeaveType": "",
        "attachmentRequired": true,
        "excludeDayType": {
            "isExcludeHoliday": true,
            "isExcludeRestDay": true
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
                "textValue": "BACK DATED APPLICATION"
            },
            "excludeDayType": {
                "isExcludeHoliday": false,
                "isExcludeRestDay": false
            }
        },
        "isAllowAppliedMoreThanBalance": {
            "isCheck": true,
            "textValue": "UNPAID LEAVE"
        },
        "isAllowAfterJoinDate": {
            "isCheck": false,
            "textValue": ""
        },
        "isAllowLeaveCancelAfterDate": {
            "isCheck": false,
            "textValue": "LEAVE CANCELLATION"
        },
        "isLimitApplicationToCarryForward": {
            "isCheck": false,
            "textValue": "CARRY FORWARD LEAVE"
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
                "carryForward": 5
            }
        }
    }
}
