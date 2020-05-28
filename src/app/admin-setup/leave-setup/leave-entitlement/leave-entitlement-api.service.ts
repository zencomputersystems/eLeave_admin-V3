import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "$admin-root/src/services/shared-service/api.service";
import { MatDialog } from "@angular/material";

/**
 * Leave API endpoint
 * @export
 * @class LeaveEntitlementApiService
 */
@Injectable({
    providedIn: 'root'
})
export class LeaveEntitlementApiService {

    /**
     * main url of server
     * @type {string}
     * @memberof LeaveEntitlementApiService
     */
    public baseUrl: string = "https://zencore.zen.com.my:3000";

    /**
     *Creates an instance of LeaveEntitlementApiService.
     * @param {APIService} apiService
     * @param {MatDialog} dialog open material dialog
     * @memberof LeaveEntitlementApiService
     */
    constructor(private apiService: APIService, public dialog: MatDialog) {
    }

    /**
     * get details of entitlement profile
     * @param {string} entitlementId
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementApiService
     */
    get_leavetype_entitlement_id(entitlementId: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/leavetype-entitlement/', entitlementId);
    }

    /**
     * delete leave entitlement profile
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementApiService
     */
    delete_leavetype_entitlement(id: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.deleteApi(id, '/api/leavetype-entitlement/');
    }

    /**
     * create new leave entitlement profile
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementApiService
     */
    post_leavetype_entitlement(data: any): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(data, '/api/leavetype-entitlement');
    }

    /**
     * update leave entitlement details
     * @param {*} details
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementApiService
     */
    patch_leavetype_entitlement(details: any): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(details, '/api/leavetype-entitlement');
    }

    /**
    * get leavetype filtered by id
    * @param {string} id
    * @returns {Observable<any>}
    * @memberof LeaveEntitlementApiService
    */
    get_admin_leavetype_id(id: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/admin/leavetype/', id);
    }

    /**
     * create new leave type
     * @param {*} content
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementApiService
     */
    post_leavetype(content: any): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(content, '/api/admin/leavetype');
    }

    /**
     * delete leave type
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementApiService
     */
    delete_leavetype(id: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.deleteApi(id, '/api/admin/leavetype/');
    }

    /**
     * update data of leavetype (abbr, code, description)
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementApiService
     */
    patch_leavetype(data): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(data, '/api/admin/leavetype');
    }





}