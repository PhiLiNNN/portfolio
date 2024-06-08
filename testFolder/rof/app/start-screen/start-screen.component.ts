import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  getDoc,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Game } from '../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  constructor(private router: Router) {}
  newGame() {
    this.addGame();
  }

  async addGame() {
    let game = new Game();
    await addDoc(this.getGamesRef(), game.toJson())
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        this.router.navigate(['/game/' + docRef?.id]);
      });
  }
  getGamesRef() {
    return collection(this.firestore, 'games');
  }
}
