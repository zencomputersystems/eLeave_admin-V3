import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";
import { LeaveApiService } from "../leave-setup/leave-api.service";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationComponent } from "../leave-setup/snackbar-notification/snackbar-notification.component";

/**
 * API for policy
 * @export
 * @class PolicyApiService
 */
@Injectable({
    providedIn: 'root'
})
export class PolicyApiService {

    /**
     *Creates an instance of PolicyApiService.
     * @param {APIService} apiService
     * @memberof PolicyApiService
     */
    constructor(private apiService: APIService, private leaveAPi: LeaveApiService, public snackbar: MatSnackBar) {

    }

    /**
     * create new policy for tenant
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof PolicyApiService
     */
    post_general_leave_policy(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(value, '/api/admin/general-leave-policy');
    }

    /**
     * get all tenant policy list 
     * @returns {Observable<any>}
     * @memberof PolicyApiService
     */
    get_general_leave_policy_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/general-leave-policy');
    }

    /**
     * update the selected tenant policy
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof PolicyApiService
     */
    patch_general_leave_policy(data): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(data, '/api/admin/general-leave-policy');
    }

    /**
     * get general leave policy details from specific Id
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof PolicyApiService
     */
    get_general_leave_policy_id(id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/admin/general-leave-policy/', id);
    }

    /**
    * return company list from leave api
    * @returns {Observable<any>}
    * @memberof PolicyApiService
    */
    get_company_list(): Observable<any> {
        return this.leaveAPi.get_company_list();
    }

    /**
     * show notifation snackbar after clicked create policy
     * @param {string} message
     * @memberof PolicyApiService
     */
    message(message: string) {
        this.snackbar.openFromComponent(SnackbarNotificationComponent, {
            duration: 2500,
            data: message
        });
    }

}