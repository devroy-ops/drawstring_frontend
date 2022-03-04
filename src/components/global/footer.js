import React from "react";
import { NavLink } from "react-router-dom";
import '../../styles/footer.css';

function Footer() {
  return (
    <div>
      <footer className="menu text-white text-center text-lg-start border-top-2">
        <div className="container p-4 px-0">
          <div className="row">
            <div className="col-lg-5 col-md-6 mb-4 mb-md-0 pe-lg-5">
              <NavLink exact="true" activeclassname="active" to="/" className="navbar-brand text-light text-transform-uppercase font-size-18"><span className="color-theme">draw</span>string</NavLink>
              <p className="pe-5 font-size-16 pt-3 tab-none">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis
                molestias. Fugiat pariatur maxime quis culpa corporis vitae repudiandae aliquam
                voluptatem veniam, est atque cumque eum delectus sint!
                </p>

              <div className="slide-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
            <div className="col-lg-7 col-md-6">
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 className="footer-link-title mb-3">Explore</h5>
                  <ul className="list-unstyled">
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">Art</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">Photography</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">Music</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">Games</NavLink>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 className="footer-link-title mb-3">My Account</h5>
                  <ul className="list-unstyled">
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">My profile</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">My colloctions</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">My favorites</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">My account settings</NavLink>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 className="footer-link-title mb-3">Community</h5>
                  <ul className="list-unstyled">
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">About</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">Blog</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">Suggest feature</NavLink>
                    </li>
                    <li className="pb-2">
                      <NavLink exact="true" activeclassname="active" to="/" className="text-white footer-links">Newsletter</NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          <div className="row footer-btm">
            <div className="col-6 font-size-16">
              © Drawstring, Inc. All rights reserved.
            </div>
            <div className="col-6 text-end font-size-16">
              <a href="#" className="text-white">Terms </a> <a href="#" className="text-white">Privacy policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
