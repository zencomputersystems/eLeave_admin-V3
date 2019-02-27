import { Component, OnInit } from '@angular/core';
import { EmployeeSetupService } from 'src/services/employee-setup/employee-setup.service';

@Component({
  selector: 'app-employee-setup',
  templateUrl: './employee-setup.page.html',
  styleUrls: ['./employee-setup.page.scss'],
  providers: [EmployeeSetupService]
})
export class EmployeeSetupPage implements OnInit {
  employeeList: any;
  displayedColumns: string[] = ['EMPLOYEE_NAME', 'Option'];
  displayArrowOfPersonal: boolean = false;
  displayArrowOfEmployment: boolean = false;
  displayArrowOfLeave: boolean = false;
  displayArrowOfAwards: boolean = false;
  displayArrowOfConnection: boolean = false;
  displayArrowOfAccount: boolean = false;
  text1Color: string;
  text2Color: string;
  text3Color: string;
  text4Color: string;
  text5Color: string;
  text6Color: string;

  get ArrowOfPersonal(): boolean {
    return this.displayArrowOfPersonal;
  }
  get ArrowOfEmployment(): boolean {
    return this.displayArrowOfEmployment;
  }
  get ArrowOfLeave(): boolean {
    return this.displayArrowOfLeave;
  }
  get ArrowOfAwards(): boolean {
    return this.displayArrowOfAwards;
  }
  get ArrowOfConnection(): boolean {
    return this.displayArrowOfConnection;
  }
  get ArrowOfAccount(): boolean {
    return this.displayArrowOfAccount;
  }

  constructor(private _employeeDataService: EmployeeSetupService) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    this._employeeDataService.getBranchList()
      .subscribe(() => {
        this.employeeList = this._employeeDataService.branchData;
      });
  }

  openPersonalDetails() {
    this.displayArrowOfPersonal = true;
    this.displayArrowOfEmployment = false;
    this.displayArrowOfLeave = false;
    this.displayArrowOfAwards = false;
    this.displayArrowOfConnection = false;
    this.displayArrowOfAccount = false;
    this.text1Color = '#057dcd';
    this.text2Color = '';
    this.text3Color = '';
    this.text4Color = '';
    this.text5Color = '';
    this.text6Color = '';
    console.log('personal');
  }
  openEmploymentDetails() {
    this.displayArrowOfPersonal = false;
    this.displayArrowOfEmployment = true;
    this.displayArrowOfLeave = false;
    this.displayArrowOfAwards = false;
    this.displayArrowOfConnection = false;
    this.displayArrowOfAccount = false;
    this.text1Color = '';
    this.text2Color = '#057dcd';
    this.text3Color = '';
    this.text4Color = '';
    this.text5Color = '';
    this.text6Color = '';
    console.log('employmentDetails');
  }
  openLeaveEntitlement() {
    this.displayArrowOfPersonal = false;
    this.displayArrowOfEmployment = false;
    this.displayArrowOfLeave = true;
    this.displayArrowOfAwards = false;
    this.displayArrowOfConnection = false;
    this.displayArrowOfAccount = false;
    this.text1Color = '';
    this.text2Color = '';
    this.text3Color = '#057dcd';
    this.text4Color = '';
    this.text5Color = '';
    this.text6Color = '';
    console.log('leave');
  }
  openAwards() {
    this.displayArrowOfPersonal = false;
    this.displayArrowOfEmployment = false;
    this.displayArrowOfLeave = false;
    this.displayArrowOfAwards = true;
    this.displayArrowOfConnection = false;
    this.displayArrowOfAccount = false;
    this.text1Color = '';
    this.text2Color = '';
    this.text3Color = '';
    this.text4Color = '#057dcd';
    this.text5Color = '';
    this.text6Color = '';
    console.log('leave');
  }
  openMyConnections() {
    this.displayArrowOfPersonal = false;
    this.displayArrowOfEmployment = false;
    this.displayArrowOfLeave = false;
    this.displayArrowOfAwards = false;
    this.displayArrowOfConnection = true;
    this.displayArrowOfAccount = false;
    this.text1Color = '';
    this.text2Color = '';
    this.text3Color = '';
    this.text4Color = '';
    this.text5Color = '#057dcd';
    this.text6Color = '';

    console.log('connections');
  }
  openAccount() {
    this.displayArrowOfPersonal = false;
    this.displayArrowOfEmployment = false;
    this.displayArrowOfLeave = false;
    this.displayArrowOfAwards = false;
    this.displayArrowOfConnection = false;
    this.displayArrowOfAccount = true;
    this.text1Color = '';
    this.text2Color = '';
    this.text3Color = '';
    this.text4Color = '';
    this.text5Color = '';
    this.text6Color = '#057dcd';
    console.log('account');
  }

}
