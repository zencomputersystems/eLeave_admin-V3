import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";

/**
 * API for policy
 * @export
 * @class PolicyAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class PolicyAPIService {

    /**
     *Creates an instance of PolicyAPIService.
     * @param {APIService} apiService
     * @memberof PolicyAPIService
     */
    constructor(private apiService: APIService) {

    }

    /**
     * create new policy for tenant
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof PolicyAPIService
     */
    post_general_leave_policy(value): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.postApi(value, '/api/admin/general-leave-policy');
    }

    /**
     * get all tenant policy list 
     * @returns {Observable<any>}
     * @memberof PolicyAPIService
     */
    get_general_leave_policy_list(): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/general-leave-policy');
    }

    /**
     * update the selected tenant policy
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof PolicyAPIService
     */
    patch_general_leave_policy(data): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(data, '/api/admin/general-leave-policy');
    }

    /**
     * get general leave policy details from specific Id
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof PolicyAPIService
     */
    get_general_leave_policy_id(id): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApiWithId('/api/admin/general-leave-policy/', id);
    }

}