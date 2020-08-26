import { Injectable } from "@angular/core";
import { AttendanceSetupApiService } from "../attendance-setup-api.service";
import { Observable } from "rxjs";

/**
 * Support api
 * @export
 * @class SupportApiService
 */
@Injectable({
    providedIn: 'root'
})
export class SupportApiService {


    constructor(private attendanceApiService: AttendanceSetupApiService) {
    }

    get_support_list(): Observable<any> {
        this.attendanceApiService.headerAuthorization();
        return this.attendanceApiService.getApi('/support');
    }
}