import { prisma } from '../../../server/db/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"



export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)

    const { method } = req;

    switch (method) {
        case 'POST':
            if (!session) {
                res.status(401).json({ error: 'Unauthorized' })
                return
            }
            const prismaUser = await prisma.user.findUnique({
                where: {
                    email: session.user.email
                }
            })
            if (!prismaUser) {
                res.status(401).json({ error: 'Unauthorized' })
                return
            }
            const isLiked = await prisma.like.findUnique({
                where: {
                    postId_userId: {
                        postId: req.body.postId,
                        userId: prismaUser.id,
                    }
                },
            })
            if (isLiked) {
                const deletedLike = await prisma.like.delete({
                    where: {
                        postId_userId: {
                            postId: req.body.postId,
                            userId: prismaUser.id,
                        }
                    }
                })
                const likes = await prisma.like.findMany({
                    where: {
                        postId: req.body.postId,
                    },
                    include: {
                        post: true,
                    }
                });
                console.log("likes number", likes.length)
                console.log('likes', likes)
                res.status(200).json({ message: "deleted like", liked: false, totalLikes: likes.length });
                return;
            } else {
                const liked = await prisma.like.create({
                    data: {
                        postId: req.body.postId,
                        userId: prismaUser.id,
                    },
                })
                res.status(201).json({ message: "add like", liked: true });
                return;
            }

        case 'GET':
            const comments = await prisma.like.findMany({
                where: {
                    postId: req.body.id
                },
                include: {
                    user: true,
                }
            }
            );

            res.status(200).json(comments);
            break;

        // case 'DELETE':
        //     console.log("id", req.body.id)
        //     const deletedLike = await prisma.like.delete({
        //         where: {
        //             id: +req.body.id,
        //         }
        //     })
        //     res.status(200).send("unliked");
        //     break;


        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}