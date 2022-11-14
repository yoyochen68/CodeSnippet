import Link from "next/link"
import Comment from "../Comment"

export default function Comments({ comments, className }) {
  return (
    <ul className={' ' + className}>
      {comments.map(comment => (
        <li
          key={comment.id}
          className='my-6 border-t border-gray-600 pt-6'
        >
          <Link href={`/code/${comment.postId}`}>
            <Comment
              className="px-6"
              key={comment.id}
              comment={comment}
              user={comment.user}
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}