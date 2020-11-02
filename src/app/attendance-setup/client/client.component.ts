import { Component, OnInit, HostBinding } from '@angular/core';
import { DialogDeleteConfirmationComponent } from '../../admin-setup/role-management/dialog-delete-confirmation/dialog-delete-confirmation.component';
import { EditModeDialogComponent } from '../../admin-setup/leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../admin-setup/leave-setup/shared.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ClientApiService } from './client-api.service';

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
    public clientList: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof ClientComponent
     */
    public showSpinner: boolean = true;

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
     * client id value
     * @type {string}
     * @memberof ClientComponent
     */
    public clientId: string;

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

    public project;
    public contract;
    public location;

    public newClientName: string;
    public newClientAbbr: string;
    public newProject = [{
        "name": "",
        "code": "",
        "description": ""
    }];

    public newContract = [{
        "name": "",
        "code": "",
        "description": ""
    }]

    public newLocation = [{
        "latitude": "",
        "longitude": "",
        "address": ""
    }]

    public filteredLocation: string[];

    public newFilteredLocation: string[];

    public patchProject: any = [];
    public patchContract: any = [];
    public patchLocation: any = [];

    public postProject: any = [];
    public postContract: any = [];
    public postLocation: any = [];

    private projectDeleted: any = [];
    private contractDeleted: any = [];
    private locationDeleted: any = [];

    /**
     *Creates an instance of ClientComponent.
     * @param {SharedService} _sharedService
     * @param {MapsAPILoader} mapsAPILoader
     * @param {ClientApiService} clientApi
     * @memberof ClientComponent
     */
    constructor(private _sharedService: SharedService,
        private mapsAPILoader: MapsAPILoader, private clientApi: ClientApiService) {
    }

    /**
     * initial method to get endpoint list
     * @memberof ClientComponent
     */
    ngOnInit() {
        this.editClientName = new FormControl('', Validators.required);
        this.editClientAbbr = new FormControl('', Validators.required);
        this.refreshRoleList();

        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
        });
    }

    // setCurrentLocation() {
    //     if ('geolocation' in navigator) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             this.latitude = position.coords.latitude;
    //             this.longitude = position.coords.longitude;
    //             this.zoom = 12;
    //             const coordinate = this.latitude + ',' + this.longitude;
    //             this.clientApi.get_search_type_location(coordinate, 'coordinate').subscribe(data => {
    //                 console.log(data);
    //             })
    //         });
    //     }
    // }

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
    markerDragEnd($event: MouseEvent, index:number) {
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude, index);
    }

    getAddress(latitude, longitude, index: number) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    if (this.createNew === true) {
                        // this.currentAddress = results[0].formatted_address;
                        this.newLocation[index].address = results[0].formatted_address;
                    } else {
                        if (index !== undefined) {
                            this.location[index].ADDRESS = results[0].formatted_address;
                        }
                        // else {
                        //     this.setCurrentLocation();
                        // }
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
        if (item !== undefined) {
            this.clientId = item.CLIENT_GUID;
            this.project = item.PROJECT_DATA;
            this.contract = item.CONTRACT_DATA;
            this.location = item.LOCATION_DATA;
        }
        this.zoom = 15;
        // if (this.location[0] != undefined) {
        //     this.latitude = this.location[0].LATITUDE;
        //     this.longitude = this.location[0].LONGITUDE;
        //     this.address = this.location[0].ADDRESS;
        //     this.zoom = 15;
        // } 
        // else {
        //     this.setCurrentLocation();
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
            this.clientApi.snackbarMsg('Edit mode disabled. Good job!', true);
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
                        this.clientApi.snackbarMsg('Client profile was failed to delete', false);
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
            "location": this.newLocation,
            "project": this.newProject,
            "contract": this.newContract
        }
        this.clientApi.post_client_profile(postBody).subscribe(response => {
            this._sharedService.menu.close('createNewClientDetails');
            this.showSmallSpinner = false;
            this.clientApi.snackbarMsg('Client details was created successfully', true);
            this.refreshRoleList();
            this.newClientName = null;
            this.newClientAbbr = null;
            this.latitude = null;
            this.longitude = null;
            this.currentAddress = '';
            this.newProject = [{
                "name": "",
                "code": "",
                "description": ""
            }];
            this.newContract = [{
                "name": "",
                "code": "",
                "description": ""
            }];
            this.newLocation = [{
                "latitude": "",
                "longitude": "",
                "address": ""
            }]
        }, error => {
            this.showSmallSpinner = false;
            this.clientApi.snackbarMsg('Failed to create new client profile', false);
        })
    }

    /**
     * Get list of client profle & selected profile
     * @memberof ClientComponent
     */
    refreshRoleList() {
        this.clientApi.get_client_profile_list().subscribe(data => {
            this.clientList = data;
            this.showSpinner = false;
            this.clickedIndex = 0;
            this.selectedProfile(this.clientList[this.clickedIndex], this.clickedIndex);
        });
    }

    async filter(text: any) {
        if (text && text.trim() != '') {
            this.clientList = this.clientList.filter((items: any) => {
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
        this.clientApi.get_search_location(location).subscribe(data => {
            this.filteredLocation = data.predictions;
        })
    }

    getLocationCoordinate(address: string, index: number) {
        this.clientApi.get_search_type_location(address, 'address').subscribe(
            detail => {
                console.log(detail.results[0].geometry.location);
                this.location[index].LATITUDE = detail.results[0].geometry.location.lat;
                this.location[index].LONGITUDE = detail.results[0].geometry.location.lng;
            }
        )
    }

    /**
     * search location from keyup text for create new menu
     * @param {*} location
     * @memberof ClientComponent
     */
    getNewSearchLocation(location) {
        this.clientApi.get_search_location(location).subscribe(data => {
            this.newFilteredLocation = data.predictions;
        })
    }

    /**
     * seleted autocomplete address in create new menu
     * @param {string} address
     * @param {number} index
     * @memberof ClientComponent
     */
    getNewLocationCoordinate(address: string, index: number) {
        this.clientApi.get_search_type_location(address, 'address').subscribe(
            detail => {
                this.newLocation[index].latitude = detail.results[0].geometry.location.lat;
                this.newLocation[index].longitude = detail.results[0].geometry.location.lng;
            }
        )
    }

    addNewProject(type: string) {
        if (type === 'edit') {
            this.project.push({
                "PROJECT_GUID": "",
                "NAME": '',
                "SOC_NO": "",
                "DESCRIPTION": ""
            });
        } else {
            this.newProject.push({
                "name": '',
                "code": '',
                "description": ''
            })
        }
    }

    deleteProjet(index, type: string) {
        if (type === 'edit') {
            if (this.project[index].PROJECT_GUID != '') {
                this.projectDeleted.push({ "id": this.project[index].PROJECT_GUID });
            }
            this.project.splice(index, 1);
        } else {
            this.newProject.splice(index, 1);
        }
    }

    addNewContract(type: string) {
        if (type === 'edit') {
            this.contract.push({
                "CONTRACT_GUID": "",
                "NAME": "",
                "CONTRACT_NO": "",
                "DESCRIPTION": ""
            })
        } else {
            this.newContract.push({
                "name": "",
                "code": "",
                "description": ""
            })
        }
    }

    deleteContract(index, type: string) {
        if (type === 'edit') {
            if (this.contract[index].CONTRACT_GUID != '') {
                this.contractDeleted.push({ "id": this.contract[index].CONTRACT_GUID });
            }
            this.contract.splice(index, 1);
        } else {
            this.newContract.splice(index, 1);
        }
    }

    addNewLocation(type: string) {
        if (type === 'edit') {
            this.location.push({
                "LOCATION_GUID": "",
                "LATITUDE": null,
                "LONGITUDE": null,
                "ADDRESS": ""
            })
        } else {
            this.newLocation.push({
                "latitude": "",
                "longitude": "",
                "address": ""
            })
        }
    }

    deleteLocation(index, type: string) {
        if (type === 'edit') {
            if (this.location[index].LOCATION_GUID != '') {
                this.locationDeleted.push({ "id": this.location[index].LOCATION_GUID });
            }
            this.location.splice(index, 1);
        } else {
            this.newLocation.splice(index, 1);
        }
    }
    saveEditClient() {
        // project
        if (this.project.length > 0) {
            for (let i = 0; i < this.project.length; i++) {
                if (this.project[i].PROJECT_GUID !== '') {
                    const project = {
                        "projectId": this.project[i].PROJECT_GUID,
                        "clientId": this.clientId,
                        "name": this.project[i].NAME,
                        "socNo": this.project[i].SOC_NO,
                        "description": this.project[i].DESCRIPTION
                    }
                    this.patchProject.push(project);
                } else {
                    const newproject = {
                        "clientId": this.clientId,
                        "name": this.project[i].NAME,
                        "socNo": this.project[i].SOC_NO,
                        "description": this.project[i].DESCRIPTION
                    }
                    this.postProject.push(newproject);
                }
            }
        } else {
            this.patchProject = [];
            this.postProject = [];
        }

        // contract
        if (this.contract.length > 0) {
            for (let i = 0; i < this.contract.length; i++) {
                if (this.contract[i].CONTRACT_GUID !== '') {
                    const contract = {
                        "contractId": this.contract[i].CONTRACT_GUID,
                        "clientId": this.clientId,
                        "name": this.contract[i].NAME,
                        "contractNo": this.contract[i].CONTRACT_NO,
                        "description": this.contract[i].DESCRIPTION
                    }
                    this.patchContract.push(contract);
                } else {
                    const newcontract = {
                        "clientId": this.clientId,
                        "name": this.contract[i].NAME,
                        "contractNo": this.contract[i].CONTRACT_NO,
                        "description": this.contract[i].DESCRIPTION
                    }
                    this.postContract.push(newcontract);
                }
            }
        } else {
            this.patchContract = [];
            this.postContract = [];
        }

        //location 
        if (this.location.length > 0) {
            for (let i = 0; i < this.location.length; i++) {
                if (this.location[i].LOCATION_GUID !== '') {
                    const location =
                    {
                        "locationId": this.location[i].LOCATION_GUID,
                        "clientId": this.clientId,
                        "latitude": (this.location[i].LATITUDE).toString(),
                        "longitude": (this.location[i].LONGITUDE).toString(),
                        "address": this.location[i].ADDRESS
                    }
                    this.patchLocation.push(location);
                } else {
                    const newLocation = {
                        "clientId": this.clientId,
                        "latitude": (this.location[i].LATITUDE).toString(),
                        "longitude": (this.location[i].LONGITUDE).toString(),
                        "address": this.location[i].ADDRESS
                    }
                    this.postLocation.push(newLocation);
                }
            }
        } else {
            this.patchLocation = [];
            this.postLocation = [];
        }

        const patchData = {
            "patch": {
                "client": [
                    {
                        "id": this.clientId,
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
            },
            "delete": {
                "project": this.projectDeleted,
                "contract": this.contractDeleted,
                "location": this.locationDeleted
            }
        }

        this.clientApi.patch_client_bundle(patchData).subscribe(res => {
            this.patchProject = [];
            this.patchContract = [];
            this.patchLocation = [];
            this.postProject = [];
            this.postContract = [];
            this.postLocation = [];
            this.projectDeleted = [];
            this.contractDeleted = [];
            this.showSmallSpinner = false;
            this.clientApi.snackbarMsg('Client details was saved successfully', true);
            this._sharedService.menu.close('editClientDetails');
            this.refreshRoleList();
        }, error => {
            this.clientApi.snackbarMsg('Failed to edit client detail', false);
        })
    }

}
