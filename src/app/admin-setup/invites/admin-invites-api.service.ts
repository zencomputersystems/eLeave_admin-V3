import { Injectable } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from '../leave-setup/snackbar-notification/snackbar-notification.component';

/**
 * invite more API used
 * @export
 * @class AdminInvitesApiService
 */
@Injectable({
    providedIn: 'root'
})
export class AdminInvitesApiService {

    /**
     *Creates an instance of AdminInvitesApiService.
     * @param {APIService} apiService
     * @memberof AdminInvitesApiService
     */
    constructor(private apiService: APIService, public http: Http, public snackBar: MatSnackBar) { }

    /**
     * POST invited new user Id to endpoint
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    post_user_invite(userId: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(userId, '/api/invitation');
    }


    /**
     * POST new user details to endpoint
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    post_userimport(data: any): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(data, '/api/userimport');
    }

    /**
     * Delete resigned user from user list
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    delete_user(id: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.http.delete(this.apiService.baseUrl + '/api/users/' + id, { headers: this.apiService.headers })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * set user to disable(inactive) on a specific date
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    disable_user(data: any): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(data, '/api/users/disable');
    }

    /**
     * get user list from api service
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    get_user_profile_list(): Observable<any> {
        return this.apiService.get_user_profile_list();
    }

    /**
     * get user info (personal-details, employment-detail, notification-rule)
     * @param {*} item
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    get_admin_user_info(item, id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/user-info-details/' + item + '/' + id);
    }


    /**
     * patch personal user info details
     * @param {*} data
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    patch_admin_personal_user_info(data, userId): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(data, '/api/admin/user-info-details/personal/' + userId);
    }

    /**
     * patch employment user info details 
     * @param {*} details
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    patch_admin_employment_user_info(details, id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(details, '/api/admin/user-info-details/employment/' + id);
    }

    /**
     * get role profile list
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    get_role_profile_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/role/role-profile');
    }

    /**
     * get calendar profile list
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    get_calendar_profile_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/holiday/calendar-profile');
    }

    /**
     * get working hour profile list
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    get_working_hour_profile_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/working-hours/working-hours-profile');
    }

    /**
     * show pop up snackbar
     * @param {string} txt
     * @param {boolean} value
     * @memberof AdminInvitesApiService
     */
    showSnackbar(text: string, value: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 2000,
            verticalPosition: "top",
            data: { message: text, response: value }
        });
    }

}