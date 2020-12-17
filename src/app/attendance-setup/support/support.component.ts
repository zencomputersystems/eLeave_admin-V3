import { Component, OnInit } from '@angular/core';
import { SupportApiService } from './support-api.service';
import { map } from 'rxjs/operators';
import { APIService } from '../../../../src/services/shared-service/api.service';
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

    /**
     * all support message for this tenant
     * @type {*}
     * @memberof SupportComponent
     */
    public supportList: any;

    public data: any;

    /**
     * copy of all support message for this tenant
     * @type {*}
     * @memberof SupportComponent
     */
    public copySupportList: any;

    /**
     * total number of suggestion message from support list
     * @type {number}
     * @memberof SupportComponent
     */
    public suggestLength: number;

    /**
     * total number of request message from support list
     * @type {number}
     * @memberof SupportComponent
     */
    public requestLength: number;

    /**
     * total number of request pending message from support list
     * @type {number}
     * @memberof SupportComponent
     */
    public pendingVal: number = 0;

    /**
     * total number of request approved message from support list
     * @type {number}
     * @memberof SupportComponent
     */
    public approvedVal: number = 0;

    /**
     * total number of request rejected message from support list
     * @type {number}
     * @memberof SupportComponent
     */
    public rejectedVal: number = 0;

    /**
     * show spinner when loading to this page
     * @type {boolean}
     * @memberof SupportComponent
     */
    public showSpinner: boolean = true;

    /**
     * selected message index
     * @type {number}
     * @memberof SupportComponent
     */
    public clickedIndex: number;

    /**
     * get all profile picture list
     * @type {*}
     * @memberof SupportComponent
     */
    public url: any;

    /**
     * selected message details from support list
     * @type {*}
     * @memberof SupportComponent
     */
    public selectedDetails: any;

    /**
     * selected message conversation get by supportId
     * @type {*}
     * @memberof SupportComponent
     */
    public conversationList: any;

    /**
     * message ngmodel value from editor
     * @type {*}
     * @memberof SupportComponent
     */
    public message: any;

    /**
     * attachment file type
     * @type {string}
     * @memberof SupportComponent
     */
    public fileTypeOutput: string;

    /**
     * this logged in user info from API
     * @type {*}
     * @memberof SupportComponent
     */
    public info: any;

    /**
     * selected menu text
     * @type {string}
     * @memberof SupportComponent
     */
    public clickedText: string = 'all';

    /**
     * get attachment name after POST
     * @private
     * @type {string}
     * @memberof SupportComponent
     */
    private _fileName: string = '';

    /**
     * filtered array list('all', 'suggestion', 'request',..) from selected menu
     * @private
     * @memberof SupportComponent
     */
    private filteredSupport = [];

    /**
     *Creates an instance of SupportComponent.
     * @param {SupportApiService} supportApi
     * @param {APIService} apiService
     * @param {ClientApiService} clientApi
     * @memberof SupportComponent
     */
    constructor(private supportApi: SupportApiService, private apiService: APIService, private clientApi: ClientApiService) {
    }

    /**
     * initial method
     * @memberof SupportComponent
     */
    ngOnInit() {
        this.supportApi.get_user_info().subscribe(info => this.info = info)
        this.supportApi.get_support_list().pipe(
            map(data => {
                this.suggestLength = data.suggestion.length;
                this.requestLength = data.request.length;
                let value = data.request.concat(data.suggestion);
                value.sort((a, b) => new Date(b.CREATION_TS).getTime() - new Date(a.CREATION_TS).getTime());
                this.data = value;
                this.copySupportList = this.data;
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].STATUS != undefined) {
                        if (this.data[i].STATUS === 'pending') {
                            this.pendingVal++
                        }
                        if (this.data[i].STATUS === 'approved') {
                            this.approvedVal++
                        }
                        if (this.data[i].STATUS === 'rejected') {
                            this.rejectedVal++
                        }
                    }
                }
                this.showSpinner = false;
                this.changeDetails('');
            })
        ).subscribe(list => { })
        this.apiService.get_profile_pic('all').subscribe(data => {
            this.url = data;
        });
    }

    /**
     * filter support message according selected item
     * @param {string} type
     * @memberof SupportComponent
     */
    filterSupportList(type: string) {
        this.data = this.copySupportList;
        switch (type) {
            case "all":
                this.data = this.copySupportList;
                break;

            case "request":
                this.filteredSupport = [];
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].REQUEST_TYPE != 'suggestions') {
                        this.filteredSupport.push(this.data[i]);
                    }
                }
                this.data = this.filteredSupport;
                break;

            case "suggestion":
                this.filteredSupport = [];
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].REQUEST_TYPE == 'suggestions') {
                        this.filteredSupport.push(this.data[i]);
                    }
                }
                this.data = this.filteredSupport;
                break;

            case "pending":
                this.filteredSupport = [];
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].STATUS === 'pending') {
                        this.filteredSupport.push(this.data[i]);
                    }
                }
                this.data = this.filteredSupport;
                break;

            case "approve":
                this.filteredSupport = [];
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].STATUS === 'approved') {
                        this.filteredSupport.push(this.data[i]);
                    }
                }
                this.data = this.filteredSupport;
                break;

            case "reject":
                this.filteredSupport = [];
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].STATUS === 'rejected') {
                        this.filteredSupport.push(this.data[i]);
                    }
                }
                this.data = this.filteredSupport;
                break;

            case "allSuggestion":
                this.filteredSupport = [];
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].REQUEST_TYPE == 'suggestions') {
                        this.filteredSupport.push(this.data[i]);
                    }
                }
                this.data = this.filteredSupport;
                break;
        }
        this.changeDetails('');
    }

    /**
     * select message to view details info
     * @param {number} i
     * @param {*} data
     * @memberof SupportComponent
     */
    selectedMessage(i: number, data) {
        this.clickedIndex = i;
        this.selectedDetails = data;
        if (this.selectedDetails.ATTACHMENT != undefined) {
            let fileType = this.selectedDetails.ATTACHMENT.split('.');
            this.fileTypeOutput = fileType.pop();
        }
        this.supportApi.get_support_conversation_id(data.SUPPORT_GUID).subscribe(data => {
            this.conversationList = data;
            this.conversationList.sort((a, b) => new Date(a.CREATION_TS).getTime() - new Date(b.CREATION_TS).getTime());
            if (this.selectedDetails != undefined) {
                this.conversationList.unshift(this.selectedDetails);
            }
            for (let i = 0; i < this.conversationList.length; i++) {
                let type = this.conversationList[i].ATTACHMENT.split('.');
                this.conversationList[i]["type"] = type.pop();
            }
        })
    }

    /**
     * filter employee name from searchbar 
     * @param {*} searchKeyword
     * @param {*} data
     * @param {*} arg
     * @returns
     * @memberof SupportComponent
     */
    filerSearch(searchKeyword, data, arg) {
        return data.filter(itm => new RegExp(searchKeyword, 'i').test(itm[arg]));
    }

    /**
     * To filter entered text
     * @param {*} text
     * @memberof SupportComponent
     */
    changeDetails(text: any) {
        this.supportList = this.data;
        this.supportList = (text.length > 0) ?
            this.filerSearch(text, this.supportList, 'FULLNAME') :
            this.supportList;
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
        this.apiService.post_file(formData).subscribe(res => {
            this._fileName = res.filename;
        });
    }

    /**
     * reply to the user support conversation
     * @param {string} status
     * @memberof SupportComponent
     */
    async replyMessage(status: string) {
        const data = {
            "supportId": this.selectedDetails.SUPPORT_GUID,
            "userId": this.info.userId,
            "doc": this._fileName,
            "message": this.message,
            "status": status
        }
        this.supportApi.post_support_clarification(data).subscribe(res => {
            if (res[0] != undefined) {
                this.clientApi.snackbarMsg('Your message has been submitted successfully', true);
                this.message = '';
                this._fileName = '';
            } else {
                this.clientApi.snackbarMsg('Your message was not able to submit. Please refresh and try again', false);
            }
            this.selectedMessage(this.clickedIndex, this.selectedDetails);
        })
    }
}