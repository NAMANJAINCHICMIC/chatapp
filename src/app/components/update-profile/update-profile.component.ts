import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule ,Router} from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {HttpClient, HttpClientModule}from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { HeaderComponent } from "../header/header.component";
import { environment } from 'src/environment';

@Component({
    selector: 'app-update-profile',
    standalone: true,
    providers: [HttpClientModule, AuthService],
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.css'],
    imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, HeaderComponent]
})
export class UpdateProfileComponent implements OnInit{
  updateProfileForm: FormGroup<{
    firstName: FormControl<string | null>,
    lastName: FormControl<string | null>,
    // email: FormControl<string | null>,
    phone: FormControl<string | null>,
   
    dateOfBirth: FormControl<any>,
    pathToProfilePic: FormControl<string | null>
}>;
  myself:any;
  uploadImage : Blob | string=''
  imgPath='';
  visible=true;
  showError= false;
  validateDateOfbirth = false
  viewPassword(){
    this.visible = !this.visible;
  }
  constructor(private router: Router , private http: HttpClient,private authService: AuthService,private chatService: ChatService){
    this.updateProfileForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required , Validators.minLength(3)]),
        lastName: new FormControl('', [Validators.required , Validators.minLength(3)]),
        // email: new FormControl('', [Validators.required,Validators.email]),
        phone: new FormControl('',[Validators.required , Validators.minLength(10),Validators.pattern("^[6-9]\\d{9}$")]),
       
        dateOfBirth: new FormControl('', Validators.required ),
        pathToProfilePic:new FormControl('')
      }
    )
  }
  
  ngOnInit(): void {
    this.authService.userProfile().subscribe((res:any)=>{
      this.myself =res.data
      console.log(res);
      this.updateProfileForm = new FormGroup(
        {
          firstName: new FormControl(this.myself.firstName, [Validators.required , Validators.minLength(3)]),
          lastName: new FormControl(this.myself.lastName, [Validators.required , Validators.minLength(3)]),
          // email: new FormControl(''),
          phone: new FormControl(this.myself.phone,[Validators.required , Validators.minLength(10),Validators.pattern("^[6-9]\\d{9}$")]),
          dateOfBirth: new FormControl(this.myself.dateOfBirth),
          pathToProfilePic:new FormControl(this.myself.pathToProfilePic)
        }
      )
      // console.log(this.myself);
    })
    }
  // form: any = {
  //   firstName: null,
  //   lastName: null,
  //   email: null,
  //   password: null,
  //   phone:null,
  //   dateOfBirth:null
  // };

get controlName(){
  return this.updateProfileForm.controls;
}
// onClick(){
//   this.router.navigateByUrl("/sign-in");
// }
onSubmit(){
  if (this.updateProfileForm.valid ) {
    console.log('form submitted');

  const { firstName , lastName, phone,dateOfBirth, pathToProfilePic} = this.updateProfileForm.value
  console.log(this.updateProfileForm.value);
  // this.updateProfileForm.value.email="string";
  this.authService.updateUserProfile(this.updateProfileForm.value).subscribe(
    (res)=>{
      console.log(res)
      alert(res.message);
      if(res.success){

        // this.updateProfileForm.reset();
        // this.authService.storeToken(res.data.token);
        // this.authService.storeEmail(res.data.email);
        this.router.navigate(['home']);
      }
    }
  );
  // this.authService.register(this.updateProfileForm.value).subscribe();
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
imageUpload(event:any){
  this.uploadImage = event.target.files[0]
 const formData = new FormData()
  formData.append('file',this.uploadImage)

 this.chatService.imageUpload(formData).subscribe((res:any)=>{
  console.log(res);
  this.updateProfileForm.value.pathToProfilePic =  environment.AUTH_API +res.data.pathToFile
  // PathToFileAttachment = AUTH_API + PathToFileAttachment;
  // this.imgPath = res.data
  // console.log(this.imgPath);
  // this.chatService.sendImage(this.chatService.receiverEmail,this.imgPath,2,this.content)
  // this.chatService.sendImage(this.chatService.receiverEmail,this.filePath)
},
  (error:any) => {
    console.log('Upload error:', error);
  })

}


}
