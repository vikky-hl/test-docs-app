import { DocumentStatus } from "./document-status.enum";
import { User } from "./user.interface";

export interface Document {
    id: string;
    name: string;
    status: DocumentStatus;
    fileUrl: string;
    updatedAt: string;
    createdAt: string;
    creator: User; 
}