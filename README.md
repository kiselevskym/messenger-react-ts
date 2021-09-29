Стек технологий: React, Redux, TypeScript и Firebase.


(https://messenger-react-ts.web.app/)
## Back-end Setup

The back-end of the app is handled by Firebase

## Basic Setup

Go to firebase console and create a new project with the name "Messanger"

## App Setup

Create an App for the project from the overview page\
Copy and paste the configurations in the required location (given in the readme of the respective apps)

## Auth Setup

Go to the project Authentication section\
Select Sign-in method tab\
Enable Email/Password

## Firestore Setup

* Go to the project Firestore section\
* Create firestore provisions for the project (choose the server nearest to your location)

* Go to the Indexes tab and create the following index:\
`
{
    collection: "conversations",
    fields: {
        users: Arrays,
        timestamp: Descending,
    },
    queryScope: Collection
}
`
and\
`
{
    collection: "messages",
    fields: {
        users: Ascending,
        timestamp: Descending,
    },
    queryScope: Collection
}`
and\
`
{
    collection: "messages",
    fields: {
        users: Ascending,
        timestamp: Ascending,
    },
    queryScope: Collection
}`



