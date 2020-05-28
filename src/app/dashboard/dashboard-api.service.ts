import { Injectable } from '@angular/core';
import { APIService } from '$admin-root/src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from '../admin-setup/leave-setup/snackbar-notification/snackbar-notification.component';

/**
 * ALl API for dashboard page
 * @export
 * @class DashboardApiService
 */
@Injectable({
    providedIn: 'root'
})
export class DashboardApiService {

    /**
     *Creates an instance of DashboardApiService.
     * @param {APIService} apiService get all api service
     * @param {Http} http perform http request
     * @memberof DashboardApiService
     */
    constructor(public apiService: APIService, public http: Http, private snackBar: MatSnackBar) {
    }

    /**
     * get all announcement created from admin
     * @returns
     * @memberof DashboardApiService
     */
    get_announcement_list() {
        return this.apiService.getApi('/api/admin/announcement');
    }

    /**
     * create announcement
     * @param {*} data
     * @returns
     * @memberof DashboardApiService
     */
    post_announcement_list(data: any) {
        return this.apiService.postApi(data, '/api/admin/announcement');
    }

    /**
     * edit announcement data
     * @param {*} body
     * @returns
     * @memberof DashboardApiService
     */
    patch_announcement(body: any) {
        return this.apiService.patchApi(body, '/api/admin/announcement');
    }

    /**
     * delete announcement
     * @param {*} id
     * @returns
     * @memberof DashboardApiService
     */
    delete_announcement_list(id: any) {
        return this.apiService.deleteApi(id, '/api/admin/announcement/');
    }


    /**
     * get upcoming holidays from today date
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_upcoming_holidays(): Observable<any> {
        return this.apiService.getApi('/api/employee/upcoming-holiday');
    }

    /**
     * get long leave (>5 days) details
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_long_leave_reminder(): Observable<any> {
        return this.apiService.getApi('/api/employee/long-leave/admin');
    }

    /**
     * admin take action on task leave from dashboard
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    post_leave_status(action: string, data): Observable<any> {
        return this.http.post(this.apiService.baseUrl + '/api/leave/' + action, data, { headers: this.apiService.headers })
            .pipe(map((value: Response) => value.text()))
    }

    /**
     * upcoming joiner, leaver, birthday
     * @param {string} item
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    upcoming_item(item: string): Observable<any> {
        return this.apiService.getApi('/api/admin/dashboard/' + item);
    }

    /**
     * show POST action request after click send confirmation
     * @param {string} msg
     * @memberof DashboardApiService
     */
    snackbarMessage(msg: string, value: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: msg, response: value }
        });
    }
}