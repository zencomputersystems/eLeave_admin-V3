import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";
import { LeaveAPIService } from "../leave-api.service";

/**
 * Approval override API endpoint
 * @export
 * @class ApprovalOverrideAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class ApprovalOverrideAPIService {

    /**
     *Creates an instance of ApprovalOverrideAPIService.
     * @param {APIService} apiService
     * @param {LeaveAPIService} leaveAPI
     * @memberof ApprovalOverrideAPIService
     */
    constructor(private apiService: APIService, private leaveAPI: LeaveAPIService) { }

    /**
     * Get all the pending leave application list
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideAPIService
     */
    get_approval_override_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/approval-override');
    }

    /**
     * submit leave application status (approve, reject, cancel)
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideAPIService
     */
    patch_approval_override(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(value, '/api/admin/approval-override');
    }

    /**
     * return company list from leave api
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideAPIService
     */
    get_company_list(): Observable<any> {
        return this.leaveAPI.get_company_list();
    }

    /**
     * get company details from leave api service
     * @param {*} tenant_Id
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideAPIService
     */
    get_company_detail(tenant_Id): Observable<any> {
        return this.leaveAPI.get_company_details(tenant_Id);
    }

    /**
     * get leave type list from leave api
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideAPIService
     */
    get_admin_leavetype(): Observable<any> {
        return this.leaveAPI.get_admin_leavetype();
    }

    /**
     * get user list from api service
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideAPIService
     */
    get_user_profile_list(): Observable<any> {
        return this.apiService.get_user_profile_list();
    }


}