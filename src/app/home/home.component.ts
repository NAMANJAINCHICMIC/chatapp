import { APP_INITIALIZER, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import {  Router, RouterModule } from '@angular/router';
import { ChatListComponent } from '../components/chat-list/chat-list.component';

import { ChatBodyComponent } from '../components/chat-body/chat-body.component';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [
    ChatService,
    {
      provide: APP_INITIALIZER,
      useFactory: (chatService: ChatService) => () => chatService.initiateSignalrConnection(),
      deps: [ChatService],
      multi: true,
    }
  ],
  imports: [CommonModule,RouterModule,ChatBodyComponent,ChatListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private authService : AuthService , private router:Router, private chatService:ChatService){
    const curr =  this.router.getCurrentNavigation();
        const state = curr?.extras.state as {
         'email' : string
        }
        chatService.senderEmail = state.email
        // console.log(chatService.senderEmail)
  }
signOut(){
this.authService.signOut();
}

changePassword()
{
  this.router.navigate(['change-password']);

}
ngOnInit(): void {
  this.chatService.initiateSignalrConnection();
  
  setTimeout(()=>{
    this.chatService.sendMessageListener();
    this.chatService.sendMessage();
  },5000)
}
title = 'chat_App';

ngOnDestroy(): void {
  // this.chatService._hubConnection?.off("recieveMessage")
  console.log();
}
}
