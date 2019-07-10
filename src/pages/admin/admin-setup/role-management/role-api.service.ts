import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RolesAPIService {


    public headerApp = new Headers();


    public baseUrl: string = "http://zencore.zen.com.my:3000";


    constructor(public http: Http) {
    }

    authorization() {
        if (this.headerApp["_headers"].size < 1) {
            this.headerApp.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        }
    }

    get_role_profile_list(): Observable<any> {
        this.authorization();
        return this.http.get(this.baseUrl + '/api/admin/role/role-profile', { headers: this.headerApp })
            .pipe(map((res: Response) => res.json()))
    }

    get_role_details_profile(id): Observable<any> {
        this.authorization();
        return this.http.get(this.baseUrl + '/api/admin/role/' + id, { headers: this.headerApp })
            .pipe(map((res: Response) => res.json()));
    }

    patch_role_profile(body): Observable<any> {
        this.authorization();
        return this.http.patch(this.baseUrl + '/api/admin/role/role-profile', body, { headers: this.headerApp })
    }



}