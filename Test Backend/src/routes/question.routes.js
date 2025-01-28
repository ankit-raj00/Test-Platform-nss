import {Router} from "express"
import { addQuestion, getQuestions, updateQuestion, deleteQuestion } from "../controllers/question.controller.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router()



//secure routes 
// give acess to logout when user is login
//verify using jwt tokens and cookies
//inject middleware in  logout route

router.post(
    "/",
    upload.single("questionImage"),
    addQuestion
  );

// READ (all or by ID)
router.get("/:id?", getQuestions);

// UPDATE
router.put("/:id",upload.single("questionImage"),  updateQuestion);

// DELETE
router.delete("/:id", deleteQuestion);
// router can confuse what to do after running verifyJWT , that's why
// we write next() in auth middleware so that after running verifyjwt it run logout user





export default router