import { Component, OnInit, HostBinding, NgZone, ViewChild, ElementRef } from '@angular/core';
import { DialogDeleteConfirmationComponent } from '../../admin-setup/role-management/dialog-delete-confirmation/dialog-delete-confirmation.component';
import { EditModeDialogComponent } from '../../admin-setup/leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { WorkingHourApiService } from '../../admin-setup/leave-setup/working-hour/working-hour-api.service';
import { RoleApiService } from '../../admin-setup/role-management/role-api.service';
import { FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../admin-setup/leave-setup/shared.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ClientApiService } from './client-api.service';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

    /**
        * Role items get from API
        * @type {*}
        * @memberof ClientComponent
        */
    public roleList: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof ClientComponent
     */
    public showSpinner: boolean = true;

    /**
     * get assigned employee name list 
     * @type {*}
     * @memberof ClientComponent
     */
    public assignedNameList: any;

    /**
     * selected index
     * @type {number}
     * @memberof ClientComponent
     */
    public clickedIndex: number = 0;

    /**
     * toggle button mode value
     * @type {string}
     * @memberof ClientComponent
     */
    public mode: string = 'OFF';

    /** 
     * role id value
     * @type {string}
     * @memberof ClientComponent
     */
    public roleIdOutput: string;

    /**
     * role name form control
     * @type {*}
     * @memberof ClientComponent
     */
    public editRoleName: any;

    /**
     * role description form control
     * @type {*}
     * @memberof ClientComponent
     */
    public editRoleDescription: any;

    /**
     * new role profile name form control
     * @type {*}
     * @memberof ClientComponent
     */
    public newRoleName: any;

    /**
     * new role profile description form control
     * @type {*}
     * @memberof ClientComponent
     */
    public newRoleDescription: any;

    /**
     * selected new button or not
     * @type {boolean}
     * @memberof ClientComponent
     */
    public newButton: boolean = true;

    /**
     * selected clone button or not
     * @type {boolean}
     * @memberof ClientComponent
     */
    public cloneButton: boolean = false;

    /**
     * selected radio button (role profile id)
     * @type {string}
     * @memberof ClientComponent
     */
    public cloneRoleId: string;

    /**
     * show loading spinner
     * @type {boolean}
     * @memberof ClientComponent
     */
    public showSmallSpinner: boolean;

    /**
     * set menu is open or close by assign new class
     * @type {boolean}
     * @memberof ClientComponent
     */
    @HostBinding('class.menuOverlay') menuOpen: boolean = false;

    /**
     * user list
     * @private
     * @type {*}
     * @memberof ClientComponent
     */
    private _userList: any;

    /**
     * filtered userId list of dragged user
     * @private
     * @type {*}
     * @memberof ClientComponent
     */
    private _filteredList: any = [];

    /**
     * get property details from requested role id
     * @private
     * @type {*}
     * @memberof ClientComponent
     */
    private _property: any;

    /**
     * This property is to bind value of check all sign in check all status in checkbox
     * @type {boolean}
     * @memberof ClientComponent
     */
    public roleListCheckAll: boolean;

    /**
     * This property is to bind value of indetimate sign in check all status's checkbox
     * @type {boolean}
     * @memberof ClientComponent
     */
    public roleListIsIndeterminate: boolean;

    /**
     * This property is to bind data of defult role
     * @type {*}
     * @memberof ClientComponent
     */
    public defaultRoleData: any;

    /**
     * This property is to bind data of default role in checkbox during creation
     * @type {boolean}
     * @memberof ClientComponent
     */
    public defaultProfileRole: boolean = false;

    /**
     * To check current role is existed or not during role profile creation
     * @type {boolean}
     * @memberof ClientComponent
     */
    public showWarning: boolean = false;

    public showLocation: boolean = false;
    public showContrat: boolean = false;
    public showProject: boolean = true;
    public title: string = 'AGM project';
    public latitude: number;
    public longitude: number;
    public zoom: number;
    public address: string;
    private geoCoder;
    @ViewChild('search')
    public searchElementRef: ElementRef;

    public project;
    public contract;
    public location;

    /**
     *Creates an instance of ClientComponent.
     * @param {RoleApiService} roleAPi
     * @param {SharedService} _sharedService
     * @memberof ClientComponent
     */
    constructor(private roleAPi: RoleApiService, private _sharedService: SharedService,
        private workingHourWorkingHourApiService: WorkingHourApiService, private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone, private clientApi: ClientApiService) {
        this.newRoleName = new FormControl('', Validators.required);
        this.newRoleDescription = new FormControl('', Validators.required);
    }

    /**
     * initial method to get endpoint list
     * @memberof ClientComponent
     */
    ngOnInit() {
        this.editRoleName = new FormControl('', Validators.required);
        this.editRoleDescription = new FormControl('', Validators.required);
        this.refreshRoleList();
        this.mapsAPILoader.load().then(() => {
            this.setCurrentLocation();
            this.geoCoder = new google.maps.Geocoder;
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 12;
                });
            });
        });
    }

    private setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 15;
            });
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
    }

    getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    this.address = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }


    /**
     * selected role profile
     * @param {*} item
     * @param {*} index
     * @memberof ClientComponent
     */
    async selectedProfile(item, index) {
        this.clickedIndex = index;
        this.roleIdOutput = item.CLIENT_GUID;
        this.project = item.PROJECT_DATA;
        this.contract = item.CONTRACT_DATA;
        this.location = item.LOCATION_DATA;
        // let data = await this.roleAPi.get_role_details_profile(item.CLIENT_GUID).toPromise();
        // this._property = data.property;
        // let list = await this.roleAPi.get_assigned_user_profile(item.CLIENT_GUID).toPromise();
        // this.assignedNameList = list;
        // for (let j = 0; j < this.assignedNameList.length; j++) {
        //     this.assignedNameList[j]["content"] = this.assignedNameList[j].fullname;
        //     this.assignedNameList[j]["effectAllowed"] = "move";
        //     this.assignedNameList[j]["handle"] = true;
        //     this.assignedNameList[j]["disable"] = false;
        // }
    }

    /**
     * toggle edit mode
     * @param {*} event
     * @memberof ClientComponent
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
     * update role name & description 
     * @memberof ClientComponent
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
     * @param {string} client_guid
     * @param {string} name
     * @memberof ClientComponent
     */
    delete(client_guid: string, name: string) {
        const dialogRef = this._sharedService.dialog.open(DialogDeleteConfirmationComponent, {
            disableClose: true,
            data: { value: client_guid, name: name },
            height: "195px",
            width: "270px"
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === client_guid) {
                this.roleAPi.delete_role_profile(client_guid).subscribe(response => {
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
     * Get list of role profle, selected profile and user list based on profile
     * @memberof ClientComponent
     */
    refreshRoleList() {
        this.clientApi.get_client_profile_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            this.clickedIndex = 0;
            this.selectedProfile(this.roleList[this.clickedIndex], this.clickedIndex);
        });
        this.roleAPi.get_user_list().subscribe(list => this._userList = list);

    }

    async filter(text: any) {
        if (text && text.trim() != '') {
            this.roleList = this.roleList.filter((items: any) => {
                if (items.NAME != undefined) {
                    return (items.NAME.toLowerCase().indexOf(text.toLowerCase()) > -1)
                }
            })
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof ClientComponent
     */
    changeDetails(text: any) {
        if (text === '') {
            this.ngOnInit();
        } else {
            this.filter(text);
        }
    }

}
