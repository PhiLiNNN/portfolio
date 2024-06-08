import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../models/game';
import { PlayerComponent } from '../player/player.component';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import {
  Firestore,
  collection,
  getDoc,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    DialogAddPlayerComponent,
    MatDialogModule,
    GameInfoComponent,
    PlayerMobileComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  game: Game = new Game();
  animal: string = '';
  name: string = '';
  gameId: string = '';

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  async updateGame() {
    if (this.gameId) {
      const docRef = this.getSingleDocRef('games', this.gameId);
      await updateDoc(docRef, this.game.toJson()).catch((err) => {
        console.error(err);
      });
    }
  }

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      const gameDocRef = this.getSingleDocRef('games', params['id']);
      this.gameId = params['id'];
      const gameDocSnapshot = await getDoc(gameDocRef);
      const gameData = gameDocSnapshot.data();
      if (gameData) {
        this.game.currentPlayer = gameData['currentPlayer'];
        this.game.playedCard = gameData['playedCard'];
        this.game.players = gameData['players'];
        this.game.stack = gameData['stack'];
        this.game.pickCardAnimation = gameData['pickCardAnimation'];
        this.game.currentCard = gameData['currentCard'];
      }
    });
  }

  newGame() {
    this.game = new Game();
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
  takeCard() {
    if (this.game.players.length !== 0) {
      if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop() || '';
        this.game.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;
        this.updateGame();
        setTimeout(() => {
          this.game.playedCard.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.updateGame();
        }, 1000);
      }
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.updateGame();
      }
    });
  }
}
