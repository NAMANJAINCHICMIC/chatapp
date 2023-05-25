import { APP_INITIALIZER, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import {  Router, RouterModule } from '@angular/router';
import { ChatListComponent } from '../components/chat-list/chat-list.component';

import { ChatBodyComponent } from '../components/chat-body/chat-body.component';
import { ChatService } from '../services/chat.service';
import { Subject, Subscription } from 'rxjs';
import { HeaderComponent } from "../components/header/header.component";

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
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [CommonModule, RouterModule, ChatBodyComponent, ChatListComponent, HeaderComponent]
})
export class HomeComponent implements OnInit {
  userName = ""
  userData :any
  tokenValue = localStorage.getItem('token');
  searchUserDataSubscription?: Subscription;
  searchUserDataSubject = new Subject<string | undefined>();

  constructor(private authService : AuthService , private router:Router, private chatService:ChatService){
    // console.log("token", this.tokenValue)
    // const curr =  this.router.getCurrentNavigation();
    //     const state = curr?.extras.state as {
    //      'email' : string
    //     }
        this.chatService.senderEmail = localStorage.getItem('email')
        // console.log(chatService.senderEmail)

        this.chatService.initiateSignalrConnection(this.tokenValue);

    //     console.log(this.chatService.senderEmail)
    //     this.chatService.searchUserByEmail(this.chatService.senderEmail)
    //  .subscribe(
    //      (res:any) => {
    //        console.log(res);
    //        if (res.success) {
    //           this.userName = res.firstName
    //        } else {
    //          console.log("show errors")          
    //        }
          
    //      }
    //      )
        //  ;
  }
  ngOnInit(): void {
    // this.chatService.userData()
    // .subscribe(
    //     (res:any) => {
    //       console.log(res);
    //       if (res.success) {
    //          this.userName = res.firstName
    //       } else {
    //         console.log("show errors")          
    //       }
         
    //     }
    //     )
    //  console.log(this.chatService.senderEmail)
 
  //     ;
        // console.log(this.searchUserDataSubscription)
        console.log(this.userName)
  }

  ngDestroy(){
    this.chatService.stopChatConnection();
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
