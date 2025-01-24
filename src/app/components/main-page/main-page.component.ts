import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from "../modal/modal.component";
import { Router } from '@angular/router';
import { AuthGoogleService } from '../../services/auth-google.service';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { WebsocketService } from '../../services/websocket.service';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NgFor, NgIf, ModalComponent, ReactiveFormsModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {

    user:any = null
    allUsers:any[] = []

    selectedUser:any = null;
    chatId:any = null;
    chatMessages:any[] = [];

    chats:Map<string, any[]> = new Map();

    isModalOpened = false;

    private authService = inject(AuthGoogleService);
    private userService = inject(UserService);
    private chatService = inject(ChatService);
    private webSocketService = inject(WebsocketService);

    public_channel = '/broadcast/chat';

    chatForm:FormGroup;

    constructor(private router: Router) {
        this.chatForm = new FormGroup({
          message: new FormControl('', [Validators.required])
        })
    }

    ngOnInit() {
      this.userService.user.subscribe({
        next: (res) => {
          this.user = res;
          if(this.user !== null) {
            this.pullUserFromDb();
          }
        }
      })
      setTimeout(() => {
        this.subscribeToPublicChannel();
        this.sendPulicMessage('joined');
      }, 1000);
    }

    isString(val:any) {
      return typeof val === 'string';
    }

    formatTimestamp(timestamp: number[]) {
      let stamp = new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5]);
      let date = stamp.toLocaleDateString();
      let time = String(stamp.getHours()).padStart(2, '0') + ':' + String(stamp.getMinutes()).padStart(2, '0');
      return date + ' - ' + time;
    }


    subscribeToPublicChannel() {
      this.webSocketService.subscribeToChannel(this.public_channel, (payload:any) => {
          let msg = JSON.parse(payload.body);
          let exists = false;
          for(let i = 0; i < this.allUsers.length; i++) {
            if(this.allUsers[i].id === msg.sender.id) {
              exists = true;
              if(msg.originalMessage === 'joined') {
                this.allUsers[i].status = 'online';
              } else if(msg.originalMessage === 'left') {
                this.allUsers[i].status = 'offline';
              }
            }
          }
          if(!exists && msg.sender.id !== this.user.id) {
            this.allUsers.push(msg.sender);
          }
      });
    }

    subscribeToPrivateChannel() {
      let privateChannel = '/unicast/' + this.user.id + '/chat';
      this.webSocketService.subscribeToChannel(privateChannel, (payload:any) => {
        let msg = JSON.parse(payload.body);
        const chat = this.chats.get(msg.chatId);
        if(msg.chatId === this.chatId) {
          this.chatMessages.push(msg);
        } else if (chat) {
          chat.push(msg);
        }
      });
    }

    async sendPulicMessage(content: string) {
      let msg = {
        sender: this.user,
        originalMessage: content
      }
      let sending_channel = '/app/broadcast-message';
      await this.webSocketService.sendMessage(sending_channel, JSON.stringify(msg));
      if(content === 'left') {
        sessionStorage.removeItem('my_token');
        sessionStorage.removeItem('user_id');
        this.router.navigate(['/login']);
      }
    }

    sendPrivateMessage(msg: any) {
      let sending_channel = '/app/unicast-message';
      this.webSocketService.sendMessage(sending_channel, JSON.stringify(msg));
    }

    onUserSelected(other: any) {
      this.selectedUser = other;
      this.chatId = this.user.id < other.id ? this.user.id + '_' + other.id
      : other.id + '_' + this.user.id;
      this.loadChatMessages();
      this.subscribeToPrivateChannel();
    }

    loadChatMessages() {
      this.chatService.getChatMessages(this.chatId).subscribe((res:any) => {
        console.log(res);
        this.chatMessages = res;
        this.chats.set(this.chatId, this.chatMessages);
      })
    }

    formatDateToMatchJava(date:Date) {
      const pad = (num:any, size:any) => String(num).padStart(size, '0');
    
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1, 2); // Months are 0-based
      const day = pad(date.getDate(), 2);
      const hours = pad(date.getHours(), 2);
      const minutes = pad(date.getMinutes(), 2);
      const seconds = pad(date.getSeconds(), 2);
      const milliseconds = pad(date.getMilliseconds(), 3);
    
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}000000`;
    }

    formatForLocal(dateStr:string) {
      let date = dateStr.split('T')[0];
      let time = dateStr.split('T')[1].split('.')[0];
      let year = date.split('-')[0];
      let month = date.split('-')[1];
      let day = date.split('-')[2];
      let hours = time.split(':')[0];
      let minutes = time.split(':')[1];
      let seconds = time.split(':')[2];
      return this.formatTimestamp([Number(year), Number(month), Number(day), Number(hours), Number(minutes), Number(seconds)]);
    }

    resetForm() {
      this.chatForm.reset({
        message: ''
      });
    }

    onSendMessage() {
      let textMsg = this.chatForm.value.message
      this.resetForm();
      let msg = {
        sender: this.user,
        receiver: this.selectedUser,
        originalMessage: textMsg,
        chatId: this.chatId,
        timestamp: this.formatDateToMatchJava(new Date())
      }
      this.chatMessages.push(msg);
      setTimeout(() => {
        if(this.chatMessages.length > 1
          && this.chatMessages[this.chatMessages.length - 2].sender.id === this.user.id
          && this.chatMessages[this.chatMessages.length - 2].originalMessage === textMsg) {
          this.chatMessages.pop();
        } else {
          this.sendPrivateMessage(msg);
        }
      }, 3000);
    }

    get message() {
      return this.chatForm.controls['message'];
    }

    pullUserFromDb() {
      this.userService.claimDbUser(this.user).subscribe({
        next: (res) => {
          this.user = res;
          sessionStorage.setItem('user_id', this.user.id);
          this.getAllUsers();
        },
        error: (err) => {
          console.log(err);
        }
      })
    }

    getAllUsers() {
      this.userService.getAllUsers(this.user.id).subscribe((res:any) => {
        this.allUsers = res;
      })
    }

    openModal(): void {
      this.isModalOpened = true;
    }
  
    closeModal(): void {
      this.isModalOpened = false;
    }

    onConfirmBtnClicked(): void {
      this.isModalOpened = false;
      this.authService.logout();
      this.userService.logout(this.user).subscribe((res) => {
          this.sendPulicMessage('left');
      })
    }

    onCancelBtnClicked(): void {
      this.isModalOpened = false;
    }

}
