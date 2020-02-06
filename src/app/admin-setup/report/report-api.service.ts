import { Injectable } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Observable } from 'rxjs';

/**
 * report API
 * @export
 * @class ReportApiService
 */
@Injectable({
    providedIn: 'root'
})
export class ReportApiService {

    /**
     *Creates an instance of ReportApiService.
     * @param {APIService} apiService
     * @memberof ReportApiService
     */
    constructor(public apiService: APIService) { }

    /**
     * get individual reports
     * @param {string} userId
     * @param {string} reporttype
     * @returns {Observable<any>}
     * @memberof ReportApiService
     */
    get_individual_report(userId: string, reporttype: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/report/' + reporttype + '/' + userId);
    }

    /**
     * get bundle reports
     * @param {string} reportType
     * @returns {Observable<any>}
     * @memberof ReportApiService
     */
    get_bundle_report(reportType: string): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.getApi('/api/admin/report/' + reportType);
    }
}