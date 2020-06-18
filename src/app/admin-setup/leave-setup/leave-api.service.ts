import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { APIService } from "$admin-root/src/services/shared-service/api.service";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationComponent } from "./snackbar-notification/snackbar-notification.component";
import { environment } from "$admin-root/src/environments/environment";

/**
 * Leave API endpoint
 * @export
 * @class LeaveApiService
 */
@Injectable({
    providedIn: 'root'
})
export class LeaveApiService {

    /**
     * main url of server
     * @type {string}
     * @memberof LeaveApiService
     */
    public baseUrl: string = environment.URL + ":3000";

    /**
     * snackbar reference
     * @type {*}
     * @memberof LeaveApiService
     */
    public snackBarRef: any;


    /**
     *Creates an instance of LeaveApiService.
     * @param {Http} http perform http request
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar show material snackbar message
     * @memberof LeaveApiService
     */
    constructor(public http: Http, private apiService: APIService, public snackBar: MatSnackBar) {
    }

    /**
     * Get all calendar profile list 
     * [{ "calendar_guid": "075f64d0-8cf1-11e9-805c-2f26cd7ad959", "code": "profile 1" }]
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    get_calendar_profile_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/holiday/calendar-profile');
    }

    /**
     * Get requested calendar Id details
     * restday and public holiday
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    get_personal_holiday_calendar(id: string, year: number): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/holiday/calendar-profile/days/' + id + '/' + year);
    }

    /**
     * Assign calendar profile to employee
     * @param {*} body
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    patch_assign_calendar_profile(body): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(body, '/api/admin/holiday/calendar-profile/user-calendar');
    }

    /**
     * assign working hour profile
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    patch_user_working_hours(data: any): Observable<any> {
        return this.apiService.patchApi(data, '/api/admin/working-hours/user-working-hours');
    }

    /**
     * Apply leave for employee 
     * @param {*} id
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    post_apply_leave_onBehalf(data): Observable<any> {
        this.apiService.headerAuthorization();
        return this.http.post(this.baseUrl + '/api/leave/apply-on-behalf', data, { headers: this.apiService.headers })
            .pipe(map((res: Response) => res));
        // return this.apiService.postApi(data, '/api/leave/apply-on-behalf');
    }

    /**
     * Get company list from API
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    get_company_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/company');
    }

    /**
     * Request company details from given tenant ID
     * @param {*} tenantId
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    get_company_details(tenantId): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/company/', tenantId);
    }

    /**
     * Get leavetype details list
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    get_admin_leavetype(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/leavetype');
    }

    /**
     * update leave adjustment number of day
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    patch_leave_adjustment(data): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(data, '/api/admin/leave-adjustment');
    }

    /**
     * get requested user's entitlement details
     * leave type, entitled day, balance, pending, taken
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    get_entilement_details(id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/leave-entitlement/', id);
    }

    /**
     * Get list of leave entitlement for this tenant
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    get_leavetype_entitlement(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/leavetype-entitlement');
    }

    /**
     * assign leave entitlement to user
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveApiService
     */
    post_leave_entitlement(data): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(data, '/api/leave-entitlement');
    }

    /**
    * Show message of pass or fail after post data
    * @param {string} message
    * @memberof LeaveApiService
    */
    openSnackBar(message: string, val: boolean) {
        this.snackBarRef = this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: message, response: val }
        });
    }

}