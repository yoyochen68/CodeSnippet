import Post from "../../components/Post"
import { prisma } from '../../server/db/client'
import CommentForm from '../../components/CommentForm'
import { useSession, signIn, signOut } from "next-auth/react"
import Comments from "../../components/Comments"
import useSWR from 'swr';
import axios from "axios"
import { useState, useEffect } from "react"
import React from 'react';
import SharePost from "../../components/SharePost"
import styled from "styled-components";
// import { authOptions } from '../api/auth/[...nextauth]';
// import { unstable_getServerSession } from "next-auth/next";

const Sharebox = styled.div`
position: fixed;
top: 40%;
left: 50%;
transform: translate(-50%, -50%);
`

export default function ({ post }) {
    // { onComment, onLike, onShare, liked, post, user, className = "" }

    const { data: session } = useSession()

    const ref = React.createRef();

    const loginedUser = session?.user

    const [comments, setComments] = useState([])
    const [totalComments, setTotalComments] = useState(post.totalComments)
    const [totalLikes, setTotalLikes] = useState(post.totalLikes)
    const [like, setLike] = useState()

    console.log("totalLikes", totalLikes)
    // const [likedPost, setLikedPost] = useState(
    //     post.likes.filter((like) => like.user.email == loginedUser?.email).length > 0 ? true : false
    // )

    useEffect(() => {
        axios.get(`/api/comments/${post.id}`)
            .then(res => {
                setComments(res.data)
            }).catch(err => {
                console.log(err)
            })
    }, [])

    const handleAddsubmit = (content) => {
        if (session) {
            axios.post('/api/comments', {
                content: content,
                postId: post.id,
                user: loginedUser

            }).then(res => {
                if (res.data) {
                    const newComment = res.data
                    console.log("new comment:", res.data)
                    axios.put('/api/posts', {
                        postId: post.id,
                        totalComments: totalComments + 1
                    }).then(res => {
                        console.log("updatedP:", res.data)
                        setComments([...comments, newComment])
                        setTotalComments(totalComments + 1)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            signIn()
        }
    }


    // console.log("out", post.likes.filter(like => like.user.email == session?.user.email)[0]?.id)

    useEffect(() => {
        setLike(post.likes.find(like => like.user.email == session?.user.email))
    }, [session]);


    const handleOnlike = () => {
        axios.post('/api/likes', {
            postId: post.id
        }).then((res) => {
            console.log("sucessful", res.data);
            setLike(res.data.liked)
            if (res.data.liked == true) {
                axios.put('/api/posts', {
                    postId: post.id,
                    totalLikes: totalLikes + 1

                }).then(res => {
                    console.log("totalLikes+1", res.data)
                    setTotalLikes(totalLikes + 1)

                })
            }
            if (res.data.liked == false) {
                axios.put('/api/posts', {
                    postId: post.id,
                    totalLikes: totalLikes - 1

                }).then(res => {
                    console.log("totalLikes-1", res.data)
                    setTotalLikes(totalLikes - 1)

                })
            }

        });
    }

    const [shareUrl, setShareUrl] = useState('');
    const [share, setShare] = useState(false);

    const handleOnShare = () => {
        if (session) {
            setShareUrl(window.location);
            setShare(true);
        } else {
            signIn()
        }
    }


    return (
        <div className="m-20">

            <Post
                totalComments={totalComments}
                totalLikes={totalLikes}
                user={post.user}
                post={post}
                onComment={() => console.log("comment")}
                onLike={handleOnlike}
                onShare={handleOnShare}
                // liked={like ? like : post.likes.find(like => like.user.email == session?.user.email)}
                liked={like}
                className='px-6 my-3 mt-10'
            />

            {session && <CommentForm onSubmit={handleAddsubmit} user={loginedUser} textareaRef={ref} />}

            <Comments comments={comments} />

            <Sharebox>
                <SharePost shareUrl={shareUrl} share={share} closeShare={() => { setShare(false) }} />
            </Sharebox>

        </div>
    )

}


export async function getStaticPaths() {

    const posts = await prisma.post.findMany();
    const paths = posts.map((post) => ({
        params: { id: post.id.toString() },
    }))

    return { paths, fallback: false }
}

export async function getStaticProps(context) {
    // const session = await unstable_getServerSession(context.req, context.res, authOptions)

    const postData = await prisma.post.findUnique({
        where: {
            id: parseInt(context.params.id)
        },
        include: {
            user: true,
            likes: {
                select: {
                    user: true
                }
            },
            comments: true
        }

    })
    const post = JSON.parse(JSON.stringify(postData))


    return {
        props: {
            post,
        }
    }

}



// const handleOnlike = () => {

    //     const likeId = post.likes.filter(like => like.user.email == session?.user.email)[0]?.id

    //     console.log("likeId", likeId)
    //     if (likeId) {
    //         axios.delete(`/api/likes/${likeId}`)
    //             .then(res => {
    //                 console.log("like?", res.data)

    //                 if (res.data) {
    //                     axios.put('/api/posts', {
    //                         postId: post.id,
    //                         totalLikes: totalLikes - 1
    //                     }).then(res => {
    //                         console.log("updateportlike-1", res.data)
    //                         setTotalLikes(totalLikes - 1)
    //                         // setLikedPost(!likedPost)
    //                     })
    //                 }

    //             }).catch(err => {
    //                 console.log(err)
    //             })
    //             return
    //     }
    //     if (likeId === undefined || likeId == null || !likeId) {
    //         axios.post('/api/likes', {
    //             postId: post.id
    //         }).then(res => {
    //             console.log("liked", res.data)

    //             if (res.data) {
    //                 axios.put('/api/posts', {
    //                     postId: post.id,
    //                     totalLikes: totalLikes + 1

    //                 }).then(res => {
    //                     console.log("totalLikes+1",res.data)
    //                     setTotalLikes(totalLikes + 1)
    //                     // setLikedPost(!likedPost)
    //                 })
    //             }


    //         }).catch(err => {
    //             console.log(err)
    //         })
    //         return
    //     }

    // }