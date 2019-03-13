import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import * as constants from '../../config/constant';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class APIService {

    public queryHeaders = new Headers();
    public headers = new Headers();
    public loginHeaders = new HttpHeaders().append('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJzaGFmdWFuIiwidGVuYW50SWQiOiJkZGRkZCJ9LCJpYXQiOjE1NDk4Njc1NDB9.4Ww0-45TubOFUANfCsMRtPRKFJLZ8nbUFOjVmf4gTxM')
        .append('Content-Type', 'application/x-www-form-urlencoded');
    public body = new HttpParams().set('email', 'tarmimi@zen.com.my')
        .set('password', 'P@ss1234');
    public baseUrl: string = "http://localhost:3000";

    constructor(public http: Http, private httpClient: HttpClient) {
        this.queryHeaders.append('Content-Type', 'application/json');
        this.queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        this.headers.append('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhcm1pbWlAemVuLmNvbS5teSIsInVzZXJJZCI6IjY5N2IyNWFjLWJmZjEtYjFkMS1mMTdlLWZhMDIwNmZjN2EyYSIsInRlbmFudElkIjoiNThhMDM1Y2EtYjIyZi0xYjRlLTc5YzYtN2UxM2VjMTVkMmQyIiwiaWF0IjoxNTUyNDQ2MDkyLCJleHAiOjE1NTI0NDkzOTJ9.EB27x_JJ_XoHQVkCIy6iwnbknMu_0ExdQoGj3Oz7hHM');
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg);
        return Observable.throw(errMsg);
    }

    getModelUrl(table: string, args?: string) {
        if (args != null) {
            return constants.DREAMFACTORY_TABLE_URL + '/' + table + '?' + args;
        }
        return constants.DREAMFACTORY_TABLE_URL + '/' + table;
    }

    getApiModel(endPoint: string, args?: string) {
        const url = this.getModelUrl(endPoint, args);
        return this.http.get(url, { headers: this.queryHeaders }).pipe(map(res => res.json()));
    }

    save(Model_Name: any, Table_Name: string): Observable<any> {
        const options = new RequestOptions({ headers: this.queryHeaders });
        return this.http.post(constants.DREAMFACTORY_TABLE_URL + '/' + Table_Name, Model_Name, options)
            .pipe(map((response) => {
                return response;
            }));
    }

    update(Model_Name: any, Table_Name: string): Observable<any> {
        const options = new RequestOptions({ headers: this.queryHeaders });
        return this.http.patch(constants.DREAMFACTORY_TABLE_URL + '/' + Table_Name, Model_Name, options)
            .pipe(map((response) => {
                return response;
            }));
    }

    createTimestamp() {
        // return moment.utc(new Date()).zone('+08:00').format('YYYY-MM-DDTHH:mm');
        // return moment.utc(new Date()).zone(localStorage.getItem("cs_timestamp")).format('YYYY-MM-DDTHH:mm');
    }

    // get_login() {
    //     return this.httpClient.post<{ access_token: string }>(this.baseUrl + '/api/auth/login', this.body, { headers: this.loginHeaders });
    // }

    get_login(email: string, password: string) {
        return this.httpClient.post<{ access_token: string }>('http://localhost:3000/api/auth/login', { email, password }).pipe(tap(res => {
            localStorage.setItem('access_token', res.access_token);
        }))
    }

    get_user_profile_me() {
        return this.http.get(this.baseUrl + '/api/userprofile/me', { headers: this.headers });
    }

    get_user_profile_list() {
        return this.http.get(this.baseUrl + '/api/userprofile/list', { headers: this.headers });
    }



}
