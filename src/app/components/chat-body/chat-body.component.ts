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
  uploadImage : Blob | string=''
  uploadFile : Blob | string=''
  // hubHelloMessage =[];
  chatMessagedetail :any;
  content?:string;
  fromEmail = this.chatService.senderEmail;

  imgTagSrc = ''
imgPath='';
filePath = '';
  formData = new FormData()
constructor(public chatService: ChatService,private cdref: ChangeDetectorRef){
 
  // this.waste = chatService.getChatMessages();


  this.chatService.hubHelloMessage.subscribe((hubHelloMessage: Array<Message>) => {
    console.log("constructor",hubHelloMessage)
    if((chatService.receiverEmail=== hubHelloMessage[0].receiverEmail||chatService.receiverEmail=== hubHelloMessage[0].senderEmail )){

      this.chatMessagedetail = hubHelloMessage;
    }
  });
}
ngAfterContentChecked() {
  // this.sampleViewModel.DataContext = this.DataContext;
  // this.sampleViewModel.Position = this.Position;
  this.cdref.detectChanges();
}
ngOnInit(): void {
  this.chatService.hubHelloMessage.subscribe((hubHelloMessage: any) => {
    console.log(hubHelloMessage)
   
    // this.hubHelloMessage = hubHelloMessage;
   
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
  
  this.chatService.sendMessage(this.chatService.receiverEmail,1,this.content)
  this.content = ""
  this.chatService.getChatMessages();

}
imageUpload(event:any){
  this.uploadImage = event.target.files[0]
 this.formData = new FormData()
  this.formData.append('file',this.uploadImage)

 this.chatService.imageUpload(this.formData).subscribe((res:any)=>{
  console.log(res);
  this.imgPath = res.data
  // console.log(this.imgPath);
  this.chatService.sendMessage(this.chatService.receiverEmail,2,this.content,this.imgPath)
  // this.chatService.sendImage(this.chatService.receiverEmail,this.filePath)
},
  error => {
    console.log('Upload error:', error);
  })

}
fileUpload(event :any){
 
  this.uploadFile = event.target.files[0]
  this.formData = new FormData()
    this.formData.append('file',this.uploadFile)
   
  this.chatService.fileUpload(this.formData).subscribe((res:any)=>{
    console.log("data",res);
    this.filePath = res.data
   
    this.chatService.sendMessage(this.chatService.receiverEmail,3,this.content,this.filePath)

  },
    error => {
      console.log('Upload error:', error);
    })
   
}
}
