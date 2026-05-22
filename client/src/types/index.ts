export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueSeverity = 'Minor' | 'Major' | 'Critical';

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  createdBy: User;
  assignedTo?: User;
  tags: string[];
  attachments?: string[];
  dueDate?: string;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IssuesResponse {
  issues: Issue[];
  meta: PaginationMeta;
}

export interface IssueFilters {
  search?: string;
  status?: IssueStatus | '';
  priority?: IssuePriority | '';
  severity?: IssueSeverity | '';
  page?: number;
  limit?: number;
}
