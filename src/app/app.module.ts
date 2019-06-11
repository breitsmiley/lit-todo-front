import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Apollo, ApolloModule } from "apollo-angular";
import { HttpLinkModule, HttpLink,  } from 'apollo-angular-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
// import { GraphQLModule } from './graphql.module';

import { environment } from "../environments/environment";
import { AuthService } from "./auth/auth.service";
import { TodoListComponent } from './todo-list/todo-list.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBan, faSignOutAlt, faSignInAlt, faBars, faPlus, faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    TodoListComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    // FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    // GraphQLModule,
    // HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private authService: AuthService
  ) {

    // FontAwesomeModule
    //--------------------------------
    library.add(faBan,faSignOutAlt, faSignInAlt, faBars, faPlus, faCheck, faEdit);
    //--------------------------------

    // TODO заменить на useFactory https://github.com/apollographql/apollo-angular/issues/1062
    const uri = environment.apiBackendURL;
    const link = httpLink.create({uri});

    // const errorLink = onError(({ graphQLErrors, networkError,  operation, forward  }) => {
    //   if (graphQLErrors) {
    //     graphQLErrors.map(({ message, locations, path }) =>
    //       console.log(
    //         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    //       ),
    //     );
    //     // throw new Error('Some graphQLErrors');
    //   }
    //
    //
    //   if (networkError) {
    //     console.log(`[Network error]:`, networkError);
    //     // throw new Error('Some Server problems');
    //   }
    //
    //   // throw new Error('Valid token not returned');
    //   // return <any>throwError('AAAAAAAAAAAAAAAAAAAAAA');
    //   // return forward(operation);
    //   // return forward(operation);
    // });

    const authLink = new ApolloLink((operation, forward) => {
      // Get the authentication token from local storage if it exists
      const token = authService.getUserTokenFromLocalStorage();

      // const token = 'ASD';
      // Use the setContext method to set the HTTP headers.
      if (token) {
        operation.setContext({
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }


      // Call the next link in the middleware chain.
      return forward(operation);
    });

    apollo.create({
      // link: from([authLink, errorLink, link]),
      // link: from([ errorLink, link]),
      link: from([authLink, link]),
      // link: from([link]),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        mutate: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        }
      }
    });
  }
}
