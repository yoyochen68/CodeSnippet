import { prisma } from '../../server/db/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

function titleFromCode(code) {
    return code.trim().split('\n')[0].replace('//', '');
}

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)

    const { method } = req;


    switch (method) {

        case 'GET':
            let posts = await prisma.post.findMany({
                include: {
                    user: true,
                    likes: {
                        select: {
                            user: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            if (session) {
                posts = posts.map((post) => ({
                    ...post,
                    liked: post.likes.some((like) => like.user.email === session.user.email)
                }))
            }
            res.status(200).json({ posts });
            break;




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

            console.log('wwwww', session.user)
            const { language, code } = req.body
            const title = titleFromCode(code);
            const post = await prisma.post.create({
                data: {
                    title,
                    language,
                    code,
                    userId: prismaUser.id,
                },
            })
            console.log('post', post)
            res.status(201).json(post);
            break;


        case 'PUT':
            //increase the comment count
            const id = req.body.postId
            if (req.body.totalComments !== undefined) {
                const updatedPost = await prisma.post.update({
                    where: { id: Number(id) },
                    data: {
                        totalComments: req.body.totalComments
                    },
                })
                res.status(200).json({ updatedPost });
                return
            }
            if (req.body.totalLikes !== undefined) {
                const updatedPost = await prisma.post.update({
                    where: { id: Number(id) },
                    data: {
                        totalLikes: req.body.totalLikes
                    },
                })
                res.status(200).json({ updatedPost });
                return
            }

            res.status(405).send("failed to edit post");
            break;


        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}