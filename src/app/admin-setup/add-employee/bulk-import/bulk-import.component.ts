import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { RequestOptions, Http, Headers } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BulkImportSuccessComponent } from '../bulk-import-success/bulk-import-success.component';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
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
     * @param {MatDialogRef<BulkImportComponent>} dialogBulkImport
     * @param {MatDialogRef<BulkImportSuccessComponent>} dialogSuccess
     * @param {MatDialog} dialog
     * @param {Http} http
     * @param {FormBuilder} fb
     * @memberof BulkImportComponent
     */
    constructor(public dialogBulkImport: MatDialogRef<BulkImportComponent>,
        public dialogSuccess: MatDialogRef<BulkImportSuccessComponent>,
        public dialog: MatDialog, private http: Http, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.fileform = this.fb.group({
            file: ''
        });
    }

    /**
     * To close pop up page
     * @memberof BulkImportComponent
     */
    onCloseClick(): void {
        this.dialogBulkImport.close();
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
                    this.onSubmit();
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
     * @param {*} uploadedFileName
     * @memberof BulkImportComponent
     */
    openFile(event, uploadedFileName) {
        if (uploadedFileName) {
            this.showUploadButton = true;
        }
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.filename = file.name;
            this.fileform.get('file').setValue(file);
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
        queryHeaders.append('Authorization', 'JWT ' + JSON.parse(localStorage.getItem('access_token')));
        const options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve) => {
            this.http.post('http://zencore.zen.com.my:3000/api/userimport/csv', this.formData, options)
                .pipe(map((response) => {
                    return response;
                })).subscribe(
                    (response) => {
                        resolve(response.json());
                        this.dialogBulkImport.close();
                        this.dialog.open(BulkImportSuccessComponent);
                    },
                    (err) => {
                        if (err.status === 401) {
                            window.location.href = '/login';
                        }
                    }
                )
        })
    }
}