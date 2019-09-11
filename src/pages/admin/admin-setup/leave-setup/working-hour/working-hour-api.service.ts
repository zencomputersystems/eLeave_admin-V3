import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";
import { MatSnackBar } from "@angular/material";


@Injectable({
    providedIn: 'root'
})
export class WorkingHourAPIService {

    constructor(public http: Http, private apiService: APIService, public snackBar: MatSnackBar) {
    }

    get_working_hours_profile(): Observable<any> {
        return this.apiService.getApi('/api/admin/working-hours/working-hours-profile');
    }

    get_working_hours_details(id: string): Observable<any> {
        return this.apiService.getApiWithId('/api/admin/working-hours/', id);
    }

    post_working_hours(body: any): Observable<any> {
        return this.apiService.postApi(body, '/api/admin/working-hours/working-hours-profile');
    }

    patch_working_hours(data: any): Observable<any> {
        return this.apiService.patchApi(data, '/api/admin/working-hours/working-hours-profile');
    }



}