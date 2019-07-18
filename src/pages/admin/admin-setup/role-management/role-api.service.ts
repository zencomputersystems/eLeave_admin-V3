import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

/**
 * Role API
 * @export
 * @class RolesAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class RolesAPIService {

    /**
     * header authorization value 
     * @memberof RolesAPIService
     */
    public headerApp = new Headers();

    /**
     * main url of server
     * @type {string}
     * @memberof RolesAPIService
     */
    public baseUrl: string = "http://zencore.zen.com.my:3000";

    /**
     *Creates an instance of RolesAPIService.
     * @param {Http} http
     * @memberof RolesAPIService
     */
    constructor(public http: Http) {
    }

    /**
     * Method used to append authorize token
     * @memberof RolesAPIService
     */
    authorization() {
        if (this.headerApp["_headers"].size < 1) {
            this.headerApp.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
    }

    /**
     * Role profile list
     * @returns {Observable<any>}
     * @memberof RolesAPIService
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
     * @memberof RolesAPIService
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
     * @memberof RolesAPIService
     */
    patch_role_profile(body): Observable<any> {
        this.authorization();
        return this.http.patch(this.baseUrl + '/api/admin/role/role-profile', body, { headers: this.headerApp })
    }

    /**
     * create new role and it rights/permission
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof RolesAPIService
     */
    post_role_profile(data): Observable<any> {
        this.authorization();
        return this.http.post(this.baseUrl + '/api/admin/role/role-profile', data, { headers: this.headerApp })
    }

    /**
     * assign role profile to employee
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof RolesAPIService
     */
    patch_user_profile(id): Observable<any> {
        this.authorization();
        return this.http.patch(this.baseUrl + '/api/admin/role/user-role', id, { headers: this.headerApp });
    }



}