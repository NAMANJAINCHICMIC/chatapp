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
  tokenValue = localStorage.getItem('token');
  onlineUsers: Array<any> = [];
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

//   private hubConnection : signalR.HubConnection | any;
//     public startConnection = (token:string) => {
//       this.hubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7256/chart", {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets, accessTokenFactory: () => token}).withAutomaticReconnect().build();
//       this.hubConnection.start().then(() => console.log("connection started")).catch((err:any) => {
//         console.log("Error while starting connection", err)
//         // setTimeout(() => {
//         //   this.startConnection(token);
//         // }, 2000)
//       });
//     }
// ah implement krlia
  stopChatConnection() {
    this.hubConnection?.stop().catch((error: any) => console.log(error));
  }
  public async initiateSignalrConnection(token:any): Promise<void> {
    try {

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(AUTH_API + "chatHubs",
          { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets , accessTokenFactory: () => token})
        .withAutomaticReconnect().build();
      await this.hubConnection.start();
      console.log("connection started");

      this.sendMessageListener();
    }
    catch (err: any) {
      console.log("Error while starting connection", err);
      // setTimeout(() => {
      //   this.startConnection(token);
      // }, 2000)
    }
  }





  sendMessage(to: string, Content?: string) {


    const inputmsg: InputMessage = {

      ReceiverEmail: to,
      Content

    };
    this.hubConnection?.send("SendMessage", inputmsg).catch((error: any) => {
      console.log('error of sendMessage');
    });
    console.log(inputmsg)
  }

  createChat() {
    this.hubConnection?.send("CreateChat", this.receiverEmail).catch((error: any) => {
      console.log('error of createChat');
    });
    console.log("create chat with ", this.receiverEmail)
    this.getChatMessages()
  }
  getChatMessages() {
    const message = this.hubConnection?.invoke("GetChatMessages", this.receiverEmail, 1).catch((error: any) => {
      console.log('error of getChatMessages');
    });
    // this.hubHelloMessage.next(message);
    return message
  }
  getChat() {
    return this.hubConnection?.invoke("GetChat").catch((error: any) => {
      console.log('error of getChat');
    });
  }


  sendMessageListener() {

    this.hubConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });
    this.hubConnection?.on('ReceivedMessage', (someText: any) => {
      //this.messages = [...this.messages, newMessage];
      console.log("recevied Message", someText);
      if (someText.senderEmail === this.receiverEmail){
        this.getChatMessages()
      }
    })
    this.hubConnection.on('UpdateOnlineUsers', (onlineUsers: any) => {
      this.onlineUsers = [...onlineUsers];
      console.log("onlineUsers", onlineUsers);
    });
    this.hubConnection?.on('ChatCreated', (someText: any) => {

      console.log("ChatCreated", someText);
      // this.getChat()
    })
    this.hubConnection?.on('RecievedChatMessages', (someText: Array<object>) => {

      console.log("RecievedChatMessages", someText);
      this.hubHelloMessage.next(someText);
    })
    this.hubConnection?.on('ReceivedChats', (someText: any) => {

      console.log("ReceivedChats", someText);

    })

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
  // searchUserByEmail(data: string | null | undefined): Observable<any> {

  //   return this.http.get(
  //     AUTH_API + 'api/v1/users/get' + '?Email=' + data,

  //     httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         'Authorization': "Bearer " + localStorage.getItem('token')

  //       })
  //     }
  //   );
  // }
  
  async addUserConnectionId() {
    return this.hubConnection?.send('AddUserConnectionId', this.senderEmail)
      .catch((error: any) => console.log("addUserConnectionId show erorr",error));
  }


}