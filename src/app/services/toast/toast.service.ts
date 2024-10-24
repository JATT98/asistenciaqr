import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
  ) { }

  toasts: any[] = [];
  time = 5000;

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  showSuccess(message: string) {
    let txt = message;
    this.show(txt, { classname: 'bg-success text-light', delay: this.time, autohide: true });
  }

  showError(message) {
    let txt = message;
    this.show(txt, { classname: 'bg-danger text-light', delay: this.time, autohide: true });
  }
}
