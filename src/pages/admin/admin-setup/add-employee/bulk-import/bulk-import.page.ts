import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { RequestOptions, Http, Headers } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BulkImportSuccessPage } from '../bulk-import-success/bulk-import-success.page';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
    selector: 'app-bulk-import',
    templateUrl: './bulk-import.page.html',
    styleUrls: ['./bulk-import.page.scss'],
})
export class BulkImportPage implements OnInit {

    public filename: any;
    public headers = new Headers();
    public showUploadButton: boolean = false;
    public fileform: FormGroup;
    public files: UploadFile[] = [];
    public formData: FormData = new FormData();

    get fileName(): string {
        return this.filename;
    }

    constructor(public dialogBulkImport: MatDialogRef<BulkImportPage>,
        public dialogSuccess: MatDialogRef<BulkImportSuccessPage>,
        public dialog: MatDialog, private http: Http, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.fileform = this.fb.group({
            file: ''
        });
    }

    onCloseClick(): void {
        this.dialogBulkImport.close();
    }

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
