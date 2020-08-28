import { Component, OnInit } from '@angular/core';
import { SupportApiService } from './support-api.service';
import { map } from 'rxjs/operators';
import { APIService } from '$admin-root/src/services/shared-service/api.service';
import { ClientApiService } from '../client/client-api.service';

/**
 * support page
 * @export
 * @class SupportComponent
 * @implements {OnInit}
 */
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
    public conversationList: any;
    public message: any;
    public fileTypeOutput: string;
    private _fileName: string;

    /**
     *Creates an instance of SupportComponent.
     * @param {SupportApiService} supportApi
     * @param {APIService} apiService
     * @memberof SupportComponent
     */
    constructor(private supportApi: SupportApiService, private apiService: APIService, private clientApi: ClientApiService) {
    }

    /**
     * initial method
     * @memberof SupportComponent
     */
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
        this.apiService.get_profile_pic('all').subscribe(data => {
            this.url = data;
        });
    }

    /**
     * select message to view details info
     * @param {number} i
     * @param {*} data
     * @memberof SupportComponent
     */
    selectedMessage(i: number, data) {
        this.clickedIndex = i;
        console.log(data)
        this.selectedDetails = data;
        let fileType = this.selectedDetails.ATTACHMENT.split('.');
        this.fileTypeOutput = fileType.pop();
        this.supportApi.get_support_conversation_id(data.SUPPORT_GUID).subscribe(data => {
            console.log(data);
            this.conversationList = data;
            for (let i = 0; i < this.conversationList.length; i++) {
                let type = this.conversationList[i].ATTACHMENT.split('.');
                this.conversationList[i]["type"] = type.pop();
            }
        })
    }

    /**
     * filter the keyup text from searchbar
     * @param {*} text
     * @memberof SupportComponent
     */
    async filter(text: any) {
        if (text && text.trim() != '') {
            let description = this.supportList.filter((items: any) => {
                if (items.DESCRIPTION != undefined) {
                    return (items.DESCRIPTION.toLowerCase().indexOf(text.toLowerCase()) > -1)
                }
            })

            let name = this.supportList.filter((items: any) => {
                if (items.FULLNAME != undefined) {
                    return (items.FULLNAME.toLowerCase().indexOf(text.toLowerCase()) > -1)
                }
            })
            this.supportList = require('lodash').uniqBy(name.concat(description), 'SUPPORT_GUID');
        }
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof SupportComponent
     */
    changeDetails(value: any) {
        if (value === '') {
            this.ngOnInit();
        } else {
            this.filter(value);
        }
    }

    /**
   * upload image/pdf event
   * @param {*} imgFile
   * @memberof SupportComponent
   */
    uploadFile(imgFile: any) {
        const fileDetails = imgFile.item(0);
        let formData = new FormData();
        formData.append('file', fileDetails, fileDetails.name);
        console.log(formData);
        this.apiService.post_file(formData).subscribe(res => {
            console.log(res);
            this._fileName = res.filename;
        });
    }

    /**
     * reply to the user support conversation
     * @param {string} status
     * @memberof SupportComponent
     */
    replyMessage(status: string) {
        const data = {
            "supportId": this.selectedDetails.SUPPORT_GUID,
            "userId": this.selectedDetails.USER_GUID,
            "doc": [this._fileName],
            "message": this.message,
            "status": status
        }
        console.log(data);
        this.supportApi.post_support_clarification(data).subscribe(res => {
            console.log(res);
            this.clientApi.snackbarMsg('Your message has been submitted successfully', true);
            this.message = '';
            this._fileName = '';
        })
    }
}