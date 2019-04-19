import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-invite-more',
    templateUrl: './invite-more.page.html',
    styleUrls: ['./invite-more.page.scss'],
})
export class InviteMorePage implements OnInit {

    public employeeList: any;
    public filterList: any;
    public inputValue: string;
    public chipValue: any = [];
    public showDropDown: boolean;
    public showChips: boolean;
    public dataList: any = [];
    public dataSelected: any = [];
    @ViewChild('searchbar') searchbar: any;

    public get personalList() {
        return this.employeeList;
    }

    constructor(private apiService: APIService) {
    }

    ngOnInit() {
        this.searchbar.setFocus();
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.employeeList = data;
                this.filterList = data;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    filterDetails(text: any) {
        if (text && text.trim() != '') {
            this.filterList = this.employeeList.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
        }
    }

    getInputValue(text: any) {
        this.inputValue = text.srcElement.value;
        if (text.srcElement.value.length > 0) {
            this.showDropDown = true;
            this.filterDetails(this.inputValue);
        } else {
            this.reset();
        }
    }

    deleteSearchText() {
        this.inputValue = null;
        this.showDropDown = false;
        this.filterList = this.filterList;
    }

    reset(): void {
        this.showDropDown = false;
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.filterList = data;
            }
        );
    }

    updateTextBox(valueSelected: any) {
        this.showChips = true;
        this.dataSelected.push(valueSelected);
        this.showDropDown = false;
        this.inputValue = null;
        const removeIndex = this.employeeList.map(function (item) {
            return item.employeeName;
        }).indexOf(valueSelected.employeeName);
        this.employeeList.splice(removeIndex, 1);
        this.filterList = this.employeeList;
    }

    removeContact(index: number, data: any) {
        this.dataList.splice(index, 1);
        this.filterList = this.employeeList.splice(1, 0, data);
    }

    deleteChip(index: number, data: any) {
        this.dataSelected.splice(index, 1);
        this.filterList = this.employeeList.splice(1, 0, data);
    }

    addSelectedContact() {
        this.showChips = false;
        this.dataList = this.dataList.concat(this.dataSelected);
        this.dataSelected = [];
    }


}