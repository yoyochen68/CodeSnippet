import { useRouter } from "next/router"
import Button from "../components/Button"
import PostSmall from "../components/PostSmall"
import axios from "axios"
import useSWR, { useSWRConfig } from 'swr';
import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import NextNProgress from 'nextjs-progressbar';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {

  const [like, setLike] = useState()
  const [totalLikes, setTotalLikes] = useState()
  const { data: session, status } = useSession()
  const loginedUser = session?.user
  const router = useRouter()

  const { mutate } = useSWRConfig()
  const { data, error } = useSWR('/api/posts', fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>


  const likePost = (postUpdate) => {
    axios.put('/api/posts', {
      postId: postUpdate.id,
      totalLikes: postUpdate.totalLikes
    })
  }

  const unlikePost = (postUpdate) => {
    axios.put('/api/posts', {
      postId: postUpdate.id,
      totalLikes: postUpdate.totalLikes
    })
  }

  const postComponents = data?.posts.map((post) => (

    <PostSmall
      loginedUser={loginedUser}
      newTotalLikes={totalLikes}
      key={post.id}
      user={post.user}
      post={post}
      href={`/code/${post.id}`}
      // onLike={() => {}}
      onComment={() => router.push(`/code/${post.id}`)}
      onShare={() => router.push(`/code/${post.id}`)}
    // liked={like}
    />
  ))

  return (

    <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
      <div className="flex justify-center mx-auto text-3xl font-large">Welcome to Code It</div>
      <Button onClick={() => session ? router.push("/addPost") : signIn()}>Add a Snippet</Button>
      {postComponents}
    </div>
  )
}

// export default function Home() {
//   const router = useRouter();


//   return (
//     <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
//       <Button onClick={() => router.push("/addPost")}>
//         Create A Snippet
//       </Button>

//       <ul>
//         {postsData.map((post) => (
//           <li key={post.id}>
//             <PostSmall
//               post={post}
//               href={`/code/${post.id}`}
//               onLike={() => console.log("like", post.id)}
//               onComment={() => console.log("like", post.id)}
//               onShare={() => console.log("like", post.id)}

//             />
//           </li>
//         ))}
//       </ul>

//     </div>
//   )
// }

// export async function getServerSideProps() {
//   //will always run on the server
//   const posts = await prisma.post.findMany({
//     orderBy: {
//       createdAt: "desc"
//     }
//   })

//   return {
//     props: {
//       posts: JSON.parse(JSON.stringify(posts)),
//     },
//   }
// }




// const handleOnlike = (post) => {
  //   axios.post('/api/likes', {
  //     postId: post.id
  //   }).then((res) => {
  //     console.log("sucessful", res.data);
  //     // router.reload()
  //     setLike(res.data.liked)
  //     if (res.data.liked == true) {
  //       const totalLikes = post.totalLikes + 1
  //       const postUpdate = { ...post, totalLikes: totalLikes }
  //       const options = { optimisticData: postUpdate, rollbackOnError: true }
  //       mutate('/api/posts', likePost(postUpdate), options)
  //     }
  //     if (res.data.liked == false) {
  //       const totalLikes = post.totalLikes - 1
  //       const postUpdate = { ...post, totalLikes: totalLikes }
  //       const options = { optimisticData: postUpdate, rollbackOnError: true }
  //       mutate('/api/posts', unlikePost(postUpdate), options)
  //     }
  //   });
  // }

  // const handleOnlike = (post) => {
  //   axios.post('/api/likes', {
  //     postId: post.id
  //   }).then((res) => {
  //     console.log("sucessful", res.data);
  //     // router.reload()
  //     setLike(res.data.liked)
  //     if (res.data.liked == true) {
  //       axios.put('/api/posts', {
  //         postId: post.id,
  //         totalLikes: post.totalLikes + 1
  //       }).then(res => {
  //         console.log("success", res.data.totalLikes)
  //         if (res.data.totalLikes > 0) {
  //           setTotalLikes(+res.data.totalLikes + 1)
  //         } else {
  //           setTotalLikes(1)
  //         }
  //       }
  //       )
  //     }
  //     if (res.data.liked == false) {
  //       axios.put('/api/posts', {
  //         postId: post.id,
  //         totalLikes: post.totalLikes - 1
  //       }).then(res => {
  //         console.log("success", res.data.totalLikes)
  //         if (res.data.totalLikes > 0) {
  //           setTotalLikes(+res.data.totalLikes - 1)
  //         } else {
  //           setTotalLikes(0)
  //         }
  //       }
  //       )
  //     }
  //   });
  // }