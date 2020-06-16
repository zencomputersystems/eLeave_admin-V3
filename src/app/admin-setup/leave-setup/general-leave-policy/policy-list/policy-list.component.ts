import { Component, OnInit } from '@angular/core';
import { PolicyApiService } from '../policy-api.service';
import { Validators, FormControl } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { EditModeDialogComponent } from '../../edit-mode-dialog/edit-mode-dialog.component';
import { DeleteCalendarConfirmationComponent } from '../../delete-calendar-confirmation/delete-calendar-confirmation.component';

/**
 * List for all leave policy
 * @export
 * @class PolicyListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-policy-list',
    templateUrl: './policy-list.component.html',
    styleUrls: ['./policy-list.component.scss'],
})
export class PolicyListComponent implements OnInit {

    /**
     * Role items get from API
     * @type {*}
     * @memberof PolicyListComponent
     */
    public companyName: any;

    /**
     * Show loading spinner
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    public showSpinner: boolean = true;

    /**
     * edit mode value
     * @type {string}
     * @memberof PolicyListComponent
     */
    public modeValue: string = 'OFF';

    /**
     * index of clicked company name 
     * @type {number}
     * @memberof PolicyListComponent
     */
    public clickedIndex: number = 0;

    /**
     * selected leave policy details
     * @type {*}
     * @memberof PolicyListComponent
     */
    public policyDetails: any;

    /**
     * get clicked tenant company guid
     * @type {string}
     * @memberof PolicyListComponent
     */
    public tenantId: string;

    /**
     * validate on value create new company name
     * @type {*}
     * @memberof PolicyListComponent
     */
    public newName: any;

    /**
     * validate on value edit company name
     * @type {*}
     * @memberof PolicyListComponent
     */
    public editName: any;

    /**
     * get company id to patch company name
     * @type {string}
     * @memberof PolicyListComponent
     */
    public companyId: string;

    /**
     * show loading spinner
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    public showSmallSpinner: boolean;

    /**
     *Creates an instance of PolicyListComponent.
     * @param {PolicyApiService} policyApi
     * @param {SharedService} sharedService
     * @memberof PolicyListComponent
     */
    constructor(private policyApi: PolicyApiService, private sharedService: SharedService) { }

    /**
     * Set initial value to the properties & get endpoint value
     * @memberof PolicyListComponent
     */
    ngOnInit() {
        this.newName = new FormControl('', Validators.required);
        this.editName = new FormControl('', Validators.required);
        this.sharedService.leaveApi.get_company_list().subscribe(data => {
            this.companyName = data;
            this.clickedPolicy(this.companyName[0], 0);
            this.showSpinner = false;
        })
        this.getAssignedEmployee();
    }

    /**
     * assigned employee under the company
     * @memberof PolicyListComponent
     */
    async getAssignedEmployee() {
        let list = await this.policyApi.get_user_list().toPromise();
        for (let i = 0; i < this.companyName.length; i++) {
            let users = new Array();
            this.filterUser(list, users, i);
        }
    }

    /**
     * filtered user
     * @param {*} list
     * @param {*} users
     * @param {number} i
     * @memberof PolicyListComponent
     */
    filterUser(list, users, i: number) {
        for (let j = 0; j < list.length; j++) {
            if (this.companyName[i].TENANT_COMPANY_GUID == list[j].companyId) {
                users.push({ 'employeeName': list[j].employeeName });
                // users.push(list[j].employeeName); 
            }
            this.companyName[i]["employee"] = users.length;
            this.companyName[i]["employeeName"] = users;
        }
    }

    /**
     * toggle edit mode
     * @param {*} evt
     * @memberof WorkingHourListComponent
     */
    toggleEvent(evt) {
        if (evt.detail.checked === true) {
            this.modeValue = 'ON';
            this.policyApi.dialog.open(EditModeDialogComponent, {
                disableClose: true,
                data: 'policy',
                height: "355.3px",
                width: "383px"
            });
        } else {
            this.modeValue = 'OFF'
        }
        this.sharedService.emitChange(this.modeValue);
    }

    /**
     * clicked policy name
     * @param {*} item
     * @param {number} index
     * @memberof PolicyListComponent
     */
    clickedPolicy(item: any, index: number) {
        this.tenantId = item.TENANT_COMPANY_GUID;
        this.policyApi.get_general_leave_policy_id(item.TENANT_COMPANY_GUID).subscribe(list => {
            this.policyDetails = list;
        })
        this.clickedIndex = index;
    }

    /**
     * create new company name
     * @memberof PolicyListComponent
     */
    createNewCompany() {
        this.policyApi.post_company_name(this.newName.value).subscribe(result => {
            if (result[0].TENANT_COMPANY_GUID != undefined) {
                this.policyApi.message('New company was created successfully', true);
                this.showSmallSpinner = false;
                this.sharedService.menu.close('createCompanyDetails');
                this.newName.reset();
                const data = {
                    "approvalConfirmation": {
                        "requirement": "Anyone",
                        "approvalLevel": null,
                        "escalateAfterDays": null
                    },
                    "forfeitCFLeave": {
                        "value": false,
                        "day": null,
                        "month": ""
                    },
                    "allowYearEndClosing": {
                        "value": false,
                        "day": null,
                        "month": "",
                        "relativeYear": "This year"
                    },
                    "applyOnBehalfConfirmation": false,
                    "emailReminder": false,
                    "anniversaryBonus": {
                        "allowAutoApplyLeave": false,
                        "applyLeaveOnDate": [
                            ""
                        ]
                    },
                    "tenantCompanyId": result[0].TENANT_COMPANY_GUID
                }
                this.policyApi.post_general_leave_policy(data).subscribe(a => {});
                this.ngOnInit();
            }
        }, error => {
            this.policyApi.message(JSON.parse(error._body).error, false);
        });
    }

    /**
     * delete company
     * @param {*} item
     * @memberof PolicyListComponent
     */
    deleteCompany(item: any) {
        const dialog = this.policyApi.dialog.open(DeleteCalendarConfirmationComponent, {
            disableClose: true,
            data: { name: item.NAME, value: item.TENANT_COMPANY_GUID, desc: ' company' },
            height: "195px",
            width: "270px"
        });
        dialog.afterClosed().subscribe(value => {
            if (value === item.TENANT_COMPANY_GUID) {
                this.policyApi.delete_company_name(item.TENANT_COMPANY_GUID).subscribe(response => {
                    if (response[0] != undefined) {
                        if (response[0].TENANT_COMPANY_GUID != undefined) {
                            this.ngOnInit();
                            this.policyApi.message('Company name was deleted successfully', true);
                        }
                        if (response[0].FULLNAME != undefined) {
                            this.policyApi.message('Please re-assign user to delete this company name', false);
                        }
                    }
                    else {
                        this.policyApi.message('Company name was failed to delete', false);
                    }
                })
            }
        });
    }

    /**
     * update company name
     * @param {*} items
     * @memberof PolicyListComponent
     */
    updateCompanyName() {
        this.policyApi.patch_company_name({ "id": this.companyId, "name": this.editName.value }).subscribe(res => {
            if (res[0].TENANT_COMPANY_GUID != undefined) {
                this.policyApi.message('Company name was updated successfully', true);
                this.ngOnInit();
            } else {
                this.policyApi.message(res.status, false);
            }
            this.showSmallSpinner = false;
            this.sharedService.menu.close('editCompanyDetails');
            this.editName.reset();
        }, error => {
            this.policyApi.message(JSON.parse(error._body).error, false);
        })
    }

}