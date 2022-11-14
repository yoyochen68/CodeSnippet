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

            console.log('wwwww', session.user)
            // const { content,user } = req.body

    
            const createdComment = await prisma.comment.create({
                data: {
                    content: content,
                    postId: +req.query.id,
                    userId: prismaUser.id,
                    user: {
                        connect: {
                            id: prismaUser.id
                        }
                    },
                    post: {
                        connect: {
                            id: +req.query.id
                        }
                    }
                },

            })

            res.status(201).json(createdComment);
            break;

        case 'GET':
            const comments = await prisma.comment.findMany({
                where: {
                    postId: +req.query.id
                },
                include: {
                    user: true,
                }
            }
            );

            res.status(200).json(comments);
            break;

        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}