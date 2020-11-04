import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MatDialog } from '@angular/material';
import { LeaveApiService } from './leave-api.service';
import { Subject } from 'rxjs';

/**
 * share service for emit data
 * @export
 * @class SharedService
 */
@Injectable()
export class SharedService {

    /**
     * Observable string sources
     * @private
     * @memberof SharedService
     */
    private emitChangeSource = new Subject<any>();

    /**
     * Observable string streams
     * @memberof SharedService
     */
    changeEmitted$ = this.emitChangeSource.asObservable();


    /**
     * role data sources
     * @private
     * @memberof SharedService
     */
    private emitRoleData = new Subject<any>();

    /**
     * department sources
     * @private
     * @memberof SharedService
     */
    private emitDepartment = new Subject<any>();

    /**
     * Observable role streams
     * @memberof SharedService
     */
    roleDataEmitted$ = this.emitRoleData.asObservable();

    /**
     * Observable department streams
     * @memberof SharedService
     */
    departmentEmitted$ = this.emitDepartment.asObservable();

    /**
     *Creates an instance of SharedService.
     * @param {MenuController} menu ionic menu event
     * @param {MatDialog} dialog open dialog material
     * @param {LeaveApiService} leaveApi leave api service
     * @memberof SharedService
     */
    constructor(public menu: MenuController, public dialog: MatDialog, public leaveApi: LeaveApiService) { }

    /**
     * Service message commands
     * @param {*} change
     * @memberof SharedService
     */
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }

    /**
     * emit role data
     * @param {*} data
     * @memberof SharedService
     */
    emitRoleDetails(data: any, department: string) {
        this.emitRoleData.next(data);
        this.emitDepartment.next(department);
    }
}