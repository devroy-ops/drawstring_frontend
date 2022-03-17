import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
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
import ThemeContextWrapper from './theame/themeContextWrapper'

import getConfig from './config.js'
import * as nearAPI from 'near-api-js'
import { initContracts } from './services/utils'

import {
  NearContextProvider,
  NftContractContextProvider,
  MarketContractContextProvider,
} from './contexts'
// Initializing contract

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

window.nearInitPromise = initContracts().then(
  ({
    contractX,
    currentUser,
    nearConfig,
    walletConnection,
    account,
    nearAPI,
    nftContract,
    marketContract,
    near,
  }) => {
    ReactDOM.render(
      // <React.StrictMode>
      //   <App />
      // </React.StrictMode>,

      <ThemeContextWrapper>
        <React.StrictMode>
          <NearContextProvider
            currentUser={currentUser}
            nearConfig={nearConfig}
            wallet={walletConnection}
            near={near}
          >
            <NftContractContextProvider nftContract={nftContract}>
              <App
                contractX={contractX}
                account={account}
                nearAPI={nearAPI}
                contract={nftContract}
                wallet={walletConnection}
              />
            </NftContractContextProvider>
          </NearContextProvider>
        </React.StrictMode>{' '}
      </ThemeContextWrapper>,

      //routing,

      document.getElementById('root'),
    )
  },
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
