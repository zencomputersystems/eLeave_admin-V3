import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employment',
    templateUrl: './employment.page.html',
    styleUrls: ['./employment.page.scss'],
})
export class EmploymentPage implements OnInit {

    public list: any;
    public employmentlist: any;

    get personalList() {
        return this.list;
    }
    get employmentPersonalList() {
        return this.employmentlist;
    }

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
            },
            error => {
                if (error) {
                    this.router.navigate(['/login']);
                }
            }
        );
        setTimeout(() => {
            const userId = this.list.id;
            this.apiService.get_employment_details(userId).subscribe(
                data => {
                    this.employmentlist = data;
                }
            )
        }, 2000);

    }


}
