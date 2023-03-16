import { APP_INITIALIZER, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import {  Router, RouterModule } from '@angular/router';
import { ChatListComponent } from '../components/chat-list/chat-list.component';

import { ChatBodyComponent } from '../components/chat-body/chat-body.component';
import { ChatService } from '../services/chat.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [
    ChatService,
    {
      provide: APP_INITIALIZER,
      useFactory: (chatService: ChatService) => () => chatService.initiateSignalrConnection(chatService.tokenValue),
      deps: [ChatService],
      multi: true,
    }
  ],
  imports: [CommonModule,RouterModule,ChatBodyComponent,ChatListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName = ""
  tokenValue = localStorage.getItem('token');
  searchUserDataSubscription?: Subscription;
  searchUserDataSubject = new Subject<string | undefined>();
  constructor(private authService : AuthService , private router:Router, private chatService:ChatService){
    // console.log("token", this.tokenValue)
    const curr =  this.router.getCurrentNavigation();
        const state = curr?.extras.state as {
         'email' : string
        }
        chatService.senderEmail = state.email
        console.log(chatService.senderEmail)

        this.chatService.initiateSignalrConnection(this.tokenValue);
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    // const userData = this.chatService.searchUserByEmail(this.chatService.senderEmail)
    // console.log("userIfo",userData)
    // this.searchUserDataSubscription = userData
    //   .subscribe((res) => {

    //     console.log(res);
    //     if (res.success) {
    //        this.userName = res.firstName
    //     } else {

    //       console.log("show errors")
    //       // this.showError = true;
    //     }
    //     // console.log("online",this.onlineConnectedUser)
    //   });
        console.log("online")
  }
signOut(){
this.authService.signOut();
}

changePassword()
{
  this.router.navigate(['change-password']);

}

title = 'chat_App';

}
