import { Injectable } from "@angular/core";
import { AttendanceSetupApiService } from "../attendance-setup-api.service";
import { Observable } from "rxjs";

/**
 * Support api
 * @export
 * @class SupportApiService
 */
@Injectable({
    providedIn: 'root'
})
export class SupportApiService {

    /**
     *Creates an instance of SupportApiService.
     * @param {AttendanceSetupApiService} attendanceApiService
     * @memberof SupportApiService
     */
    constructor(private attendanceApiService: AttendanceSetupApiService) {
    }

    /**
     * get all support message list from user
     * @returns {Observable<any>}
     * @memberof SupportApiService
     */
    get_support_list(): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApi('/support');
    }

    /**
     * get selected support conversation
     * @param {string} supportId
     * @returns {Observable<any>}
     * @memberof SupportApiService
     */
    get_support_conversation_id(supportId: string): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApi('/support/' + supportId);
    }

    /**
     * reply conversation to user
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof SupportApiService
     */
    post_support_clarification(data): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.postApi(data, '/support/admin/clarification');
    }

    /**
     * get personal basic user information
     * @returns {Observable<any>}
     * @memberof SupportApiService
     */
    get_user_info(): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApi('/api/user-info');
    }
}