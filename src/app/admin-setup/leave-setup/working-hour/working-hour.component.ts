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
     * show/hide toggle button in timepicker
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public meridian: boolean = true;

    /**
     * show/hide arrow up & down in timepicker toggle button
     * @type {boolean}
     * @memberof WorkingHourComponent
     */
    public spinners: boolean = false;

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


    /**
     *Creates an instance of WorkingHourComponent.
     * @param {WorkingHourApiService} workingHourAPI
     * @param {MenuController} menu
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
                startpicker: { "hour": Number((detail.property.fullday.start_time.split(':'))[0]), "minute": Number((detail.property.fullday.start_time.split(':'))[1]) },
                endpicker: { "hour": Number((detail.property.fullday.end_time.split(':'))[0]), "minute": Number((detail.property.fullday.end_time.split(':'))[1]) },
                starthalfdayAMpicker: { "hour": Number((detail.property.halfday.AM.start_time.split(':'))[0]), "minute": Number((detail.property.halfday.AM.start_time.split(':'))[1]) },
                endhalfdayAMpicker: { "hour": Number((detail.property.halfday.AM.end_time.split(':'))[0]), "minute": Number((detail.property.halfday.AM.end_time.split(':'))[1]) },
                starthalfdayPMpicker: { "hour": Number((detail.property.halfday.PM.start_time.split(':'))[0]), "minute": Number((detail.property.halfday.PM.start_time.split(':'))[1]) },
                endhalfdayPMpicker: { "hour": Number((detail.property.halfday.PM.end_time.split(':'))[0]), "minute": Number((detail.property.halfday.PM.end_time.split(':'))[1]) },
                startQ1picker: {
                    "hour": Number((detail.property.quarterday.Q1.start_time.split(':'))[0]), "minute": Number((detail.property.quarterday.Q1.start_time.split(':'))[1])
                },
                endQ1picker: {
                    "hour": Number((detail.property.quarterday.Q1.end_time.split(':'))[0]), "minute": Number((detail.property.quarterday.Q1.end_time.split(':'))[1])
                },
                startQ2picker: {
                    "hour": Number((detail.property.quarterday.Q2.start_time.split(':'))[0]), "minute": Number((detail.property.quarterday.Q2.start_time.split(':'))[1])
                },
                endQ2picker: {
                    "hour": Number((detail.property.quarterday.Q2.end_time.split(':'))[0]), "minute": Number((detail.property.quarterday.Q2.end_time.split(':'))[1])
                },
                startQ3picker: {
                    "hour": Number((detail.property.quarterday.Q3.start_time.split(':'))[0]), "minute": Number((detail.property.quarterday.Q3.start_time.split(':'))[1])
                },
                endQ3picker: {
                    "hour": Number((detail.property.quarterday.Q3.end_time.split(':'))[0]), "minute": Number((detail.property.quarterday.Q3.end_time.split(':'))[1])
                },
                startQ4picker: {
                    "hour": Number((detail.property.quarterday.Q4.start_time.split(':'))[0]), "minute": Number((detail.property.quarterday.Q4.start_time.split(':'))[1])
                },
                endQ4picker: {
                    "hour": Number((detail.property.quarterday.Q4.end_time.split(':'))[0]), "minute": Number((detail.property.quarterday.Q4.end_time.split(':'))[1])
                }
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
        this._data.property.fullday.start_time = this.workingHourForm.controls.startpicker.value.hour + ":" + (this.workingHourForm.controls.startpicker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.startpicker.value.minute;
        this._data.property.fullday.end_time = this.workingHourForm.controls.endpicker.value.hour + ":" + (this.workingHourForm.controls.endpicker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.endpicker.value.minute;
        this._data.property.halfday.AM.start_time = this.workingHourForm.controls.starthalfdayAMpicker.value.hour + ":" + (this.workingHourForm.controls.starthalfdayAMpicker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.starthalfdayAMpicker.value.minute;
        this._data.property.halfday.AM.end_time = this.workingHourForm.controls.endhalfdayAMpicker.value.hour + ":" + (this.workingHourForm.controls.endhalfdayAMpicker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.endhalfdayAMpicker.value.minute;
        this._data.property.halfday.PM.start_time = this.workingHourForm.controls.starthalfdayPMpicker.value.hour + ":" + (this.workingHourForm.controls.starthalfdayPMpicker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.starthalfdayPMpicker.value.minute;
        this._data.property.halfday.PM.end_time = this.workingHourForm.controls.endhalfdayPMpicker.value.hour + ":" + (this.workingHourForm.controls.endhalfdayPMpicker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.endhalfdayPMpicker.value.minute;
        Object.keys(this._data.property.halfday).map(ampm => {
            Object.keys(this._data.property.halfday[ampm]).map(startend => {
                this._data.property.halfday[ampm][startend] = this._data.property.halfday[ampm][startend];
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
        this._data.property.quarterday.Q1.start_time = this.workingHourForm.controls.startQ1picker.value.hour + ":" + (this.workingHourForm.controls.startQ1picker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.startQ1picker.value.minute;
        this._data.property.quarterday.Q1.end_time = this.workingHourForm.controls.endQ1picker.value.hour + ":" + (this.workingHourForm.controls.endQ1picker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.endQ1picker.value.minute;
        this._data.property.quarterday.Q2.start_time = this.workingHourForm.controls.startQ2picker.value + ":" + (this.workingHourForm.controls.startQ2picker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.startQ2picker.value.minute;
        this._data.property.quarterday.Q2.end_time = this.workingHourForm.controls.endQ2picker.value + ":" + (this.workingHourForm.controls.endQ2picker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.endQ2picker.value.minute;
        this._data.property.quarterday.Q3.start_time = this.workingHourForm.controls.startQ3picker.value + ":" + (this.workingHourForm.controls.startQ3picker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.startQ3picker.value.minute;
        this._data.property.quarterday.Q3.end_time = this.workingHourForm.controls.endQ3picker.value + ":" + (this.workingHourForm.controls.endQ3picker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.endQ3picker.value.minute;
        this._data.property.quarterday.Q4.start_time = this.workingHourForm.controls.startQ4picker.value + ":" + (this.workingHourForm.controls.startQ4picker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.startQ4picker.value.minute;
        this._data.property.quarterday.Q4.end_time = this.workingHourForm.controls.endQ4picker.value + ":" + (this.workingHourForm.controls.endQ4picker.value.minute < 10 ? '0' : '') + this.workingHourForm.controls.endQ4picker.value.minute;
        Object.keys(this._data.property.quarterday).map(objKey => {
            Object.keys(this._data.property.quarterday[objKey]).map(endstart => {
                this._data.property.quarterday[objKey][endstart] = this._data.property.quarterday[objKey][endstart];
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
                this.workingHourAPI.showPopUp('Working hour profile was updated successfully', true);
                this.showSmallSpinner = false;
            }, error => {
                this.workingHourAPI.showPopUp('Sorry. Error occurred.', false);
            })
        } else {
            this.workingHourAPI.post_working_hours(body).subscribe(response => {
                this.workingHourAPI.showPopUp('New working hour profile was created successfully', true);
                this.showSmallSpinner = false;
                this.refreshProfile(response[0].WORKING_HOURS_GUID);
            }, error => {
                this.workingHourAPI.showPopUp(error.status + ' ' + error.statusText + '.', false);
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