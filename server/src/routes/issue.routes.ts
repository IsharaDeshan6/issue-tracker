import {Router} from "express";
import {protect} from "../middleware/auth.middleware";
import {createIssue, deleteIssue, getIssueById, getIssues, updateIssue} from "../controllers/issue.controller";
import {validate} from "../validators/auth.validator";
import {issueSchema} from "../validators/issue.validator";

const router = Router();

router.use(protect);

router.route('/')
    .get(getIssues)
    .post(validate(issueSchema), createIssue); // VALIDATED!

router.route('/:id')
    .get(getIssueById)
    .put(validate(issueSchema), updateIssue)   // VALIDATED!
    .delete(deleteIssue);

export default router;
