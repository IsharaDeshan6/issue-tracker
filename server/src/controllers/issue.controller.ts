import {AuthRequest} from "../middleware/auth.middleware";
import {Request, Response} from 'express';
import Issue from "../models/issue.model";
import {getIssuesService} from "../services/issue.service";
import {asyncHandler} from "../utils/asyncHandler";

export const createIssue = asyncHandler(async (req: AuthRequest, res: Response) => {

    const issueData = {
        ...req.body,
        createdBy: req.user?._id,
    };

    const issue = await Issue.create(issueData);
    res.status(201).json(issue);

});


export const getIssues = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const result = await getIssuesService(req.query);
    res.status(200).json(result);

});

export const getIssueById = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const issue = await Issue.findById(req.params.id)
        .populate('createdBy', 'username email')
        .populate('updatedBy', 'username email')

    if (!issue) {
        res.status(404).json({message: 'Issue Not Found'});
        return;
    }

    res.status(200).json(issue);

});

export const updateIssue = asyncHandler(async (req: Request, res: Response): Promise<void> => {

        const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: "after",
            runValidators: true,
        });

        if (!issue) {
            res.status(404).json({message: 'Issue Not Found'});
            return;
        }

        res.status(200).json(issue);

});


export const deleteIssue = asyncHandler(async (req: Request, res: Response): Promise<void> => {

        const issue = await Issue.findByIdAndDelete(req.params.id);
        if (!issue) {
            res.status(404).json({message: 'Issue Not Found'});
            return;
        }
        res.status(200).json({message: 'Issue Deleted Successfully'});

});

