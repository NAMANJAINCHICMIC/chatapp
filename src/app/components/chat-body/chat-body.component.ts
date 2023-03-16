import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { ChatService } from 'src/app/services/chat.service';
import { ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'app-chat-body',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.css']
})
export class ChatBodyComponent {
  hubHelloMessage =[];
  chatMessagedetail :any;
  content?:string;
  fromEmail = this.chatService.senderEmail;
  waste :any
  
 
constructor(public chatService: ChatService,private cdref: ChangeDetectorRef){
 
  this.waste = chatService.getChatMessages();
  console.log(this.waste)

  this.chatService.hubHelloMessage.subscribe((hubHelloMessage: Message) => {
    this.chatMessagedetail = hubHelloMessage;
  });
}
ngAfterContentChecked() {
  // this.sampleViewModel.DataContext = this.DataContext;
  // this.sampleViewModel.Position = this.Position;
  this.cdref.detectChanges();
}
ngOnInit(): void {
  this.chatService.hubHelloMessage.subscribe((hubHelloMessage: any) => {
    this.hubHelloMessage = hubHelloMessage;
  });

  // this.chatService.hubConnection
  //   .invoke('Hello')
  //   .catch((error: any) => {
  //     console.log(`SignalrDemoHub.Hello() error: ${error}`);
  //     alert('SignalrDemoHub.Hello() error!, see console for details.');
  //   }
  // );
}

send(){
  
  this.chatService.sendMessage(this.chatService.receiverEmail,this.content)
  this.content = ""
  this.waste = this.chatService.getChatMessages();
  console.log(this.waste)
}
}
