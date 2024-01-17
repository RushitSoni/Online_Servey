import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { take } from 'rxjs';
import { User } from 'src/app/shared/Models/user';
import { DOCUMENT } from '@angular/common';
import { CredentialResponse } from 'google-one-tap';
import { jwtDecode } from 'jwt-decode';
import { LoginWithExternal } from 'src/app/shared/Models/loginWithExternal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('googleButton',{static:true})  googleButton : ElementRef = new ElementRef({})
  loginForm: FormGroup = new FormGroup({});
  submitted = false;

  errorMessage: string[] = [];
  returnUrl:string | null=null

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService:SharedService,
   
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer2:Renderer2,
    @Inject(DOCUMENT) private _document:Document
  ) {

    this.accountService.user$.pipe(take(1)).subscribe({
      next:(user:User | null)=>{
        if(user){
          this.router.navigateByUrl('/')
        }
        else{
            this.activatedRoute.queryParamMap.subscribe({
              next:(params : any)=>{
                if(params){
                  this.returnUrl = params.get('returnUrl')
                }
              }
            })
        }
      }
    })
  }
  ngOnInit(): void {
    this.initializeGoogleButton()
    this.initializeForm()
  }
  ngAfterViewInit(){
    const script1=this.renderer2.createElement('script')
    script1.src='https://accounts.google.com/gsi/client'
    script1.async='true'
    script1.defer='true'
    this.renderer2.appendChild(this._document.body,script1)
  }
   

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      userName: [
        '',
        [
          Validators.required,
         
        ],
      ],
     
      password: [
        '',
        [
          Validators.required,
         
        ],
      ],
    });
  }

  login(){
    this.submitted=true
    this.errorMessage=[]

    if(this.loginForm.valid){


      this.accountService.login(this.loginForm.value).subscribe({
        next:(response:any)=>{
          
          // console.log(response)

          if(this.returnUrl){
            this.router.navigateByUrl(this.returnUrl)
          }
          else{
            this.router.navigateByUrl('/')
          
          }
          
        },
        error: error =>{
  
          console.log(error)
          if(error.error.errors){
            this.errorMessage=error.error.errors
          }
          else{
            this.errorMessage.push(error.error)
          }
  
        }
        
      })

      
  
      //console.log(this.registerForm.value)

    }



  }

  resendEmailConfirmationLink(){
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link')
  }

  private initializeGoogleButton(){
    (window as any).onGoogleLibraryLoad = ()=>{

      //@ts-ignore

      google.accounts.id.initialize({
        client_id:'476915189475-pggc8ml41s2gor0l5thi1rct38lt1pt2.apps.googleusercontent.com',
        callback:this.googleCallBack.bind(this),
        auto_select:false,
        cancel_on_tap_outside:true
      })

      //@ts-ignore

      google.accounts.id.renderButton(
        this.googleButton.nativeElement,
        {
          size:'medium',shape:'rectangular',text:'signin_with',logo_alignment:'center'
        }
      )
      
  }}

  private  async googleCallBack(response: CredentialResponse){
        // console.log(response.credential)

        const decodedToken: any = jwtDecode(response.credential)

        this.accountService.loginWithThirdParty(new LoginWithExternal(response.credential,decodedToken.sub,"google"))
        .subscribe({
          next: _ => {
            if (this.returnUrl) {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigateByUrl('/');
            }
          }, error: error => {
            this.sharedService.showNotification(false, "Failed", error.error);
          }
  
        })
  }
}
