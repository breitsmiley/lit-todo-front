import { Component, OnInit } from '@angular/core';
import { Apollo } from "apollo-angular";
import gql from 'graphql-tag';
import { ApolloQueryResult } from "apollo-client";

interface AAA {
  user: {
    id: number;
    name: string;
    createdAt: number;
    ttt: string;
  }
}

// We use the gql tag to parse our query string into a query document
const userTTT = gql`
query userTTT($id: Float!) {
  user(id: $id) {
    id,
    name,
    createdAt,
    ttt
  }
}
`;

// console.log(userTTT);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // loadedNav = 'todo';

  // rates: any[];
  // loading = true;
  // error: any;

  title = 'lit-todo-front';

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    // this.apollo
    //   .watchQuery({
    //     query: userTTT,
    //   // .watchQuery({
    //   //   query: userTTT,
    //     variables: {
    //       id: 1.1,
    //     },
    //   })
    //   .valueChanges.subscribe(result => {
    //     // const aaa: ApolloQueryResult = result;
    //   // this.rates = result.data && result.data.rates;
    //   // this.loading = result.loading;
    //   // this.error = result.error;
    //   // const aaa:any = result.data;
    //   const data = result.data;
    //   const a = <AAA> data;
    //   console.log(a);
    // });
  }

  onNavigate(feature: string) {
    // this.loadedFeature = feature;
  }
}
