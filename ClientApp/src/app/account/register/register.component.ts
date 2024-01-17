import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/Models/user';
import { CredentialResponse } from 'google-one-tap';
import { jwtDecode} from 'jwt-decode';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  @ViewChild('googleButton',{static:true})  googleButton : ElementRef = new ElementRef({})

  registerForm : FormGroup =new FormGroup({})
  submitted=false

  errorMessage:string[]=[]



  constructor(private accountService : AccountService,private formBuilder : FormBuilder,private sharedService : SharedService, private router : Router,private renderer2:Renderer2,
    @Inject(DOCUMENT) private _document:Document){

        this.accountService.user$.pipe(take(1)).subscribe({
          next:(user : User | null)=>{

            if(user){
              this.router.navigateByUrl('/')
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
   
  initializeForm(){

    this.registerForm = this.formBuilder.group({
      firstName:['',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]],
      lastName:['',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]],
      email:['',[Validators.required]],//Validators.pattern("")
      password:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]]
    })

  }

  register(){
    this.submitted=true
    this.errorMessage=[]

    if(this.registerForm.valid){


      this.accountService.register(this.registerForm.value).subscribe({
        next:(response:any)=>{
          console.log(response.title)
          this.sharedService.showNotification(true, response.value.title,response.value.message)
          this.router.navigateByUrl('/account/login')
          console.log(response)
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

        this.router.navigateByUrl(`/account/register/third-party/google?access_token=${response.credential}&userId=${decodedToken.sub}`)
  }
}
