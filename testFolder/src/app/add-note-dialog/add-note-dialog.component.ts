import { CommonModule } from '@angular/common';
import { Note } from '../interfaces/note.interface';
import { Component, Output, EventEmitter } from '@angular/core';
import { NoteListService } from '../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-note-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-note-dialog.component.html',
  styleUrl: './add-note-dialog.component.scss',
})
export class AddNoteDialogComponent {
  @Output() addDialogClosed: EventEmitter<boolean> = new EventEmitter();
  title = '';
  description = '';

  constructor(public noteService: NoteListService) {}
  closeDialog() {
    this.title = '';
    this.description = '';
    this.addDialogClosed.emit(false);
  }

  addNote() {
    let note: Note = {
      id: '',
      type: 'note',
      title: this.title,
      content: this.description,
      marked: false,
    };
    this.noteService.addNote(note, 'notes');
    this.closeDialog();
  }
}
