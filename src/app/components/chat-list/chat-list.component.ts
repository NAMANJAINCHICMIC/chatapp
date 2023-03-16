import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-list',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  private searchSubscription?: Subscription;
  userlist = false;
  connectedUsers : any
  searchQuery = '';
  private readonly searchSubject = new Subject<string | undefined>();
  searchResults: Array<any>=[];
  onlineConnectedUser = this.chatService.onlineUsers
  constructor(public chatService: ChatService) { }
  public ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchQuery) => this.chatService.searchUser(searchQuery))
      )
      .subscribe((res) => {

        console.log(res);
        if (res.success) {
          if (res.message === "Users list fetched") {
            this.userlist = true;
            this.searchResults = res.data;
          }
          if (res.message === "No user found") {
            console.log(res.message);
          }
        } else {

          console.log("show errors")
          // this.showError = true;
        }
        console.log("online",this.onlineConnectedUser)
      });
this.connectedUsers = this.chatService.getChat()
console.log(this.connectedUsers)

  }

  onSearchQueryInput(event: Event): void {
     this.searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(this.searchQuery?.trim());
  }

  public ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
  displayUser() {
    this.searchResults
    console.log(this.searchResults)
  }
  selectUser(email:string){
    // console.log(email)
    // console.log("user selected")
    this.chatService.receiverEmail=email;
    this.chatService.createChat();
    // this.searchSubscription?.unsubscribe();
    // this.searchQuery=''
    this.searchResults.length = 0
  }
}
