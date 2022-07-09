import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Spinner } from '../../components/Spinner';
import { PostAuthor } from '../users/PostAuthor';
import { selectAllPosts, fetchPosts, selectPostIds, selectPostById } from './postsSlice.js';

import { ReactionButtons } from './ReactionButtons';
import { TimeAgo } from './TimeAgo';

// Excerpt component to encapsulate the post content -----------
let PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId));
  return (
    <article className='post-excerpt' key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className='post-content'>{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className='button muted-button'>
        View Post
      </Link>
    </article>
  );
};

// the exported component -----------------------------------------
export const PostsList = () => {
  const dispatch = useDispatch();
  const orderedPostIds = useSelector(selectPostIds);

  const postStatus = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);

  useEffect(() => {
    console.log('PostsList.useEffect');
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === 'loading') {
    content = <Spinner text='Loading...' />;
  } else if (postStatus === 'succeeded') {
    // const orderedPosts = posts
    //   .slice()
    //   .sort((a, b) => b.date.localeCompare(a.date)) // slice is important. makes a copy, so we dont mutate state.
    // New using adapter is moved to top of component

    //   content = orderedPosts.map((post) => (
    //   <PostExcerpt key={post.id} post={post} />
    // ))
    content = orderedPostIds.map(postId => <PostExcerpt key={postId} postId={postId} />);
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <h1>Posts</h1>
      <div className='post-excerpts-wrapper'>{content}</div>
    </div>
  );
};
export default PostsList;
