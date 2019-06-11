import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from "./auth/auth.component";
import { LoggedGuard } from "./auth/logged.guard";
import { TodoListComponent } from "./todo-list/todo-list.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/todo-list',
    pathMatch: 'full'
  },
  {
    path: 'todo-list',
    component: TodoListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [LoggedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
