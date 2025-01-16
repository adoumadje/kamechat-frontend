import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalComponent } from "../modal/modal.component";
import { Route, Router } from '@angular/router';
import { AuthGoogleService } from '../../services/auth-google.service';

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

    private authService = inject(AuthGoogleService);

    constructor(private router: Router) {
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
      this.authService.logout();
      this.router.navigate(['/login']);
    }

    onCancelBtnClicked(): void {
      this.isModalOpened = false;
    }

}
