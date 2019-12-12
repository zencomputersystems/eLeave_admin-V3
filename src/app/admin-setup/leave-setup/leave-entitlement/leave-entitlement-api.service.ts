import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";
import { MatSnackBar } from "@angular/material";

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
    public baseUrl: string = "http://zencore.zen.com.my:3000";

    /**
     *Creates an instance of LeaveEntitlementApiService.
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar
     * @memberof LeaveEntitlementApiService
     */
    constructor(private apiService: APIService, public snackBar: MatSnackBar) {
    }

    /**
     *
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof LeaveEntitlementApiService
     */
    get_admin_leavetype_id(id: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/admin/leavetype/', id);
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




}