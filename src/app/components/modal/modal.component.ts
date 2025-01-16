import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent  {
  @Input() isModalOpened = false;

  @Input() title: string = '';
  @Input() content: string = '';

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmBtnClicked = new EventEmitter<void>();
  @Output() cancelBtnClicked = new EventEmitter<void>();

  constructor() { }

  closeModalOnOutsideClick(event: MouseEvent): void {
    if( event.target === document.querySelector('.fixed') ) {
      this.closeModal.emit();
    }
  }
}
