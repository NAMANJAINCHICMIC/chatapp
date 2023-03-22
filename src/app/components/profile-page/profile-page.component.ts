import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: 'app-profile-page',
    standalone: true,
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
    imports: [CommonModule, HeaderComponent]
})
export class ProfilePageComponent implements OnInit {
  myself:any;
  constructor(private authService : AuthService){}
  ngOnInit(): void {
  this.authService.userProfile().subscribe((res:any)=>{
    this.myself =res.data
    console.log(res);
    console.log(this.myself);
  })
  }

}
