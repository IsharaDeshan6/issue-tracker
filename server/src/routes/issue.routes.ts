import {Router} from "express";
import {protect} from "../middleware/auth.middleware";
import {createIssue, deleteIssue, getIssueById, getIssues, updateIssue} from "../controllers/issue.controller";

const router = Router();

router.use(protect);

router.route('/')
    .get(getIssues)
    .post(createIssue);

router.route('/:id')
    .get(getIssueById)
    .put(updateIssue)
    .delete(deleteIssue);

export default router;
