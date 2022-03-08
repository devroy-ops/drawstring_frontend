import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Header from './components/global/header';
// import Footer from './components/global/footer';
// import { Route, BrowserRouter as Router, Routes, Switch } from "react-router-dom";
// import Home from './components/home';
// import Users from './components/users';
// import EditProfile from './components/editprofile';
// import Collections from './components/collections';
// import Product from './components/product';
// import CreateCollection from './components/createcollection';
// import ViewCollection from './components/viewcollection';
import ThemeContextWrapper from './theame/themeContextWrapper';

import getConfig from "./config.js";
import * as nearAPI from "near-api-js";
import { ApolloProvider } from '@apollo/client';
import { client } from './db/mongodb';

// Initializing contract
async function initContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || "testnet");

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  // Validate if a smart contract has been deployed to this account previously

  const account = await near.account("jitendra0891.testnet");
  //const account = await near.account(walletConnection.getAccountId());


  // await account.addKey("8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc");
  const keys = await account.getAccessKeys();
  // console.log(keys);

  const data = await account.state();
  const codeHash = data.code_hash.split("");

  const containsContract = codeHash.every((el) => el === "1");

  if (!containsContract) {
    //alert("This account contains a smart contract");
    console.log("This account contains a smart contract");
  }

  const contractX = new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      changeMethods: ["deploy_contract_code"],
    }
  );

  return {
    contractX,
    currentUser,
    nearConfig,
    walletConnection,
    account,
    nearAPI,
  };
}


// const routing = (
//   <Router>
//     <div>
//       <Header name="jitendra" />
//       <Routes>
//         <Route exact="true" path="/" component={Home} element={<Home name="drawstring" />} />
//         <Route exact="true" path="/collections" component={Collections} element={<Collections />} />
//         <Route path="/users" component={Users} element={<Users />} />
//         <Route path="/users/:userId" component={EditProfile} element={<EditProfile />} />
//         <Route path="/product" component={Product} element={<Product />} />
//         <Route path="/createcollection" component={CreateCollection} element={<CreateCollection 
//         />} />
//         <Route path="/viewcollection" component={ViewCollection} element={<ViewCollection />} />
//         {/* <Route path="/contact" component={Contact} />
//         <Route component={Notfound} /> */}
//       </Routes>
//       <Footer />
//     </div>
//   </Router>
// );

window.nearInitPromise = initContract().then(
  ({
    contractX,
    currentUser,
    nearConfig,
    walletConnection,
    account,
    nearAPI,
  }) => {

    ReactDOM.render(
      // <React.StrictMode>
      //   <App />
      // </React.StrictMode>,
      <ApolloProvider client={client}>

      <ThemeContextWrapper>
        <React.StrictMode>
          <App
            contractX={contractX}
            currentUser={currentUser}
            nearConfig={nearConfig}
            wallet={walletConnection}
            account={account}
            nearAPI={nearAPI}
          />
        </React.StrictMode>{' '}
      </ThemeContextWrapper>
      </ApolloProvider>
      ,


      //routing,

      document.getElementById('root')
    );
  });
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
