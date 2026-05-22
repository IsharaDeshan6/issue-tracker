import {z} from 'zod';

export const issueSchema = z.object({
    body: z.object({
        title: z.string({message: 'Title is required'})
            .min(3, 'Title must be at least 3 characters')
            .max(100, 'Title cannot exceed 100 characters'),

        description: z.string({message: 'Description is required'}),

        // Zod Enums ensures they only send valid statuses
        status: z.enum(['Open', 'In Progress', 'Resolved', 'Closed']).optional(),
        priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
        severity: z.enum(['Minor', 'Major', 'Critical']).optional(),

        tags: z.array(z.string()).optional(),
    }),
});
