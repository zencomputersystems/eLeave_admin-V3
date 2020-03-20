import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationComponent } from "../snackbar-notification/snackbar-notification.component";

/**
 * Working hour profile API
 * @export
 * @class WorkingHourApiService
 */
@Injectable({
    providedIn: 'root'
})
export class WorkingHourApiService {

    /**
     *Creates an instance of WorkingHourApiService.
     * @param {Http} http perform http request
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar show material snackbar message
     * @memberof WorkingHourApiService
     */
    constructor(public http: Http, private apiService: APIService, public snackBar: MatSnackBar) {
    }

    /**
     * get all list of working hour profile
     * @returns {Observable<any>}
     * @memberof WorkingHourApiService
     */
    get_working_hours_profile_list(): Observable<any> {
        return this.apiService.getApi('/api/admin/working-hours/working-hours-profile');
    }

    /**
     * get details from requested working hour profile id
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof WorkingHourApiService
     */
    get_working_hours_details(id: string): Observable<any> {
        return this.apiService.getApiWithId('/api/admin/working-hours/', id);
    }

    /** 
     * post data to create new working hour profile
     * @param {*} body
     * @returns {Observable<any>}
     * @memberof WorkingHourApiService
     */
    post_working_hours(body: any): Observable<any> {
        return this.apiService.postApi(body, '/api/admin/working-hours/working-hours-profile');
    }

    /**
     * udpate details of selected working profile
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof WorkingHourApiService
     */
    patch_working_hours(data: any): Observable<any> {
        return this.apiService.patchApi(data, '/api/admin/working-hours/working-hours-profile');
    }

    /**
     * delete selected working hour profile
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof WorkingHourApiService
     */
    delete_working_hours_profile(id: string): Observable<any> {
        return this.apiService.deleteApi(id, '/api/admin/working-hours/working-hours-profile/');
    }

    /**
     * assign working hour profile to user
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof WorkingHourApiService
     */
    patch_user_working_hours(data: any): Observable<any> {
        return this.apiService.patchApi(data, '/api/admin/working-hours/user-working-hours');
    }

    /**
     * get assigned employee list by given working hour GUID
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof WorkingHourApiService
     */
    get_assigned_working_profile_user(id: string): Observable<any> {
        return this.apiService.getApiWithId('/api/admin/working-hours/working-hours-profile/users/', id);
    }

    /**
     * get user list
     * @returns {Observable<any>}
     * @memberof WorkingHourApiService
     */
    get_all_users_list(): Observable<any> {
        return this.apiService.get_user_profile_list();
    }

    /**
     * show pop up snackbar
     * @param {string} txt
     * @param {boolean} value
     * @memberof WorkingHourApiService
     */
    showPopUp(txt: string, value: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: txt, response: value }
        });
    }


}