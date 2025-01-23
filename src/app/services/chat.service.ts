import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = 'http://localhost:8080/api/v1/chat';

  constructor(private http:HttpClient) { }

  getChatMessages(chatId: string) {
    return this.http.get(`${this.baseUrl}/get-all-messages?chatId=${chatId}`)
  }
}
