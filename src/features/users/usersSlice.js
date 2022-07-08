import { createAsyncThunk, createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';
// import { client } from '../../api/client';

import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase-config';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  // const response = await client.get('/fakeApi/users')
  // console.log('response', response.data)
  // return response.data

  // const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users.json`)
  // const data = await response.json()
  // return data

  const userCollection = await getDocs(collection(db, 'users'));
  const usersArray = userCollection.docs.map(doc => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data());
    // return { ...doc.data(), id: doc.id, time: doc.data().time.toDate().toISOString() };
    return {
      ...doc.data(),
      id: doc.id,
      date: new Date(doc.data().date.seconds * 1000).toISOString(),
    };
  });
  console.log('usersArray', usersArray);
  const time = usersArray[0].date;
  console.log('time', time);
  // const timeDate = time.toDate();
  // console.log('timeDate', timeDate);

  return usersArray;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(name, email) {
        return {
          payload: {
            id: nanoid(),
            name,
            email,
          },
        };
      },
    },
    userUpdated: (state, action) => {
      const { id, name, email } = action.payload;
      const existingUser = state.find(user => user.id === id);
      if (existingUser) {
        existingUser.name = name;
        existingUser.email = email;
      }
    },
  },
  extraReducers(builder) {
    // builder.addCase(fetchUsers.fulfilled, (state, action) => {
    //   return action.payload
    // })
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
  },
});

// export const selectAllUsers = (state) => state.users

// export const selectUserById = (state, userId) =>
//   state.users.find((user) => user.id === userId)

export const { userAdded, userUpdated } = usersSlice.actions;

export default usersSlice.reducer;

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(
  state => state.users
);
