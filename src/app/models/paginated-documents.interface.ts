import { Document } from "./document.interface";

export interface PaginatedDocuments {
    results: Document[]; 
    count: number;       
  }