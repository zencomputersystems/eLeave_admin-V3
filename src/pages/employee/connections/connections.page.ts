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

    viewList(showList: boolean, pageItem: number, range: number) {
        this.listView = showList;
        this.gridView = !showList;
        this.disableNextButton = false;
        this.disablePrevButton = true;
        this.pageItems = pageItem;
        this.range = range;
        this.renderItems(1, this.items, this.pageItems, this.range);
    }

    renderItems(i: number, data: any, pageIndex: number, rangeNumber: number) {
        this.pageNum = i;
        this.totalItem = this.items.length;
        this.totalPageNum = this.totalItem / pageIndex;
        this.totalPageNum = Math.ceil(this.totalPageNum);
        const firstNum = (this.pageNum * pageIndex) - rangeNumber;
        const lastNum = this.pageNum * pageIndex;
        const currentPageList = [];
        for (let j = firstNum - 1; j < lastNum; j++) {
            const itemValue = data[j];
            if (itemValue !== undefined) {
                currentPageList.push(itemValue);
            }
        }
        this.currentPageItems = currentPageList;
        this.showSpinner = false;
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

    clickPageButton(index: number, nextOrPrev: string) {
        if (!(index > this.totalPageNum) && nextOrPrev === 'next') {
            this.showSpinner = true;
            this.renderItems(index, this.items, this.pageItems, this.range);
            this.disableEnableNextButton();
        }
        if (!(index < 1) && nextOrPrev === 'prev') {
            this.showSpinner = true;
            this.renderItems(index, this.items, this.pageItems, this.range);
            this.disableEnablePreviousButton();
        }
    }

    nameSorting(value: boolean, checkAsc: number, checkDes: number) {
        this.showSpinner = true;
        this.arrowDownName = value;
        this.items = this.items.slice(0);
        this.items.sort(function (a: any, b: any) {
            const x = a.employeeName.toUpperCase();
            const y = b.employeeName.toUpperCase();
            return x < y ? checkAsc : x > y ? checkDes : 0;
        });
        this.renderItems(1, this.items, this.pageItems, this.range);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    IDSorting(value: boolean, ascValue: number, desValue: number) {
        this.showSpinner = true;
        this.arrowDownId = value;
        this.items = this.items.slice(0);
        this.items.sort(function (x, y) {
            const a = x.staffNumber;
            const b = y.staffNumber;
            return a < b ? ascValue : a > b ? desValue : 0;
        });
        this.renderItems(1, this.items, this.pageItems, this.range);
        this.disableNextButton = false;
        this.disablePrevButton = true;
    }

    filterDetails(char: any) {
        if (char && char.trim() != '') {
            this.items = this.items.filter((data: any) => {
                return (data.employeeName.toUpperCase().indexOf(char.toUpperCase()) > -1);
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
        this.showSpinner = true;
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
        const obj = { index: index, itemId: item.id };
        const data = obj;
        if (!this.userIDExists(item.id) && this.setAsFavourite.length > 0) {
            this.setAsFavourite.push(data);
        } else if (this.userIDExists(item.id) && this.setAsFavourite.length > 0) {
            for (let i = 0; i < this.setAsFavourite.length; i++) {
                if (this.setAsFavourite[i].itemId == item.id && this.setAsFavourite[i].index == index) {
                    this.setAsFavourite.splice(i, 1);
                }
            }
        } else {
            this.setAsFavourite.push(data);
        }
    };

}
