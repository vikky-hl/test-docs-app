import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Config
import { API_BASE_URL } from '../../core/api/config';

// Models & Enums
import { Document } from '../../models/document.interface';
import { DocumentStatus } from '../../models/document-status.enum';
import { PaginatedDocuments } from '../../models/paginated-documents.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${API_BASE_URL}/document`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a list of documents with pagination and optional filters.
   *
   * @param params - Query parameters for filtering and pagination:
   *   - `page`: Page number (must be >= 1).
   *   - `size`: Number of documents per page (must be >= 1).
   *   - `sort`: Optional sorting parameter.
   *   - `status`: Optional filter by document status.
   *   - `creatorId`: Optional filter by creator's UUID.
   *   - `creatorEmail`: Optional filter by creator's email.
   * @returns An observable of a paginated document list.
   * @throws Error if `page` or `size` is less than 1.
   * @throws Error if `status` is invalid.
   */
  getDocuments(params: { 
    page: number;
    size: number;
    sort?: string;
    status?: DocumentStatus;
    creatorId?: string;
    creatorEmail?: string;
  }): Observable<PaginatedDocuments> {
    
    if (params.page < 1 || params.size < 1) {
      throw new Error('Page and size must be greater than 0');
    }

    if (params.status && !Object.values(DocumentStatus).includes(params.status)) {
      throw new Error('Invalid document status');
    }

    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.creatorId) httpParams = httpParams.set('creatorId', params.creatorId);
    if (params.creatorEmail) httpParams = httpParams.set('creatorEmail', params.creatorEmail);

    return this.http.get<PaginatedDocuments>(this.apiUrl, { params: httpParams });
  }

  /**
   * Retrieves details of a specific document by its ID.
   * @param id - Document ID.
   * @returns An observable of the document details.
   */
  getDocumentById(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new document.
   * @param formData - FormData containing document details (name, status, file).
   * @returns An observable of the created document.
   */
  createDocument(formData: FormData): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, formData);
  }

  /**
   * Updates an existing document.
   * @param id - Document ID.
   * @param updatedDocument - Updated document object.
   * @returns An observable of the updated document.
   */
  updateDocument(id: string, updatedDocument: Document): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, updatedDocument);
  }

  /**
   * Deletes a document by its ID.
   * @param id - Document ID.
   * @returns An observable indicating completion.
   */
  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Sends a document for review.
   * @param id - Document ID.
   * @returns An observable indicating completion.
   */
  sendToReview(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/send-to-review`, {});
  }

  /**
   * Revokes a document from review.
   * @param id - Document ID.
   * @returns An observable indicating completion.
   */
  revokeReview(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/revoke-review`, {});
  }

  /**
   * Changes the status of a document.
   * @param id - Document ID.
   * @param status - New document status.
   * @returns An observable indicating completion.
   */
  changeDocumentStatus(id: string, status: DocumentStatus): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/change-status`, { status });
  }
}