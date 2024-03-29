import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/Models/register';
import { environment } from 'src/environments/environment.development';
import { Login } from '../shared/Models/login';
import { User } from '../shared/Models/user';
import { ReplaySubject, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmEmail } from '../shared/Models/confirmEmail';
import { ResetPassword } from '../shared/Models/resetPassword';
import { RegisterWithExternal } from '../shared/Models/registerWithExternal';
import { LoginWithExternal } from '../shared/Models/loginWithExternal';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSource = new ReplaySubject<User | null>(1)
  user$ = this.userSource.asObservable();


  constructor(private http:HttpClient, private router: Router) { }

  refreshUser(jwt : string | null){
    if(jwt=== null){

      this.userSource.next(null)
      return of(undefined)
    }

    let headers = new HttpHeaders()
    headers = headers.set('Authorization','Bearer ' +  jwt)

    return this.http.get<User>(`${environment.appUrl}/api/account/refresh-user-token`,{headers}).pipe(
      map((user:User)=>{
        if(user){
          this.setUser(user)
        }
      })
    )
  }

  register(model:Register){
    return this.http.post(`${environment.appUrl}/api/account/register`,model)
  }

  login(model : Login){
    // return this.http.post(`${environment.appUrl}/api/account/login`,model)
    return this.http.post<User>(`${environment.appUrl}/api/account/login`,model).pipe(
      map((user:User)=>{
        if(user){
          this.setUser(user)
          
        }
       
      })
    )
  }

  logout(){
    localStorage.removeItem(environment.userKey)
    this.userSource.next(null)
    this.router.navigateByUrl('/')
  }

  confirmEmail(model:ConfirmEmail){
    return this.http.put(`${environment.appUrl}/api/account/confirm-email`,model)
  }

  resendEmailConfirmationLink(email:string){

    return this.http.post(`${environment.appUrl}/api/account/resend-email-confirmation-link/${email}`,{})


  }

  forgotUsernameOrPassword(email:string){

    return this.http.post(`${environment.appUrl}/api/account/forgot-username-or-password/${email}`,{})

  }

  resetPassword(model :ResetPassword){
      return this.http.put(`${environment.appUrl}/api/account/reset-password`,model)
  }




  getJWT(){
    const key= localStorage.getItem(environment.userKey)
    if(key){
      const user:User = JSON.parse(key)
      return user.jwt
    }
    else{
      return null
    }
  }

  

  registerWithThirdParty(model: RegisterWithExternal) {
    return this.http.post<User>(`${environment.appUrl}/api/account/register-with-third-party`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  

  loginWithThirdParty(model: LoginWithExternal) {
    return this.http.post<User>(`${environment.appUrl}/api/account/login-with-third-party`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    )
  }

  private setUser(user : User){
    localStorage.setItem(environment.userKey,JSON.stringify(user))
    this.userSource.next(user)

    // this.user$.subscribe({
    //   next:response=> console.log(response)
    // })

  }
}
