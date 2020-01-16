import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";
import { MatSnackBar } from "@angular/material";
import { ApprovalOverrideApiService } from "../approval-override/approval-override-api.service";
import { SnackbarNotificationComponent } from "../leave-setup/snackbar-notification/snackbar-notification.component";

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
    public baseUrl: string = "http://zencore.zen.com.my:3000";

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
     * @returns {Observable<any>}
     * @memberof YearEndClosingApiService
     */
    post_year_end_closing(year: number): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(year, '/api/admin/year-end-closing/' + year);
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
     * snackbar message after submit approval
     * @param {string} text
     * @param {boolean} value
     * @memberof YearEndClosingApiService
     */
    snackbar(text: string, value: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 3000,
            verticalPosition: "top",
            data: { message: text, response: value }
        });
    }


}