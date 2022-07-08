import { useDispatch } from 'react-redux';

import { addReaction } from './postsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

export const ReactionButtons = ({ post }) => {
  const postId = post.id;
  const dispatch = useDispatch();

  const onClickHandler = e => {
    console.log('e.target.tester', e.target.dataset.tester);
    const reaction = e.target.dataset.tester;
    dispatch(addReaction({postId, reaction}));
  };

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        data-tester={name}
        key={name}
        type='button'
        className='muted-button reaction-button'
        onClick={onClickHandler}
        // onClick={() =>
        //   dispatch(reactionAdded({ postId: post.id, reaction: name }))
        // }
      >
        {emoji}
        {post.reactions ? post.reactions[name] : 0}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
