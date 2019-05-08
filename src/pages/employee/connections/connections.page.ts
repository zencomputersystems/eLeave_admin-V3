import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-connections',
    templateUrl: './connections.page.html',
    styleUrls: ['./connections.page.scss'],
})
export class ConnectionsPage implements OnInit {

    public items: any;
    public departmentList: any;
    public arrowDownName: boolean = true;
    public arrowDownId: boolean = true;
    public totalItem: number;
    public pageItems: number = 6;
    public range: number = 5;
    public pageNum: number;
    public totalPageNum: number;
    public currentPageItems: any;
    public disableNextButton: boolean;
    public disablePrevButton: boolean = true;
    public listView: boolean = true;
    public gridView: boolean = false;
    public setAsFavourite = [];
    public viewMoreFilter: boolean = false;
    public connectionRoute: boolean;
    public showHeader: boolean = true;
    public showSpinner: boolean = true;
    private subscription: Subscription = new Subscription();

    foods = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' }
    ];
    public get personalList() {
        return this.currentPageItems;
    }
    constructor(private apiService: APIService, private route: ActivatedRoute,
        private elRef: ElementRef, private renderer: Renderer, public router: Router) { }

    ngOnInit() {
        if (this.route.routeConfig.path.includes('connection')) {
            this.connectionRoute = true;
        } else {
            this.renderer.setElementStyle(this.elRef.nativeElement, 'top', '48px');
        }
        this.subscription = this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.items = data;
                this.pageNum = 1;
                this.renderItems(this.pageNum, this.items, this.pageItems, this.range);
                this.showSpinner = false;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );

        this.subscription = this.apiService.get_department().subscribe((data) => {
            this.departmentList = data;
        });


    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    viewOnList() {
        this.listView = true;
        this.gridView = false;
        this.disableNextButton = false;
        this.disablePrevButton = true;
        this.pageItems = 6;
        this.range = 5;
        this.renderItems(1, this.items, this.pageItems, this.range);
    }

    viewOnGrid() {
        this.listView = false;
        this.gridView = true;
        this.disableNextButton = false;
        this.disablePrevButton = true;
        this.pageItems = 8;
        this.range = 7;
        this.renderItems(1, this.items, this.pageItems, this.range);
    }

    renderItems(i: number, data: any, pageIndex: number, rangeNumber: number) {
        this.pageNum = i;
        this.totalItem = this.items.length;
        this.totalPageNum = this.totalItem / pageIndex;
        this.totalPageNum = Math.ceil(this.totalPageNum);
        const startNum = (this.pageNum * pageIndex) - rangeNumber;
        const endNum = this.pageNum * pageIndex;
        const currentPageItems = [];
        for (let j = startNum - 1; j < endNum; j++) {
            const itemNum = data[j];
            if (itemNum !== undefined) {
                currentPageItems.push(itemNum);
            }
        }
        this.currentPageItems = currentPageItems;
    }

    disableEnableNextButton() {
        if (this.pageNum > 0 && this.pageNum < this.totalPageNum) {
            this.disableNextButton = false;
        }
        if (this.pageNum === this.totalPageNum) {
            this.disableNextButton = true;
        }
        if (this.pageNum > 1) {
            this.disablePrevButton = false;
        }
    }

    disableEnablePreviousButton() {
        if (this.pageNum > 1 && this.pageNum === this.totalPageNum) {
            this.disablePrevButton = false;
        }
        if (this.pageNum < 2) {
            this.disablePrevButton = true;
        }
        if (this.pageNum < this.totalPageNum) {
            this.disableNextButton = false;
        }
    }

    clickToNextPage(index: number) {
        if (!(index > this.totalPageNum)) {
            this.renderItems(index, this.items, this.pageItems, this.range);
        }
        this.disableEnableNextButton();
    }

    clickToPrevPage(index: number) {
        if (!(index < 1)) {
            this.renderItems(index, this.items, this.pageItems, this.range);
        }
        this.disableEnablePreviousButton();
    }

    nameSorting(value: boolean, checkAsc: number, checkDes: number) {
        this.arrowDownName = value;
        this.items = this.items.slice(0);
        this.items.sort(function (a: any, b: any) {
            const x = a.employeeName.toLowerCase();
            const y = b.employeeName.toLowerCase();
            return x < y ? checkAsc : x > y ? checkDes : 0;
        });
        this.renderItems(1, this.items, this.pageItems, this.range);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    IDSorting(value: boolean, ascValue: number, desValue: number) {
        this.arrowDownId = value;
        this.items = this.items.slice(0);
        this.items.sort(function (a, b) {
            var x = a.staffNumber;
            var y = b.staffNumber;
            return x < y ? ascValue : x > y ? desValue : 0;
        });
        this.renderItems(1, this.items, this.pageItems, this.range);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    filterDetails(text: any) {
        if (text && text.trim() != '') {
            this.items = this.items.filter((item: any) => {
                return (item.employeeName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })

            this.pageNum = 1;
            this.renderItems(this.pageNum, this.items, this.pageItems, this.range);
            this.disableEnableNextButton();
            this.disableEnablePreviousButton();
        }
    }

    clearDetails() {
        this.subscription = this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.items = data;
                this.pageNum = 1;
                this.renderItems(this.pageNum, this.items, this.pageItems, this.range);
            }
        );
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    changeDetails(text: any) {
        if (text.srcElement.value === '') {
            this.clearDetails();
        } else {
            this.filterDetails(text.srcElement.value);
        }
    }

    userIDExists(ID: string) {
        return this.setAsFavourite.some(function (el) {
            return el.itemId === ID;
        });
    }

    clickAsFavourite(index: number, item: any) {
        const objects = { index: index, itemId: item.id };
        const a = objects;
        if (this.setAsFavourite.length < 1) {
            this.setAsFavourite.push(a);
        } else {
            if (this.userIDExists(item.id)) {
                for (let i = 0; i < this.setAsFavourite.length; i++) {
                    if (this.setAsFavourite[i].index == index && this.setAsFavourite[i].itemId == item.id) {
                        this.setAsFavourite.splice(i, 1);
                    }
                }
            } else {
                this.setAsFavourite.push(a);
            }
        }
    };

    moreFilter() {
        if (this.viewMoreFilter) {
            this.viewMoreFilter = false;
        } else {
            this.viewMoreFilter = true;
        }
    }


}
