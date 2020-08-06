import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material";
import { APIService } from "../../../../src/services/shared-service/api.service";
import { environment } from "../../../../src/environments/environment";
import { SnackbarNotificationComponent } from "../../admin-setup/leave-setup/snackbar-notification/snackbar-notification.component";
import { AttendanceSetupApiService } from "../attendance-setup-api.service";

/**
 * Client API
 * @export
 * @class ClientApiService
 */
@Injectable({
    providedIn: 'root'
})
export class ClientApiService {

    /**
     *Creates an instance of ClientApiService.
     * @param {MatSnackBar} snackBar
     * @param {APIService} attendanceApiService
     * @memberof ClientApiService
     */
    constructor(private snackBar: MatSnackBar, private attendanceApiService: AttendanceSetupApiService) {
    }

    /**
     * Client profile list
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    get_client_profile_list(): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApi('/api/client/detail');
    }

    /**
     * Project list
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    get_project_list(): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApi('/api/project');
    }

    /**
     * show delete confirmation after click Delete button
     * @param {string} sentences
     * @memberof ClientApiService
     */
    snackbarMsg(sentences: string, value: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: sentences, response: value }
        });
    }




}