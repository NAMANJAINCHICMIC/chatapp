import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { ChatService } from 'src/app/services/chat.service';
import { ChangeDetectionStrategy } from "@angular/core";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SafePipeModule } from 'safe-pipe';
import { DomSanitizer} from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr'
// import { MatIconModule } from '@angular/material/icon'; 
@Component({
  selector: 'app-chat-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollModule ,  SafePipeModule,],
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.css']
})
export class ChatBodyComponent {
  @ViewChild('scrollMe') myScrollContainer!: ElementRef<any>;
  disableScrollDown = false
  uploadImage : Blob | string=''
  imgPath='';
  uploadFile : Blob | string=''
  filePath = '';
  // hubHelloMessage =[];
  throttle = 1000;
  distance = 2;
  page = 1;
  // chatMessagedetail :any;
  chatMessagedetail: Array<any> = [] ;
  content?:string;
  fromEmail = this.chatService.senderEmail;
  // updatedMessage : any;
  // imgTagSrc = ''
  formData = new FormData()
constructor(public chatService: ChatService,private cdref: ChangeDetectorRef , private toastr: ToastrService){
 
  // this.waste = chatService.getChatMessages();
 

  this.chatService.hubHelloMessage.subscribe((hubHelloMessage: Array<Message>) => {
    console.log("constructor",hubHelloMessage)
    
    if((chatService?.receiverEmail=== hubHelloMessage[0]?.receiverEmail||chatService?.receiverEmail=== hubHelloMessage[0]?.senderEmail )){
   
            if(!(hubHelloMessage[0].messageId)){
              // console.log("not push")
              this.chatMessagedetail.push(hubHelloMessage[0])
            }else if(chatService.newChat){
  this.chatMessagedetail = hubHelloMessage;
  chatService.newChat =false;
  this.disableScrollDown = false
}else if(this.chatMessagedetail.length !=0 && (hubHelloMessage[0].messageId) ){
  // this.chatMessagedetail.unshift(hubHelloMessage)
this.chatMessagedetail = [...hubHelloMessage,...this.chatMessagedetail]
}
      console.log("chatmesssage detail",this.chatMessagedetail)
    }
  });
}
ngAfterContentChecked() {
  // this.sampleViewModel.DataContext = this.DataContext;
  // this.sampleViewModel.Position = this.Position;
  this.cdref.detectChanges();
  // this.scrollToBottom();
}
ngOnInit(): void {
  this.chatService.hubHelloMessage.subscribe((hubHelloMessage: any) => {
    console.log(hubHelloMessage)
   
    // this.hubHelloMessage = hubHelloMessage;
    // this.disableScrollDown = false
    // this.scrollToBottom();
  });
 
  // this.chatService.hubConnection
  //   .invoke('Hello')
  //   .catch((error: any) => {
  //     console.log(`SignalrDemoHub.Hello() error: ${error}`);
  //     alert('SignalrDemoHub.Hello() error!, see console for details.');
  //   }
  // );
  this.chatService.notification.subscribe((name:string)=>{
    this.showToasterInfo(name)
  })
}
// ngAfterViewInit() {
//   // this.scrollToBottom();
//   // this.messages.changes.subscribe(this.scrollToBottom);
// }


send(){
  
  this.imgPath =''
  this.chatService.sendMessage(this.chatService.receiverEmail,1,this.content,this.imgPath)
  this.content = ""
  // this.chatService.getChatMessages(1);
  // this.chatMessagedetail = [...this.chatMessagedetail,this.chatService.messages]
  // this.chatMessagedetail.push(this.chatService.messages[0])
  // console.log("chatmessagedetail",this.chatMessagedetail)
  this.disableScrollDown = false
  // this.scrollToBottom();
}
imageUpload(event:any){
  this.uploadImage = event.target.files[0]
 this.formData = new FormData()
  this.formData.append('file',this.uploadImage)

 this.chatService.imageUpload(this.formData).subscribe((res:any)=>{
  console.log(res);
  this.imgPath = res.data.pathToFile
  console.log(this.imgPath);
  this.chatService.sendImage(this.chatService.receiverEmail,this.imgPath,2,this.content)
  // this.chatService.sendImage(this.chatService.receiverEmail,this.filePath)
  this.disableScrollDown = false
  // this.scrollToBottom();
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
    this.filePath = res.data.pathToFile
    this.chatService.sendAllFile(this.chatService.receiverEmail,this.filePath,3,this.content)
    // this.chatService.sendMessage(this.chatService.receiverEmail,3,this.content,this.filePath)
    this.disableScrollDown = false
    // this.scrollToBottom();
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

    const element = this.myScrollContainer.nativeElement
    console.log("scrollpageUp e",element.scrollHeight)

  const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
  console.log("scrollpageUp b",atBottom)
  if (this.disableScrollDown && atBottom) {
      this.disableScrollDown = false
  } else {
      this.disableScrollDown = true
  }
}
// onScroll(): void {

//   // if(this.page > 1)
//   //   // this.chatService.getChatMessages(--this.page);

//   //   console.log("scrollpageDown",this.page)
//     console.log("scrollpage")
// }
onScroll() {
  // const element = this.myScrollContainer.nativeElement
  // const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
  // if (this.disableScrollDown && atBottom) {
  //     this.disableScrollDown = false
  // } else {
  //     this.disableScrollDown = true
  // }
}


scrollToBottom(): void {
  if (this.disableScrollDown) {
      return
  }
 console.log("scroll down")
  this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  
}
showToasterInfo(name:string){
  this.toastr.info("New message received from "+ name)
}
showProfilePic(){
  this.chatService.searchUserByEmail(this.chatMessagedetail[0].senderEmail)
}
}
