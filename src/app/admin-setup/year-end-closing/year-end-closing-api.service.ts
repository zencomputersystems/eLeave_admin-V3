import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "$admin-root/src/services/shared-service/api.service";
import { MatSnackBar } from "@angular/material";
import { ApprovalOverrideApiService } from "../approval-override/approval-override-api.service";
import { SnackbarNotificationComponent } from "../leave-setup/snackbar-notification/snackbar-notification.component";
import { environment } from "$admin-root/src/environments/environment";

/**
 * Leave API endpoint
 * @export
 * @class YearEndClosingApiService
 */
@Injectable({
    providedIn: 'root'
})
export class YearEndClosingApiService {

    /**
     * main url of server
     * @type {string}
     * @memberof YearEndClosingApiService
     */
    public baseUrl: string = environment.API_URL;

    /**
     *Creates an instance of YearEndClosingApiService.
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar
     * @param {ApprovalOverrideApiService} approvalOverrideAPI
     * @memberof YearEndClosingApiService
     */
    constructor(private apiService: APIService, private snackBar: MatSnackBar, private approvalOverrideAPI: ApprovalOverrideApiService) {
    }

    /**
     * post year end closing year
     * @param {number} year
     * @param {string} companyId
     * @returns {Observable<any>}
     * @memberof YearEndClosingApiService
     */
    post_year_end_closing(year: number, companyId: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(year, '/api/admin/year-end-closing/' + year + '/' + companyId);
    }

    /**
     * get pending list
     * @returns {Observable<any>}
     * @memberof YearEndClosingApiService
     */
    get_approval_override_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.approvalOverrideAPI.get_approval_override_list()
    };

    /**
     * get pending leave from selected company id
     * @param {string} companyId
     * @returns {Observable<any>}
     * @memberof YearEndClosingApiService
     */
    get_approval_override_by_company(companyId: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/approval-override/company/' + companyId)
    };

    /**
     * get year-end policy list
     * @returns {Observable<any>}
     * @memberof YearEndClosingApiService
     */
    get_company_year_end(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/company/year-end')
    };

    /**
     * snackbar message after submit approval
     * @param {string} msg
     * @param {boolean} response
     * @memberof YearEndClosingApiService
     */
    snackbar(msg: string, response: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: msg, response: response }
        });
    }


}