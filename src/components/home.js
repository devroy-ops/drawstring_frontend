import logo from '../logo.svg';
import '../App.css';
import React from 'react';
// import covid_santa from '../../images/home/covid_santa.svg';
import { NavLink } from "react-router-dom";
import '../styles/home.css';

import arrow_back from '../images/home/arrow_back.svg';
import arrow_fwd from '../images/home/arrow_fwd.svg';

import featured1 from '../images/home/featured1.svg';
import featured2 from '../images/home/featured2.svg';
import featured3 from '../images/home/featured3.svg';
import featured4 from '../images/home/featured4.svg';

import images from '../images/home/images.svg';
import calendar from '../images/home/calendar.svg';
import arrow_down from '../images/home/arrow_down.svg';

import blockchain from '../images/home/blockchain.svg';
import category from '../images/home/category.svg';
import saletype from '../images/home/saletype.svg';
import price from '../images/home/price.svg';
import sort from '../images/home/sort.svg';
import more from '../images/home/more.svg';

import explore1 from '../images/home/explore1.svg';
import explore2 from '../images/home/explore2.svg';
import explore3 from '../images/home/explore3.svg';
import explore4 from '../images/home/explore4.svg';
import explore5 from '../images/home/explore5.svg';
import explore6 from '../images/home/explore6.svg';
import explore7 from '../images/home/explore7.svg';
import explore8 from '../images/home/explore8.svg';

import heart from '../images/home/heart.svg';

import { db, auth } from "../db/firebase";


