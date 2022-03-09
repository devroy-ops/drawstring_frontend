import * as Realm from "realm-web";
// import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const APP_ID = "drawstringrealmapp-vafye";

const app = new Realm.App({ id: APP_ID });

// const graphqlUri = `http://localhost:3000/api/client/v2.0/app/${APP_ID}/graphql`;
// const graphqlUri = `https://realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`;
// Local apps should use a local URI!
// const graphqlUri = `https://us-east-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`
// const graphqlUri = `https://eu-west-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`
// const graphqlUri = `https://ap-southeast-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`

login();

const CLUSTER_NAME = "mongodb-atlas";
const DATABASE_NAME = "DrawstringMarketplace";
// const COLLECTION_NAME = "authors";

const mongo =  app.currentUser.mongoClient(CLUSTER_NAME);
const mongodb =  mongo.db(DATABASE_NAME);


async function login(){
    const credentials = Realm.Credentials.anonymous();
    // Authenticate the user
    const user = await app.logIn(credentials);
    //const featured = await user.functions.get_featured();
    return user;
   
    
    //const collection = mongo.db(DATABASE_NAME).collection(COLLECTION_NAME);
    //debugger;

    //const result = await collection.find();

    // const result = await collection.insertOne({
    //     id: 2,
    //     firstName: "lily of the valley",
    //     lastName: "full",
    //     userName: "white",
    //     description: "perennial",
    // });
}

// async function getValidAccessToken() {
//     // Guarantee that there's a logged in user with a valid access token
//     if (!app.currentUser) {
//         // If no user is logged in, log in an anonymous user. The logged in user will have a valid
//         // access token.
//         await app.logIn(Realm.Credentials.anonymous());
//     } else {
//         // An already logged in user's access token might be stale. To guarantee that the token is
//         // valid, we refresh the user's custom data which also refreshes their access token.
//         await app.currentUser.refreshCustomData();
//     }
//     return app.currentUser.accessToken;
// }

// const client = new ApolloClient({
//     link: new HttpLink({
//         uri: graphqlUri,
//         // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
//         // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
//         // access token before sending the request.
//         // fetch: async (uri, options) => {
//         //     const accessToken = await getValidAccessToken();
//         //     options.headers.Authorization = `Bearer ${accessToken}`;
//         //     return fetch(uri, options);
//         // },
//     }),
//     cache: new InMemoryCache(),
// });

export { mongodb };//graphqlUri, client,
