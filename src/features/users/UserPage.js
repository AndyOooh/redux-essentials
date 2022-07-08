import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectAllPosts, selectPostsByUser } from '../posts/postsSlice'
import { selectUserById } from './usersSlice'

export default function UserPage({ match }) {
  const userId = match.params.userId
  console.log('userId', userId)
  const user = useSelector((state) => selectUserById(state, userId))
  console.log('user', user)

  // const postsForUser = useSelector((state) => {
  //   const allPosts = selectAllPosts(state)
  //   return allPosts.filter((post) => post.user === userId)
  // })

  // Old not memoized version, see below for memoized version
  // const postsForUser = useSelector((state) => {
  //   const allPosts = selectAllPosts(state)
  //   return allPosts.filter((post) => post.user === userId)
  // })

  // momoised version
  const postsForUser = useSelector((state) => selectPostsByUser(state, userId))

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}
