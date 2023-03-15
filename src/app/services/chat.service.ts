import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message';
import { UserList } from '../models/userList';
import { InputMessage } from '../models/input-message';


 //const AUTH_API = 'http://192.180.2.128:5050/'
const AUTH_API = 'http://192.180.0.192:4040/'
// const AUTH_API = 'http://192.180.0.127:4040/'
let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //  'Authorization': "Bearer "+ tokenValue

  })
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  myName = '';
  receiverEmail = '';
  senderEmail = '';
 
  onlineUsers: string[] = [];
  messages: Message[] = [];
  privateMessages: Message[] = [];
  privateMesageInitiated = false;

  hubHelloMessage: BehaviorSubject<any>;

  public hubConnection: signalR.HubConnection | any;

  constructor(private http: HttpClient,) {
    this.hubHelloMessage = new BehaviorSubject<any>('');
    const tokenValue = localStorage.getItem('token');
    if (tokenValue) {

      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + tokenValue

        })
      };
    }
  }

  stopChatConnection() {
    this.hubConnection?.stop().catch((error: any) => console.log(error));
  }
  public async initiateSignalrConnection(): Promise<void> {
    try {
 
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(AUTH_API+"chatHubs", 
    { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
    .withAutomaticReconnect().build();
    await this.hubConnection.start();
    console.log("connection started");
  
    this.sendMessageListener();
  }
    catch(err: any) {
      console.log("Error while starting connection", err);
      // setTimeout(() => {
      //   this.startConnection(token);
      // }, 2000)
    }
  }
  



  // receiving commands from chathub
  //   this.hubConnection.on('UserConnected', () => {
  //     this.addUserConnectionId();
  //     setTimeout(()=>{
  //       this.hubConnection?.invoke("SendMessage",{ReceiverEmail:'test@yopmail.com',Content:'This is my first message....'}).catch((error:any)=>{
  //         console.log('error of send on connection');
  //  });
  //     },2000)
  //   });

  // this.hubConnection.on('UpdateOnlineUsers', (onlineUsers:any) => {
  //   this.onlineUsers = [...onlineUsers];
  // });



  // this.hubConnection?.invoke("SendMessage",'hi').catch((error:any)=>{
  //       console.log('error of send');
  //     });

  sendMessage(to: string, Content?: string) {

  
    const inputmsg: InputMessage = {

      ReceiverEmail : to,
      Content 

    };
    this.hubConnection?.send("SendMessage",inputmsg).catch((error:any)=>{
      console.log('error of send');
    });
    console.log(inputmsg)
  }
//   CreateChat(string ToMail)

// GetChatMessages(string OtherMail, int pageNumber)

// .invoke functions


// List<OutputChatMappings> GetChats()
createChat(){
  this.hubConnection?.send("CreateChat",this.receiverEmail).catch((error:any)=>{
    console.log('error of send');
  });
  console.log("create chat with ", this.receiverEmail)
}
getChatMessages(){
  const message =  this.hubConnection?.invoke("GetChatMessages",this.receiverEmail,1).catch((error:any)=>{
    console.log('error of send');
  });
  // this.hubHelloMessage.next(message);
  return message
}
getChat(){
  return this.hubConnection?.invoke("GetChat").catch((error:any)=>{
    console.log('error of send');
  });
}


  sendMessageListener() {

    this.hubConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });
 this.hubConnection?.on('ReceivedMessage', (someText: any) => {
      //this.messages = [...this.messages, newMessage];
      console.log("recevied Message",someText);
    })
    this.hubConnection.on('UpdateOnlineUsers', (onlineUsers:any) => {
      this.onlineUsers = [...onlineUsers];
      console.log("onlineUsers",onlineUsers);
    });
    this.hubConnection?.on('ChatCreated', (someText: any) => {

      console.log("ChatCreated",someText);
    })
    this.hubConnection?.on('RecievedChatMessages', (someText: Array<object>) => {
 
      console.log("RecievedChatMessages",someText);
      this.hubHelloMessage.next(someText);
    })
    this.hubConnection?.on('ReceivedChats', (someText: any) => {
 
      console.log("ReceivedChats",someText);
    
    })
    
  }
//   demo(){
// //     ChatCreated  -- params - responsemodel

// // RecievedChats  -- params - list of OutputChatMappings

// // RecievedChatMessages  --params  --list of OutputMessages
// this.hubConnection?.on('ReceivedChats', (someText: any) => {
 
//   console.log("ReceivedChats",someText);
// })
// this.hubConnection?.on('ChatCreated', (someText: any) => {

//   console.log("ChatCreated",someText);
// })
// this.hubConnection?.on('RecievedChatMessages', (someText: any) => {
 
//   console.log("RecievedChatMessages",someText);
//   this.hubHelloMessage.next(someText);
// })

//   }




  searchUser(data: string | null | undefined): Observable<any> {

    return this.http.get(
      AUTH_API + 'api/v1/users/get' + '?searchString=' + data,

      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.getItem('token')

        })
      }
    );
  }
  async addUserConnectionId() {
    return this.hubConnection?.invoke('AddUserConnectionId', this.senderEmail)
      .catch((error:any) => console.log(error));
  }


}