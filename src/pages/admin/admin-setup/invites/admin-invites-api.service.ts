import { Injectable } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

/**
 * invite more API used
 * @export
 * @class AdminInvitesAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class AdminInvitesAPIService {

    /**
     *Creates an instance of AdminInvitesAPIService.
     * @param {APIService} apiService
     * @memberof AdminInvitesAPIService
     */
    constructor(private apiService: APIService, public http: Http) { }

    /**
     * POST invited new user Id to endpoint
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof AdminInvitesAPIService
     */
    post_user_invite(userId): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(userId, '/api/invitation');
    }

    /**
     * Delete resigned user from user list
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof AdminInvitesAPIService
     */
    delete_user(id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.http.delete(this.apiService.baseUrl + '/api/users/' + id, { headers: this.apiService.headers })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * get user list from api service
     * @returns {Observable<any>}
     * @memberof AdminInvitesAPIService
     */
    get_user_profile_list(): Observable<any> {
        return this.apiService.get_user_profile_list();
    }
}