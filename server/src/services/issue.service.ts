import Issue from "../models/issue.model";


export const getIssuesService = async (query: any) => {

    const dbQuery: any = {};

    // 2. Exact Match Filters (Status, Priority, Severity, CreatedBy)
    if (query.status) {
        dbQuery.status = query.status;
    }
    if (query.priority) {
        dbQuery.priority = query.priority;
    }
    if (query.severity) {
        dbQuery.severity = query.severity;
    }
    if (query.createdBy) {
        dbQuery.createdBy = query.createdBy;
    }

    // 3. Text Search using Regex ($or operator checks multiple fields)
    if (query.serach) {
        dbQuery.$or = [
            {title: {$regex: query.search, $options: 'i'}},
            {description: {$regex: query.search, $options: 'i'}},
        ];
    }

    // 4. Execute the query against the database
    // Note: We use .populate() to get the actual user details instead of just the ObjectId
    const issues = await Issue.find(dbQuery)
        .populate('createdBy', 'username email profileImage')
        .populate('assignedTo', 'username email profileImage')
        .sort({createdAt: -1}); // Sort by newest first


    return issues;


}
