import { useSession, signIn, signOut } from "next-auth/react"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { redirect } from "next/dist/server/api-utils"
import PostSmall from "../components/PostSmall"
import Post from "../components/Post"
import Comments from "../components/Comments"
import { prisma } from '../server/db/client'

export default function Profilel({ userPosts, userComments }) {
    const { data: session } = useSession()

    if (session) {
        return (
            <>
                <div className="flex flex-col items-center justify-center pt-8">
                    {session.user.email} <br />
                    <img src={session.user.image} className="w-32 h-32 rounded-full" /> <br />
                    {session.user.name} <br />
                    <button onClick={() => signOut()} className="bg-blue-500 m-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign out</button>
                </div>
                <hr />
                <h2 className="text-center	text-4xl">Posts</h2>
                {userPosts.map((post) => (
                    <PostSmall
                        key={post.id}
                        post={post}
                        href={`/code/${post.id}`}
                        user={post.user}
                    />
                ))}
                <hr />
                <h2 className="text-center	text-4xl">Comments</h2>
                <div className="ml-32 mr-32">
                    <Comments comments={userComments} />

                </div>

            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions)

    const posts = await prisma.post.findMany({
        where: {
            user: {
                email: session.user.email
            }
        },
        include: {
            user: true,
            likes: true,
            comments: true
        }
    })
    const userPosts = JSON.parse(JSON.stringify(posts))

    const comments = await prisma.comment.findMany({
        where: {
            user: {
                email: session.user.email
            }
        },
        include: {
            user: true,
            post: true
        }
    })
    const userComments = JSON.parse(JSON.stringify(comments))

    if (!session) {
        //redirect to login page
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false,
            },
        }
    }
    return {
        props: {
            session, userPosts, userComments
        }
    }

}
