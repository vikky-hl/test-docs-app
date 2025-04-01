import { Component, computed, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

// Services
import { AuthService } from '../auth/auth.service';
import { DocumentService } from '../shared/services/document.service';
import { UserService } from '../shared/services/user.service';

// Components
import { AddDocumentDialogComponent } from '../shared/components/add-document-dialog/add-document-dialog.component';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

// Models and Interfaces
import { Document } from '../models/document.interface';
import { DocumentStatus } from '../models/document-status.enum';
import { PaginatedDocuments } from '../models/paginated-documents.interface';

@Component({
  selector: 'app-document-panel',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, FormsModule, PdfViewerComponent ],
  templateUrl: './document-panel.component.html',
  styleUrls: ['./document-panel.component.scss']
})
export class DocumentPanelComponent implements OnInit {
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  public documentStatus = DocumentStatus;

  documents: WritableSignal<Document[]> = signal([]);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(10);
  totalItems: WritableSignal<number> = signal(0);
  sortField: WritableSignal<string> = signal('name,asc');
  selectedStatus: WritableSignal<DocumentStatus | undefined> = signal(undefined);
  creatorFilter: WritableSignal<string> = signal('');

  isReviewer = computed(() => this.userService.getUserRole() === 'REVIEWER');
  isUser = computed(() => this.userService.getUserRole() === 'USER');

  displayedColumns = computed(() =>
    this.isReviewer() ? ['name', 'status', 'creator', 'actions', 'view'] : ['name', 'status', 'actions', 'view']
  );

  ngOnInit(): void {
    if (this.userService.getCurrentUser()()) {
      this.loadDocuments();
    } else {
      console.log('User data is still loading...');
    }
  }

  loadDocuments(): void {
    const params: any = {
      page: this.currentPage(),
      size: this.pageSize(),
      sort: this.sortField()
    };

    if (!this.isReviewer()) {
      params.creatorId = this.authService.getUserId();
    } else {
      if (this.selectedStatus()) {
        params.status = this.selectedStatus();
      } else {
        params.status = [
          DocumentStatus.UNDER_REVIEW,
          DocumentStatus.APPROVED,
          DocumentStatus.DECLINED,
          DocumentStatus.READY_FOR_REVIEW,
          DocumentStatus.REVOKE
        ].join(',');
      }
      const creatorValue = this.creatorFilter();
      if (creatorValue) {
        if (this.isValidUUID(creatorValue)) {
          params.creatorId = creatorValue;
        } else {
          params.creatorEmail = creatorValue;
        }
      }
    }

    this.documentService.getDocuments(params).subscribe({
      next: (response: PaginatedDocuments) => {
        this.documents.set(response.results);
        this.totalItems.set(response.count);
      },
      error: (err) => console.error('Error loading documents:', err)
    });
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadDocuments();
  }

  changeSort(sort: string): void {
    this.sortField.set(sort);
    this.loadDocuments();
  }

  filterByStatus(status: DocumentStatus): void {
    this.selectedStatus.set(status);
    this.loadDocuments();
  }

  filterByCreator(creator: string): void {
    this.creatorFilter.set(creator);
    this.loadDocuments();
  }

  openAddDocumentDialog(): void {
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDocuments();
      }
    });
  }

  deleteDocument(document: Document): void {
    if (document.status === DocumentStatus.DRAFT || document.status === DocumentStatus.REVOKE) {
      this.documentService.deleteDocument(document.id).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (err) => console.error('Error deleting document:', err)
      });
    }
  }

  revokeDocument(document: Document): void {
    if (document.status === DocumentStatus.READY_FOR_REVIEW) {
      this.documentService.changeDocumentStatus(document.id, DocumentStatus.REVOKE).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (err) => console.error('Error revoking document:', err)
      });
    }
  }

  changeDocumentStatus(document: Document, newStatus: DocumentStatus): void {
    this.documentService.changeDocumentStatus(document.id, newStatus).subscribe({
      next: () => {
        this.loadDocuments();
      },
      error: (err) => console.error('Error changing document status:', err)
    });
  }

  viewDocument(document: Document): void {
    this.dialog.open(PdfViewerComponent, {
      width: '80vw',
      height: '90vh',
      data: { pdfUrl: document.fileUrl }
    });
  }

  isValidUUID(uuid: string): boolean {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
  }
}