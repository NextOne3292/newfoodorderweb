import e from "express";
import { userlogin, userLogout, userProfile,updateUser, userSignup ,checkUser} from "../controllers/userControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

//signup
router.post("/signup", userSignup);

//login
router.post("/login", userlogin);

//profile
router.get("/profile", userAuth, userProfile);

router.put("/update", userAuth, updateUser);
//logout
router.get("/logout", userAuth, userLogout);

router.get("/check", checkUser);
//profile-update
//forgot-password
//change-password
//account-deactivate


//check-user

export { router as userRouter };