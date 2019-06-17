import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { RequestOptions, Http, Headers } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BulkImportSuccessPage } from '../bulk-import-success/bulk-import-success.page';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
/**
 * Bulk Import Page
 * @export
 * @class BulkImportPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-bulk-import',
    templateUrl: './bulk-import.page.html',
    styleUrls: ['./bulk-import.page.scss'],
})
export class BulkImportPage implements OnInit {

    /**
     * Get file name of imported/dropped file
     * @type {*}
     * @memberof BulkImportPage
     */
    public filename: any;

    /**
     * Show upload button after imported/dropped file
     * @memberof BulkImportPage
     */
    public showUploadButton: boolean = false;

    /**
     * Form group format for file
     * @type {FormGroup}
     * @memberof BulkImportPage
     */
    public fileform: FormGroup;

    /**
     * Get document info from imported/dropped file
     * @type {UploadFile[]}
     * @memberof BulkImportPage
     */
    public files: UploadFile[] = [];

    /**
     * Form data from document to post to API
     * @type {FormData}
     * @memberof BulkImportPage
     */
    public formData: FormData = new FormData();

    /**
     * Return value of filename from imported document
     * @readonly
     * @type {string}
     * @memberof BulkImportPage
     */
    get fileName(): string {
        return this.filename;
    }

    /**
     *Creates an instance of BulkImportPage.
     * @param {MatDialogRef<BulkImportPage>} dialogBulkImport
     * @param {MatDialogRef<BulkImportSuccessPage>} dialogSuccess
     * @param {MatDialog} dialog
     * @param {Http} http
     * @param {FormBuilder} fb
     * @memberof BulkImportPage
     */
    constructor(public dialogBulkImport: MatDialogRef<BulkImportPage>,
        public dialogSuccess: MatDialogRef<BulkImportSuccessPage>,
        public dialog: MatDialog, private http: Http, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.fileform = this.fb.group({
            file: ''
        });
    }

    /**
     * To close pop up page
     * @memberof BulkImportPage
     */
    onCloseClick(): void {
        this.dialogBulkImport.close();
    }

    /**
     * Get dropped file details
     * Submit file to API
     * @param {UploadEvent} event
     * @memberof BulkImportPage
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
     * @memberof BulkImportPage
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
     * @memberof BulkImportPage
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
                        this.dialog.open(BulkImportSuccessPage);
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
