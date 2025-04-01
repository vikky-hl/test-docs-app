import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// Models & Enums
import { DocumentStatus } from '../../../models/document-status.enum';

// Services
import { DocumentService } from '../../services/document.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrl: './add-document-dialog.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule]
})
export class AddDocumentDialogComponent {
  /** Name of the new document */
  newDocumentName: string = '';

  /** Initial status of the new document (default: Draft) */
  newDocumentStatus: DocumentStatus = DocumentStatus.DRAFT;

  /** File selected by the user */
  newDocumentFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    private documentService: DocumentService,
    private authService: AuthService
  ) {}

  /**
   * Handles file selection and validates file type.
   * Only PDF files are accepted.
   * @param event File input change event
   */
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      if (file.type !== 'application/pdf') {
        console.error('Invalid file type. Please select a PDF.');
        return;
      }

      this.newDocumentFile = file;
    }
  }

  /**
   * Adds a new document by sending form data to the document service.
   * Ensures both a document name and a file are provided before submission.
   */
  addDocument(): void {
    if (!this.newDocumentName || !this.newDocumentFile) {
      console.error('Please provide both a document name and a file.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newDocumentName);
    formData.append('status', this.newDocumentStatus);
    formData.append('file', this.newDocumentFile);

    this.documentService.createDocument(formData).subscribe({
      next: () => {
        console.log('Document added successfully.');
        this.dialogRef.close(true); // Close dialog and refresh document list
      },
      error: (err) => {
        console.error('Error adding document:', err);
      }
    });
  }

  /**
   * Closes the dialog without taking any action.
   */
  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
