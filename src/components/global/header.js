// import React from "react";
import React, { useCallback, useContext, useEffect, useState } from "react";
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
import logo from '../../images/header/logo.png'
import { NearContext } from '../../contexts';
import { getUser } from "../../db/mongodb";
import { scroller } from "react-scroll";
import {balance} from "../../services/utils";

export default function Header({currentUser, wallet, nearConfig }) {

  const [darkMode, setDarkMode] = React.useState(true);
  const { signIn, signOut } = useContext(NearContext);
  const [profile, setProfile] = useState({});

 const scrollToSection = () => {
    scroller.scrollTo("explore", {
      duration: 500,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };
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
 
 
let available = balance()
 
  let navigate = useNavigate();
  const user = wallet.getAccountId();
  let User = wallet.isSignedIn();
  const handleUser = async (e) => {
    if (User) {
      signOut().then(()=> navigate("/"));
      
    } else if (!User) {
      signIn().then(()=> navigate("/"));
    }
  }

  useEffect(() => {
    console.log(available, 'available');
    return getProfile();
  }, [])

  const getProfile = async () => {
    if (user) {
      const muser = await getUser();
      const pro = await muser.functions.get_profile(user);
      console.log(pro)
      setProfile(pro);
    }
  };



  return (

    <nav className="navbar sticky-top navbar-expand-lg navbar-light menu border-bottom-2">
      <div className="container ps-lg-0">
        <NavLink exact="true" activeclassname="active" to="/" className="navbar-brand text-light text-transform-uppercase font-size-18"><span className="color-theme"><img className="logo" src={logo} alt="logo" /></span></NavLink>
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
              <div onClick={() => { scrollToSection() }} className="nav-link discover active">Discover</div>
              {/* collections */}
            </li>
            <li className="nav-item">
              <NavLink exact="true" activeclassname="active" to="/myprofile" onClick={(e) => { e.preventDefault(); !User ? handleUser() : navigate(`/user/${wallet.getAccountId()}`) }} className="nav-link">Profile</NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink exact="true" activeclassname="active" to="/about" onClick={(e) => { e.preventDefault(); navigate("/about") }} className="nav-link">Wtf?</NavLink>

            </li> */}
            <li className="nav-item">
              <NavLink exact="true" activeclassname="active" to="/about" onClick={(e) => { e.preventDefault(); navigate("/about") }} className="nav-link">About</NavLink>
            </li>
          </ul>
        </div>

        <ul className="navbar-nav me-auto mb-2 mb-lg-0 create-signin-btn">
          <li className="nav-item">
            <NavLink exact="true" activeclassname="active" to="/mintnft" className="create">Create</NavLink>
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
          <Dropdown align="end">
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <div
                type="button"
                className="btn toggle-link p-0 height-width me-3"
              >
                <img src={(profile && profile.profile_pic) ? profile?.profile_pic : dp} width="44" className="border-radius-50" />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item> {user}</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>{parseFloat(available).toFixed(2)} NEAR</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={(e) => { e.preventDefault(); navigate("/createcollection") }}>Create Collection</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { e.preventDefault(); navigate("/mintnft") }}>Mint Nft</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { e.preventDefault(); navigate(`/user/${wallet.getAccountId()}`) }}>My Profile</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { e.preventDefault(); navigate("/editprofile") }}>Edit Profile</Dropdown.Item>
              {/* <Dropdown.Item onClick={(e) => { e.preventDefault(); navigate("/collections") }}>View Collections</Dropdown.Item>
              <Dropdown.Item onClick={(e) => { e.preventDefault(); navigate("/nfts") }}>View Nfts</Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleUser} className="text-center">Sign out</Dropdown.Item>
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
