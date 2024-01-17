import { Component } from '@angular/core';
import { AccountService } from '../account/account.service';
import { jwtDecode } from 'jwt-decode';
import { take } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(public accountService : AccountService){}

  logout(){
    this.accountService.logout()
  }
  checkUserHasRole(role: string): boolean {
    let hasRole = false;

    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          const decodedToken: any = jwtDecode(user.jwt);
          hasRole = decodedToken.role.includes(role);
        }
      },
    });

    return hasRole;
  }
}
