import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { AppAuthLoginData } from "./interfaces";


export interface AppAuthLoginResponse {
  login: AppAuthLoginData;
}

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGql extends Query<AppAuthLoginResponse> {

  document = gql`
    query login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token,
      }
    }
  `;
}
