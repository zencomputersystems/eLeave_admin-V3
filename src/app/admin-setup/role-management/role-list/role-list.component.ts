import { PopoverController } from '@ionic/angular';
import { ConfirmationWindowComponent } from './../../../global/confirmation-window/confirmation-window.component';
import { WorkingHourApiService } from './../../leave-setup/working-hour/working-hour-api.service';
import { Component, OnInit, HostBinding } from '@angular/core';
import { RoleApiService } from '../role-api.service';
import { DialogDeleteConfirmationComponent } from '../dialog-delete-confirmation/dialog-delete-confirmation.component';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { roleDetails } from '../role-details-data';
import { SharedService } from '../../leave-setup/shared.service';

/**
 * Show list of role
 * @export
 * @class RoleListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {

    /**
     * Role items get from API
     * @type {*}
     * @memberof RoleListComponent
     */
    public roleList: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public showSpinner: boolean = true;

    /**
     * get assigned employee name list 
     * @type {*}
     * @memberof RoleListComponent
     */
    public assignedNameList: any;

    /**
     * selected index
     * @type {number}
     * @memberof RoleListComponent
     */
    public clickedIndex: number = 0;

    /**
     * toggle button mode value
     * @type {string}
     * @memberof RoleListComponent
     */
    public mode: string = 'OFF';

    /** 
     * role id value
     * @type {string}
     * @memberof RoleListComponent
     */
    public roleIdOutput: string;

    /**
     * role name form control
     * @type {*}
     * @memberof RoleListComponent
     */
    public editRoleName: any;

    /**
     * role description form control
     * @type {*}
     * @memberof RoleListComponent
     */
    public editRoleDescription: any;

    /**
     * new role profile name form control
     * @type {*}
     * @memberof RoleListComponent
     */
    public newRoleName: any;

    /**
     * new role profile description form control
     * @type {*}
     * @memberof RoleListComponent
     */
    public newRoleDescription: any;

    /**
     * selected new button or not
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public newButton: boolean = true;

    /**
     * selected clone button or not
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public cloneButton: boolean = false;

    /**
     * selected radio button (role profile id)
     * @type {string}
     * @memberof RoleListComponent
     */
    public cloneRoleId: string;

    /**
     * show loading spinner
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public showSmallSpinner: boolean;

    /**
     * set menu is open or close by assign new class
     * @type {boolean}
     * @memberof RoleListComponent
     */
    @HostBinding('class.menuOverlay') menuOpen: boolean = false;

    /**
     * user list
     * @private
     * @type {*}
     * @memberof RoleListComponent
     */
    private _userList: any;

    /**
     * filtered userId list of dragged user
     * @private
     * @type {*}
     * @memberof RoleListComponent
     */
    private _filteredList: any = [];

    /**
     * get property details from requested role id
     * @private
     * @type {*}
     * @memberof RoleListComponent
     */
    private _property: any;

    /**
     * This property is to bind value of check all sign in check all status in checkbox
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public roleListCheckAll: boolean;

    /**
     * This property is to bind value of indetimate sign in check all status's checkbox
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public roleListIsIndeterminate: boolean;

    /**
     * This property is to bind data of defult role
     * @type {*}
     * @memberof RoleListComponent
     */
    public defaultRoleData: any;

    /**
     * This property is to bind data of default role in checkbox during creation
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public defaultProfileRole: boolean = false;

    /**
     * To check current role is existed or not during role profile creation
     * @type {boolean}
     * @memberof RoleListComponent
     */
    public showWarning: boolean = false;

    /**
     *Creates an instance of RoleListComponent.
     * @param {RoleApiService} roleAPi
     * @param {SharedService} _sharedService
     * @memberof RoleListComponent
     */
    constructor(private roleAPi: RoleApiService, private _sharedService: SharedService,
        private workingHourWorkingHourApiService: WorkingHourApiService, private rolePopoverController: PopoverController) {
        this.newRoleName = new FormControl('', Validators.required);
        this.newRoleDescription = new FormControl('', Validators.required);
    }

    /**
     * initial method to get endpoint list
     * @memberof RoleListComponent
     */
    ngOnInit() {
        this.editRoleName = new FormControl('', Validators.required);
        this.editRoleDescription = new FormControl('', Validators.required);
        this.refreshRoleList();
    }

    /**
     * dropped user to patch to the assigned role profile
     * @param {*} evt
     * @param {*} roleItem
     * @memberof RoleListComponent
     */
    async onDropped(evt, roleItem) {
        for (let i = 0; i < this.assignedNameList.length; i++) {
            if (evt.data === this.assignedNameList[i].fullname) {
                this.draggedUserId(i);
                try {
                    let response = await this.roleAPi.patch_user_profile({
                        "user_guid": this._filteredList,
                        "role_guid": roleItem.role_guid
                    }).toPromise();
                    this.assignedNameList.splice(i, 1);
                } catch (err) {
                    this.roleAPi.snackbarMsg(err.statusText, false);
                }
                this._filteredList = [];
                let data = await this.roleAPi.get_role_profile_list().toPromise();
                this.roleList = data;
                this.roleListCheckAll = false;
                this.roleListIsIndeterminate = false;
            }
        }
    }

    /**
     * get dragged item 
     * @param {number} i
     * @memberof RoleListComponent
     */
    async draggedUserId(i: number) {
        if (this.checkDuplicateName(this._userList, this.assignedNameList[i].fullname) != 0) {
            const indexes: number = this.checkDuplicateName(this._userList, this.assignedNameList[i].fullname);
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
     * @memberof RoleListComponent
     */
    checkDuplicateName(list: any, obj: any) {
        for (let j = 0; j < list.length; j++) {
            if (list[j].employeeName === obj) {
                return j;
            }
        }
        return 0;
    }

    /**
     * selected role profile
     * @param {*} item
     * @param {*} index
     * @memberof RoleListComponent
     */
    async selectedProfile(item, index) {
        this.clickedIndex = index;
        this.roleIdOutput = item.role_guid;
        let data = await this.roleAPi.get_role_details_profile(item.role_guid).toPromise();
        this._property = data.property;
        let list = await this.roleAPi.get_assigned_user_profile(item.role_guid).toPromise();
        this.assignedNameList = list;
        for (let j = 0; j < this.assignedNameList.length; j++) {
            this.assignedNameList[j]["content"] = this.assignedNameList[j].fullname;
            this.assignedNameList[j]["effectAllowed"] = "move";
            this.assignedNameList[j]["handle"] = true;
            this.assignedNameList[j]["disable"] = false;
        }
    }

    /**
     * toggle edit mode
     * @param {*} event
     * @memberof RoleListComponent
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
            this.roleAPi.snackbarMsg('Edit mode disabled. Good job!', true);
        }
        this._sharedService.emitChange(this.mode);
    }

    /**
     * create new/clone role profile
     * @param {string} buttonName
     * @memberof RoleListComponent
     */
    async createNew(buttonName: string) {
        let details;
        if (buttonName == 'new') {
            details = roleDetails;
            details.code = this.newRoleName.value;
            details.description = this.newRoleDescription.value;
        } else {
            details = await this.roleAPi.get_role_details_profile(this.cloneRoleId).toPromise();
            details.code = details.code + ' (copy)';
        }
        this.roleAPi.post_role_profile(details).subscribe(res => {
            if (res[0].ROLE_GUID != undefined) {
                if (this.defaultProfileRole === true) {
                    this.workingHourWorkingHourApiService.post_profile_default('role', res[0].ROLE_GUID).subscribe(data => { });
                }
                this.ngOnInit();
                this.roleAPi.snackbarMsg('New role profile was created successfully', true);
            } else {
                this.roleAPi.snackbarMsg('Failed to create new role profile', false);
            }
            this._sharedService.menu.close('createNewRoleDetails');
            this.newRoleName.reset();
            this.newRoleDescription.reset();
            this.showSmallSpinner = false;
            this.showWarning = false;
            this.defaultProfileRole = false;
        }, error => {
            this.roleAPi.snackbarMsg(error.statusText, false);
            this.showSmallSpinner = false;
        })
    }

    /**
     * update role name & description 
     * @memberof RoleListComponent
     */
    updateRole() {
        let data = {};
        data["code"] = this.editRoleName.value;
        data["description"] = this.editRoleDescription.value;
        data["property"] = this._property;
        const body = {
            "role_guid": this.roleIdOutput,
            "data": data
        };
        this.roleAPi.patch_role_profile(body).subscribe(results => {
            if (results[0].ROLE_GUID != undefined) {
                this.roleAPi.snackbarMsg('Role profile was updated successfully', true);
                this.ngOnInit();
            } else {
                this.roleAPi.snackbarMsg('Failed to update role profile', false);
            }
            this._sharedService.menu.close('editRoleDetails');
            this.showSmallSpinner = false;
        }, error => {
            this.roleAPi.snackbarMsg(error.statusText, false);
            this.showSmallSpinner = false;
        })
    }

    /**
     * delete confirmation pop up dialog message
     * @param {string} role_guid
     * @param {string} role_name
     * @memberof RoleListComponent
     */
    delete(role_guid: string, role_name: string) {
        const dialogRef = this._sharedService.dialog.open(DialogDeleteConfirmationComponent, {
            disableClose: true,
            data: { value: role_guid, name: role_name },
            height: "195px",
            width: "270px"
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === role_guid) {
                this.roleAPi.delete_role_profile(role_guid).subscribe(response => {
                    if (response[0] !== undefined) {
                        if (response[0].ROLE_GUID != undefined) {
                            this.ngOnInit();
                            this.roleAPi.snackbarMsg('Selected role profile was deleted', true);
                        } else {
                            this.roleAPi.snackbarMsg('Please re-assign user to delete this profile', false);
                        }
                    }
                    else {
                        this.roleAPi.snackbarMsg('Role profile was failed to delete', false);
                    }
                })
            }
        });
    }

    /**
     * tick to check all or uncheck all user
     * @memberof RoleListComponent
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
     * @memberof RoleListComponent
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
     * @memberof RoleListComponent
     */
    async reassignToOtherRoles(item) {
        this._filteredList = this.assignedNameList.filter(list => list.isChecked === true).map(function (o) { return o.user_guid; });
        try {
            let value = await this.roleAPi.patch_user_profile({
                "user_guid": this._filteredList,
                "role_guid": item.role_guid
            }).toPromise();
        }
        catch (error) {
            this.roleAPi.snackbarMsg(error.statusText, false);
        }
        this.assignedNameList = this.assignedNameList.filter(item => item.isChecked !== true);
        this._filteredList = [];
        let list = await this.roleAPi.get_role_profile_list().toPromise();
        this.roleList = list;
        this.roleListCheckAll = false;
        this.roleListIsIndeterminate = false;
    }

    /**
     * Get default role guid then assign it to role list
     * @memberof RoleListComponent
     */
    async getDefaultRole() {
        const defaultList = await this.workingHourWorkingHourApiService.get_default_profile().toPromise();
        this.roleList.forEach(item => {
            if (item.role_guid === defaultList[0].ROLE_PROFILE_GUID) {
                item.isDefault = true;
                this.defaultRoleData = item;
            } else {
                item.isDefault = false;
            }
        });
    }

    /**
     * Executed when user confirm to update default role. It will patch new role's guid to api
     * @param {*} status
     * @param {*} newProfile
     * @returns
     * @memberof RoleListComponent
     */
    async changeDefaultRoleProfile(status, newProfile) {
        if (status === false) {
            const rolePopup = await this.rolePopoverController.create({
                component: ConfirmationWindowComponent,
                componentProps: {
                    type: 'role',
                    currDefaultProfile: this.defaultRoleData,
                    newDefaultProfile: newProfile
                },
                cssClass: 'confirmation-popover'
            });

            rolePopup.onDidDismiss().then(ret => {
                if (ret.data === true) {
                    this.workingHourWorkingHourApiService.post_profile_default('role', newProfile.role_guid).subscribe(
                        data => {
                            // this.getProfileList();
                            this.refreshRoleList();
                            this.roleAPi.snackbarMsg('Default role was updated', true);

                        }
                    );
                }
            })
            return await rolePopup.present();
        }
    }

    /**
     * Get list of role profle, selected profile and user list based on profile
     * @memberof RoleListComponent
     */
    refreshRoleList() {
        this.roleAPi.get_role_profile_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            this.clickedIndex = 0;
            this.selectedProfile(this.roleList[this.clickedIndex], this.clickedIndex);
            this.getDefaultRole();
        });
        this.roleAPi.get_user_list().subscribe(list => this._userList = list);

    }

    /**
     * Check if current profile list have default and set new profile to be as default profile
     * @memberof RoleListComponent
     */
    setDefaultRoleProfile(event) {
        this.defaultProfileRole = event.target.checked;
        if (this.defaultProfileRole == true) {
            this.workingHourWorkingHourApiService.get_default_profile().subscribe(
                ret => {
                    if (ret[0].ROLE_PROFILE_GUID !== undefined || ret[0].ROLE_PROFILE_GUID !== null || ret[0].ROLE_PROFILE_GUID !== "") {
                        this.showWarning = true;
                    }
                }
            );
        } else {
            this.showWarning = false;
        }
    }
}