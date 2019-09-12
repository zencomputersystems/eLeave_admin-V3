import { OnInit, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { WorkingHourAPIService } from "./working-hour-api.service";
import * as _moment from 'moment';
import { MatSnackBar } from "@angular/material";
import { SnackbarNotificationPage } from "../snackbar-notification/snackbar-notification";
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
     * @param {MatSnackBar} snackbar
     * @memberof WorkingHourPage
     */
    constructor(private workingHourAPI: WorkingHourAPIService, private snackbar: MatSnackBar) {
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

    ngOnInit() {

    }

    async ngOnChanges(changes: SimpleChanges) {
        console.log('change', changes);
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
        const body = {
            "code": this.workingHourForm.controls.profileName.value,
            "description": this.workingHourForm.controls.description.value,
            "property": {
                "fullday": {
                    "start_time": this.format(this.workingHourForm.controls.startpicker.value),
                    "end_time": this.format(this.workingHourForm.controls.endpicker.value)
                },
                "halfday": {
                    "AM": {
                        "start_time": this.format(this.workingHourForm.controls.starthalfdayAMpicker.value),
                        "end_time": this.format(this.workingHourForm.controls.endhalfdayAMpicker.value)
                    },
                    "PM": {
                        "start_time": this.format(this.workingHourForm.controls.starthalfdayPMpicker.value),
                        "end_time": this.format(this.workingHourForm.controls.endhalfdayPMpicker.value)
                    }
                },
                "quarterday": {
                    "Q1": {
                        "start_time": this.format(this.workingHourForm.controls.startQ1picker.value),
                        "end_time": this.format(this.workingHourForm.controls.endQ1picker.value)
                    },
                    "Q2": {
                        "start_time": this.format(this.workingHourForm.controls.startQ2picker.value),
                        "end_time": this.format(this.workingHourForm.controls.endQ2picker.value)
                    },
                    "Q3": {
                        "start_time": this.format(this.workingHourForm.controls.startQ3picker.value),
                        "end_time": this.format(this.workingHourForm.controls.endQ3picker.value)
                    },
                    "Q4": {
                        "start_time": this.format(this.workingHourForm.controls.startQ4picker.value),
                        "end_time": this.format(this.workingHourForm.controls.endQ4picker.value)
                    }
                }
            }
        }
        this.patchWorkingHourSetup(body);
    }

    /**
     * format the time to 24 hour before patch or post to endpoint
     * @param {*} value
     * @returns
     * @memberof WorkingHourPage
     */
    format(value: any) {
        return moment(value, ["h:mm A"]).format("HH:mm")
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
                this.showPopUp('submitted successfully ');
                this.showSmallSpinner = false;
            })
        } else {
            this.workingHourAPI.post_working_hours(body).subscribe(response => {
                this.showPopUp('submitted successfully ');
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


    /**
     * show pop up snackbar
     * @param {string} statement
     * @memberof WorkingHourPage
     */
    showPopUp(txt: string) {
        this.snackbar.openFromComponent(SnackbarNotificationPage, {
            duration: 5000,
            data: txt
        });
    }

}