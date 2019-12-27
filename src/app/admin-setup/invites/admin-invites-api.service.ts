import { Injectable } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { MatDialog } from '@angular/material';

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
     * @param {APIService} apiService main url from server
     * @param {MatDialog} popUp material dialog
     * @param {MenuController} menu ionic menu controller
     * @memberof AdminInvitesApiService
     */
    constructor(public apiService: APIService, public popUp: MatDialog, public menu: MenuController) { }

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
        return this.apiService.deleteApi(id, '/api/users/');
        // return this.http.delete(this.apiService.baseUrl + '/api/users/' + id, { headers: this.apiService.headers })
        //     .pipe(map((res: Response) => res.json()));
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
     * get requested user profile 
     * @param {string} guid
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    get_user_profile_details(guid: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/userprofile/', guid);
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
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    patch_admin_personal_user_info(data, id: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(data, '/api/admin/user-info-details/personal/' + id);
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
     * get department list
     * @returns {Observable<any>}
     * @memberof AdminInvitesApiService
     */
    get_departmet_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/master/department');
    }
}