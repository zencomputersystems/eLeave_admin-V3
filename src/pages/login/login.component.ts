import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/shared-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public showPassword: boolean = false;
  public formGroupValidation = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    pass: new FormControl(null, [Validators.required]),
  });

  getErrorMessage() {
    return this.formGroupValidation.controls['email'].hasError('required') ? 'Please enter your email address' :
      this.formGroupValidation.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  getPassErrorMessage() {
    return this.formGroupValidation.controls['pass'].hasError('required') ? 'Please enter your password' : '';
  }

  constructor(private _auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this._auth.logout();
  }

  showPasswordKey() {
    this.showPassword = true;
  }
  hidePasswordKey() {
    this.showPassword = false;
  }

  signIn(email: string, pass: string) {
    this._auth.login(email, pass)
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['main'])
      },
      );
  }

}
