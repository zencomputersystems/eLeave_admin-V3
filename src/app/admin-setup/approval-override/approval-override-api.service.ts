import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "../../../../src/services/shared-service/api.service";
import { LeaveApiService } from "../leave-setup/leave-api.service";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationComponent } from "../leave-setup/snackbar-notification/snackbar-notification.component";

/**
 * Approval override API endpoint
 * @export
 * @class ApprovalOverrideApiService
 */
@Injectable({
    providedIn: 'root'
})
export class ApprovalOverrideApiService {

    /**
     *Creates an instance of ApprovalOverrideApiService.
     * @param {APIService} apiService
     * @param {LeaveApiService} leaveAPI
     * @param {MatSnackBar} snackbar
     * @memberof ApprovalOverrideApiService
     */
    constructor(public apiService: APIService, private leaveAPI: LeaveApiService, public snackbar: MatSnackBar) { }

    /**
     * Get all the pending leave application list
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideApiService
     */
    get_approval_override_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/approval-override');
    }

    /**
     * submit leave application status (approve, reject, cancel)
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideApiService
     */
    patch_approval_override(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(value, '/api/admin/approval-override');
    }

    /**
     * return company list from leave api
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideApiService
     */
    get_company_list(): Observable<any> {
        return this.leaveAPI.get_company_list();
    }

    /**
     * get company details from leave api service
     * @param {*} tenant_Id
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideApiService
     */
    get_company_detail(tenant_Id): Observable<any> {
        return this.leaveAPI.get_company_details(tenant_Id);
    }

    /**
     * get leave type list from leave api
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideApiService
     */
    get_admin_leavetype(): Observable<any> {
        return this.leaveAPI.get_admin_leavetype();
    }

    /**
     * get user list from api service
     * @returns {Observable<any>}
     * @memberof ApprovalOverrideApiService
     */
    get_user_profile_list(): Observable<any> {
        return this.apiService.get_user_profile_list();
    }

    /**
     * snackbar message after submit approval
     * @param {string} text
     * @param {boolean} value
     * @memberof ApprovalOverrideApiService
     */
    notification(text: string, value: boolean) {
        this.snackbar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: text, response: value }
        });
    }


}