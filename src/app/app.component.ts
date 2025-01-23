import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPageComponent } from "./components/main-page/main-page.component";
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kamechat-frontend';

  private webSocketService = inject(WebsocketService);

  constructor() {
    this.webSocketService.connect();
  }
}
