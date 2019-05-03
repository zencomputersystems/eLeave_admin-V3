import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-leave-planning',
    templateUrl: './leave-planning.page.html',
    styleUrls: ['./leave-planning.page.scss'],
})
export class LeavePlanningPage implements OnInit {

    public list: any;
    public showSpinner: boolean = true;
    private subscription: Subscription = new Subscription();

    get personalList() {
        return this.list;
    }

    constructor(private apiService: APIService, private router: Router
    ) { }

    ngOnInit() {
        this.subscription = this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.showSpinner = false;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    backToProfile() {
        this.router.navigate(['/main/employee-setup/leave-entitlement']);
    }
}