import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import * as constants from '../../config/constant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class APIService {

    public queryHeaders = new Headers();
    public headers = new Headers();
    // public baseUrl: string = "http://zencore.southeastasia.cloudapp.azure.com:3000";
    public baseUrl: string = "http://zencore.zen.com.my:3000/api";

    constructor(public http: Http) {
    }

    headerAuthorization() {
        if (this.headers["_headers"].size != 1) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
    }

    getApi(address: string) {
        return this.http.get(this.baseUrl + address, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    patchApi(data: any, address: string) {
        return this.http.patch(this.baseUrl + address, data, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    postApi(data: any, address: string) {
        return this.http.post(this.baseUrl + address, data, { headers: this.headers })
            .pipe(map((res: Response) => res.json()
            ));
    }

    get_personal_details(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/userprofile/personal-detail');
    }

    patch_personal_details(updateData): Observable<any[]> {
        this.headerAuthorization();
        return this.patchApi(updateData, '/userprofile/personal-detail');
    }

    get_employment_details(userId): Observable<any> {
        this.headerAuthorization();
        return this.http.get(this.baseUrl + '/userprofile/employment-detail/' + userId, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    patch_employment_details(updateData: any): Observable<any> {
        this.headerAuthorization();
        return this.patchApi(updateData, '/userprofile/employment-detail');
    }

    get_user_profile(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/userprofile');
    }

    get_user_profile_list(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/users');
    }

    post_user_apply_leave(leaveData: any): Observable<any> {
        this.headerAuthorization();
        return this.http.post(this.baseUrl + '/leave/apply', leaveData, { headers: this.headers })
            .pipe(map((res: Response) => res.json()));
    }

    get_department(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/department');
    }

    post_user_invite(userId): Observable<any> {
        this.headerAuthorization();
        return this.postApi(userId, '/admin/user-invite');
    }

}
