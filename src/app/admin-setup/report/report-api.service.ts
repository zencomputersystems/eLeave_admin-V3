import { Injectable } from '@angular/core';
import { APIService } from '../../../../src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { AttendanceSetupApiService } from '../../attendance-setup/attendance-setup-api.service';

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
     * @param {MenuController} menu access menu controller
     * @memberof ReportApiService
     */
    constructor(public apiService: APIService, public menu: MenuController, public attendanceApi: AttendanceSetupApiService) { }

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

    /**
     * get attendance report from amscore environment variable
     * @param {*} start
     * @param {*} end
     * @param {*} userIds
     * @returns {Observable<any>}
     * @memberof ReportApiService
     */
    get_attendance_report(start, end, userIds): Observable<any> {
        this.attendanceApi.headerAuthorization();
        return this.attendanceApi.getApi('/report/attendance/' + start + '/' + end + '/' + userIds);
    }

    /**
     * get activity report from amscore environment variable
     * @param {*} start
     * @param {*} end
     * @param {*} category
     * @param {*} input
     * @returns {Observable<any>}
     * @memberof ReportApiService
     */
    get_activity_report(start, end, category, input): Observable<any> {
        this.attendanceApi.headerAuthorization();
        return this.attendanceApi.getApi('/report/activity/' + start + '/' + end + '/' + category + '/' + input);
    }

    /**
     * get project list
     * @returns {Observable<any>}
     * @memberof ReportApiService
     */
    get_project_list(): Observable<any> {
        this.attendanceApi.headerAuthorization();
        return this.attendanceApi.getApi('/api/project');
    }

    /**
     * get contract list
     * @returns {Observable<any>}
     * @memberof ReportApiService
     */
    get_contract_list(): Observable<any> {
        this.attendanceApi.headerAuthorization();
        return this.attendanceApi.getApi('/api/contract');
    }
}