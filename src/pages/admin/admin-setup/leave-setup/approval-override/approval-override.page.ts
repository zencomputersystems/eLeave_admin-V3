import { Component, OnInit } from '@angular/core';
import { LeaveAPIService } from '../leave-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from 'src/services/shared-service/api.service';
import { MatDialog } from '@angular/material';
import { AddRemarkPage } from './add-remark-dialog/add-remark.page';


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
    public mainCheckbox: boolean;
    public indeterminate: boolean;
    public displayCheckbox: boolean = false;
    public remark: string;
    public data: string;
    private _userList: any;
    private _pendingList: any;
    private _companyId: string;
    private _filteredUserList: any = [];
    private _leaveTypeList: any;
    private addApplication = [];

    constructor(private leaveAPI: LeaveAPIService, private apiService: APIService, public dialog: MatDialog) {
        this.approvalForm = new FormGroup({
            company: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
        })
    }

    ngOnInit() {
        this.leaveAPI.get_company_list().subscribe(list => this.companyList = list)
        this.leaveAPI.get_approval_override_list().subscribe(list => this._pendingList = list)
    }

    filterUserGUID(list: any, obj: any, index: number) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].USER_GUID === obj) {
                // this.addApplication.push(i);
                // return 1;
                this.filteredPendingList.push(this._pendingList[i]);
                this.filteredPendingList[this.filteredPendingList.length - 1].employeeName = this._filteredUserList[index].employeeName;
                this.filteredPendingList[this.filteredPendingList.length - 1].isChecked = false;
                this.getLeaveType(this.filteredPendingList.length - 1, this._pendingList[i].LEAVE_TYPE_GUID);
            }
            // return this.addApplication;
        }
        // return 0;
    }

    selectedCompany(company_guid) {
        this._companyId = company_guid;
        this.leaveAPI.get_company_details(company_guid).subscribe(list => {
            this.departmentList = list.departmentList;
        })
    }

    selectedDepartment(departmentName) {
        this.filteredPendingList = [];
        this._filteredUserList = [];
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

    checkPendingUserList() {
        for (let j = 0; j < this._filteredUserList.length; j++) {
            this.filterUserGUID(this._pendingList, this._filteredUserList[j].userId, j);
            // if (this.addApplication.length > 0) {
            // for (let i = 0; i < this.addApplication.length; i++) {
            // if (this.filterUserGUID(this._pendingList, this._filteredUserList[j].userId) != 0) {
            //     const index = this.filterUserGUID(this._pendingList, this._filteredUserList[j].userId);
            //     this.filteredPendingList.push(this._pendingList[this.addApplication[index]);
            //     this.filteredPendingList[this.filteredPendingList.length - 1].employeeName = this._filteredUserList[j].employeeName;
            //     this.filteredPendingList[this.filteredPendingList.length - 1].isChecked = false;
            //     this.getLeaveType(this.filteredPendingList.length - 1, this._pendingList[index].LEAVE_TYPE_GUID);
            // }
            // }
            // }

            console.log(this.filteredPendingList);
        }
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

    mainEvent() {
        setTimeout(() => {
            this.filteredPendingList.forEach(item => {
                item.isChecked = this.mainCheckbox;
                if (item.isChecked) {
                    this.displayCheckbox = true;
                } else {
                    this.displayCheckbox = false;
                }
            });
        })
    }

    subEvent() {
        const total = this.filteredPendingList.length;
        let checkedItem = 0;
        this.filteredPendingList.map(item => {
            if (item.isChecked) {
                checkedItem++;
                this.displayCheckbox = true;
            } else {
                this.displayCheckbox = false;
            }
        });
        if (checkedItem > 0 && checkedItem < total) {
            this.indeterminate = true;
            this.mainCheckbox = false;
        } else if (checkedItem == total) {
            this.mainCheckbox = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = false;
            this.mainCheckbox = false;
        }
    }

    mouseEvent(value, isChecked) {
        if (isChecked) {
            this.displayCheckbox = true;
        } else {
            this.displayCheckbox = value;
        }
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AddRemarkPage, {
            // width: '250px',
            // data: this.data
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
            this.remark = result;
        });

    }

    patchStatus(status) {
        const array = [];
        for (let i = 0; i < this.filteredPendingList.length; i++) {
            array.push(this.filteredPendingList[i].LEAVE_TRANSACTION_GUID);
        }
        const body = {
            "leaveTransactionId": array,
            "status": status,
            "remark": this.remark
        }
    }



}