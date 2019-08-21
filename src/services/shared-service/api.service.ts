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
    public baseUrl: string = "http://zencore.zen.com.my:3000";

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
        return this.getApi('/api/userprofile/personal-detail');
    }

    /**
     * Update personal details to endpoint
     * @param {*} updateData
     * @returns {Observable<any[]>}
     * @memberof APIService
     */
    patch_personal_details(updateData): Observable<any[]> {
        this.headerAuthorization();
        return this.patchApi(updateData, '/api/userprofile/personal-detail');
    }

    /**
     * Get employment details JSON data from API
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_employment_details(userId): Observable<any> {
        return this.getApiWithId('/api/userprofile/employment-detail/', userId);
    }

    /**
     * Update employment details to endpoint
     * @param {*} updateData
     * @returns {Observable<any>}
     * @memberof APIService
     */
    patch_employment_details(updateData: any): Observable<any> {
        this.headerAuthorization();
        return this.patchApi(updateData, '/api/userprofile/employment-detail');
    }

    /**
     * This method is used to get user profile information of requested GUID
     * @param {*} guid
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile_details(guid): Observable<any> {
        this.headerAuthorization();
        return this.http.get(this.baseUrl + '/api/userprofile/' + guid, { headers: this.headers })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * Get user profile list JSON data from endpoint
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile_list(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/api/users');
    }

    /**
     * This method is used to get any desired item
     * department, designation, section, branch, bank, costcentre, country
     * @param {*} item
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_master_list(item): Observable<any> {
        this.headerAuthorization();
        return this.getApiWithId('/api/admin/master/', item);
    }


}

