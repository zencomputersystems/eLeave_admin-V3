import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";
import { map } from "rxjs/operators";

/**
 * API for leave entitlement by batch
 * @export
 * @class LeaveEntitlementByBatchApiService
 */
@Injectable({
    providedIn: 'root'
})
export class LeaveEntitlementByBatchApiService {

    /**
     *Creates an instance of LeaveEntitlementByBatchApiService.
     * @param {Http} http to perform http request
     * @param {APIService} apiService
     * @memberof LeaveEntitlementByBatchApiService
     */
    constructor(public http: Http, private apiService: APIService) {
    }

    /**
     * Get list of leave entitlement for this tenant
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementByBatchApiService
     */
    get_leavetype_entitlement(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/leavetype-entitlement');
    }

    /**
     * Assign leave entitlement to user
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementByBatchApiService
     */
    post_leave_entitlement(value): Observable<any> {
        this.apiService.headerAuthorization();
        // return this.apiService.postApi(value, '/api/leave-entitlement');
        return this.http.post(this.apiService.baseUrl + '/api/leave-entitlement', value, { headers: this.apiService.headers })
            .pipe(map((response) => response.text()))
    }

    /**
     * return user list from API service
     * @returns
     * @memberof LeaveEntitlementByBatchApiService
     */
    get_user_list() {
        return this.apiService.get_user_profile_list();
    }
}