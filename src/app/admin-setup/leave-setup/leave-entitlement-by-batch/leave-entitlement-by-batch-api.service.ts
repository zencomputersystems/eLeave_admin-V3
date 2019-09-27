import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";

/**
 * API for leave entitlement by batch
 * @export
 * @class LeaveEntitlementByBatchAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class LeaveEntitlementByBatchAPIService {

    /**
     *Creates an instance of LeaveEntitlementByBatchAPIService.
     * @param {Http} http
     * @param {APIService} apiService
     * @memberof LeaveEntitlementByBatchAPIService
     */
    constructor(public http: Http, private apiService: APIService) {
    }

    /**
     * Get list of leave entitlement for this tenant
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementByBatchAPIService
     */
    get_leavetype_entitlement(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/leavetype-entitlement');
    }

    /**
     * Assign leave entitlement to user
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementByBatchAPIService
     */
    post_leave_entitlement(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(value, '/api/leave-entitlement');
    }

    /**
     * return user list from API service
     * @returns
     * @memberof LeaveEntitlementByBatchAPIService
     */
    get_user_list() {
        return this.apiService.get_user_profile_list();
    }
}