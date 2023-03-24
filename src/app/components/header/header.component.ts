import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authService : AuthService , private router:Router, ){}
  signOut(){
    this.authService.signOut();
    }
    
    changePassword()
    {
      this.router.navigate(['change-password']);
    
    }
    viewProfile(){
      this.router.navigate(['view-profile']);
    }
    updateProfile(){
      this.router.navigate(['edit-profile']);
    }
    homePage(){
      this.router.navigate(['home']);
    }
}
