import { Injectable } from '@angular/core';
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socket:WebSocket;
  stompClient:Client;
  baseUrl = 'http://localhost:8080/ws';

  constructor() {
    this.socket = new SockJS(this.baseUrl);
    this.stompClient = over(this.socket);
  }

  connect() {
    this.stompClient.connect({}, this.onConnected, this.onError);
  }

  onConnected(frame:any) {
    console.log('Connected: ' + frame);
  }

  onError(error: any) {
    console.log('Error: ' + error);
  }

  disconnect() {
    this.stompClient.disconnect(this.onDisconnected);
  }

  onDisconnected() {
    console.log('Disconnected');
  }

  subscribeToChannel(channel: string, callback: any) {
    this.stompClient.subscribe(channel, callback);
  }

  sendMessage(channel: string, message: any) {
    this.stompClient.send(channel, {}, message);
  }
}
