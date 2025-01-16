import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NgFor, NgIf, ModalComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
    now = new Date();
    date: String;
    time: String;

    isModalOpened = false;

    constructor() {
        this.date = this.now.toLocaleDateString();
        this.time = String(this.now.getHours()).padStart(2, '0') + ':' + String(this.now.getMinutes()).padStart(2, '0');
    }

    openModal(): void {
      this.isModalOpened = true;
    }
  
    closeModal(): void {
      this.isModalOpened = false;
    }

    onConfirmBtnClicked(): void {
      this.isModalOpened = false;
    }

    onCancelBtnClicked(): void {
      this.isModalOpened = false;
    }

}
