import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationComponent } from "../leave-setup/snackbar-notification/snackbar-notification.component";
import { LocalStorageService } from "angular-web-storage";
import { AuthService } from "src/services/shared-service/auth.service";

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
     * @param {Http} http
     * @param {MatSnackBar} snackBar
     * @param {LocalStorageService} local
     * @param {AuthService} auth
     * @memberof RoleApiService
     */
    constructor(public http: Http, private snackBar: MatSnackBar, private local: LocalStorageService, private auth: AuthService) {
    }

    /**
     * Method used to append authorize token
     * @memberof RoleApiService
     */
    authorization() {
        if (this.headerApp["_headers"].size < 1 && this.auth.isAuthenticated) {
            this.headerApp.append('Authorization', 'JWT ' + JSON.parse(this.local.get('access_token')));
        }
    }

    /**
     * Role profile list
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    get_role_profile_list(): Observable<any> {
        this.authorization();
        return this.http.get(this.baseUrl + '/api/admin/role/role-profile', { headers: this.headerApp })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * Role rights request from Id
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    get_role_details_profile(id): Observable<any> {
        this.authorization();
        return this.http.get(this.baseUrl + '/api/admin/role/' + id, { headers: this.headerApp })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * Update role rights for desired role
     * @param {*} body
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    patch_role_profile(body): Observable<any> {
        this.authorization();
        return this.http.patch(this.baseUrl + '/api/admin/role/role-profile', body, { headers: this.headerApp })
    }

    /**
     * create new role and it rights/permission
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    post_role_profile(data): Observable<any> {
        this.authorization();
        return this.http.post(this.baseUrl + '/api/admin/role/role-profile', data, { headers: this.headerApp })
    }

    /**
     * delete role and its all details from database
     * @param {*} roleId
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    delete_role_profile(roleId): Observable<any> {
        this.authorization();
        return this.http.delete(this.baseUrl + '/api/admin/role/role-profile/' + roleId, { headers: this.headerApp })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * assign role profile to employee
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    patch_user_profile(id): Observable<any> {
        this.authorization();
        return this.http.patch(this.baseUrl + '/api/admin/role/user-role', id, { headers: this.headerApp });
    }

    /**
     * get assigned user from requested role profile id
     * @param {string} roleId
     * @returns {Observable<any>}
     * @memberof RoleApiService
     */
    get_assigned_user_profile(roleId: string): Observable<any> {
        this.authorization();
        return this.http.get(this.baseUrl + '/api/admin/role/role-profile/users/' + roleId, { headers: this.headerApp })
            .pipe(map((res: Response) => res.json()));

    }

    /**
     * show delete confirmation after click Delete button
     * @param {string} text
     * @memberof RoleApiService
     */
    snackbarMsg(text: string, val: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 2000,
            verticalPosition: "top",
            data: { message: text, response: val }
        });
    }




}