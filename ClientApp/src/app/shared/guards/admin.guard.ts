import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { SharedService } from '../shared.service';
import { AccountService } from 'src/app/account/account.service';
import { User } from '../Models/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {

  constructor(
    private sharedService:SharedService,
    private router:Router,
    private accountService:AccountService
  ){
   
  }
  canActivate():
    Observable<boolean>  
    {
    return this.accountService.user$.pipe(map((user:User | null)=>{
      if(user){
        const decodedToken:any =jwtDecode(user.jwt)

        if(decodedToken.role.includes('Admin')){
          return true
      }
      }

      this.sharedService.showNotification(false,"Admin_Area","Leave Now")
      this.router.navigateByUrl('/')
      
      return false
    }))
  }
  
}
