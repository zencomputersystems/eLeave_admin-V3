import { Injectable, Injector } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { CRUD } from '../base/crud.service';
import { ConnectionsModel } from 'src/models/main/connections.model';

@Injectable({
    providedIn: 'root'
})
export class ConnectionsService extends CRUD {

    private _personalData: BehaviorSubject<ConnectionsModel[]> = new BehaviorSubject([]);
    public readonly personalData: Observable<ConnectionsModel[]> = this._personalData.asObservable();

    constructor(
        injector: Injector) {
        super(injector);
    }

    public getConnectionsList() {
        return this.read('l_connections', 'filter=ACTIVE_FLAG=0')
            .pipe(map(data => {
                let personalData = new Array<ConnectionsModel>();
                personalData = data['resource'];

                this._personalData.next(personalData);
                return this.personalData;
            }));

    }

    // public removeBranch(personalDetailsId: string) {

    //     // get the leave data
    //     this.read('l_personal_details', 'filter=PERSONAL_DETAILS_GUID=' + personalDetailsId)
    //         .pipe(map(data => {

    //             set the ACTIVE_FLAG to 0
    //             data['resource'][0].ACTIVE_FLAG = 0;

    //             return data;
    //         }))
    //         .subscribe(data => {
    //             this.delete(data['resource'], 'l_personal_details', this.getPersonalDetailsList());
    //         });

    // }
}
