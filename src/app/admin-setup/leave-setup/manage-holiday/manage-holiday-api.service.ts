import { Injectable } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { LeaveApiService } from '../leave-api.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from '../snackbar-notification/snackbar-notification';
import { Response } from '@angular/http';
import { map } from 'rxjs/operators';

/**
 * API for manage holiday
 * @export
 * @class ManageHolidayApiService
 */
@Injectable({
    providedIn: 'root'
})
export class ManageHolidayApiService {

    /**
     *Creates an instance of ManageHolidayApiService.
     * @param {APIService} api
     * @param {LeaveApiService} leaveApi
     * @param {MatSnackBar} snackBar
     * @memberof ManageHolidayApiService
     */
    constructor(private api: APIService, private leaveApi: LeaveApiService, private snackBar: MatSnackBar) { }

    /**
     * Delete calendar profile
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof ManageHolidayApiService
     */
    delete_calendar_profile(id: string): Observable<any> {
        this.api.headerAuthorization();
        return this.api.deleteApi(id, '/api/admin/holiday/calendar-profile/');
    }

    /**
     * Get all calendar profile list 
     * [{ "calendar_guid": "075f64d0-8cf1-11e9-805c-2f26cd7ad959", "code": "profile 1" }]
     * @returns {Observable<any>}
     * @memberof ManageHolidayApiService
     */
    get_calendar_profile_list(): Observable<any> {
        return this.leaveApi.get_calendar_profile_list();
    }

    /**
     * Update calendar for specific calendar Id profile (each employee)
     * @param {*} profileBody
     * @returns {Observable<any>}
     * @memberof ManageHolidayApiService
     */
    patch_calendar_profile(profileBody: any): Observable<any> {
        this.api.headerAuthorization();
        return this.api.patchApi(profileBody, '/api/admin/holiday/calendar-profile');
    }

    /**
     * Setup new calendar profile with different holiday or rest day
     * @param {*} newProfile
     * @returns {Observable<any>}
     * @memberof ManageHolidayApiService
     */
    post_calendar_profile(newProfile): Observable<any> {
        this.api.headerAuthorization();
        return this.api.postApi(newProfile, '/api/admin/holiday/calendar-profile');
    }

    /**
     * Get public holiday JSON data from endpoint calendarific
     * @returns {Observable<any>}
     * @memberof ManageHolidayApiService
     */
    get_public_holiday_list(param?: any): Observable<any> {
        this.api.headerAuthorization();
        return this.api.http.get(this.api.baseUrl + '/api/admin/holiday/calendar', { params: param, headers: this.api.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * Get requested calendar Id details
     * restday and public holiday
     * @param {string} ID
     * @returns {Observable<any>}
     * @memberof ManageHolidayApiService
     */
    get_personal_holiday_calendar(ID: string): Observable<any> {
        return this.leaveApi.get_personal_holiday_calendar(ID);
    }

    /**
     * get all employee onleave list
     * @returns {Observable<any>}
     * @memberof ManageHolidayApiService
     */
    get_calendar_onleave_list(date: any): Observable<any> {
        return this.api.http.get(this.api.baseUrl + '/api/employee/calendar-leave-list', { params: date, headers: this.api.headers })
            .pipe(map((response: Response) => response.json()))
    }

    /**
    * Show notification after submit
    * @param {string} text
    * @memberof ManageHolidayApiService
    */
    notification(text: string) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 3000,
            data: text
        });
    }

}