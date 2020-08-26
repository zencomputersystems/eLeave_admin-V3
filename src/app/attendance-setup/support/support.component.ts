import { Component, OnInit } from '@angular/core';
import { SupportApiService } from './support-api.service';
import { map } from 'rxjs/operators';
import { APIService } from '$admin-root/src/services/shared-service/api.service';

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

    public supportList: any;
    public suggestLength: number;
    public requestLength: number;
    public pendingVal: number = 0;
    public approvedVal: number = 0;
    public rejectedVal: number = 0;
    public showSpinner: boolean = true;
    public clickedIndex: number;
    public url: any;
    public selectedDetails: any;

    constructor(private supportApi: SupportApiService, private apiService: APIService) {
    }

    ngOnInit() {
        this.supportApi.get_support_list().pipe(
            map(data => {
                console.log(data)
                this.suggestLength = data.suggestion.length;
                this.requestLength = data.request.length;
                let value = data.request.concat(data.suggestion);
                console.log(value);
                value.sort((a, b) => new Date(b.CREATION_TS).getTime() - new Date(a.CREATION_TS).getTime());
                this.supportList = value;
                for (let i = 0; i < this.supportList.length; i++) {
                    if (this.supportList[i].STATUS != undefined) {
                        if (this.supportList[i].STATUS === 'pending') {
                            this.pendingVal++
                        }
                        if (this.supportList[i].STATUS === 'approved') {
                            this.approvedVal++
                        }
                        if (this.supportList[i].STATUS === 'rejected') {
                            this.rejectedVal++
                        }
                    }
                }
                this.showSpinner = false;
            })
        ).subscribe(list => { })
        // this.apiService.get_profile_pic('all').subscribe(data => {
        //     this.url = data;
        // });
    }

    selectedMessage(i: number, data) {
        this.clickedIndex = i;
        console.log(data)
        this.selectedDetails = data;
    }
}