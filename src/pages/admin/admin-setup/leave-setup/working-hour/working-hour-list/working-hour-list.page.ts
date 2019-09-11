import { OnInit, Component, Input } from "@angular/core";
import { WorkingHourAPIService } from "../working-hour-api.service";

@Component({
    selector: 'app-working-hour-list',
    templateUrl: './working-hour-list.page.html',
    styleUrls: ['./working-hour-list.page.scss'],
})
export class WorkingHourListPage implements OnInit {

    public list: any;
    public showDetailPage: boolean = false;
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

    valueChanged(value) {
        this.showDetailPage = value;
        this.ngOnInit();
    }
}