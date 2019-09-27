import { OnInit, Component } from "@angular/core";
import { WorkingHourApiService } from "../working-hour-api.service";
import { MatDialog } from "@angular/material";
import { DialogDeleteConfirmationComponent } from "src/app/admin-setup/role-management/dialog-delete-confirmation/dialog-delete-confirmation.component";

/**
 * working hour profile list page
 * @export
 * @class WorkingHourListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-working-hour-list',
    templateUrl: './working-hour-list.component.html',
    styleUrls: ['./working-hour-list.component.scss'],
})
export class WorkingHourListComponent implements OnInit {

    /**
     * get profile list from endpoint
     * @type {*}
     * @memberof WorkingHourListComponent
     */
    public list: any;

    /**
     * show/hide details page
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public showDetailPage: boolean = false;

    /**
     * show/hide assign page
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public showAssignPage: boolean = false;

    /**
     * show/hide list page
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public showListPage: boolean = true;

    /**
     * show loading spinner before reach the page
     * @type {boolean}
     * @memberof WorkingHourListComponent
     */
    public showSpinner: boolean = false;

    /**
     *Creates an instance of WorkingHourListComponent.
     * @param {WorkingHourApiService} workingHrAPI
     * @param {MatDialog} dialog
     * @memberof WorkingHourListComponent
     */
    constructor(private workingHrAPI: WorkingHourApiService, public dialog: MatDialog) {
    }

    async ngOnInit() {
        this.showSpinner = true;
        this.list = await this.workingHrAPI.get_working_hours_profile_list().toPromise();
        for (let i = 0; i < this.list.length; i++) {
            let details = await this.workingHrAPI.get_working_hours_details(this.list[i].working_hours_guid).toPromise();
            this.list[i].strtime = details.property.fullday.start_time;
            this.list[i].endtime = details.property.fullday.end_time;
        }
        this.showSpinner = false;
    }

    /**
     * show/hide details page (value from child component)
     * @param {*} value
     * @memberof WorkingHourListComponent
     */
    valueChanged(value, action: string) {
        if (action == 'edit') {
            this.showDetailPage = value;
        } else {
            this.showAssignPage = value;
        }
        this.showListPage = true;
        this.ngOnInit();
    }

    /**
     * delete working hour profile
     * @param {string} working_hour_guid
     * @param {string} name
     * @memberof WorkingHourListComponent
     */
    deleteWorkingHrProfile(working_hour_guid: string, name: string) {
        const dialogRef = this.dialog.open(DialogDeleteConfirmationComponent, {
            data: { value: working_hour_guid, name: name }
        });
        dialogRef.afterClosed().subscribe(val => {
            if (val === working_hour_guid) {
                this.workingHrAPI.delete_working_hours_profile(working_hour_guid).subscribe(response => {
                    this.ngOnInit();
                    this.workingHrAPI.showPopUp('deleted successfully ');
                })
            }
        });
    }
}