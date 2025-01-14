import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
    now = new Date();
    date: String;
    time: String;

    constructor() {
        this.date = this.now.toLocaleDateString();
        this.time = String(this.now.getHours()).padStart(2, '0') + ':' + String(this.now.getMinutes()).padStart(2, '0');
    }

}
