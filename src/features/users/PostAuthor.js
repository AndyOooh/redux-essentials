import { useSelector } from 'react-redux'
import { selectAllUsers, selectUserById } from './usersSlice'

export const PostAuthor = ({ userId }) => {

  // const allUsers = useSelector(selectAllUsers)
  // console.log('PostAuthor: allUsers', allUsers)


  // const author = useSelector((state) =>
  //   state.users.find((user) => user.id === userId)
  // )
  const author = useSelector(state => selectUserById(state, userId)) 
  return <span>by {author ? author.name : 'Unknown author'}</span>
}
