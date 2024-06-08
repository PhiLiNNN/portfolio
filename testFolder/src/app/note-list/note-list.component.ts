import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NoteComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
})
export class NoteListComponent {
  noteList: Note[] = [];
  favFilter: 'all' | 'fav' = 'all';
  status: 'notes' | 'trash' = 'notes';

  constructor(private noteService: NoteListService) {}
  getList(): Note[] {
    if (this.status == 'notes') {
      if (this.favFilter == 'all') return this.noteService.normalNotes;
      else return this.noteService.normalMarkedNotes;
    } else return this.noteService.trashNotes;
  }
  getTrashList(): Note[] {
    return this.noteService.trashNotes;
  }
  changeFavFilter(filter: 'all' | 'fav') {
    this.favFilter = filter;
  }

  changeTrashStatus() {
    if (this.status == 'trash') this.status = 'notes';
    else {
      this.status = 'trash';
      this.favFilter = 'all';
    }
  }
}
