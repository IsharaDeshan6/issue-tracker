import { Document, Types } from 'mongoose';

export interface IIssue extends Document {
    title: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    severity: 'Minor' | 'Major' | 'Critical';
    createdBy: Types.ObjectId; // Reference to User
    assignedTo?: Types.ObjectId; // Reference to User (Optional)
    tags: string[];
    attachments?: string[];
    dueDate?: Date;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
}
