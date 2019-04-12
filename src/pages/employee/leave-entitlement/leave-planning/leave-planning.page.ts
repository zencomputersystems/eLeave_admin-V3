import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-leave-planning',
    templateUrl: './leave-planning.page.html',
    styleUrls: ['./leave-planning.page.scss'],
})
export class LeavePlanningPage implements OnInit {

    public list: any;

    get personalList() {
        return this.list;
    }

    constructor(private apiService: APIService, private router: Router
    ) { }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                console.log(this.list);
            },
            error => {
                if (error) {
                    this.router.navigate(['/login']);
                }
            }
        );
    }

    backToProfile() {
        this.router.navigate(['/main/employee-setup/leave-entitlement']);
    }
}