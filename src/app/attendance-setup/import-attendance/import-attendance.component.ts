import { environment } from '../../../../src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequestOptions, Headers } from '@angular/http';
import { MatDialog } from '@angular/material';
import { LocalStorageService } from 'angular-web-storage';
import { FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { ClientApiService } from '../client/client-api.service';
import { map } from 'rxjs/operators';
import { ImportAttendanceApiService } from './import-attendance.service';

@Component({
    selector: 'app-import-attendance',
    templateUrl: './import-attendance.component.html',
    styleUrls: ['./import-attendance.component.scss']
})
export class ImportAttendanceComponent implements OnInit {

    /**
     * open file button
     * @type {boolean}
     * @memberof ImportAttendanceComponent
     */
    public chooseFileButton: boolean = true;

    /**
     * upload file button
     * @type {boolean}
     * @memberof ImportAttendanceComponent
     */
    public showUploadButton: boolean = false;

    /**
     * Form group format for file
     * @type {FormGroup}
     * @memberof ImportAttendanceComponent
     */
    public fileform: FormGroup;

    /**
     * Get document info from imported/dropped file
     * @type {UploadFile[]}
     * @memberof ImportAttendanceComponent
     */
    public files: UploadFile[] = [];

    /**
     * Form data from document to post to API
     * @type {FormData}
     * @memberof ImportAttendanceComponent
     */
    public formData: FormData = new FormData();

    /**
     * filename of the upload document
     * @type {*}
     * @memberof ImportAttendanceComponent
     */
    public filename: any;

    /**
     * button small spinner
     * @type {boolean}
     * @memberof ImportAttendanceComponent
     */
    public showSmallSpinner: boolean = false;

    /**
     * show spinner when loading log list
     * @type {boolean}
     * @memberof ImportAttendanceComponent
     */
    public showSpinner: boolean = true;

    /**
     * get log list
     * @type {*}
     * @memberof ImportAttendanceComponent
     */
    public logList: any;

    /**
     * Return value of filename from imported document
     * @readonly
     * @type {string}
     * @memberof ImportAttendanceComponent
     */
    get fileName(): string {
        return this.filename;
    }

    /**
     *Creates an instance of ImportAttendanceComponent.
     * @memberof ImportAttendanceComponent
     */
    constructor(private fb: FormBuilder, private local: LocalStorageService, public dialog: MatDialog, private importAttendanceApi: ImportAttendanceApiService) { }

    /**
     * initial function
     * @memberof ImportAttendanceComponent
     */
    ngOnInit() {
        this.fileform = this.fb.group({
            file: ''
        });
        this.importAttendanceApi.get_log().subscribe(list => {
            this.logList = list;
            this.showSpinner = false;
        }, error => {
            this.logList = [];
            this.showSpinner = false;
        })
    }

    /**
    * To download CSV employee data Template 
    * @memberof ImportAttendanceComponent
    */
    downloadFile() {
        const blob = new Blob([`UserID,EmployeeCode,Name,Dept.,Att_Time,Att_ID,Dev_ID,Photo_ID
1000,1000,MUHAMMAD ALI,Head office,5/10/2020 9:20,0,1,0
1000,1000,MUHAMMAD ALI,Head office,5/10/2020 12:22,0,2,0
1000,1000,MUHAMMAD ALI,Head office,5/10/2020 12:26,0,2,0
1000,1000,MUHAMMAD ALI,Head office,5/10/2020 18:42,0,2,0
        `], { type: "text/plain" });
        if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
            window.navigator.msSaveBlob(blob, "csv-template.csv");
        else {
            const a = window.document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = "template.csv";
            document.body.appendChild(a);
            a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
            document.body.removeChild(a);
        }
    }

    /**
     * get the dropped file info
     * @param {UploadEvent} event
     * @memberof ImportAttendanceComponent
     */
    public dropped(event: UploadEvent) {
        this.files = event.files;
        for (const droppedFile of event.files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    this.filename = file.name;
                    this.fileform.get('file').setValue(file);
                    this.chooseFileButton = false;
                    this.showUploadButton = true;
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }

    /**
     * Get the uploaded file details
     * Set value to fileform (form data)
     * @param {*} event
     * @memberof ImportAttendanceComponent
     */
    openFile(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.filename = file.name;
            this.fileform.get('file').setValue(file);
            this.showUploadButton = true;
            this.chooseFileButton = false;
        }
    }

    /**
     * Upload file to API
     * @returns
     * @memberof ImportAttendanceComponent
     */
    onSubmit() {
        this.showSmallSpinner = true;
        this.formData.append('file', new Blob([(this.fileform.get('file').value)], { type: 'text/csv' }), this.fileName);
        const queryHeaders = new Headers();
        queryHeaders.append('Authorization', 'JWT ' + JSON.parse(this.local.get('access_token')));
        const options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve) => {
            this.importAttendanceApi.http.post(environment.ATTENDANCE_MAIN_URL + '/admin/import-clock/csv', this.formData, options)
                .pipe(map((response) => {
                    return response;
                })).subscribe(
                    (response) => {
                        resolve(response.json());
                        this.responseHandler(response.json());
                    }
                )
        })
    }

    /**
     * response handler
     * @param {*} response
     * @memberof ImportAttendanceComponent
     */
    responseHandler(response: any) {
        if (response.message !== undefined) {
            this.importAttendanceApi.snackbarMsg(response.message, false);
        } else {
            response.forEach(item => {
                if (item.length > 0) {
                    this.importAttendanceApi.snackbarMsg(item.length + ' Attendance record was uploaded successfully', true);
                }
            });
        }
        this.showSmallSpinner = false;
        this.ngOnInit();
        this.formData = new FormData();
        this.filename = '';
        this.chooseFileButton = true;
        this.showUploadButton = false;
    }

    /**
     *  filter csv filename
     * @param {*} text
     * @memberof ImportAttendanceComponent
     */
    async filter(text: any) {
        if (text && text.trim() != '') {
            let name = this.logList.filter((item: any) => {
                return (item.FILENAME.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
            this.logList = name;
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof ImportAttendanceComponent
     */
    changeDetails(text: any) {
        if (text === '') {
            this.ngOnInit();
        } else {
            this.filter(text);
        }
    }
}
