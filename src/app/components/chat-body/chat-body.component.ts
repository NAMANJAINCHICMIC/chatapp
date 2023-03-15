import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-body',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.css']
})
export class ChatBodyComponent {
  content?:string;
  fromEmail = this.chatService.senderEmail;
  messages = [
    {
      mContent  :"lorem35 djkdgfid gfid fodfhldn fidhflh f ",
      SenderEmail : "h@gamil.com",
      ReceiverEmail: "namanjainoswal@gmail.com",
      DateTime: "11:00"
    },
    {
      mContent  :"lore46 fid gfid fodfhldn fidhflh f ",
      SenderEmail : "namanjainoswal@gmail.com",
      ReceiverEmail: "h@gmail.com",
      DateTime: "12:00"
    }
  ];
constructor(public chatService: ChatService){

}


send(){
  
  console.log(this.fromEmail)
  console.log(this.content)
  this.content = ""
}
}
