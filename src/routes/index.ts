import { Router } from "express";
import { postsController } from "../controllers/posts.controller";

const router = Router();

//routes
router.route("/:page")
.get(postsController.allPosts);

router.route("/post/:id")
.get(postsController.getPost);

router.route("/create")
.post(postsController.createPost);

router.route("/update/:id")
.put(postsController.updatePost);

router.route("/delete/:id")
.delete(postsController.deletePost);

export default router;