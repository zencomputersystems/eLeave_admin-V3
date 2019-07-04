import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RolesAPIService {


    public headers = new Headers();


    public baseUrl: string = "http://zencore.zen.com.my:3000";


    constructor(public http: Http) {
    }


    authorization() {
        if (this.headers["_headers"].size != 1) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
    }

    get_role_profile_list(): Observable<any> {
        this.authorization();
        return this.http.get(this.baseUrl + '/api/admin/role/role-profile', { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    get_role_details_profile(id): Observable<any> {
        this.authorization();
        return this.http.get(this.baseUrl + '/api/admin/role/' + id, { headers: this.headers })
            .pipe(map((res: Response) => res.json()));
    }



}