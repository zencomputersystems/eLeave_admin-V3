import { Component, OnInit, HostBinding } from '@angular/core';
import { DialogDeleteConfirmationComponent } from '../../admin-setup/role-management/dialog-delete-confirmation/dialog-delete-confirmation.component';
import { EditModeDialogComponent } from '../../admin-setup/leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../admin-setup/leave-setup/shared.service';
import { RoleApiService } from '../../admin-setup/role-management/role-api.service';
import { AttendanceSetupApiService } from '../attendance-setup-api.service';
import { propertyFormat } from '../attendance-setup-data';

@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.component.html',
    styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

    /**
      * Role items get from API
      * @type {*}
      * @memberof AttendanceComponent
      */
    public roleList: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    public showSpinner: boolean = true;

    /**
     * get assigned employee name list 
     * @type {*}
     * @memberof AttendanceComponent
     */
    public assignedNameList: any;

    /**
     * selected index
     * @type {number}
     * @memberof AttendanceComponent
     */
    public clickedIndex: number = 0;

    /**
     * toggle button mode value
     * @type {string}
     * @memberof AttendanceComponent
     */
    public mode: string = 'OFF';

    /** 
     * attendance id value
     * @type {string}
     * @memberof AttendanceComponent
     */
    public attendanceIdOutput: string;

    /**
     * role name form control
     * @type {*}
     * @memberof AttendanceComponent
     */
    public editAttendanceName: any;

    /**
     * role description form control
     * @type {*}
     * @memberof AttendanceComponent
     */
    public editAttendanceDescription: any;

    /**
     * new role profile name form control
     * @type {*}
     * @memberof AttendanceComponent
     */
    public newAttendanceName: any;

    /**
     * new role profile description form control
     * @type {*}
     * @memberof AttendanceComponent
     */
    public newAttendanceDescription: any;

    /**
     * selected new button or not
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    public newButton: boolean = true;

    /**
     * selected clone button or not
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    public cloneButton: boolean = false;

    /**
     * selected radio button (role profile id)
     * @type {string}
     * @memberof AttendanceComponent
     */
    public cloneRoleId: string;

    /**
     * show loading spinner
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    public showSmallSpinner: boolean;

    /**
     * set menu is open or close by assign new class
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    @HostBinding('class.menuOverlay') menuOpen: boolean = false;

    /**
     * user list
     * @private
     * @type {*}
     * @memberof AttendanceComponent
     */
    private _userList: any;

    /**
     * filtered userId list of dragged user
     * @private
     * @type {*}
     * @memberof AttendanceComponent
     */
    private _filteredList: any = [];

    /**
     * get property details from requested role id
     * @private
     * @type {*}
     * @memberof AttendanceComponent
     */
    private _property: any;

    /**
     * This property is to bind value of check all sign in check all status in checkbox
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    public roleListCheckAll: boolean;

    /**
     * This property is to bind value of indetimate sign in check all status's checkbox
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    public roleListIsIndeterminate: boolean;

    /**
     * This property is to bind data of defult role
     * @type {*}
     * @memberof AttendanceComponent
     */
    public defaultRoleData: any;

    /**
     * This property is to bind data of default role in checkbox during creation
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    public defaultProfileRole: boolean = false;

    /**
     * To check current role is existed or not during role profile creation
     * @type {boolean}
     * @memberof AttendanceComponent
     */
    public showWarning: boolean = false;

    /**
     *Creates an instance of AttendanceComponent.
     * @param {RoleApiService} roleAPi
     * @param {SharedService} _sharedService
     * @memberof AttendanceComponent
     */
    constructor(private attendanceApi: AttendanceSetupApiService, private roleAPi: RoleApiService, public _sharedService: SharedService) {
        this.newAttendanceName = new FormControl('', Validators.required);
        this.newAttendanceDescription = new FormControl('', Validators.required);
    }

    /**
     * initial method to get endpoint list
     * @memberof AttendanceComponent
     */
    ngOnInit() {
        this.editAttendanceName = new FormControl('', Validators.required);
        this.editAttendanceDescription = new FormControl('', Validators.required);
        this.refreshRoleList(0);
    }

    /**
     * dropped user to patch to the assigned role profile
     * @param {*} evt
     * @param {*} roleItem
     * @memberof AttendanceComponent
     */
    async onDropped(evt, roleItem) {
        for (let i = 0; i < this.assignedNameList.length; i++) {
            if (evt.data === this.assignedNameList[i].fullname) {
                await this.draggedUserId(i);
                try {
                    let response = await this.attendanceApi.patch_user_attendance({
                        "user_guid": this._filteredList,
                        "attendance_guid": roleItem.attendance_guid
                    }).toPromise();
                    this.assignedNameList.splice(i, 1);
                } catch (err) {
                    this.roleAPi.snackbarMsg(err.statusText, false);
                }
                this._filteredList = [];
                //     let data = await this.roleAPi.get_role_profile_list().toPromise();
                //     this.roleList = data;
                //     this.roleListCheckAll = false;
                //     this.roleListIsIndeterminate = false;
                let data = await this.attendanceApi.get_attendance_list().toPromise();
                this.roleList = data;
                this.roleListCheckAll = false;
                this.roleListIsIndeterminate = false;
            }
        }
    }

    /**
     * get dragged item 
     * @param {number} i
     * @memberof AttendanceComponent
     */
    async draggedUserId(i: number) {
        if (this.checkDuplicateName(this._userList, this.assignedNameList[i].user_guid) > -1) {
            const indexes: number = this.checkDuplicateName(this._userList, this.assignedNameList[i].user_guid);
            if (!this._filteredList.includes(this._userList[indexes].userId)) {
                await this._filteredList.push(this._userList[indexes].userId);
            }
        }
    }

    /**
     * check duplicate employee name in the user list
     * @param {*} list
     * @param {*} obj
     * @returns
     * @memberof AttendanceComponent
     */
    checkDuplicateName(list: any, obj: any) {
        for (let j = 0; j < list.length; j++) {
            if (list[j].userId === obj) {
                return j;
            }
        }
        return 0;
    }

    /**
     * selected role profile
     * @param {*} item
     * @param {*} index
     * @memberof AttendanceComponent
     */
    async selectedProfile(item, index) {
        this.clickedIndex = index;
        if (item !== undefined) {
            this.attendanceIdOutput = item.attendance_guid;
            let data = await this.attendanceApi.get_attendance_details(item.attendance_guid).toPromise();
            this._property = data.property;
            let list = await this.attendanceApi.get_attendance_user_list(item.attendance_guid).toPromise();
            this.assignedNameList = list;
            for (let j = 0; j < this.assignedNameList.length; j++) {
                this.assignedNameList[j]["content"] = this.assignedNameList[j].fullname;
                this.assignedNameList[j]["effectAllowed"] = "move";
                this.assignedNameList[j]["handle"] = true;
                this.assignedNameList[j]["disable"] = false;
            }
        }
    }

    /**
     * toggle edit mode
     * @param {*} event
     * @memberof AttendanceComponent
     */
    toggleMode(event) {
        if (event.detail.checked === true) {
            this.mode = 'ON';
            this._sharedService.dialog.open(EditModeDialogComponent, {
                disableClose: true,
                data: 'role',
                height: "360.3px",
                width: "383px"
            });
        } else {
            this.mode = 'OFF'
            this.updateRole();
            this.roleAPi.snackbarMsg('Edit mode disabled. Good job!', true);
        }
        this._sharedService.emitChange(this.mode);
    }

    createNew() {
        let newData = {};
        newData["code"] = this.newAttendanceName.value;
        newData["description"] = this.newAttendanceDescription.value;
        newData["property"] = propertyFormat;
        this.attendanceApi.post_attendance_profile(newData).subscribe(results => {
            if (results[0].ATTENDANCE_GUID != undefined) {
                this.roleAPi.snackbarMsg('Attendance profile was created successfully', true);
                this.ngOnInit();
            } else {
                this.roleAPi.snackbarMsg('Failed to create attendance profile', false);
            }
            this._sharedService.menu.close('createNewAttendanceDetails');
            this.showSmallSpinner = false;
        }, error => {
            this.roleAPi.snackbarMsg(error.statusText, false);
            this.showSmallSpinner = false;
        })
    }

    /**
     * update role name & description 
     * @memberof AttendanceComponent
     */
    updateRole() {
        let data = {};
        data["code"] = this.editAttendanceName.value;
        data["description"] = this.editAttendanceDescription.value;
        data["property"] = this._property;
        const body = {
            "attendance_profile_guid": this.attendanceIdOutput,
            "data": data
        };
        this.attendanceApi.patch_attendance_details(body).subscribe(results => {
            if (results.attendance_profile_guid != undefined) {
                this.roleAPi.snackbarMsg('Attendance profile was updated successfully', true);
                this.refreshRoleList(this.clickedIndex);
            } else {
                this.roleAPi.snackbarMsg('Failed to update attendance profile', false);
            }
            this._sharedService.menu.close('editAttendanceDetails');
            this.showSmallSpinner = false;
        }, error => {
            this.roleAPi.snackbarMsg(error.statusText, false);
            this.showSmallSpinner = false;
        })
    }

    /**
     * delete confirmation pop up dialog message
     * @param {string} attendance_guid
     * @param {string} attendance_name
     * @memberof AttendanceComponent
     */
    delete(attendance_guid: string, attendance_name: string) {
        const dialogRef = this._sharedService.dialog.open(DialogDeleteConfirmationComponent, {
            disableClose: true,
            data: { value: attendance_guid, name: attendance_name, data: 'attendance' },
            height: "195px",
            width: "270px"
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === attendance_guid) {
                this.attendanceApi.delete_attendance_profile(attendance_guid).subscribe(response => {
                    if (response[0] !== undefined) {
                        if (response[0].ATTENDANCE_GUID != undefined) {
                            this.ngOnInit();
                            this.roleAPi.snackbarMsg('Selected attendance profile was deleted', true);
                        } else {
                            this.roleAPi.snackbarMsg('Please re-assign user to delete this profile', false);
                        }
                    }
                    else {
                        this.roleAPi.snackbarMsg('Attendance profile was failed to delete', false);
                    }
                })
            }
        });
    }

    /**
     * tick to check all or uncheck all user
     * @memberof AttendanceComponent
     */
    checkAllRoleListAssignedEmployees() {
        setTimeout(() => {
            this.assignedNameList.forEach(obj => {
                obj.isChecked = this.roleListCheckAll;
            })
        });
    }

    /**
     * get onchanged checked value
     * @memberof AttendanceComponent
     */
    checkRoleListAssignedEmployeeEvent() {
        const totalItems = this.assignedNameList.length;
        let checked = 0;
        this.assignedNameList.map(obj => {
            if (obj.isChecked) checked++;
        });
        if (checked > 0 && checked < totalItems) {
            //If even one item is checked but not all
            this.roleListIsIndeterminate = true;
            this.roleListCheckAll = false;
        } else if (checked == totalItems) {
            //If all are checked
            this.roleListCheckAll = true;
            this.roleListIsIndeterminate = false;
        } else {
            //If none is checked
            this.roleListIsIndeterminate = false;
            this.roleListCheckAll = false;
        }
    }

    /**
     * assign role profile by bulk
     * @param {*} item
     * @memberof AttendanceComponent
     */
    async reassignToOtherRoles(item) {
        this._filteredList = this.assignedNameList.filter(list => list.isChecked === true).map(function (o) { return o.user_guid; });
        try {
            let value = await this.attendanceApi.patch_user_attendance({
                "user_guid": this._filteredList,
                "attendance_guid": item.attendance_guid
            }).toPromise();
        }
        catch (error) {
            this.roleAPi.snackbarMsg(error.statusText, false);
        }
        this.assignedNameList = this.assignedNameList.filter(item => item.isChecked !== true);
        this._filteredList = [];
        // let list = await this.roleAPi.get_role_profile_list().toPromise();
        let list = await this.attendanceApi.get_attendance_list().toPromise();
        this.roleList = list;
        this.roleListCheckAll = false;
        this.roleListIsIndeterminate = false;
    }

    /**
     * Get list of role profle, selected profile and user list based on profile
     * @memberof AttendanceComponent
     */
    refreshRoleList(index: number) {
        this.attendanceApi.get_attendance_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            this.clickedIndex = index;
            this.selectedProfile(this.roleList[this.clickedIndex], this.clickedIndex);
            if (this.roleList.length > 0) {
                this.editAttendanceName.patchValue(this.roleList[this.clickedIndex].code);
                this.editAttendanceDescription.patchValue(this.roleList[this.clickedIndex].description);
            }
        });
        this.roleAPi.get_user_list().subscribe(list => {
            this._userList = list;
        });
    }

    /**
     * Filter text key in from searchbar 
     * @param {*} text
     * @memberof AttendanceComponent
     */
    async filter(text: any) {
        if (text && text.trim() != '') {
            let name = this._userList.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            let department = this._userList.filter((value: any) => {
                if (value.department != undefined) {
                    return (value.department.toLowerCase().indexOf(text.toLowerCase()) > -1);
                }
            })
            let company = this._userList.filter((items: any) => {
                if (items.companyName != undefined) {
                    return (items.companyName.toLowerCase().indexOf(text.toLowerCase()) > -1)
                }
            })
            this._userList = require('lodash').uniqBy(name.concat(department).concat(company), 'id');
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof AttendanceComponent
     */
    changeDetails(text: any) {
        if (text === '') {
            this.ngOnInit();
        } else {
            this.filter(text);
        }
    }

}
