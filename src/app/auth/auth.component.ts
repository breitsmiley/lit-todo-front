import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.error = null;
    const email = form.value.email;
    const password = form.value.password;

    let authObs;
    
    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        // console.log(resData);
        this.isLoading = false;
        // this.router.navigate(['/recipes']);
        this.router.navigate(['']);
      },
      errorMessage => {
        this.error = errorMessage.message;
        // this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );

    // console.log(authObs);
    //
    // authObs.subscribe(result => {
    // // const aaa: ApolloQueryResult = result;
    // // this.rates = result.data && result.data.rates;
    // // this.loading = result.loading;
    // // this.error = result.error;
    // // const aaa:any = result.data;
    // // const data = result.data;
    // // const a = <AAA> data;
    // console.log(result);
    //
    // });
    // console.log(authObs);

    form.reset();
  }

}
