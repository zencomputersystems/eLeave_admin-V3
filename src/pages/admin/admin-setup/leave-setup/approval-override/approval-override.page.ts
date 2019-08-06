import { Component, OnInit } from '@angular/core';
import { LeaveAPIService } from '../leave-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from 'src/services/shared-service/api.service';


@Component({
    selector: 'app-approval-override',
    templateUrl: './approval-override.page.html',
    styleUrls: ['./approval-override.page.scss'],
})
export class ApprovalOverridePage implements OnInit {

    public companyList: any;
    public departmentList: any;
    public approvalForm: any;
    public filteredPendingList: any = [];
    private _userList: any;
    private _pendingList: any;
    private _companyId: string;
    private _filteredUserList: any = [];
    private _leaveTypeList: any;

    constructor(private leaveAPI: LeaveAPIService, private apiService: APIService) {
        this.approvalForm = new FormGroup({
            company: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required)
        })
    }

    ngOnInit() {
        this.leaveAPI.get_company_list().subscribe(list => this.companyList = list)
        this.leaveAPI.get_approval_override_list().subscribe(list => this._pendingList = list)
    }

    selectedCompany(company_guid) {
        this._companyId = company_guid;
        this.leaveAPI.get_company_details(company_guid).subscribe(list => {
            this.departmentList = list.departmentList;
        })
    }

    selectedDepartment(departmentName) {
        this.filteredPendingList = [];
        this.apiService.get_user_profile_list().subscribe(list => {
            this._userList = list;
            for (let i = 0; i < this._userList.length; i++) {
                if (this._userList[i].department === departmentName && this._userList[i].companyId === this._companyId) {
                    this._filteredUserList.push(this._userList[i]);
                }
            }
            this.checkPendingUserList();
        })

    }

    filterUserGUID(list: any, obj: any) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].USER_GUID === obj) {
                return i;
            }
        }
        return 0;
    }

    checkPendingUserList() {
        for (let j = 0; j < this._filteredUserList.length; j++) {
            if (this.filterUserGUID(this._pendingList, this._filteredUserList[j].userId) != 0) {
                const index: number = this.filterUserGUID(this._pendingList, this._filteredUserList[j].userId);
                this.filteredPendingList.push(this._pendingList[index]);
                this.filteredPendingList[this.filteredPendingList.length - 1].employeeName = this._filteredUserList[j].employeeName;
                this.getLeaveType(this.filteredPendingList.length - 1, this._pendingList[index].LEAVE_TYPE_GUID);
            }
        }
        console.log(this.filteredPendingList);
    }

    getLeaveType(index: number, leaveTypeGuid: string) {
        this.leaveAPI.get_admin_leavetype().subscribe(type => {
            this._leaveTypeList = type;
            for (let i = 0; i < this._leaveTypeList.length; i++) {
                if (leaveTypeGuid === this._leaveTypeList[i].LEAVE_TYPE_GUID) {
                    this.filteredPendingList[index].leveTypeName = this._leaveTypeList[i].CODE;
                }
            }
        })
    }



}