import { OnInit, Component } from "@angular/core";
import { WorkingHourAPIService } from "../working-hour-api.service";

/**
 * working hour profile list page
 * @export
 * @class WorkingHourListPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-working-hour-list',
    templateUrl: './working-hour-list.page.html',
    styleUrls: ['./working-hour-list.page.scss'],
})
export class WorkingHourListPage implements OnInit {

    /**
     * get profile list from endpoint
     * @type {*}
     * @memberof WorkingHourListPage
     */
    public list: any;

    /**
     * show/hide details page
     * @type {boolean}
     * @memberof WorkingHourListPage
     */
    public showDetailPage: boolean = false;

    /**
     *Creates an instance of WorkingHourListPage.
     * @param {WorkingHourAPIService} workingHrAPI
     * @memberof WorkingHourListPage
     */
    constructor(private workingHrAPI: WorkingHourAPIService) {
    }

    async ngOnInit() {
        this.list = await this.workingHrAPI.get_working_hours_profile().toPromise();
        for (let i = 0; i < this.list.length; i++) {
            let details = await this.workingHrAPI.get_working_hours_details(this.list[i].working_hours_guid).toPromise();
            this.list[i].strtime = details.property.fullday.start_time;
            this.list[i].endtime = details.property.fullday.end_time;
        }
    }

    /**
     * show/hide details page (value from child component)
     * @param {*} value
     * @memberof WorkingHourListPage
     */
    valueChanged(value) {
        this.showDetailPage = value;
        this.ngOnInit();
    }
}