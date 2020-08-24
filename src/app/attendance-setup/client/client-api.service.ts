import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material";
import { APIService } from "../../../../src/services/shared-service/api.service";
import { environment } from "../../../../src/environments/environment";
import { SnackbarNotificationComponent } from "../../admin-setup/leave-setup/snackbar-notification/snackbar-notification.component";
import { AttendanceSetupApiService } from "../attendance-setup-api.service";

/**
 * Client API
 * @export
 * @class ClientApiService
 */
@Injectable({
    providedIn: 'root'
})
export class ClientApiService {

    /**
     *Creates an instance of ClientApiService.
     * @param {MatSnackBar} snackBar
     * @param {APIService} attendanceApiService
     * @memberof ClientApiService
     */
    constructor(private snackBar: MatSnackBar, private attendanceApiService: AttendanceSetupApiService) {
    }

    /**
     * Client profile list
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    get_client_profile_list(): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApi('/api/client/detail');
    }

    /**
     * create new client profile
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    post_client_profile(data): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.postApi(data, '/api/client');
    }

    /**
     * update client name & abbr
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    patch_client_profile(value): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.patchApi(value, '/api/client');
    }

    /**
     * delete client profile
     * @param {string} clientId
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    delete_client_profile(clientId: string): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.deleteApi(clientId, '/api/client/');
    }

    /**
     * Project list
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    get_project_list_id(clientId: string): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApiWithId('/api/project/', clientId);
    }

    /**
     * create new project list
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    post_project(data): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.postApi(data, '/api/project');
    }

    get_contract_list_id(id): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApiWithId('/api/contract/', id);
    }

    post_contract(data): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.postApi(data, '/api/contract');
    }

    get_location_list_id(id: string): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApiWithId('/api/location/', id);
    }

    post_location(data): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.postApi(data, '/api/location');
    }

    /**
     * autocomplete search places
     * @param {string} location
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    get_search_location(location: string): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApiWithId('/api/location/search/', location);
    }

    /**
     * search by address to get latitude & longitude
     * @param {string} location
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    get_search_type_location(location: string, type): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApiWithId('/api/location/search/' + type + '/', location);
    }

    /**
     * update or create new project, contract & location 
     * @returns {Observable<any>}
     * @memberof ClientApiService
     */
    patch_client_bundle(bundleData): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.patchApi(bundleData, '/api/client/bundle');
    }

    /**
     * show delete confirmation after click Delete button
     * @param {string} sentences
     * @memberof ClientApiService
     */
    snackbarMsg(sentences: string, value: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: sentences, response: value }
        });
    }




}