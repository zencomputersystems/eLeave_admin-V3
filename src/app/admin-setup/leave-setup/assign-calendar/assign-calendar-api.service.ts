import { Injectable } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { LeaveAPIService } from '../leave-api.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationPage } from '../snackbar-notification/snackbar-notification';

/**
 * assign calendar API
 * @export
 * @class AssignCalendarAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class AssignCalendarAPIService {

    /**
     *Creates an instance of AssignCalendarAPIService.
     * @param {APIService} api
     * @param {LeaveAPIService} leaveAPI
     * @memberof AssignCalendarAPIService
     */
    constructor(private api: APIService, private leaveAPI: LeaveAPIService, public snackBar: MatSnackBar) {
    }

    /**
     * get all user list
     * @returns {Observable<any>}
     * @memberof AssignCalendarAPIService
     */
    get_user_list(): Observable<any> {
        return this.api.get_user_profile_list();
    }

    /**
     * get all calendar profile list
     * @returns {Observable<any>}
     * @memberof AssignCalendarAPIService
     */
    get_calendar_profile_list(): Observable<any> {
        return this.leaveAPI.get_calendar_profile_list();
    }

    /**
     * get requested holiday calendar
     * @param {*} calendarId
     * @returns {Observable<any>}
     * @memberof AssignCalendarAPIService
     */
    get_personal_holiday_calendar(calendarId): Observable<any> {
        return this.leaveAPI.get_personal_holiday_calendar(calendarId);
    }

    /**
     * update calendar profile
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof AssignCalendarAPIService
     */
    patch_assign_calendar_profile(data): Observable<any> {
        return this.leaveAPI.patch_assign_calendar_profile(data);
    }

    /**
     * Display message after submitted calendar profile
     * @param {string} message
     * @memberof AssignCalendarAPIService
     */
    openSnackBar(message: string) {
        this.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 2500,
            data: message
        });
    }


}