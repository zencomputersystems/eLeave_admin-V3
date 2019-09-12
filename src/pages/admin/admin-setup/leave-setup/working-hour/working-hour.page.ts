import { OnInit, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { WorkingHourAPIService } from "./working-hour-api.service";
import * as _moment from 'moment';
const moment = _moment;

/**
 * create or update working hour profile
 * @export
 * @class WorkingHourPage
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
    selector: 'app-working-hour',
    templateUrl: './working-hour.page.html',
    styleUrls: ['./working-hour.page.scss'],
})
export class WorkingHourPage implements OnInit, OnChanges {

    /**
     * form group use in validate value 
     * @type {*}
     * @memberof WorkingHourPage
     */
    public workingHourForm: any;

    /**
     * show loading small spinner when clicked submit button
     * @type {boolean}
     * @memberof WorkingHourPage
     */
    public showSmallSpinner: boolean = false;

    /**
     * details from requested id
     * @private
     * @type {*}
     * @memberof WorkingHourPage
     */
    private _data: any;

    /**
     * show/hide this page
     * @type {boolean}
     * @memberof WorkingHourPage
     */
    @Input() showDetailPage: boolean = true;

    /** 
     * get value of clicked working_hour_guid from parent page
     * @type {string}
     * @memberof WorkingHourPage
     */
    @Input() id: string;

    /**
     * emit value to hide this page after clicked back button
     * @memberof WorkingHourPage
     */
    @Output() valueChange = new EventEmitter();

    /**
     *Creates an instance of WorkingHourPage.
     * @param {WorkingHourAPIService} workingHourAPI
     * @memberof WorkingHourPage
     */
    constructor(private workingHourAPI: WorkingHourAPIService) {
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
        if (changes.id) {
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
        }
    }

    /**
     * get data before send to endpoint
     * @memberof WorkingHourPage
     */
    postWorkingHourSetup() {
        this.showSmallSpinner = true;
        this._data.code = this.workingHourForm.controls.profileName.value;
        this._data.description = this.workingHourForm.controls.description.value;
        this._data.property.fullday.start_time = moment(this.workingHourForm.controls.startpicker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.fullday.end_time = moment(this.workingHourForm.controls.endpicker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.halfday.AM.start_time = moment(this.workingHourForm.controls.starthalfdayAMpicker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.halfday.AM.end_time = moment(this.workingHourForm.controls.endhalfdayAMpicker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.halfday.PM.start_time = moment(this.workingHourForm.controls.starthalfdayPMpicker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.halfday.PM.end_time = moment(this.workingHourForm.controls.endhalfdayPMpicker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.quarterday.Q1.start_time = moment(this.workingHourForm.controls.startQ1picker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.quarterday.Q1.end_time = moment(this.workingHourForm.controls.endQ1picker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.quarterday.Q2.start_time = moment(this.workingHourForm.controls.startQ2picker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.quarterday.Q2.end_time = moment(this.workingHourForm.controls.endQ2picker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.quarterday.Q3.start_time = moment(this.workingHourForm.controls.startQ3picker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.quarterday.Q3.end_time = moment(this.workingHourForm.controls.endQ3picker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.quarterday.Q4.start_time = moment(this.workingHourForm.controls.startQ4picker.value, ["h:mm A"]).format("HH:mm");
        this._data.property.quarterday.Q4.end_time = moment(this.workingHourForm.controls.endQ4picker.value, ["h:mm A"]).format("HH:mm");
        this.patchWorkingHourSetup(this._data);
    }

    /**
     * update or create data of working hour profile
     * @param {*} body
     * @memberof WorkingHourPage
     */
    patchWorkingHourSetup(body: any) {
        if (this.id != '') {
            this.workingHourAPI.patch_working_hours({
                "working_hours_guid": this.id,
                "data": body
            }).subscribe(res => {
                this.workingHourAPI.showPopUp('submitted successfully ');
                this.showSmallSpinner = false;
            })
        } else {
            this.workingHourAPI.post_working_hours(body).subscribe(response => {
                this.workingHourAPI.showPopUp('submitted successfully ');
                this.showSmallSpinner = false;
            })
        }
    }

    /**
     * click back to hide the details page
     * @param {boolean} value
     * @memberof WorkingHourPage
     */
    hideDetailPage(value: boolean) {
        this.valueChange.emit(value);
    }




}