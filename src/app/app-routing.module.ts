import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from "./auth/auth.component";
import { LoggedGuard } from "./auth/logged.guard";

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [LoggedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
