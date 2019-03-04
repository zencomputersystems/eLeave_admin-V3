import { Injectable, Injector } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { CRUD } from '../base/crud.service';
import { PersonalDetailsModel } from 'src/models/main/personal-details.model';

@Injectable({
    providedIn: 'root'
})
export class PersonalDetailsService extends CRUD {

    private _personalData: BehaviorSubject<PersonalDetailsModel[]> = new BehaviorSubject([]);
    public readonly personalData: Observable<PersonalDetailsModel[]> = this._personalData.asObservable();

    constructor(
        injector: Injector) {
        super(injector);
    }

    public getPersonalDetailsList() {
        return this.read('l_personal_details', 'filter=ACTIVE_FLAG=0')
            .pipe(map(data => {
                let personalData = new Array<PersonalDetailsModel>();
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
