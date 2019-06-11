import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isShowMobileMenu = false;
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      // console.log(this.isAuthenticated );
      // console.log(!!user);
    });
  }

  onMobileMenu() {
    this.isShowMobileMenu = !this.isShowMobileMenu;
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
