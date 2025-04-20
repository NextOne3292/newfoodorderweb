import e from "express";
import { userlogin, userLogout, userProfile,updateUser, userSignup , getUserInfo, checkUser} from "../controllers/userControllers.js";
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
router.post("/logout",  userLogout);
// ✅ New route for getting logged-in user info
router.get("/me", userAuth, getUserInfo);

router.get("/check", checkUser);


export { router as userRouter };