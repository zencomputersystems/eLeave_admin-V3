import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationComponent } from "../../admin-setup/leave-setup/snackbar-notification/snackbar-notification.component";
import { AttendanceSetupApiService } from "../attendance-setup-api.service";
import { Http } from "@angular/http";

/**
 * Client API
 * @export
 * @class ImportAttendanceApiService
 */
@Injectable({
    providedIn: 'root'
})
export class ImportAttendanceApiService {

    /**
     *Creates an instance of ImportAttendanceApiService.
     * @param {MatSnackBar} snackBar
     * @param {APIService} attendanceApiService
     * @memberof ImportAttendanceApiService
     */
    constructor(public http: Http, private snackBar: MatSnackBar, private attendanceApiService: AttendanceSetupApiService) {
    }

    /**
     * Get attendance log
     * @returns {Observable<any>}
     * @memberof ImportAttendanceApiService
     */
    get_log(): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApi('/admin/import-clock/attendance-upload-log');
    }

    /**
     * upload new attendance csv file
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof ImportAttendanceApiService
     */
    post_csv_file(data): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.postApi(data, '/admin/import-clock/csv');
    }

    /**
     * show delete confirmation after click Delete button
     * @param {string} text
     * @memberof ImportAttendanceApiService
     */
    snackbarMsg(text: string, value: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: text, response: value }
        });
    }




}