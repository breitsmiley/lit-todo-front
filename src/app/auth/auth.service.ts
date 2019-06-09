import { Injectable } from '@angular/core';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { throwError, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { AuthGQL } from "../graphql/auth-gql";
import { onError } from 'apollo-link-error';
import { IUserData, User } from "./user.model";
import { Router } from "@angular/router";
import { GraphQLError } from 'graphql';


// export interface AAA {
//   user: {
//     id: number;
//     name: string;
//     createdAt: number;
//     ttt: string;
//   }
// }

// export interface AuthResponseData {
//   kind: string;
//   idToken: string;
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
// }

// // We use the gql tag to parse our query string into a query document
// const userTTT = gql`
// query userTTT($id: Float!) {
//   user(id: $id) {
//     id,
//     name,
//     createdAt,
//     ttt
//   }
// }
// `;


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
    private authGQL: AuthGQL,
    private router: Router
  ) { }

  private getJwtPayloadFromToken(token: string): IAuthJwtPayload {
    try {
      const payloadStr = token.split('.')[1];
      return JSON.parse(atob(payloadStr));
    } catch(e) {
      throwError('Parse JWT payload Error');
    }
  }

  login(email: string, password: string) {

    return this.authGQL.fetch({
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
    );
  }


  // login(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponseData>(
  //       'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDb0xTaRAoxyCgvaDF3kk5VYOsTwB_3o7Y',
  //       {
  //         email: email,
  //         password: password,
  //         returnSecureToken: true
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap(resData => {
  //         this.handleAuthentication(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       })
  //     );
  // }
  //
  
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
    throw Error(errorRes[0].message);
  }
}
