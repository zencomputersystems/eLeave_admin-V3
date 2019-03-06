import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from 'src/services/employee-setup/connections.service';

@Component({
    selector: 'app-connections',
    templateUrl: './connections.page.html',
    styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit {

    public data: any;
    public arrowDownName: boolean = true;
    public arrowDownId: boolean = true;
    private _dataValue: any;

    public get sortDirectionArrowDownName(): boolean {
        return this.arrowDownName;
    }
    public get sortDirectionArrowDownId(): boolean {
        return this.arrowDownId;
    }

    constructor(private _data: ConnectionsService) { }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this._data.getConnectionsList()
            .subscribe(() => {
                this.data = this._data.personalData;
            });
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
