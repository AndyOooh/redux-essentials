# Redux Essentials Tutorial Example

This project contains the setup and code from the "Redux Essentials" tutorial in the Redux docs ( https://redux.js.org/tutorials/essentials/part-1-overview-concepts ).

The `master` branch has a single commit that already has the initial project configuration in place. You can use this to follow along with the instructions from the tutorial.

The `tutorial-steps` branch has the actual code commits from the tutorial. You can look at these to see how the official tutorial actually implements each piece of functionality along the way.

--- 

## App features
Users can create and edit posts, as well click on emoticons on posts. Furthermore they can click a button to see a list of mock notifications.


## My goals
- Learn redux from scratch by coding along with the Redux Essentials Tutorial.
- Go beyond the tutorial and add a Firebase backend to the project.

## What I have done 
- **Gone through chapters 1-6 of the tutorial.**
- **Set up the backend except *notifications* in a Firebase Firestore database.** 

The database contains a users and a posts collection. Every post has a client-side generated id (using uuid library). Example:
```
{ 
    key: 
        { 
            content: string,
            date: date Object,
            id: key,
            title: string,
            user: ref to object in users collection
    }
}
```
Placing the key inside the object is done with postDoc() and a client-side generated key (`addDoc()` generates a key server-side).
The users collection is similar but simpler as it has no nested objects. Also, there isn't any logic to deal with it directly (yet).

On the client-side all state is normalized with the one exception of the reactions property in *posts*, which contains a nested object. Here is what it looks like:
```
{ 
    status: enum,
    error: string,
    ids: [],
    entities: {
                key: {
                        content: string,
                        date, ISOString,
                        id: string,
                        title: string,
                        user: user.id matching a user in the users slice (string)   
                }
    }
}
```
### Challenges
- Rewriring the reducers to export extra properties and maintaining a normalized structure
- Handling Firebase Objects and syntax
- Learning redux with emphasis on async code with createAsyncThunk and entity adapters. 
- Learning Firebase methods.

