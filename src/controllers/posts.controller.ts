import { Request, Response } from "express";
import Post from "../models/Post";
import { handle } from "../libs/promiseHandler";
import { upload } from "../libs/multer";
import { unlinkSync } from "fs";


export const postsController = {
    allPosts: async(req: Request, res: Response) => {
        let perPage = 3;
        let page: any = req.params.page || 1;

        Post
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, posts) => {
            Post.count("", (err, count) => {
                if(err){
                    console.log(err)
                }else{
                    res.status(200).json({
                        data: posts,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                }
            })
        })

    },
    getPost: async(req: Request, res: Response) => {
        let [post, postError] = await handle(Post.findById(req.params.id));
        if(postError){
            res.status(500).json({
                data: postError
            });
        }else{
            res.status(200).json({
                data: post
            });
        }
    },
    createPost: async(req: Request, res: Response) => {
        upload(req, res, async(error) => {
            if(error){
                console.log(error);
                res.status(500).json({
                    err: "The image was not uploaded due an error " + error
                });
            }else{
                let _post = {
                    title: req.body.title,
                    content: req.body.content,
                    cover: `http://localhost:4000/uploads/${req.file.filename}`,
                    covername: req.file.filename
                }

                const newPost = new Post(_post);
                let [post, postError] = await handle(newPost.save());

                if(postError){
                    res.status(500).json({
                        data: postError
                    });
                }else{
                    res.status(201).json({
                        data: post
                    });
                }

            }
        })
    },
    updatePost: async(req: Request, res: Response) => {
        upload(req, res, async(error) => {
            if(error){
                res.status(500).json({
                    data: error
                })
            }else{
                if(req.file == undefined){
                    let [update, updateError] = await handle(Post.findByIdAndUpdate(req.params.id, {$set: {
                        title: req.body.title,
                        content: req.body.content,
                        cover: req.body.oldcover,
                        covername: req.body.oldcovername
                    }}));

                    if(updateError){
                        res.status(500).json({
                            data: updateError
                        });
                    }else{
                        res.status(200).json({
                            data: update
                        })
                    }

                }else{
                    let postcover = req.body.oldcovername;
                    let [update, updateError] = await handle(Post.findByIdAndUpdate(req.params.id, {$set: {
                        title: req.body.title,
                        content: req.body.content,
                        cover: `http://localhost:4000/uploads/${req.file.filename}`,
                        covername: req.file.filename
                    }}));

                    if(updateError){
                        res.status(500).json({
                            data: updateError,
                            
                        });
                    }else{
                        let filePath= "./uploads/" + postcover;
                        unlinkSync(filePath);
                        res.status(200).json({
                            data: update,
                        });
    
                    }
                }

            }
        })
    },
    deletePost: async(req: Request, res: Response) => {
        let postCover = "";
        let [post, postError] = await handle(Post.findById(req.params.id));

        if(postError){
            res.status(500).json({
                data: postError
            })
        }else{
            postCover = post.covername;
        }


        let [deletePost, deletePostError] = await handle(Post.findByIdAndDelete(req.params.id));
        if(deletePostError){
            res.status(500).json({
                data: deletePostError
            });
        }else{
            let filepath = "./uploads/" + postCover;
            unlinkSync(filepath);
            res.status(200).json({
                data: deletePost
            });
        }


    }
}