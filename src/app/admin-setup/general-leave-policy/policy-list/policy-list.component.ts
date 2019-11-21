import { Component, OnInit } from '@angular/core';
import { LeaveApiService } from '../../leave-setup/leave-api.service';
import { EditModeDialogComponent } from '../../leave-setup/edit-mode-dialog/edit-mode-dialog.component';
import { MatDialog } from '@angular/material';
import { MenuController } from '@ionic/angular';
import { PolicyApiService } from '../policy-api.service';
import { Validators, FormControl } from '@angular/forms';
import { DeleteCalendarConfirmationComponent } from '../../leave-setup/delete-calendar-confirmation/delete-calendar-confirmation.component';

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
     * Content in page is hide during loading
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    // public showPage: boolean = false;

    /**
     * To show arrow up or down icon for Name column
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    // public arrowDownName: boolean = true;

    /**
     * Page number on current page
     * @type {number}
     * @memberof PolicyListComponent
     */
    // public pageIndex: number;

    /**
     * Total page number 
     * @type {number}
     * @memberof PolicyListComponent
     */
    // public totalPageNum: number;

    /**
     * Items of the current showing page
     * @type {*}
     * @memberof PolicyListComponent
     */
    // public currentItems: any;

    /**
     * Value of disable next button
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    // public disableNextButton: boolean;

    /**
     * Value of disable previous button
     * @type {boolean}
     * @memberof PolicyListComponent
     */
    // public disablePrevButton: boolean;

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
     *Creates an instance of PolicyListComponent.
     * @param {LeaveApiService} leaveAPi
     * @param {MenuController} menu
     * @param {PolicyApiService} policyApi
     * @memberof PolicyListComponent
     */
    constructor(private leaveAPi: LeaveApiService, public menu: MenuController, private policyApi: PolicyApiService) { }


    ngOnInit() {
        this.newName = new FormControl('', Validators.required);
        this.editName = new FormControl('', Validators.required);
        this.leaveAPi.get_company_list().subscribe(data => {
            this.companyName = data;
            this.clickedPolicy(this.companyName[0], 0);
            this.showSpinner = false;
        })
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
                data: 'policy',
                height: "354.3px",
                width: "383px"
            });

        } else {
            this.modeValue = 'OFF'
        }
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
        this.policyApi.post_company_name(this.newName.value).subscribe(response => {
            this.policyApi.message('New company was created successfully', true);
            this.menu.close('createCompanyDetails');
            this.newName.reset();
            this.ngOnInit();
        });
    }

    /**
     * delete company
     * @param {*} item
     * @memberof PolicyListComponent
     */
    deleteCompany(item: any) {
        const dialog = this.policyApi.dialog.open(DeleteCalendarConfirmationComponent, {
            data: { name: item.NAME, value: item.TENANT_COMPANY_GUID, desc: ' company' },
            height: "195px",
            width: "249px"
        });
        dialog.afterClosed().subscribe(value => {
            if (value === item.TENANT_COMPANY_GUID) {
                this.policyApi.delete_company_name(item.TENANT_COMPANY_GUID).subscribe(response => {
                    this.ngOnInit();
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
            this.policyApi.message('New company was updated successfully', true);
            this.menu.close('editCompanyDetails');
            this.editName.reset();
            this.ngOnInit();
        })
    }

}