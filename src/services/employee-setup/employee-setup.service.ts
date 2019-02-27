import { Injectable, Injector } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaveTypeModel } from 'src/models/leavetype.model';
import { ViewLeaveTypeSetupModel } from 'src/models/view-leavetype-setup.model';
import { CRUD } from '../base/crud.service';
import { EmployeeModel } from 'src/models/main/employee.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class EmployeeSetupService extends CRUD {

    private _branchData: BehaviorSubject<EmployeeModel[]> = new BehaviorSubject([]);
    public readonly branchData: Observable<EmployeeModel[]> = this._branchData.asObservable();

    constructor(
        injector: Injector) {
            super(injector);
        }

    public getBranchList() {
        return this.read('main_employee', 'filter=ACTIVE_FLAG=1')
                .pipe(map(data => {
                    let branchData = new Array<EmployeeModel>();
                    branchData = data['resource'];

                    this._branchData.next(branchData);
                    return this.branchData;
                }));

    }

    public removeBranch(branchId: string) {

        // get the leave data
        this.read('main_employee', 'filter=EMPLOYEE_GUID=' + branchId)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].ACTIVE_FLAG = 0;

                return data;
            }))
            .subscribe(data => {
                this.delete(data['resource'], 'main_employee', this.getBranchList());
            });

    }
}
