import { OnInit, Component } from "@angular/core";
import { WorkingHourApiService } from "../working-hour-api.service";
import { MatDialog } from "@angular/material";
import { DeleteCalendarConfirmationComponent } from "../../delete-calendar-confirmation/delete-calendar-confirmation.component";
import { MenuController } from "@ionic/angular";
import { EditModeDialogComponent } from "../../edit-mode-dialog/edit-mode-dialog.component";

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
     * set id as selected working hour guid
     * @type {string}
     * @memberof WorkingHourListComponent
     */
    public id: string;

    public clickedIndex: number = 0;

    public employeeList: any;

    public mode: string = 'OFF';

    private _users: any;

    private _droppedUser: any[] = [];

    time = { hour: 13, minute: 30 };
    spinners = false;
    meridian = true;

    /**
     *Creates an instance of WorkingHourListComponent.
     * @param {WorkingHourApiService} workingHrAPI
     * @param {MatDialog} dialog
     * @memberof WorkingHourListComponent
     */
    constructor(private workingHrAPI: WorkingHourApiService, public dialog: MatDialog, private menu: MenuController) {
    }

    async ngOnInit() {
        this.showSpinner = true;
        this.list = await this.workingHrAPI.get_working_hours_profile_list().toPromise();
        this.get_assigned_employee();
        this.showSpinner = false;
        this.clickedCalendar(this.list[this.clickedIndex], this.clickedIndex);
        this.workingHrAPI.get_all_users_list().subscribe(
            data => {
                this._users = data;
            });
    }

    /**
     * show/hide details page (value from child component)
     * @param {*} value
     * @memberof WorkingHourListComponent
     */
    refreshProfileDetails(id: string) {
        this.ngOnInit();
    }

    clickedCalendar(list, index) {
        this.clickedIndex = index;
        console.log(list);
        this.workingHrAPI.get_assigned_working_profile_user(list.working_hours_guid).subscribe(response => {
            this.employeeList = response;
            for (let j = 0; j < this.employeeList.length; j++) {
                this.employeeList[j]["content"] = this.employeeList[j].FULLNAME;
                this.employeeList[j]["effectAllowed"] = "move";
                this.employeeList[j]["handle"] = true;
                this.employeeList[j]["disable"] = false;
            }
        })
    }

    toggleMode(evt) {
        if (evt.detail.checked === true) {
            this.mode = 'ON';
            // this.showAddIcon = true;
            this.dialog.open(EditModeDialogComponent, {
                data: true,
                height: "388.3px",
                width: "383px"
            });

        } else {
            this.mode = 'OFF'
            this.workingHrAPI.showPopUp('Edit mode disabled. Good job!', true);
            // this.saveData();
        }
    }

    dropEvent(event, item) {
        for (let i = 0; i < this.employeeList.length; i++) {
            if (event.data === this.employeeList[i].FULLNAME) {
                this.draggedUser(i);
                this.workingHrAPI.patch_user_working_hours({
                    "user_guid": this._droppedUser,
                    "working_hours_guid": item.working_hours_guid
                }).subscribe(response => {
                    this.employeeList.splice(i, 1);
                    this._droppedUser = [];
                    this.get_assigned_employee();
                });
            }
        }
    }

    async get_assigned_employee() {
        for (let i = 0; i < this.list.length; i++) {
            let number = await this.workingHrAPI.get_assigned_working_profile_user(this.list[i].working_hours_guid).toPromise();
            let details = await this.workingHrAPI.get_working_hours_details(this.list[i].working_hours_guid).toPromise();
            this.list[i].strtime = details.property.fullday.start_time;
            this.list[i].endtime = details.property.fullday.end_time;
            this.list[i]["employee"] = number.length;
        }
    }

    async draggedUser(i: number) {
        if (this.checkName(this._users, this.employeeList[i].FULLNAME) != 0) {
            const indexes = this.checkName(this._users, this.employeeList[i].FULLNAME);
            if (!this._droppedUser.includes(this._users[indexes].userId)) {
                await this._droppedUser.push(this._users[indexes].userId);
            }
        }
    }

    checkName(arrayList: any, element: any) {
        for (let j = 0; j < arrayList.length; j++) {
            if (arrayList[j].employeeName === element) {
                return j;
            }
        }
        return 0;
    }

    /**
     * delete working hour profile
     * @param {string} working_hour_guid
     * @param {string} name
     * @memberof WorkingHourListComponent
     */
    deleteWorkingHrProfile(working_hour_guid: string, name: string) {
        const dialogRef = this.dialog.open(DeleteCalendarConfirmationComponent, {
            data: { name: name, value: working_hour_guid, desc: ' profile name' },
            height: "195px",
            width: "249px"
        });
        dialogRef.afterClosed().subscribe(val => {
            if (val === working_hour_guid) {
                this.workingHrAPI.delete_working_hours_profile(working_hour_guid).subscribe(response => {
                    this.ngOnInit();
                    this.workingHrAPI.showPopUp('deleted successfully ', true);
                })
            }
        });
    }
}