import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import * as constants from '../../config/constant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class APIService {

    public queryHeaders = new Headers();
    public headers = new Headers();
    public loginHeaders = new Headers();
    public baseUrl: string = "http://localhost:3000";

    constructor(public http: Http, private httpClient: HttpClient) {
        this.queryHeaders.append('Content-Type', 'application/json');
        this.queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        this.loginHeaders.append('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJzaGFmdWFuIiwidGVuYW50SWQiOiJkZGRkZCJ9LCJpYXQiOjE1NDk4Njc1NDB9.4Ww0-45TubOFUANfCsMRtPRKFJLZ8nbUFOjVmf4gTxM');
        this.loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
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

    get_login(email: string, password: string) {
        return this.http.post(this.baseUrl + '/api/auth/login', { email, password }, { headers: this.loginHeaders });
    }

    login(email: string, password: string) {
        return this.httpClient.post<any>(this.baseUrl + `/api/auth/login`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('access_token', JSON.stringify(user.access_token));
                }
                return user;
            }));
    }

    logout() {
        // remove access_token from local storage to log user out
        localStorage.removeItem('access_token');
    }


    get_personal_details(): Observable<any> {
        if (this.headers["_headers"].size != 1) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
        return this.http.get(this.baseUrl + '/api/userprofile/personal-detail', { headers: this.headers })
            .pipe(map((res: Response) => res.json()))

    }
    get_user_profile(): Observable<any> {
        if (this.headers["_headers"].size != 1) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
        return this.http.get(this.baseUrl + '/api/userprofile', { headers: this.headers })
            .pipe(map((res: Response) => res.json()));
    }

    get_user_profile_list() {
        if (this.headers["_headers"].size != 1) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
        return this.http.get(this.baseUrl + '/api/users', { headers: this.headers })
            .pipe(map((res: Response) => res.json()));;
    }





}
