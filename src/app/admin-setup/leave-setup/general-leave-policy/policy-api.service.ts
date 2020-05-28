import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "$admin-root/src/services/shared-service/api.service";
import { LeaveApiService } from "../leave-api.service";
import { MatDialog } from "@angular/material";
import { SnackbarNotificationComponent } from "../snackbar-notification/snackbar-notification.component";

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
     * @param {LeaveApiService} leaveAPi
     * @param {MatDialog} dialog open material dialog
     * @memberof PolicyApiService
     */
    constructor(private apiService: APIService, private leaveAPi: LeaveApiService, public dialog: MatDialog) {

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
     * create new company 
     * @param {string} name
     * @returns {Observable<any>}
     * @memberof PolicyApiService
     */
    post_company_name(name): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(name, '/api/company/' + name);
    }

    /**
     * delete company from list
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof PolicyApiService
     */
    delete_company_name(id: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.deleteApi(id, '/api/company/');
    }

    /**
     * update company name
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof PolicyApiService
     */
    patch_company_name(data: any): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(data, '/api/company');
    }

    /**
     * get all user list
     * @returns {Observable<any>}
     * @memberof PolicyApiService
     */
    get_user_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.get_user_profile_list();
    }

    /**
     * show notifation snackbar after clicked create policy
     * @param {string} message
     * @param {boolean} value
     * @memberof PolicyApiService
     */
    message(message: string, value: boolean) {
        this.leaveAPi.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: message, response: value }
        });
    }

}