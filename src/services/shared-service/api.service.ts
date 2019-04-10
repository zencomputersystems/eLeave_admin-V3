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
    public baseUrl: string = "http://zencore.zen.com.my:3000";

    constructor(public http: Http) {
        // this.queryHeaders.append('Content-Type', 'application/json');
        // this.queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
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

    headerAuthorization() {
        if (this.headers["_headers"].size != 1) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
    }

    get_personal_details(): Observable<any> {
        this.headerAuthorization();
        return this.http.get(this.baseUrl + '/api/userprofile/personal-detail', { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    patch_personal_details(updateData): Observable<any[]> {
        this.headerAuthorization();
        return this.http.patch(this.baseUrl + '/api/userprofile/personal-detail', updateData, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))

    }

    get_employment_details(userId): Observable<any> {
        this.headerAuthorization();
        return this.http.get(this.baseUrl + '/api/userprofile/employment-detail/' + userId, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    patch_employment_details(updateData: any): Observable<any> {
        this.headerAuthorization();
        return this.http.patch(this.baseUrl + '/api/userprofile/employment-detail', updateData, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    get_user_profile(): Observable<any> {
        this.headerAuthorization();
        return this.http.get(this.baseUrl + '/api/userprofile', { headers: this.headers })
            .pipe(map((res: Response) => res.json()));
    }

    get_user_profile_list() {
        this.headerAuthorization();
        return this.http.get(this.baseUrl + '/api/users', { headers: this.headers })
            .pipe(map((res: Response) => res.json()));;
    }

    get_department() {
        this.headerAuthorization();
        return this.http.get(this.baseUrl + '/api/department', { headers: this.headers })
            .pipe(map((res: Response) => res.json()));;
    }





}
