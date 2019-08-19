import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";

/**
 * Leave API endpoint
 * @export
 * @class LeaveAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class LeaveAPIService {

    /**
     * main url of server
     * @type {string}
     * @memberof LeaveAPIService
     */
    public baseUrl: string = "http://zencore.zen.com.my:3000";

    /**
     *Creates an instance of LeaveAPIService.
     * @param {Http} http
     * @memberof LeaveAPIService
     */
    constructor(public http: Http, private apiService: APIService) {
    }

    /**
     * Get public holiday JSON data from endpoint calendarific
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_public_holiday_list(param?): Observable<any> {
        this.apiService.headerAuthorization();
        return this.http.get(this.baseUrl + '/api/admin/holiday/calendar', { params: param, headers: this.apiService.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * Get all calendar profile list 
     * [{ "calendar_guid": "075f64d0-8cf1-11e9-805c-2f26cd7ad959", "code": "profile 1" }]
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_calendar_profile_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/holiday/calendar-profile');
    }

    /**
     * Update calendar for specific calendar Id profile (each employee)
     * @param {*} profileBody
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    patch_calendar_profile(profileBody): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(profileBody, '/api/admin/holiday/calendar-profile');
    }

    /**
     * Setup new calendar profile with different holiday or rest day
     * @param {*} newProfile
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    post_calendar_profile(newProfile): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(newProfile, '/api/admin/holiday/calendar-profile');
    }

    /**
     * Get requested calendar Id details
     * restday and public holiday
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_personal_holiday_calendar(id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/admin/holiday/', id);
    }

    /**
     * Assign calendar profile to employee
     * @param {*} body
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    patch_assign_calendar_profile(body): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(body, '/api/admin/holiday/user-calendar');
    }

    /**
     * Delete calendar profile
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    delete_calendar_profile(id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.http.delete(this.baseUrl + '/api/admin/holiday/calendar-profile/' + id, { headers: this.apiService.headers })
            .pipe(map((res: Response) => res));
    }

    /**
     * Apply leave for employee 
     * @param {*} id
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
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
     * @memberof LeaveAPIService
     */
    get_company_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/company');
    }

    /**
     * Request company details from given tenant ID
     * @param {*} tenantId
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_company_details(tenantId): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/company/', tenantId);
    }

    /**
     * Get leavetype details list
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_admin_leavetype(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/leavetype');
    }

    /**
     * Get all the pending leave application list
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_approval_override_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/approval-override');
    }

    /**
     * submit leave application status (approve, reject, cancel)
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    patch_approval_override(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(value, '/api/admin/approval-override');
    }

    /**
     * update leave adjustment number of day
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    patch_leave_adjustment(data): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(data, '/api/admin/leave-adjustment');
    }
}