class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = { name: props.name };

    }

    render() {
        return this.home();
    }

    home() {
        return (
            <div className="main-sec-full">
                <div className="pos-rel home_banner-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-7 pe-4">
                                <div className="row first-box">
                                    <div className="col-sm-6 p-5 pb-3">
                                        <div className="title text-light mb-3">Canibus of Bust’d Labs - Covid Santa</div>
                                        <div className="slide-desc text-light mb-3">Going Live Wednesday 12 - 22 at 5 pm Est</div>
                                        <div className="my-5">
                                            <NavLink exact="true" activeclassname="active" to="/" className="create-link">View Drop</NavLink>
                                        </div>

                                        <div className="pos-rel">
                                            <div className="long-line"></div>
                                            <div className="short-line"></div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 first-box-image"></div>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="row">
                                    <div className="col-sm-6 col-xs-12 mb-4">
                                        <div className="bg-img1 pos-rel">
                                            <div className="img-title">
                                                <div>Project name</div>
                                                <div>Collection</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 d-xs-none mb-4">
                                        <div className="bg-img2 pos-rel">
                                            <div className="img-title">
                                                <div>Project name</div>
                                                <div>Collection</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="bg-img3 pos-rel">
                                            <div className="img-title">
                                                <div>Project name</div>
                                                <div>Collection</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="bg-img4 pos-rel">
                                            <div className="img-title">
                                                <div>Project name</div>
                                                <div>Collection</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <img src={arrow_back} className="left-icon" />
                        <img src={arrow_fwd} className="right-icon" />
                    </div>
                </div>

                <div className="container home_featured mt-60">
                    <div className="text-light title pb-3">
                        Featured NFT's
                </div>
                    <div className="row pt-2">
                        <div className="col-sm-3">
                            <img src={featured1} className="img-fluid w-100" />
                        </div>
                        <div className="col-sm-3">
                            <img src={featured2} className="img-fluid w-100" />
                        </div>
                        <div className="col-sm-3">
                            <img src={featured3} className="img-fluid w-100" />
                        </div>
                        <div className="col-sm-3">
                            <img src={featured4} className="img-fluid w-100" />
                        </div>
                    </div>

                    <div className="home-top-collection mt-60 ">
                        <div className="row pb-4">
                            <div className="col-sm-6 title text-light">
                                Top
                            <img src={images} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} />

                                <img src={calendar} className="ps-4" /><span className="font-size-14 vertical-align px-2"> In 1 day </span><img src={arrow_down} />
                            </div>
                            <div className="col-sm-6 text-end">
                                <NavLink exact="true" activeclassname="active" to="/" className="login-link">View All</NavLink>
                            </div>
                        </div>
                        <div className="row pt-2 collection-name-tab-d">
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row p-3">
                                        <div className="col-sm-4">
                                            <div className="numbers float-start">01</div>
                                            <div className="r-text float-end">R</div>
                                        </div>
                                        <div className="col-sm-8 text-light font-size-18">
                                            <div className="collect-name">Collection name</div>
                                            <div className="color-gray">$2,593,251</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row p-3">
                                        <div className="col-sm-4">
                                            <div className="numbers float-start">01</div>
                                            <div className="r-text float-end">R</div>
                                        </div>
                                        <div className="col-sm-8 text-light font-size-18">
                                            <div className="collect-name">Collection name</div>
                                            <div className="color-gray">$2,593,251</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row p-3">
                                        <div className="col-sm-4">
                                            <div className="numbers float-start">01</div>
                                            <div className="r-text float-end">R</div>
                                        </div>
                                        <div className="col-sm-8 text-light font-size-18">
                                            <div className="collect-name">Collection name</div>
                                            <div className="color-gray">$2,593,251</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row p-3">
                                        <div className="col-sm-4">
                                            <div className="numbers float-start">01</div>
                                            <div className="r-text float-end">R</div>
                                        </div>
                                        <div className="col-sm-8 text-light font-size-18">
                                            <div className="collect-name">Collection name</div>
                                            <div className="color-gray">$2,593,251</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="top-sec-box">
                                    <div className="row p-3">
                                        <div className="col-sm-4">
                                            <div className="numbers float-start">01</div>
                                            <div className="r-text float-end">R</div>
                                        </div>
                                        <div className="col-sm-8 text-light font-size-18">
                                            <div className="collect-name">Collection name</div>
                                            <div className="color-gray">$2,593,251</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="top-sec-box">
                                    <div className="row p-3">
                                        <div className="col-sm-4">
                                            <div className="numbers float-start">01</div>
                                            <div className="r-text float-end">R</div>
                                        </div>
                                        <div className="col-sm-8 text-light font-size-18">
                                            <div className="collect-name">Collection name</div>
                                            <div className="color-gray">$2,593,251</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="top-sec-box">
                                    <div className="row p-3">
                                        <div className="col-sm-4">
                                            <div className="numbers float-start">01</div>
                                            <div className="r-text float-end">R</div>
                                        </div>
                                        <div className="col-sm-8 text-light font-size-18">
                                            <div className="collect-name">Collection name</div>
                                            <div className="color-gray">$2,593,251</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="top-sec-box">
                                    <div className="row p-3">
                                        <div className="col-sm-4">
                                            <div className="numbers float-start">01</div>
                                            <div className="r-text float-end">R</div>
                                        </div>
                                        <div className="col-sm-8 text-light font-size-18">
                                            <div className="collect-name">Collection name</div>
                                            <div className="color-gray">$2,593,251</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row title text-light pb-4 mt-60">
                            <div className="col-sm-9">
                                Explore
                        <img src={blockchain} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} />
                                <img src={category} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Category </span><img src={arrow_down} />
                                <img src={images} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} />
                                <img src={saletype} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sale type </span><img src={arrow_down} />
                                <img src={price} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Price range </span><img src={arrow_down} />
                            </div>
                            <div className="col-sm-3 text-end">
                                <img src={sort} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sort By </span><img src={arrow_down} />
                            </div>
                        </div>

                        <div className="row home_explore">
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={explore1} className="w-100" />
                                    <div className="text-light font-size-18 p-3">
                                        <div>Project name</div>
                                        <div className="row pt-2 bid-mobile-100">
                                            <div className="col-sm-6">
                                                3.89 ETN <span className="color-gray">1/1</span>
                                            </div>
                                            <div className="col-sm-6 text-end">
                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} /> <span className="color-gray">18</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={explore2} className="w-100" />
                                    <div className="text-light font-size-18 p-3">
                                        <div>Project name</div>
                                        <div className="row pt-2 bid-mobile-100">
                                            <div className="col-sm-6">
                                                3.89 ETN <span className="color-gray">1/1</span>
                                            </div>
                                            <div className="col-sm-6 text-end">
                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} /> <span className="color-gray">18</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={explore3} className="w-100" />
                                    <div className="text-light font-size-18 p-3">
                                        <div>Project name</div>
                                        <div className="row pt-2 bid-mobile-100">
                                            <div className="col-sm-6">
                                                3.89 ETN <span className="color-gray">1/1</span>
                                            </div>
                                            <div className="col-sm-6 text-end">
                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} /> <span className="color-gray">18</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={explore4} className="w-100" />
                                    <div className="text-light font-size-18 p-3">
                                        <div>Project name</div>
                                        <div className="row pt-2 bid-mobile-100">
                                            <div className="col-sm-6">
                                                3.89 ETN <span className="color-gray">1/1</span>
                                            </div>
                                            <div className="col-sm-6 text-end">
                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} /> <span className="color-gray">18</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={explore5} className="w-100" />
                                    <div className="text-light font-size-18 p-3">
                                        <div>Project name</div>
                                        <div className="row pt-2 bid-mobile-100">
                                            <div className="col-sm-6">
                                                3.89 ETN <span className="color-gray">1/1</span>
                                            </div>
                                            <div className="col-sm-6 text-end">
                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} /> <span className="color-gray">18</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={explore6} className="w-100" />
                                    <div className="text-light font-size-18 p-3">
                                        <div>Project name</div>
                                        <div className="row pt-2 bid-mobile-100">
                                            <div className="col-sm-6">
                                                3.89 ETN <span className="color-gray">1/1</span>
                                            </div>
                                            <div className="col-sm-6 text-end">
                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} /> <span className="color-gray">18</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={explore7} className="w-100" />
                                    <div className="text-light font-size-18 p-3">
                                        <div>Project name</div>
                                        <div className="row pt-2 bid-mobile-100">
                                            <div className="col-sm-6">
                                                3.89 ETN <span className="color-gray">1/1</span>
                                            </div>
                                            <div className="col-sm-6 text-end">
                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} /> <span className="color-gray">18</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 pb-4">
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={explore8} className="w-100" />
                                    <div className="text-light font-size-18 p-3">
                                        <div>Project name</div>
                                        <div className="row pt-2 bid-mobile-100">
                                            <div className="col-sm-6">
                                                3.89 ETN <span className="color-gray">1/1</span>
                                            </div>
                                            <div className="col-sm-6 text-end">
                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} /> <span className="color-gray">18</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // <div className="App">
            //     <header className="App-header" onClick={() => this.testClick("test")}>
            //         <img src={logo} className="App-logo" alt="logo" />
            //         <p>
            //             {this.state.name}
            //         </p>
            //     </header>
            // </div>
        );
    }

    testClick(what) {
    }
}


export default Home;