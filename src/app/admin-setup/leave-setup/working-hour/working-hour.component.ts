import { OnInit, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { WorkingHourApiService } from "./working-hour-api.service";
import * as _moment from 'moment';
import { MenuController } from "@ionic/angular";
const moment = _moment;

/**
 * create or update working hour profile
 * @export
 * @class WorkingHourComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
    selector: 'app-working-hour',
    templateUrl: './working-hour.component.html',
    styleUrls: ['./working-hour.component.scss'],
})
export class WorkingHourComponent implements OnInit, OnChanges {

    /**
     * form group use in validate value 
     * @type {*}
     * @memberof WorkingHourComponent
     */
    public workingHourForm: any;

    /**
     * show loading small spinner when clicked submit button
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * details from requested id
     * @private
     * @type {*}
     * @memberof WorkingHourComponent
     */
    private _data: any;

    /** 
     * get value of clicked working_hour_guid from parent page
     * @type {string}
     * @memberof WorkingHourComponent
     */
    @Input() id: string;

    /**
     * emit value to hide this page after clicked back button
     * @memberof WorkingHourComponent
     */
    @Output() valueChange = new EventEmitter();


    // time = { hour: 13, minute: 30 };
    // meridian = true;
    /**
     *Creates an instance of WorkingHourComponent.
     * @param {WorkingHourApiService} workingHourAPI
     * @memberof WorkingHourComponent
     */
    constructor(private workingHourAPI: WorkingHourApiService, private menu: MenuController) {
        this.workingHourForm = new FormGroup({
            profileName: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            startpicker: new FormControl('', Validators.required),
            endpicker: new FormControl('', Validators.required),
            starthalfdayAMpicker: new FormControl('', Validators.required),
            endhalfdayAMpicker: new FormControl('', Validators.required),
            starthalfdayPMpicker: new FormControl('', Validators.required),
            endhalfdayPMpicker: new FormControl('', Validators.required),
            startQ1picker: new FormControl('', Validators.required),
            endQ1picker: new FormControl('', Validators.required),
            startQ2picker: new FormControl('', Validators.required),
            endQ2picker: new FormControl('', Validators.required),
            startQ3picker: new FormControl('', Validators.required),
            endQ3picker: new FormControl('', Validators.required),
            startQ4picker: new FormControl('', Validators.required),
            endQ4picker: new FormControl('', Validators.required),
        })
    }

    async ngOnInit() {
        let items = await this.workingHourAPI.get_working_hours_profile_list().toPromise();
        this._data = await this.workingHourAPI.get_working_hours_details(items[0].working_hours_guid).toPromise();
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.id.currentValue !== "" && changes.id.currentValue !== undefined) {
            let detail = await this.workingHourAPI.get_working_hours_details(this.id).toPromise();
            this.workingHourForm.patchValue({
                profileName: detail.code,
                description: detail.description,
                startpicker: detail.property.fullday.start_time,
                endpicker: detail.property.fullday.end_time,
                starthalfdayAMpicker: detail.property.halfday.AM.start_time,
                endhalfdayAMpicker: detail.property.halfday.AM.end_time,
                starthalfdayPMpicker: detail.property.halfday.PM.start_time,
                endhalfdayPMpicker: detail.property.halfday.PM.end_time,
                startQ1picker: detail.property.quarterday.Q1.start_time,
                endQ1picker: detail.property.quarterday.Q1.end_time,
                startQ2picker: detail.property.quarterday.Q2.start_time,
                endQ2picker: detail.property.quarterday.Q2.end_time,
                startQ3picker: detail.property.quarterday.Q3.start_time,
                endQ3picker: detail.property.quarterday.Q3.end_time,
                startQ4picker: detail.property.quarterday.Q4.start_time,
                endQ4picker: detail.property.quarterday.Q4.end_time
            });
        } else { this.workingHourForm.reset() }
    }

    /**
     * get data before send to endpoint
     * @memberof WorkingHourComponent
     */
    postWorkingHourSetup() {
        this.showSmallSpinner = true;
        this._data.code = this.workingHourForm.controls.profileName.value;
        this._data.description = this.workingHourForm.controls.description.value;
        this._data.property.fullday.start_time = moment(this.workingHourForm.controls.startpicker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.fullday.end_time = moment(this.workingHourForm.controls.endpicker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.halfday.AM.start_time = this.workingHourForm.controls.starthalfdayAMpicker.value;
        this._data.property.halfday.AM.end_time = this.workingHourForm.controls.endhalfdayAMpicker.value;
        this._data.property.halfday.PM.start_time = this.workingHourForm.controls.starthalfdayPMpicker.value;
        this._data.property.halfday.PM.end_time = this.workingHourForm.controls.endhalfdayPMpicker.value;
        Object.keys(this._data.property.halfday).map(ampm => {
            Object.keys(this._data.property.halfday[ampm]).map(startend => {
                this._data.property.halfday[ampm][startend] = moment(this._data.property.halfday[ampm][startend], ["h:mm A"]).format("HH:mm");
            })
        });
        this.postQuarterDay();
        this.patchWorkingHourSetup(this._data);
    }

    /**
     * get quarter day data before send to endpoint
     * @memberof WorkingHourComponent
     */
    postQuarterDay() {
        this._data.property.quarterday.Q1.start_time = this.workingHourForm.controls.startQ1picker.value;
        this._data.property.quarterday.Q1.end_time = this.workingHourForm.controls.endQ1picker.value;
        this._data.property.quarterday.Q2.start_time = this.workingHourForm.controls.startQ2picker.value;
        this._data.property.quarterday.Q2.end_time = this.workingHourForm.controls.endQ2picker.value;
        this._data.property.quarterday.Q3.start_time = this.workingHourForm.controls.startQ3picker.value;
        this._data.property.quarterday.Q3.end_time = this.workingHourForm.controls.endQ3picker.value;
        this._data.property.quarterday.Q4.start_time = this.workingHourForm.controls.startQ4picker.value;
        this._data.property.quarterday.Q4.end_time = this.workingHourForm.controls.endQ4picker.value;
        Object.keys(this._data.property.quarterday).map(objKey => {
            Object.keys(this._data.property.quarterday[objKey]).map(endstart => {
                this._data.property.quarterday[objKey][endstart] = moment(this._data.property.quarterday[objKey][endstart], ["h:mm A"]).format("HH:mm");
            })
        });
    }

    /**
     * update or create data of working hour profile
     * @param {*} body
     * @memberof WorkingHourComponent
     */
    patchWorkingHourSetup(body: any) {
        if (this.id != '') {
            this.workingHourAPI.patch_working_hours({
                "working_hours_guid": this.id,
                "data": body
            }).subscribe(res => {
                // this.workingHourAPI.showPopUp('submitted successfully ');
                this.showSmallSpinner = false;
            })
        } else {
            this.workingHourAPI.post_working_hours(body).subscribe(response => {
                // this.workingHourAPI.showPopUp('submitted successfully ');
                this.showSmallSpinner = false;
            })
        }
    }

    /**
     * refresh saved data by sending back the editted working hour id
     * @param {string} id
     * @memberof WorkingHourComponent
     */
    refreshProfile(id: string) {
        this.valueChange.emit(id);
    }




}