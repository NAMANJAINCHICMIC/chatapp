import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { ChatService } from 'src/app/services/chat.service';
import { ChangeDetectionStrategy } from "@angular/core";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SafePipeModule } from 'safe-pipe';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-chat-body',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollModule ,  SafePipeModule ],
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.css']
})
export class ChatBodyComponent {
  uploadImage : Blob | string=''
  uploadFile : Blob | string=''
  // hubHelloMessage =[];
  throttle = 200;
  distance = 0;
  page = 1;
  // chatMessagedetail :any;
  chatMessagedetail: Array<any> = [] ;
  content?:string;
  fromEmail = this.chatService.senderEmail;
  updatedMessage : any;
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
      // this.chatMessagedetail = [...this.chatMessagedetail,hubHelloMessage]

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
  
  this.imgPath =''
  this.chatService.sendMessage(this.chatService.receiverEmail,1,this.content,this.imgPath)
  this.content = ""
  // this.chatService.getChatMessages(1);
  // this.chatMessagedetail = [...this.chatMessagedetail,this.chatService.messages]
  this.chatMessagedetail.push(this.chatService.messages[0])
  console.log("chatmessagedetail",this.chatMessagedetail)

}
imageUpload(event:any){
  this.uploadImage = event.target.files[0]
 this.formData = new FormData()
  this.formData.append('file',this.uploadImage)

 this.chatService.imageUpload(this.formData).subscribe((res:any)=>{
  console.log(res);
  this.imgPath = res.data
  // console.log(this.imgPath);
  this.chatService.sendImage(this.chatService.receiverEmail,this.imgPath,2,this.content)
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
    this.chatService.sendAllFile(this.chatService.receiverEmail,this.filePath,3,this.content)
    // this.chatService.sendMessage(this.chatService.receiverEmail,3,this.content,this.filePath)

  },
    error => {
      console.log('Upload error:', error);
    })
   
}
onScrollUp(): void {

  if(!(this.chatMessagedetail.length<30))
  this.chatService.getChatMessages(++this.page);
  // console.log("chatmessagedetail",this.chatMessagedetail.length)

    console.log("scrollpageUp",this.page)
    // console.log("scrollpage",this.updatedMessage)
}
onScroll(): void {

  if(this.page > 1)
    this.chatService.getChatMessages(--this.page);

    console.log("scrollpageDown",this.page)
    // console.log("scrollpage",this.updatedMessage)
}
}
