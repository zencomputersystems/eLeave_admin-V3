import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";

@Injectable({
    providedIn: 'root'
})
export class PolicyAPIService {


    constructor(private apiService: APIService) {

    }

    post_general_leave_policy(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(value, '/api/admin/general-leave-policy');
    }
}