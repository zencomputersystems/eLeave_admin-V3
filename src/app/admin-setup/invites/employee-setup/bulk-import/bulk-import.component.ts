import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { RequestOptions, Headers } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { LocalStorageService } from 'angular-web-storage';
import { LeaveApiService } from 'src/app/admin-setup/leave-setup/leave-api.service';

/**
 * Bulk Import Page
 * @export
 * @class BulkImportComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-bulk-import',
    templateUrl: './bulk-import.component.html',
    styleUrls: ['./bulk-import.component.scss'],
})
export class BulkImportComponent implements OnInit {

    /**
     * Get file name of imported/dropped file
     * @type {*}
     * @memberof BulkImportComponent
     */
    public filename: any;

    /**
     * Show upload button after imported/dropped file
     * @memberof BulkImportComponent
     */
    public showUploadButton: boolean = false;

    /**
     * Form group format for file
     * @type {FormGroup}
     * @memberof BulkImportComponent
     */
    public fileform: FormGroup;

    /**
     * Get document info from imported/dropped file
     * @type {UploadFile[]}
     * @memberof BulkImportComponent
     */
    public files: UploadFile[] = [];

    /**
     * Form data from document to post to API
     * @type {FormData}
     * @memberof BulkImportComponent
     */
    public formData: FormData = new FormData();

    /**
     * button show/hide
     * @type {boolean}
     * @memberof BulkImportComponent
     */
    public chooseFileButton: boolean = true;

    /**
     * emit output to close menu
     * @memberof BulkImportComponent
     */
    @Output() closeMenu = new EventEmitter();


    /**
     * Return value of filename from imported document
     * @readonly
     * @type {string}
     * @memberof BulkImportComponent
     */
    get fileName(): string {
        return this.filename;
    }

    /**
     *Creates an instance of BulkImportComponent.
     * @param {FormBuilder} fb
     * @param {LocalStorageService} local
     * @param {LeaveApiService} leaveApi
     * @memberof BulkImportComponent
     */
    constructor(private fb: FormBuilder, private local: LocalStorageService, private leaveApi: LeaveApiService) {
    }

    /**
     * initial method
     * @memberof BulkImportComponent
     */
    ngOnInit() {
        this.fileform = this.fb.group({
            file: ''
        });
    }

    /**
    * To download CSV employee data Template 
    * @memberof BulkImportComponent
    */
    downloadFile() {
        const blob = new Blob([`STAFF_EMAIL,STAFF_ID,FULLNAME,NICKNAME,NRIC,DOB,GENDER,MOBILE_NUMBER,WORK_NUMBER,MARITAL_STATUS,ADDRESS,POSTCODE,CITY,STATE,COUNTRY,MANAGER_EMAIL,DESIGNATION,DEPARTMENT,COST_CENTRE,BRANCH,DIVISION,SECTION,COMPANY,JOIN_DATE,CONFIRMATION_DATE,RESIGNATION_DATE
        leavetest4@zen.com.my,ZEN-00001,Test 1 ZEN,Test 1,990101-10-5656,7/9/2018,Male,60123338272,60123338275,Single,"This is address,",44333,Shah Alam,Selangor,Malaysia,emily@kool.my,Software Tester,Tester,Tester,Cyberjaya,Tester,Tester,Zen Company Sdn Bhd,9/7/2018,9/12/2018,31/12/2021
        leavetest5@zen.com.my,ZEN-00002,Test 2 ZEN,Test 2,870101-10-5680,9/7/2018,Female,60123338273,60123338276,Married,"This is address,",44333,Shah Alam,Selangor,Malaysia,emily@kool.my,Software Engineer,Tester,Tester,Cyberjaya,Tester,Tester,Zen Company Sdn Bhd,9/7/2018,9/10/2018,9/7/2020
        leavetest6@zen.com.my,ZEN-00003,Test 3 ZEN,Test 3,000101-07-5682,9/7/2018,Female,60123338274,60123338277,Married,"This is address,",44333,Shah Alam,Selangor,Malaysia,emily@kool.my,Solution Consultant,Tester,Tester,Cyberjaya,Tester,Tester,Zen Company Sdn Bhd,9/12/2018,9/10/2018,9/7/2020`], { type: "text/plain" });
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
     * Get dropped file details
     * Submit file to API
     * @param {UploadEvent} event
     * @memberof BulkImportComponent
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
     * @memberof BulkImportComponent
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
     * @memberof BulkImportComponent
     */
    onSubmit() {
        this.formData.append('file', new Blob([(this.fileform.get('file').value)], { type: 'text/csv' }), this.fileName);
        const queryHeaders = new Headers();
        queryHeaders.append('Authorization', 'JWT ' + JSON.parse(this.local.get('access_token')));
        const options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve) => {
            this.leaveApi.http.post('http://zencore.zen.com.my:3000/api/userimport/csv', this.formData, options)
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
     * @memberof BulkImportComponent
     */
    responseHandler(response: any) {
        response.forEach(item => {
            if (item.category == 'Success' && item.data.length != 0) {
                this.leaveApi.openSnackBar('New employee profiles was created successfully', true);
            }
            if (item.data.length != 0 && item.category != 'Success') {
                this.leaveApi.openSnackBar(item.message, false);
            }
        });
        this.closeMenu.emit('true');
        this.ngOnInit();
        this.formData = new FormData();
        this.filename = '';
        this.chooseFileButton = true;
        this.showUploadButton = false;
    }
}
