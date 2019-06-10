import { Injectable } from '@angular/core';
import { throwError, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { IUserData, User } from "./user.model";
import { Router } from "@angular/router";
import { AuthSignupGql,AuthLoginGql } from "../graphql";
import { AuthError } from "./auth.error";

interface IAuthJwtPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

const AUTH_USER_LOCAL_STORAGE_KEY = 'userData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  // constructor(private apollo: Apollo) { }
  constructor(
    private authLoginGql: AuthLoginGql,
    private authSignupGql: AuthSignupGql,
    private router: Router
  ) { }

  private getJwtPayloadFromToken(token: string): IAuthJwtPayload {
    try {
      const payloadStr = token.split('.')[1];
      return JSON.parse(atob(payloadStr));
    } catch(e) {
      throw Error('Parse JWT payload Error');
    }
  }

  login(email: string, password: string) {

    return this.authLoginGql.fetch({
      email: email,
      password: password,
    }).pipe(

      tap(({data, errors}) => {
        
        if (errors) {
          this.handleError(errors);
        } else {
          const token = data.login.token;
          const jwtData = this.getJwtPayloadFromToken(token);
          this.handleAuthentication(token, jwtData);
        }

      }),
      catchError(this.handleException),

    );
  }

  signup(email: string, password: string) {

    return this.authSignupGql.mutate({
      email: email,
      password: password,
    }).pipe(
      tap(({data, errors}) => {
        if (errors) {
          this.handleError(errors);
        } else {
          const token = data.signup.token;
          const jwtData = this.getJwtPayloadFromToken(token);
          this.handleAuthentication(token, jwtData);
        }
      }),
      catchError(this.handleException),
    );
  }

  
  autoLogin() {
    const user = this.getUserFromLocalStorage();

    if (!user) {
      return;
    }

    if (user.token) {

      const nowMS = Date.now();
      const expMS = new Date(user.tokenExpirationDate).getTime();

      const expirationDuration = expMS - nowMS;

      if (expirationDuration <= 3) {
        this.logout();
      }

      this.user.next(user);
      this.autoLogout(expirationDuration);

    }
  }

  private getUserFromLocalStorage(): User {
    const userDataStr = localStorage.getItem(AUTH_USER_LOCAL_STORAGE_KEY);

    let user = null;
    if (userDataStr) {

      const userData: IUserData =  JSON.parse(userDataStr);
      user = new User(
        userData.id,
        userData.email,
        userData._token,
        userData._tokenExpirationDate,
        userData.tokenExpirationTS,
      );
    }
    return user;
  }

  getUserTokenFromLocalStorage(): string {
    const user = this.getUserFromLocalStorage();
    return user ? user.token : '';
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem(AUTH_USER_LOCAL_STORAGE_KEY);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    token: string,
    payload: IAuthJwtPayload
  ) {
    const issueAtMs = payload.iat * 1000;
    const expAtMs = payload.exp * 1000;
    const expirationDate = new Date(expAtMs);
    const user = new User(
      payload.id, 
      payload.email, 
      token, 
      expirationDate, 
      payload.exp
    );
    this.user.next(user);
    this.autoLogout(expAtMs - issueAtMs);
    localStorage.setItem(AUTH_USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
  }

  private handleError(errorRes) {
    let errorMsg = errorRes[0].message;

    // TODO стандартизация ошибок на бэкенд
    if (errorMsg.hasOwnProperty('message')) {
      errorMsg = Object.values(errorMsg.message[0].constraints)[0];
    }

    throw new AuthError(errorMsg);
  }

  private handleException(errorRes) {

    let errorMsg = 'An unknown error occurred!';
    if (errorRes instanceof AuthError) {
      errorMsg = errorRes.message;
    }
    // console.log('handleException', errorRes.graphQLErrors);
    // console.log('handleException', errorRes.networkError);

    return throwError(errorMsg);

  }
}
