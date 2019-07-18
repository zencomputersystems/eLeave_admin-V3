import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

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
     * header value to be append in application
     * @memberof LeaveAPIService
     */
    public headerValue = new Headers();

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
    constructor(public http: Http) {
    }

    /**
     * pass authorized token to application header
     * @memberof LeaveAPIService
     */
    tokenAuthorization() {
        if (this.headerValue["_headers"].size < 1) {
            this.headerValue.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
    }

    /**
     * Get endpoint with assign path
     * @param {string} url
     * @returns
     * @memberof LeaveAPIService
     */
    GET(url: string) {
        return this.http.get(this.baseUrl + url, { headers: this.headerValue })
            .pipe(map((response: Response) => response.json()))
    }

    /**
     * Get endpoint with assign path & guid
     * @param {string} url
     * @param {string} ID
     * @returns
     * @memberof LeaveAPIService
     */
    GET_ID(url: string, ID: string) {
        return this.http.get(this.baseUrl + url + ID, { headers: this.headerValue })
            .pipe(map((response: Response) => response.json()))
    }

    /**
     * Update endpoint to given path and body data
     * @param {*} data
     * @param {string} urlPath
     * @returns
     * @memberof LeaveAPIService
     */
    PATCH(data: any, urlPath: string) {
        return this.http.patch(this.baseUrl + urlPath, data, { headers: this.headerValue })
            .pipe(map((response: Response) => response.json()))
    }

    /**
     * POST endpoint to given path & data
     * @param {*} bodyDetails
     * @param {string} url
     * @returns
     * @memberof LeaveAPIService
     */
    POST(bodyDetails: any, url: string) {
        return this.http.post(this.baseUrl + url, bodyDetails, { headers: this.headerValue })
            .pipe(map((response: Response) => response.json()
            ));
    }

    /**
     * Get public holiday JSON data from endpoint calendarific
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_public_holiday_list(param?): Observable<any> {
        this.tokenAuthorization();
        return this.http.get(this.baseUrl + '/api/admin/holiday/calendar', { params: param, headers: this.headerValue })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * Get all calendar profile list 
     * [{ "calendar_guid": "075f64d0-8cf1-11e9-805c-2f26cd7ad959", "code": "profile 1" }]
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_calendar_profile_list(): Observable<any> {
        this.tokenAuthorization();
        return this.GET('/api/admin/holiday/calendar-profile');
    }

    /**
     * Update calendar for specific calendar Id profile (each employee)
     * @param {*} profileBody
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    patch_calendar_profile(profileBody): Observable<any> {
        this.tokenAuthorization();
        return this.PATCH(profileBody, '/api/admin/holiday/calendar-profile');
    }

    /**
     * Setup new calendar profile with different holiday or rest day
     * @param {*} newProfile
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    post_calendar_profile(newProfile): Observable<any> {
        this.tokenAuthorization();
        return this.POST(newProfile, '/api/admin/holiday/calendar-profile');
    }

    /**
     * Get requested calendar Id details
     * restday and public holiday
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_personal_holiday_calendar(id): Observable<any> {
        this.tokenAuthorization();
        return this.GET_ID('/api/admin/holiday/', id);
    }

    /**
     * Assign calendar profile to employee
     * @param {*} body
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    patch_assign_calendar_profile(body): Observable<any> {
        this.tokenAuthorization();
        return this.PATCH(body, '/api/admin/holiday/user-calendar');
    }

    /**
     * Apply leave for employee 
     * @param {*} id
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    post_apply_leave_onBehalf(id, data): Observable<any> {
        this.tokenAuthorization();
        return this.POST(data, '/api/leave/apply-on-behalf/' + id);
    }

    /**
     * Get company list from API
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_compant_list(): Observable<any> {
        this.tokenAuthorization();
        return this.GET('/api/company');
    }

    /**
     * Request company details from given tenant ID
     * @param {*} tenantId
     * @returns {Observable<any>}
     * @memberof LeaveAPIService
     */
    get_company_details(tenantId): Observable<any> {
        this.tokenAuthorization();
        return this.GET_ID('/api/company/', tenantId);
    }
}