import { v4 as uuidv4 } from 'uuid';

import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  Timestamp,
  getDoc,
  getPath,
  updateDoc,
  FieldValue,
  increment,
  setDoc,
} from 'firebase/firestore';

import { client } from '../../api/client';
import { db } from '../../config/firebase-config';

// Adapter -----------------------------------------------------
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// initialState -------------------------------------------------
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

// Thunks -------------------------------------------------------
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  // const response = await client.get('/fakeApi/posts');
  // return response.data;

  const postsCollection = await getDocs(collection(db, 'posts'));
  const postsArray = postsCollection.docs.map(doc => {
    console.log(doc.id, ' => ', doc.data());
    return {
      ...doc.data(),
      id: doc.id,
      date: new Date(doc.data().date.seconds * 1000).toISOString(),
      user: doc.data().user.id,
    };
  });
  return postsArray;
});

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async userCreatedPost => {
    console.log('initialPost', userCreatedPost);

    const docId2 = uuidv4();
    console.log('docId', docId2);

    const response = await setDoc(doc(db, 'posts', docId2), {
      ...userCreatedPost,
      id: docId2,
      user: doc(db, 'users/' + userCreatedPost.user),
      date: Timestamp.now(),
      reactions: {
        thumbsUp: 0,
        hooray: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
    });

    // const response = await addDoc(collection(db, 'posts'), {
    //   ...initialPost,
    //   // id: doc.id, // can't do this, hence using setDoc instead
    //   user: doc(db, 'users/' + initialPost.user),
    //   date: Timestamp.now(),
    //   reactions: {
    //     thumbsUp: 0,
    //     hooray: 0,
    //     heart: 0,
    //     rocket: 0,
    //     eyes: 0,
    //   },
    // });

    console.log('response', response);

    // const addedPost = await getDoc(doc(db, response.path));
    const addedPost = await getDoc(doc(db, 'posts/' + docId2));
    console.log('addedPost', addedPost);
    const addedPostConverted = {
      ...addedPost.data(),
      date: new Date(addedPost.data().date.seconds * 1000).toISOString(),
      user: addedPost.data().user.id,
    };
    console.log('addedPostConverted', addedPostConverted);

    return addedPostConverted;
  }
);

export const updatePost = createAsyncThunk('posts/updatePost', async postUpdates => {
  console.log('postUpdates', postUpdates);

  const postRef = doc(db, 'posts/' + postUpdates.id);
  const response = await updateDoc(postRef, {
    ...postUpdates,
  });
  console.log('response', response);

  return postUpdates;
});

export const addReaction = createAsyncThunk('posts/addReaction', async postReaction => {
  const { postId, reaction } = postReaction;
  console.log('postId', postId);
  console.log('reaction', reaction);

  const postRef = doc(db, 'posts/' + postId);

  const response = await updateDoc(postRef, {
    [`reactions.${reaction}`]: increment(1),
  });
  console.log('response', response);
  // return { id: postId, changes: {reactions: '2'}; //Not complete. Attempt at using with upsertOne().
  return postReaction;
});

// Slice -------------------------------------------------------
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // reactionAdded(state, action) {
    //   const { postId, reaction } = action.payload;
    //   // const existingPost = state.posts.find((post) => post.id === postId) see new below from createEntityAdapter
    //   const existingPost = state.entities[postId];

    //   if (existingPost) {
    //     existingPost.reactions[reaction]++;
    //   }
    // },
    // postAdded replaced by addNewPost thunk ----------
    // postAdded: {
    //   reducer(state, action) {
    //     state.posts.push(action.payload)
    //   },
    //   prepare(title, content, userId) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         date: new Date().toISOString(),
    //         title,
    //         content,
    //         user: userId,
    //         reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
    //       },
    //     }
    //   },
    // },
    // postUpdated: (state, action) => {
    //   const { id, title, content } = action.payload;
    //   const existingPost = state.entities[id];
    //   if (existingPost) {
    //     existingPost.title = title;
    //     existingPost.content = content;
    //   }
    // },
  },
  // extraReducers -------------------------------------------------
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched posts to the array
        // state.posts = state.posts.concat(action.payload) old way, see above using createEntityAdapter
        // Use the `upsertMany` reducer as a mutating update utility
        console.log('action.payload', action.payload);
        postsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // .addCase(addNewPost.fulfilled, (state, action) => {
      //   // We can directly add the new post object to our posts array
      //   state.posts.push(action.payload)
      // Use the `addOne` reducer for the fulfilled case
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
      // .addCase(addReaction.fulfilled, postsAdapter.updateOne);
      // .addCase(addReaction.fulfilled, postsAdapter.upsertOne); // upserOne easier than updateOne. Howver, because reactions is nested (and not normalized), it's better/easier to not user asapter CRUD functions
      .addCase(addReaction.fulfilled, (state, action) => {
        const { postId, reaction } = action.payload;
        const existingPost = state.entities[postId];
        if (existingPost) {
          existingPost.reactions[reaction]++;
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const { id, title, content } = action.payload;
        const existingPost = state.entities[id];
        if (existingPost) {
          existingPost.title = title;
          existingPost.content = content;
        }
      });
  },
});

// Selectors ----------------------------------------------------
// export const selectAllPosts = (state) => state.posts.posts
// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId)

export const { postAdded, postUpdated } = postsSlice.actions;
export default postsSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`.
// Destructure and rename. Original: selectAll, chosen name: selectAllPosts
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId], //input selectors
  (posts, userId) => posts.filter(post => post.user === userId) // output selector
);
