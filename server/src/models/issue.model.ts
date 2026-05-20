import mongoose, { Schema } from 'mongoose';
import { IIssue } from '../interfaces/issue.interface';

const IssueSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
            index: true, // Speeds up text search for titles
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
            default: 'Open',
            index: true, // Speeds up filtering by status
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        severity: {
            type: String,
            enum: ['Minor', 'Major', 'Critical'],
            default: 'Minor',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User', // This tells Mongoose which collection to look in!
            required: [true, 'Issue must be created by a user'],
            index: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        tags: {
            type: [String],
            default: [],
        },
        attachments: {
            type: [String], // Array of URLs (e.g., AWS S3 links)
            default: [],
        },
        dueDate: {
            type: Date,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

const Issue = mongoose.model<IIssue>('Issue', IssueSchema);

export default Issue;
