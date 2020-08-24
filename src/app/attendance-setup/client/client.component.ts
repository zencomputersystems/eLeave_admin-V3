import { Component, OnInit, HostBinding, NgZone, ViewChild, ElementRef } from '@angular/core';
import { DialogDeleteConfirmationComponent } from '../../admin-setup/role-management/dialog-delete-confirmation/dialog-delete-confirmation.component';
import { EditModeDialogComponent } from '../../admin-setup/leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { RoleApiService } from '../../admin-setup/role-management/role-api.service';
import { FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../admin-setup/leave-setup/shared.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ClientApiService } from './client-api.service';
import { googlemaps } from 'googlemaps';

declare var google;

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
    public editClientName: any;

    /**
     * role description form control
     * @type {*}
     * @memberof ClientComponent
     */
    public editClientAbbr: any;

    public editProject: any;
    public editProjectAbbr: any
    public editProjectName: any
    public editProjectDescription: any

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
    public address: any;
    public currentAddress: any;
    public createNew: boolean;
    private geoCoder;
    @ViewChild('search')
    public searchElementRef: ElementRef;

    @ViewChild('editSearch')
    public editSearchElement: ElementRef;

    public project;
    public contract;
    public location;

    public newClientName: string;
    public newClientAbbr: string;
    public newSOC: string;
    public newProjectName: string;
    public newProjectDescription: string;
    public newContractNo: string;
    public newContractName: string;
    public newContractDescription: string;

    public searchControl: FormControl;

    public filteredLocation: string[];

    public selectedProjectList: any;

    public selectedContractList: any;

    public selectedLocationList: any;

    public patchProject: any = [];
    public patchContract: any = [];
    public patchLocation: any = [];

    public postProject: any = [];
    public postContract: any = [];
    public postLocation: any = [];

    /**
     *Creates an instance of ClientComponent.
     * @param {RoleApiService} roleAPi
     * @param {SharedService} _sharedService
     * @memberof ClientComponent
     */
    constructor(private roleAPi: RoleApiService, private _sharedService: SharedService,
        private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private clientApi: ClientApiService) {
        this.newRoleName = new FormControl('', Validators.required);
        this.newRoleDescription = new FormControl('', Validators.required);
    }

    /**
     * initial method to get endpoint list
     * @memberof ClientComponent
     */
    ngOnInit() {
        this.editClientName = new FormControl('', Validators.required);
        this.editClientAbbr = new FormControl('', Validators.required);
        this.refreshRoleList();

        //create search FormControl
        this.searchControl = new FormControl();

        //set current position
        // this.setCurrentLocation();

        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ["address"]
            });
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

    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
                const coordinate = this.latitude + ',' + this.longitude;
                this.clientApi.get_search_type_location(coordinate, 'coordinate').subscribe(data => {
                    console.log(data);
                    this.searchControl.patchValue(data.results[0].formatted_address)
                })
                // this.getAddress(this.latitude, this.longitude);
            });
        }
    }

    /**
     * drag location from existing location
     * @param {MouseEvent} $event
     * @memberof ClientComponent
     */
    markerDragEndEdit($event: MouseEvent, index: number) {
        this.location[index].LATITUDE = $event.coords.lat;
        this.location[index].LONGITUDE = $event.coords.lng;
        this.getAddress(this.location[index].LATITUDE, this.location[index].LONGITUDE, index);
    }

    /**
     * drag location for edit menu (no location save before)
     * @param {MouseEvent} $event
     * @memberof ClientComponent
     */
    markerDragEnd($event: MouseEvent) {
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
    }

    getAddress(latitude, longitude, index?: number) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    if (this.createNew === true) {
                        this.currentAddress = results[0].formatted_address;
                    } else {
                        if (index !== undefined) {
                            this.location[index].ADDRESS = results[0].formatted_address;
                        } else {
                            this.setCurrentLocation();
                        }
                    }
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
        this.clientApi.get_project_list_id(this.roleIdOutput).subscribe(data => this.selectedProjectList = data)
        this.clientApi.get_contract_list_id(this.roleIdOutput).subscribe(list => this.selectedContractList = list)
        this.clientApi.get_location_list_id(this.roleIdOutput).subscribe(list => this.selectedLocationList = list)
        if (this.location[0] != undefined) {
            this.latitude = this.location[0].LATITUDE;
            this.longitude = this.location[0].LONGITUDE;
            this.address = this.location[0].ADDRESS;
            this.zoom = 15;
        } else {
            this.setCurrentLocation();
        }
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
     * delete confirmation pop up dialog message
     * @param {string} client_guid
     * @param {string} name
     * @memberof ClientComponent
     */
    delete(client_guid: string, name: string) {
        const dialogRef = this._sharedService.dialog.open(DialogDeleteConfirmationComponent, {
            disableClose: true,
            data: { value: client_guid, name: name, data: 'client' },
            height: "195px",
            width: "270px"
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === client_guid) {
                this.clientApi.delete_client_profile(client_guid).subscribe(response => {
                    if (response[0] !== undefined) {
                        if (response[0].CLIENT_GUID != undefined) {
                            this.ngOnInit();
                            this.clientApi.snackbarMsg('Selected client profile was deleted', true);
                        }
                    }
                    else {
                        this.roleAPi.snackbarMsg('Client profile was failed to delete', false);
                    }
                })
            }
        });
    }

    /**
     * create new client profile
     * @memberof ClientComponent
     */
    createClientProfile() {
        const postBody = {
            "name": this.newClientName,
            "abbr": this.newClientAbbr,
            "location": [
                {
                    "lat": this.latitude,
                    "long": this.longitude,
                    "address": "abc"
                }
            ],
            "project": [
                {
                    "name": this.newProjectName,
                    "code": this.newSOC,
                    "description": this.newProjectDescription
                }
            ],
            "contract": [
                {
                    "name": this.newContractName,
                    "code": this.newContractNo,
                    "description": this.newContractDescription
                }
            ]
        }
        this.clientApi.post_client_profile(postBody).subscribe(response => console.log(response))
    }

    /**
     * Get list of client profle & selected profile
     * @memberof ClientComponent
     */
    refreshRoleList() {
        this.clientApi.get_client_profile_list().subscribe(data => {
            this.roleList = data;
            this.showSpinner = false;
            this.clickedIndex = 0;
            this.selectedProfile(this.roleList[this.clickedIndex], this.clickedIndex);
        });
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

    /**
     * search location from keyup text 
     * @param {*} location
     * @memberof ClientComponent
     */
    getSearchLocation(location) {
        console.log(location);
        this.clientApi.get_search_location(location).subscribe(data => {
            console.log('input location', data)
            this.filteredLocation = data.predictions;
        })
    }

    getLocationCoordinate(address: string) {
        this.clientApi.get_search_type_location(address, 'address').subscribe(
            detail => {
                console.log(detail.results[0].geometry.location);
                this.latitude = detail.results[0].geometry.location.lat;
                this.longitude = detail.results[0].geometry.location.lng;
            }
        )
    }

    addNewProject() {
        this.project.push({
            "PROJECT_GUID": "",
            "NAME": '',
            "SOC_NO": "",
            "DESCRIPTION": ""
        });
    }

    deleteProjet(index) {
        this.project.splice(index, 1);
    }

    addNewContract() {
        this.contract.push({
            "CONTRACT_GUID": "",
            "NAME": "",
            "CONTRACT_NO": "",
            "DESCRIPTION": ""
        })
    }

    deleteContract(index) {
        this.contract.splice(index, 1);
    }
    saveEditClient() {
        // project
        for (let i = 0; i < this.project.length; i++) {
            if (this.project[i].PROJECT_GUID !== '') {
                const project = {
                    "projectId": this.project[i].PROJECT_GUID,
                    "clientId": this.roleIdOutput,
                    "name": this.project[i].NAME,
                    "socNo": this.project[i].SOC_NO,
                    "description": this.project[i].DESCRIPTION
                }
                this.patchProject.push(project);
            } else {
                const newproject = {
                    "clientId": this.roleIdOutput,
                    "name": this.project[i].NAME,
                    "socNo": this.project[i].SOC_NO,
                    "description": this.project[i].DESCRIPTION
                }
                this.postProject.push(newproject);
            }
        }

        // contract
        for (let i = 0; i < this.contract.length; i++) {
            if (this.contract[i].CONTRACT_GUID !== '') {
                const contract = {
                    "contractId": this.contract[i].CONTRACT_GUID,
                    "clientId": this.roleIdOutput,
                    "name": this.contract[i].NAME,
                    "contractNo": this.contract[i].CONTRACT_NO,
                    "description": this.contract[i].DESCRIPTION
                }
                this.patchContract.push(contract);
            } else {
                const newcontract = {
                    "clientId": this.roleIdOutput,
                    "name": this.contract[i].NAME,
                    "contractNo": this.contract[i].CONTRACT_NO,
                    "description": this.contract[i].DESCRIPTION
                }
                this.postContract.push(newcontract);
            }
        }

        //location (feature: check if can add more location 19/8/2020)
        for (let i = 0; i < this.location.length; i++) {
            if (this.location[i].LOCATION_GUID !== '') {
                const location =
                {
                    "locationId": this.location[i].LOCATION_GUID,
                    "clientId": this.roleIdOutput,
                    "latitude": (this.location[i].LATITUDE).toString(),
                    "longitude": (this.location[i].LONGITUDE).toString(),
                    "address": this.location[i].ADDRESS
                }
                this.patchLocation.push(location);
            } else {
                const newLocation = {
                    "clientId": this.roleIdOutput,
                    "latitude": this.latitude.toString(),
                    "longitude": this.longitude.toString(),
                    "address": this.searchControl.value
                }
                this.postLocation.push(newLocation);
            }
        }

        const patchData = {
            "patch": {
                "client": [
                    {
                        "id": this.roleIdOutput,
                        "name": this.editClientName.value,
                        "abbr": this.editClientAbbr.value
                    }
                ],
                "project": this.patchProject,
                "contract": this.patchContract,
                "location": this.patchLocation
            },
            "post": {
                "project": this.postProject,
                "contract": this.postContract,
                "location": this.postLocation
            }
        }

        this.clientApi.patch_client_bundle(patchData).subscribe(res => {
            this.patchProject = [];
            this.patchContract = [];
            this.patchLocation = [];
            this.postProject = [];
            this.postContract = [];
            this.postLocation = [];
            this.showSmallSpinner = false;
            this.roleAPi.snackbarMsg('Client details was saved successfully', true);
            this._sharedService.menu.close('editLeaveTypeDetails');
            this.refreshRoleList();
        })
    }

}
