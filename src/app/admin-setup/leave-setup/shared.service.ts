import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MenuController } from '@ionic/angular';
import { MatDialog } from '@angular/material';
import { LeaveApiService } from './leave-api.service';

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
}