import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * API used in this admin folder 
 * @export
 * @class APIService
 */
@Injectable({
    providedIn: 'root'
})
export class APIService {
    /**
     * Save headers for authorization token used
     * @memberof APIService
     */
    public headers = new Headers();

    /**
     * Base URL of API 
     * @type {string}
     * @memberof APIService
     */
    public baseUrl: string = "http://zencore.zen.com.my:3000/";

    /**
     *Creates an instance of APIService.
     * @param {Http} http
     * @memberof APIService
     */
    constructor(public http: Http) {
    }

    /**
     * Pass authorize token to header
     * @memberof APIService
     */
    headerAuthorization() {
        if (this.headers["_headers"].size != 1) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
    }

    /**
     * Get endpoint with assign path
     * @param {string} address
     * @returns
     * @memberof APIService
     */
    getApi(address: string) {
        return this.http.get(this.baseUrl + address, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * Get endpoint with assign path & guid
     * @param {string} address
     * @param {string} guid
     * @returns
     * @memberof APIService
     */
    getApiWithId(address: string, guid: string) {
        return this.http.get(this.baseUrl + address + guid, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * Update endpoint to given path and body data
     * @param {*} body
     * @param {string} url
     * @returns
     * @memberof APIService
     */
    patchApi(body: any, url: string) {
        return this.http.patch(this.baseUrl + url, body, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * POST endpoint to given path & data
     * @param {*} data
     * @param {string} address
     * @returns
     * @memberof APIService
     */
    postApi(data: any, address: string) {
        return this.http.post(this.baseUrl + address, data, { headers: this.headers })
            .pipe(map((res: Response) => res.json()
            ));
    }

    /**
     * Get personal details JSON data from API
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_personal_details(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('api/userprofile/personal-detail');
    }

    /**
     * Update personal details to endpoint
     * @param {*} updateData
     * @returns {Observable<any[]>}
     * @memberof APIService
     */
    patch_personal_details(updateData): Observable<any[]> {
        this.headerAuthorization();
        return this.patchApi(updateData, 'api/userprofile/personal-detail');
    }

    /**
     * Get employment details JSON data from API
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_employment_details(userId): Observable<any> {
        return this.getApiWithId('api/userprofile/employment-detail/', userId);
    }

    /**
     * Update employment details to endpoint
     * @param {*} updateData
     * @returns {Observable<any>}
     * @memberof APIService
     */
    patch_employment_details(updateData: any): Observable<any> {
        this.headerAuthorization();
        return this.patchApi(updateData, 'api/userprofile/employment-detail');
    }

    /**
     * Get user profile list JSON data from endpoint
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile_list(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('api/users');
    }

    /**
     * POST invited new user Id to endpoint
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof APIService
     */
    post_user_invite(userId): Observable<any> {
        this.headerAuthorization();
        return this.postApi(userId, 'api/invitation');
    }

    /**
     * Get public holiday JSON data from endpoint calendarific
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_public_holiday_list(param?): Observable<any> {
        this.headerAuthorization();
        // return this.getApi('api/admin/holiday/calendar', {params: data});
        return this.http.get(this.baseUrl + 'api/admin/holiday/calendar', { params: param, headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * Get all calendar profile list 
     * [{ "calendar_guid": "075f64d0-8cf1-11e9-805c-2f26cd7ad959", "code": "profile 1" }]
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_calendar_profile_list(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('api/admin/holiday/calendar-profile');
    }

    /**
     * Update calendar for specific calendar Id profile (each employee)
     * @param {*} profileBody
     * @returns {Observable<any>}
     * @memberof APIService
     */
    patch_calendar_profile(profileBody): Observable<any> {
        this.headerAuthorization();
        return this.patchApi(profileBody, 'api/admin/holiday/calendar-profile');
    }

    /**
     * Setup new calendar profile with different holiday or rest day
     * @param {*} newProfile
     * @returns {Observable<any>}
     * @memberof APIService
     */
    post_calendar_profile(newProfile): Observable<any> {
        this.headerAuthorization();
        return this.postApi(newProfile, 'api/admin/holiday/calendar-profile');
    }

    get_personal_holiday_calendar(id): Observable<any> {
        // this.headerAuthorization();
        return this.getApiWithId('api/admin/holiday/', id);
    }


}

