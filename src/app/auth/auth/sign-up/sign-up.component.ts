import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  visible=true;
  showError= false;
  validateDateOfbirth = false
  viewPassword(){
    this.visible = !this.visible;
  }
  constructor(private router: Router , private http: HttpClient,private authService: AuthService){}
  
  form: any = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    phone:null,
    dateOfBirth:null
  };
  registrationForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required , Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required , Validators.minLength(3)]),
      email: new FormControl('', [Validators.required,Validators.email]),
      phone: new FormControl('',[Validators.required , Validators.minLength(10),Validators.pattern("^[6-9]\\d{9}$")]),
      // phone: new FormControl('',[Validators.required , Validators.minLength(10), Validators.maxLength(15)]),
      // password: new FormControl('',[Validators.required ,Validators.pattern("^[1-9]$|^[1-9][0-9]$|^(100)$")]),
      password: new FormControl('',[Validators.required , Validators.minLength(8),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]),
      dateOfBirth: new FormControl('', Validators.required ),
    }
  )
get controlName(){
  return this.registrationForm.controls;
}
onClick(){
  this.router.navigateByUrl("/sign-in");
}
onSubmit(){
  if (this.registrationForm.valid && !this.validateDateOfbirth) {
    console.log('form submitted');

  const { firstName , lastName, email, password,phone,dateOfBirth} = this.registrationForm.value
  console.log(this.registrationForm.value);

  this.authService.register(firstName, lastName, email, password,phone,dateOfBirth).subscribe(
    (res)=>{
      console.log(res)
      alert(res.message);
      if(res.success){

        this.registrationForm.reset();
        this.authService.storeToken(res.data.token);
        this.authService.storeEmail(res.data.email);
        this.router.navigate(['home']);
      }
    }
  );
  // this.authService.register(this.registrationForm.value).subscribe();
} else {
  // validate all form fields
  console.log("show errors")
  this.showError = true;
}
}
validateDOB(e: Event){
 
  const year = new Date((e.target as HTMLInputElement).value).getFullYear();
  const today = new Date().getFullYear();

  if( (today-year) < 12 || (today -year)>100){
    //Code Something
    this.validateDateOfbirth= true
    
    // console.log("dob" , this.validateDateOfbirth)
  }else{
    this.validateDateOfbirth = false
  }
  // console.log("dob" , this.validateDateOfbirth)

}


}
