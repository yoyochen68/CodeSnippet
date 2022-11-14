import NextLink from "next/link"
import NextImage from "next/image"
import PostActions from "../PostActions"
import formatTimeAgo from "../../utils/formatTimeAgo"
import highlight from "../../utils/highlight"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react"
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react"


export default function PostSmall({ loginedUser, newTotalLikes, onLike, onComment, onShare, href, post, user, Image = NextImage, liked, Link = NextLink, className = "" }) {
  const [like, setLike] = useState()
  const [totalLikes, setTotalLikes] = useState(post.totalLikes)
  const { data: session } = useSession()

  useEffect(() => {
    setLike(post.likes.find(like => like.user?.email == loginedUser?.email))
  }, [loginedUser]);

  const handleOnlike = () => {
    if(session) {
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
          setTotalLikes(totalLikes + 1)
        }
        )
      }
      if (res.data.liked == false) {
        axios.put('/api/posts', {
          postId: post.id,
          totalLikes: totalLikes - 1
        }).then(res => {
          console.log("success", res.data.totalLikes)
          setTotalLikes(totalLikes - 1)

        }
        )
      }
    });
    } else {
      signIn()
    }
  }





  return (
    <div className={twMerge('lex flex-col overflow-hidden rounded-lg shadow-lg bg-slate-600 m-10			', className)}>
      <div className="flex flex-1 flex-col justify-between p-6 pb-3">
        <Link href={href} >
          <div className="mt-2 flex items-center">
            <div className="flex-shrink-0 text-gray-100">
              {user?.image &&
                <Image
                  className="h-12 w-12 rounded-full"
                  src={user.image}
                  width={50}
                  height={50}
                  alt="user image"
                />
              }
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-100">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-300">{formatTimeAgo(post.createdAt)}</p>
              </div>
              <div className="flex-1 mt-1">
                <p className="text-xl font-semibold text-gray-100">
                  {post.title.substring(0, 50)}
                </p>

              </div>
            </div>
          </div>
          <pre className="mt-4 mx-5 max-h-52 overflow-hidden border-b border-gray-700 whitespace-pre-wrap break-words">
            {post.language ?
              <code className={`language-${post.language}`} dangerouslySetInnerHTML={{ __html: highlight(post.code, post.language) }} ></code>
              :
              <code>{post.code}</code>
            }
          </pre>
        </Link>
      </div>
      <div className="flex flex-col items-center pb-3">
        <PostActions
          newTotalLikes={newTotalLikes}
          totalLikes={totalLikes}
          post={post}
          onComment={onComment}
          onLike={handleOnlike}
          onShare={onShare}
          liked={like}
          totalComments={post.totalComments} />
      </div>

    </div>
  )
}