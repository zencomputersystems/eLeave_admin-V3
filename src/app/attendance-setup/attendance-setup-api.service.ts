import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'angular-web-storage';
import { environment } from '../../../src/environments/environment';
import { AuthService } from '$admin-root/src/services/shared-service/auth.service';

/**
 * API used in this admin folder 
 * @export
 * @class AttendanceSetupApiService
 */
@Injectable({
    providedIn: 'root'
})
export class AttendanceSetupApiService {
    /**
     * Save headers for authorization token used
     * @memberof AttendanceSetupApiService
     */
    public headers = new Headers();

    /**
     * Base URL of API 
     * @type {string}
     * @memberof AttendanceSetupApiService
     */
    public baseUrl: string = environment.ATTENDANCE_MAIN_URL;

    /**
     *Creates an instance of AttendanceSetupApiService.
     * @param {Http} http perform http request
     * @param {LocalStorageService} local
     * @param {AuthService} auth
     * @memberof AttendanceSetupApiService
     */
    constructor(public http: Http, private local: LocalStorageService, private auth: AuthService) {
    }

    /**
     * Pass authorize token to header
     * @memberof AttendanceSetupApiService
     */
    headerAuthorization() {
        if (this.headers["_headers"].size != 1 && this.auth.isAuthenticated) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(this.local.get('access_token')));
        }
    }

    /**
     * Get endpoint with assign path
     * @param {string} address
     * @returns
     * @memberof AttendanceSetupApiService
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
     * @memberof AttendanceSetupApiService
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
     * @memberof AttendanceSetupApiService
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
     * @memberof AttendanceSetupApiService
     */
    postApi(data: any, address: string) {
        return this.http.post(this.baseUrl + address, data, { headers: this.headers })
            .pipe(map((res: Response) => res.json()
            ));
    }

    /**
     * DELETE endpoint 
     * @param {string} value
     * @param {string} add
     * @returns
     * @memberof AttendanceSetupApiService
     */
    deleteApi(value: string, add: string) {
        return this.http.delete(this.baseUrl + add + value, { headers: this.headers })
            .pipe(map((res: Response) => res.json()
            ));
    }

    /**
     * Get attendance profile list
     * @returns {Observable<any>}
     * @memberof AttendanceSetupApiService
     */
    get_attendance_list(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/api/admin/attendance/attendance-profile');
    }

    /**
     * get user list under specific attendance profile 
     * @param {string} attendanceId
     * @returns {Observable<any>}
     * @memberof AttendanceSetupApiService
     */
    get_attendance_user_list(attendanceId: string): Observable<any> {
        this.headerAuthorization();
        return this.getApiWithId('/api/admin/attendance/attendance-profile/users/', attendanceId);
    }

    /**
     * get attendance profile details
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof AttendanceSetupApiService
     */
    get_attendance_details(id): Observable<any> {
        this.headerAuthorization();
        return this.getApiWithId('/api/admin/attendance/attendance-profile/', id);
    }

    /**
     * update attendance profile details
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof AttendanceSetupApiService
     */
    patch_attendance_details(data): Observable<any> {
        this.headerAuthorization();
        return this.patchApi(data, '/api/admin/attendance/attendance-profile');
    }

    /**
     * assign user to attendance profile
     * @param {*} patchData
     * @returns {Observable<any>}
     * @memberof AttendanceSetupApiService
     */
    patch_user_attendance(patchData): Observable<any> {
        this.headerAuthorization();
        return this.patchApi(patchData, '/api/admin/attendance/user-attendance');
    }

    /**
     * create new attendance profile
     * @param {*} newData
     * @returns {Observable<any>}
     * @memberof AttendanceSetupApiService
     */
    post_attendance_profile(newData): Observable<any> {
        this.headerAuthorization();
        return this.postApi(newData, '/api/admin/attendance/attendance-profile');
    }

    /**
     * delete attendance profile
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof AttendanceSetupApiService
     */
    delete_attendance_profile(id): Observable<any> {
        this.headerAuthorization();
        return this.deleteApi(id, '/api/admin/attendance/attendance-profile/');
    }


}

