import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
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
  // private hubConnection?: HubConnection;
  onlineUsers: Array<object> = [];
  messages: Message[] = [];
  privateMessages: Message[] = [];
  privateMesageInitiated = false;


  // public hubConnection: signalR.HubConnection | any;
  // public startConnection = (token:string) => {
  //   this.hubConnection = new signalR.HubConnectionBuilder().withUrl(AUTH_API+"hubs/chat", {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets, accessTokenFactory: () => token}).withAutomaticReconnect().build();
  //   this.hubConnection.start().then(() => console.log("connection started")).catch((err:any) => {
  //     console.log("Error while starting connection", err)
  //     // setTimeout(() => {
  //     //   this.startConnection(token);
  //     // }, 2000)
  //   });
  // }
  private hubConnection: signalR.HubConnection | any;
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
  

  // public startConnection() {
  //   this.hubConnection = new HubConnectionBuilder().withUrl(AUTH_API + "hubs/chat", {
  //     skipNegotiation: true,
  //     transport: signalR.HttpTransportType.WebSockets
  //   }).withAutomaticReconnect().build()
  //   this.hubConnection.start().then(() => {
  //     console.log("Connection started ")
  //   }).catch((error: any) => {
  //     console.log(" Error While starting connection " + error);
  //   });
  // }

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

  sendMessage() {

    // this.hubConnection?.invoke("SendMessage", 'hi').catch((error: any) => {
    //   console.log('error of send');
    // });
    const inputmsg: InputMessage = {

      ReceiverEmail : "rakesh.kumar23@chicmic.co.in",
      Content : "helooo bro"

    };
    this.hubConnection?.send("SendMessage",inputmsg).catch((error:any)=>{
      console.log('error of send');
    });
    console.log(inputmsg)
  }

  sendMessageListener() {
    // this.hubConnection?.on("recieveMessage",(someText :string)=>{
    //     console.log(someText);
    // })
    this.hubConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });
 this.hubConnection?.on('ReceivedMessage', (someText: any) => {
      //this.messages = [...this.messages, newMessage];
      console.log("recevied",someText);
    })
    this.hubConnection.on('UpdateOnlineUsers', (onlineUsers:any) => {
      this.onlineUsers = [...onlineUsers];
    });

  }


  constructor(private http: HttpClient,) {
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



  // stopChatConnection() {
  //   this.hubConnection?.stop().catch((err:any)=> {console.log(err)});
  // }

  // Chathub method triggers comes here
  // async addUserConnectionId() {
  //   return this.hubConnection?.invoke('AddUserConnectionId', this.senderEmail)
  //     .catch((err: any) => { console.log(err) });
  // }

  //   async sendMessage(content: string) {
  //     const message: Message = {
  //       from: this.myName,
  //       content
  //     };

  //     return this.hubConnection?.invoke('ReceiveMessage', message)
  //       .catch((err:any)=> {console.log(err)});
  //   }
  //   async GetChats(content: string) {
  //     const userList: UserList = {
  //       // from: this.myName,
  //       // content
  //     };

}