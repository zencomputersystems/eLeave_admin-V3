import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BulkImportPage } from './bulk-import/bulk-import.page';

@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.page.html',
    styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {

    }

    openBulkImport() {
        const dialogRef = this.dialog.open(BulkImportPage, {
            // width: '250px',
            // data: { name: this.name, animal: this.animal }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    downloadFile() {
        const blob = new Blob([`STAFF_EMAIL,STAFF_ID,FULLNAME,NICKNAME,NRIC,DOB,GENDER,PHONE_NUMBER,COMPANY_NUMBER,MARITAL_STATUS,ADDRESS,POSTCODE,CITY,STATE,COUNTRY,DESIGNATION,DEPARTMENT,COST_CENTRE,BRANCH,DIVISION,COMPANY,JOIN_DATE,CONFIRMATION_DATE,RESIGNATION_DATE
        leavetest@zen.com.my,ZEN-00001,TEST 1 ZEN,TEST 1,12345676,9/7/2018,Male,654323456,13222222,SINGLE,This is address,44333,Shah Alam,Selangor,Malaysia,SOFTWARE ENGINEER,Tester,,CYBERJAYA,,Zen Company Sdn Bhd,9/7/2018,9/12/2018,
        leavetest2@zen.com.my,ZEN-00002,TEST 2 ZEN,TEST 2,2345643,9/7/2018,Female,,1344433,MARRIED,,,,,MALAYSIA,SOftware Engineer,TESTER,,CYBerjaya,,Zen Company Sdn Bhd,9/7/2018,9/10/2018,9/7/2020
        leavetest2@zen.com.my,ZEN-00002,TEST 2 ZEN,TEST 3,2345643,9/7/2018,Female,,1344433,MARRIED,,,,,MALAYSIA,SOftware Engineer,TESTER,,CYBerjaya,,Zen Company Sdn Bhd,9/7/2018,9/10/2018,9/7/2020`], { type: "text/plain" });
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
}


