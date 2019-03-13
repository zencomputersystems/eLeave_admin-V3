import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-connections',
    templateUrl: './connections.page.html',
    styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit {

    public data: any = '';
    public personalData: any;
    public arrowDownName: boolean = true;
    public arrowDownId: boolean = true;
    private _dataValue: any;

    public get personalList() {
        return this.data;
    }
    public get personalDataList() {
        return this.personalData;
    }
    public get sortDirectionArrowDownName(): boolean {
        return this.arrowDownName;
    }
    public get sortDirectionArrowDownId(): boolean {
        return this.arrowDownId;
    }

    constructor(private apiService: APIService) { }

    ngOnInit() {
        this.apiService.get_user_profile_list().subscribe(
            response => this.data = response.json()
        );

        this.apiService.get_user_profile_me().subscribe(
            response => this.personalData = response.json()
        );
    }

    sortAscName() {
        this.arrowDownName = true;
        this._dataValue = this.data.source.value.slice(0);
        this._dataValue.sort(function (a, b) {
            var x = a.EMPLOYEE_NAME.toLowerCase();
            var y = b.EMPLOYEE_NAME.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        // need to update the sorted list in html
    }

    sortDesName() {
        this.arrowDownName = false;
        this._dataValue = this.data.source.value.slice(0);
        this._dataValue.sort(function (a, b) {
            var x = a.EMPLOYEE_NAME.toLowerCase();
            var y = b.EMPLOYEE_NAME.toLowerCase();
            return x < y ? 1 : x > y ? -1 : 0;
        });
        // need to update the sorted list in html
    }

    sortAscId() {
        this.arrowDownId = true;
        this._dataValue = this.data.source.value.slice(0);
        this._dataValue.sort(function (a, b) {
            var x = a.ID;
            var y = b.ID;
            return x < y ? -1 : x > y ? 1 : 0;
        });
        // need to update the sorted list in html
    }

    sortDesId() {
        this.arrowDownId = false;
        this._dataValue = this.data.source.value.slice(0);
        this._dataValue.sort(function (a, b) {
            var x = a.ID;
            var y = b.ID;
            return x < y ? 1 : x > y ? -1 : 0;
        });
        // need to update the sorted list in html
    }



}
