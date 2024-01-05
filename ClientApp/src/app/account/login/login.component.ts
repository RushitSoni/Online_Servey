import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted = false;

  errorMessage: string[] = [];

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    
   
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initializeForm()
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
          
         
          this.router.navigateByUrl('/')
          
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
}
