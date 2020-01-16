import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationComponent } from "../leave-setup/snackbar-notification/snackbar-notification.component";
import { APIService } from "src/services/shared-service/api.service";

/**
 * Role API
 * @export
 * @class RoleApiService
 */
@Injectable({
    providedIn: 'root'
})
export class RoleApiService {

    /**
     * header authorization value 
     * @memberof RoleApiService
     */
    public headerApp = new Headers();

    /**
     * main url of server
     * @type {string}
     * @memberof RoleApiService
     */
    public baseUrl: string = "http://zencore.zen.com.my:3000";

    /**
     *Creates an instance of RoleApiService.
     * @param {MatSnackBar} snackBar
     * @param {APIService} apiService
     * @memberof RoleApiService
     */
    constructor(private snackBar: MatSnackBar, private apiService: APIService) {
    }

    /**
     * Role profile list
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    get_role_profile_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/role/role-profile');
        // return this.http.get(this.baseUrl + '/api/admin/role/role-profile', { headers: this.headerApp })
        //     .pipe(map((res: Response) => res.json()))
    }

    /**
     * Role rights request from Id
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    get_role_details_profile(id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/admin/role/', id);
        // return this.http.get(this.baseUrl + '/api/admin/role/' + id, { headers: this.headerApp })
        //     .pipe(map((res: Response) => res.json()));
    }

    /**
     * Update role rights for desired role
     * @param {*} body
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    patch_role_profile(body): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(body, '/api/admin/role/role-profile');
        // return this.http.patch(this.baseUrl + '/api/admin/role/role-profile', body, { headers: this.headerApp })
    }

    /**
     * create new role and it rights/permission
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    post_role_profile(data): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(data, '/api/admin/role/role-profile');
        // return this.http.post(this.baseUrl + '/api/admin/role/role-profile', data, { headers: this.headerApp })
    }

    /**
     * delete role and its all details from database
     * @param {*} roleId
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    delete_role_profile(roleId): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.deleteApi(roleId, '/api/admin/role/role-profile/');
        // return this.http.delete(this.baseUrl + '/api/admin/role/role-profile/' + roleId, { headers: this.headerApp })
        //     .pipe(map((res: Response) => res.json()));
    }

    /**
     * assign role profile to employee
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    patch_user_profile(id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(id, '/api/admin/role/user-role');
        // return this.http.patch(this.baseUrl + '/api/admin/role/user-role', id, { headers: this.headerApp });
    }

    /**
     * get assigned user from requested role profile id
     * @param {string} role_id
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    get_assigned_user_profile(role_id: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/admin/role/role-profile/users/', role_id);
        // return this.http.get(this.baseUrl + '/api/admin/role/role-profile/users/' + role_id, { headers: this.headerApp })
        //     .pipe(map((response: Response) => response.json()));

    }

    /**
     * get all user list
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    get_user_list(): Observable<any> {
        return this.apiService.get_user_profile_list();
    }

    /**
     * show delete confirmation after click Delete button
     * @param {string} sentences
     * @memberof RoleApiService
     */
    snackbarMsg(sentences: string, value: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 3000,
            verticalPosition: "top",
            data: { message: sentences, response: value }
        });
    }




}