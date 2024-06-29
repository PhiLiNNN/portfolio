import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menuOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _menuOpen: boolean = false;

  toggleMenu(): void {
    this._menuOpen = !this._menuOpen;
    this.menuOpenChange.emit(this._menuOpen);
  }

  closeMenu(): void {
    this._menuOpen = false;
    this.menuOpenChange.emit(this._menuOpen);
  }

  get menuOpen(): boolean {
    return this._menuOpen;
  }
}
