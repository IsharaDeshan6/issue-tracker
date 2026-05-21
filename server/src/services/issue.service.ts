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
    if (query.search) {
        dbQuery.$or = [{title: {$regex: query.search, $options: 'i'}}, {
            description: {
                $regex: query.search,
                $options: 'i'
            }
        },];
    }

    //2. Pagination Math
    //We use fallback defaults: page 1 and limit 10 if the user dosent't provide them
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 3. Execute the paginated query
    // Notice we added .skip() and .limit()
    const issues = await Issue.find(dbQuery)
        .populate('createdBy', 'username email profileImage')
        .populate('assignedTo', 'username email profileImage')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);


    //4. get the total count of documents that match the db query (for frontend pagination buttons)
    const total = await Issue.countDocuments(dbQuery);

    //5. return the data along with pagination metadata

    return {
        issues,
        meta:{
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit),
        },
    };
};
