import { Injectable } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { LeaveApiService } from '../leave-api.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from '../snackbar-notification/snackbar-notification.component';

/**
 * assign calendar API
 * @export
 * @class AssignCalendarApiService
 */
@Injectable({
    providedIn: 'root'
})
export class AssignCalendarApiService {

    /**
     *Creates an instance of AssignCalendarApiService.
     * @param {APIService} api
     * @param {LeaveApiService} leaveAPI
     * @memberof AssignCalendarApiService
     */
    constructor(private api: APIService, private leaveAPI: LeaveApiService, public snackBar: MatSnackBar) {
    }

    /**
     * get all user list
     * @returns {Observable<any>}
     * @memberof AssignCalendarApiService
     */
    get_user_list(): Observable<any> {
        return this.api.get_user_profile_list();
    }

    /**
     * get all calendar profile list
     * @returns {Observable<any>}
     * @memberof AssignCalendarApiService
     */
    get_calendar_profile_list(): Observable<any> {
        return this.leaveAPI.get_calendar_profile_list();
    }

    /**
     * get requested holiday calendar
     * @param {*} calendarId
     * @returns {Observable<any>}
     * @memberof AssignCalendarApiService
     */
    get_personal_holiday_calendar(calendarId): Observable<any> {
        return this.leaveAPI.get_personal_holiday_calendar(calendarId);
    }

    /**
     * update calendar profile
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof AssignCalendarApiService
     */
    patch_assign_calendar_profile(data): Observable<any> {
        return this.leaveAPI.patch_assign_calendar_profile(data);
    }

    /**
     * Display message after submitted calendar profile
     * @param {string} message
     * @memberof AssignCalendarApiService
     */
    openSnackBar(message: string) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 2500,
            data: message
        });
    }


}