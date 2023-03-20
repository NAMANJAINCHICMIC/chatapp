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
  receiverName = '';
  senderEmail?: string | null;
  tokenValue = localStorage.getItem('token');
  onlineUsers: Array<any> = [];
  messages: Array<object> = [];
  privateMessages: Message[] = [];
  privateMesageInitiated = false;
  page = 1;
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
  public async initiateSignalrConnection(token: any): Promise<void> {
    try {

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(AUTH_API + "chatHubs",
          { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets, accessTokenFactory: () => token })
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





  sendMessage(to: string,Type:number, Content?: string,PathToFileAttachment?: string) {


    const inputmsg: InputMessage = {

      ReceiverEmail: to,
      Type: Type,
      Content,
      // PathToFileAttachment: PathToFileAttachment
    };
    this.hubConnection?.send("SendMessage", inputmsg,PathToFileAttachment).catch((error: any) => {
      console.log('error of sendMessage');
    });
    // console.log(inputmsg)
  }

  sendImage(ReceiverEmail: string, PathToFileAttachment: string ,Type:number,Content ?: string) {

    PathToFileAttachment = AUTH_API + PathToFileAttachment;
    const inputmsg: InputMessage = {

      ReceiverEmail: ReceiverEmail,
      Content: '',
      Type: 2,
      // PathToFileAttachment: PathToFileAttachment
    };
    this.hubConnection?.send("SendMessage",  inputmsg , PathToFileAttachment).catch((error: any) => {
      console.log('error of sendMessage');
    });
    // console.log(inputmsg)
  }

  sendAllFile(ReceiverEmail: string, PathToFileAttachment: string ,Type:number,Content ?: string) {

    PathToFileAttachment = AUTH_API + PathToFileAttachment;
    const inputmsg: InputMessage = {

      ReceiverEmail: ReceiverEmail,
      Content: '',
      Type: 3,
      // PathToFileAttachment: ""
    };
    this.hubConnection?.send("SendMessage", inputmsg , PathToFileAttachment).catch((error: any) => {
      console.log('error of sendMessage');
    });
    // console.log(inputmsg)
  }

  createChat() {
    this.hubConnection?.send("CreateChat", this.receiverEmail).catch((error: any) => {
      console.log('error of createChat');
    });
    console.log("create chat with ", this.receiverEmail)
    this.getChatMessages(1)
    // this.getChatMessages(this.page)
  }
  getChatMessages(page: number) {
    // const message = this.hubConnection?.invoke("GetChatMessages", this.receiverEmail, page).catch((error: any) => {
      if(typeof(this.receiverEmail) != (null || undefined)){

        this.hubConnection?.send("GetChatMessages", this.receiverEmail, page).catch((error: any) => {
          console.log('error of getChatMessages');
        });
      }else if(page>1){--page}
    // this.hubHelloMessage.next(message);
    // return message
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
    this.hubConnection?.on('ReceivedMessage', (newMessage: object) => {
      // this.messages = [...this.messages, newMessage];
      this.messages = [newMessage];
      console.log("recevied Message", newMessage);
      console.log('new message',this.messages)
      // if (someText.senderEmail === this.receiverEmail) {
      //   this.getChatMessages(1)
      // }
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
    this.hubConnection?.on('refresh', (someText: any) => {

      console.log("refresh", someText);
      this.hubConnection?.send("OnlineUsers").catch((error: any) => {
        console.log('error of OnlineUsers');
      });

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
  userData(): Observable<any> {

    return this.http.get(
      AUTH_API + 'api/v1/users/get',

      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.getItem('token')

        })
      }
    );
  }
  searchUserByEmail(data: string | null | undefined): Observable<any> {

    return this.http.get(
      AUTH_API + 'api/v1/users/get' + '?Email=' + data,

      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.getItem('token')

        })
      }
    );
  }

  async addUserConnectionId() {
    return this.hubConnection?.send('AddUserConnectionId', this.senderEmail)
      .catch((error: any) => console.log("addUserConnectionId show erorr", error));
  }
  fileUpload(file: FormData): Observable<any> {

    return this.http.post(
      AUTH_API + 'api/v1/uploadFile' + '?type=3', file,

    );
  }
  imageUpload(file: any): Observable<any> {

    const params = {
      type: 2,

    }
    return this.http.post(

      AUTH_API + 'api/v1/uploadFile', file, { params: params }
    );
  }

}