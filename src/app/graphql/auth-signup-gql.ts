import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { AppAuthLoginData } from "./interfaces";


export interface AppAuthSignupResponse {
  signup: AppAuthLoginData;
}

@Injectable({
  providedIn: 'root'
})
export class AuthSignupGql extends Mutation<AppAuthSignupResponse> {

  document = gql`
    mutation signup($email: String!, $password: String!) {
      signup(email: $email, password: $password) {
        token,
      }
    }
  `;
}
