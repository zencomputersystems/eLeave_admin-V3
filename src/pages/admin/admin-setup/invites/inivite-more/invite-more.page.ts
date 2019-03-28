import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-invite-more',
    templateUrl: './invite-more.page.html',
    styleUrls: ['./invite-more.page.scss'],
})
export class InviteMorePage implements OnInit {

    public employeeList: any;
    public totalItem: number;


    public get personalList() {
        return this.employeeList;
    }

    constructor(private apiService: APIService, private router: Router) { }

    ngOnInit() {
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.employeeList = data;
                console.log(this.employeeList)
                // this.pageIndex = 1;
                // this.loopItemsPerPage(this.pageIndex, this.employeeList, this.itemsPerPage, this.startEndNumber);
            },
            response => {
                this.router.navigate(['login']);
            }
        );
    }

    filterDetails(text: any) {
        if (text && text.trim() != '') {
            this.employeeList = this.employeeList.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })

            // this.pageIndex = 1;
            // this.loopItemsPerPage(this.pageIndex, this.employeeList, this.itemsPerPage, this.startEndNumber);
            // this.enableDisableNextButton();
            // this.enableDisablePrevButton();
        }
    }

    clearDetails() {
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.employeeList = data;
                // this.pageIndex = 1;
                // this.loopItemsPerPage(this.pageIndex, this.employeeList, this.itemsPerPage, this.startEndNumber);
            }
        );
        // this.disableNextButton = false;
        // this.disablePrevButton = true;
    }

    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.apiService.get_user_profile_list().subscribe(
                (data: any[]) => {
                    this.employeeList = data;
                    // this.pageIndex = 1;
                    // this.loopItemsPerPage(this.pageIndex, this.employeeList, this.itemsPerPage, this.startEndNumber);
                }
            );
            // this.disableNextButton = false;
            // this.disablePrevButton = true;
        } else {
            this.filterDetails(text.srcElement.value);
        }
    }

}