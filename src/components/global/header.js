// import React from "react";
import React, { useCallback, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import '../../styles/header.css';
import search from '../../images/header/search.svg';
import day from '../../images/header/day.svg';
import dp from '../../images/header/dp.svg';
import { Dropdown } from 'react-bootstrap'
import night from '../../images/header/night.svg';
import { ThemeContext, themes } from '../../theame/theameContext';
// import { AuthContext } from "../../auth/auth";
import { db, auth } from "../../db/firebase";

import { NearContext } from '../../contexts';

export default function Header({ currentUser, wallet, nearConfig}) {

  const [darkMode, setDarkMode] = React.useState(true);
  const { signIn,signOut } = useContext(NearContext);
  // var networkId = "testnet"; //mainnet
  // const near = new window.nearApi.Near({
  //   networkId: networkId,
  //   keyStore: new window.nearApi.keyStores.BrowserLocalStorageKeyStore(),
  //   nodeUrl: `https://rpc.${networkId}.near.org`,
  //   walletUrl: `https://wallet.${networkId}.near.org`,
  //   helperUrl: `https://helper.${networkId}.near.org`,
  //   explorerUrl: `https://explorer.${networkId}.near.org`,
  // });
  // // connect to the NEAR Wallet
  // const wallet = new window.nearApi.WalletConnection(near, '');
  // var accountId = "";
  // if (wallet.isSignedIn()) {
  //   accountId = wallet.getAccountId();
  // }
  // const { currentUser } = useContext(AuthContext);
  // if (currentUser) {
  // }

const user = wallet.getAccountId();
let User = wallet.isSignedIn();
  const handleUser = async (e) => {
    if (User) {
      signOut()
    } else if (!User) {
      signIn()
      
    }
  }

  let navigate = useNavigate();

  return (

    <nav className="navbar sticky-top navbar-expand-lg navbar-light menu border-bottom-2">
      <div className="container ps-lg-0">
        <NavLink exact="true" activeclassname="active" to="/" className="navbar-brand text-light text-transform-uppercase font-size-18"><span className="color-theme">d<i>raw</i></span>s<i>tring</i></NavLink>
        <button className="navbar-toggler desk-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="search-box mx-3 tab-none">
          <input type="text" placeholder="Collection, item or user" />
          <div>
            <img src={search} className="search-icon" />
          </div>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink exact="true" activeclassname="active" to="/" className="nav-link active">Explore</NavLink>
              {/* collections */}
            </li>
            <li className="nav-item">
              <NavLink exact="true" activeclassname="active" to="/users/123" onClick={(e)=>{e.preventDefault(); !currentUser ? handleUser() : navigate('/users/123')}} className="nav-link">My profile</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact="true" activeclassname="active" to="/users" className="nav-link">Activity</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact="true" activeclassname="active" to="/" className="nav-link">How it works</NavLink>
              {/* viewcollection */}
            </li>
            <li className="nav-item">
              <NavLink exact="true" activeclassname="active" to="/product" className="nav-link">Community</NavLink>
            </li>
          </ul>
        </div>

        <ul className="navbar-nav me-auto mb-2 mb-lg-0 create-signin-btn">
          <li className="nav-item">
            <NavLink exact="true" activeclassname="active" to="/authors" className="create-link">Create</NavLink>
          </li>
          <li className="nav-item">

            {/* {!accountId && (
              <a href="#!" onClick={(e) => {
                e.preventDefault();

                wallet.requestSignIn(
                  "test_collection.snft.testnet",
                  "", // optional 
                  "http://localhost:3000",//"https://drawstring-react-test.web.app" // optional
                  "http://YOUR-URL.com/failure" // optional
                );
              }} className="login-link">Sign in</a>
            )} */}

{!User && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleUser()
                }}
                className="login-link"
              >
                Sign in
              </a>
            )}
          </li>
        </ul>

        {User && (
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <div
                type="button"
                className="btn toggle-link p-0 height-width me-3"
              >
                <img src={dp} />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item><h4>{user}</h4></Dropdown.Item>
              <Dropdown.Item></Dropdown.Item>
              <Dropdown.Item>Create Item</Dropdown.Item>
              <Dropdown.Item>View Collections</Dropdown.Item>
              <Dropdown.Item onClick={handleUser}>Sign out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

        {/* {accountId && (
          <button type="button" className="btn toggle-link p-0 height-width me-3" onClick={() => {
            //auth.signOut();
            wallet.signOut();

          }}><img src={dp} /></button>
        )} */}

        <div className="search-box mx-3 desk-none tab-block">
          <div className="mobile_serch-bar">
            <img src={search} className="search-icon" />
          </div>
          <div className="abs-serch-input">
            <input type="text" placeholder="Collection, item or user" />
          </div>

        </div>
        <ThemeContext.Consumer>
          {({ changeTheme }) => (
            <button type="button" className="btn toggle-link p-0 height-width" onClick={() => {
              setDarkMode(!darkMode);
              changeTheme(darkMode ? themes.light : themes.dark);
            }}><img src={darkMode ? day : night} /></button>
          )}
        </ThemeContext.Consumer>
        <button className="navbar-toggler desk-none d-block-992" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  )
}
