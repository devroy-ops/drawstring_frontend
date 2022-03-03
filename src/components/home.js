import '../App.css';
import { NavLink } from "react-router-dom";
import '../styles/home.css';

import arrow_back from '../images/home/arrow_back.svg';
import arrow_fwd from '../images/home/arrow_fwd.svg';

// import covid_santa from '../../images/home/covid_santa.svg';
// import logo from '../logo.svg';
// import featured1 from '../images/home/featured1.svg';
// import featured2 from '../images/home/featured2.svg';
// import featured3 from '../images/home/featured3.svg';
// import featured4 from '../images/home/featured4.svg';

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
import { db } from "../db/firebase";
import React, { useEffect, useState } from "react";
import { Loader } from "../services/ui";
import { Dropdown } from 'react-bootstrap';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

const Home = () => {
    var [nfts, setNfts] = useState([]);
    const [isLoading, setLoader] = useState(false);

    useEffect(() => {
        return getNfts();
    }, []);

    const getNfts = () => {
        setLoader(true);
        db.collection('nfts').get().then((querySnapshot) => {
            let nftss = [];
            querySnapshot.forEach(element => {
                var data = element.data();
                nftss = [...nftss, data];
            });
            setNfts(nftss);
            setLoader(false);
        });
    }

    let carousel;

    return (
        <div className="main-sec-full">
            {isLoading ? <Loader /> : null}

            <div className="pos-rel home_banner-section">
                <AliceCarousel ref={(el) => (carousel = el)} autoPlay autoPlayInterval="3000" disableButtonsControls="true" disableDotsControls="true">
                    {nfts && nfts.length > 0 && nfts.filter(x => x.isMainSlideImage == true).map((nft, index) => {
                        return (
                            <div className="sliderimg" key={index}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-7 pe-4">
                                            <div className="row first-box">
                                                <div className="col-sm-6 p-5 pb-3">
                                                    <div className="title text-light mb-3">{nft.nftData.metadata.description}</div>
                                                    <div className="slide-desc text-light mb-3">Going Live Wednesday 12 - 22 at 5 pm Est</div>
                                                    <div className="my-5">
                                                        <NavLink exact="true" activeclassname="active" to="/" className="create-link">View Drop</NavLink>
                                                    </div>
                                                    <div className="pos-rel">
                                                        <div className="long-line"></div>
                                                        <div className="short-line"></div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 first-box-image" style={{ backgroundImage: `url('${nft.nftData.metadata.media}')` }}></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-5">
                                            <div className="row">
                                                {nfts && nfts.length > 0 && nfts.filter(x => x.isSliderNft == true).slice(index * 4, index == 0 ? 4 : index * 4 + 4).map((nft, i) => {
                                                    return (
                                                        <div className="col-sm-6 col-xs-12 mb-4" key={i}>
                                                            <div className="bg-img1 pos-rel" style={{ backgroundImage: `url('${nft.nftData.metadata.media}')` }}>
                                                                <div className="img-title">
                                                                    <div>{nft?.nftData?.metadata?.title}</div>
                                                                    <div>Collection</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}
                </AliceCarousel>

                <div>
                    <a href="#" className="left-icon" onClick={(e) => { e.preventDefault(); carousel.slidePrev() }}><img src={arrow_back} /></a>
                    <a href="#" className="right-icon" onClick={(e) => { e.preventDefault(); carousel.slideNext() }}><img src={arrow_fwd} /></a>
                </div>
            </div>

            <div className="container home_featured mt-60">
                <div className="text-light title pb-3">
                    Featured NFT's
                </div>
                <div className="row pt-2">
                    {nfts && nfts.length > 0 && nfts.map((nft, index) => {
                        if (index < 4) {
                            return (
                                <div className="col-sm-3" key={index}>
                                    <img src={nft?.nftData?.metadata?.media} className="img-fluid w-100 featured-img" />
                                </div>
                            )
                        }
                    })
                    }
                    {/* <div className="col-sm-3">
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
                    </div> */}
                </div>

                <div className="home-top-collection mt-60 ">
                    <div className="row pb-4">
                        <div className="col-sm-6 title text-light">
                            Top
                            {/* <div>
                                <Dropdown>
                                    <Dropdown.Toggle variant="" id="dropdown-basic">
                                        <img src={images} /><span className="font-size-14 vertical-align px-2 text-light"> Collections </span><img src={arrow_down} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Dropdown>
                                    <Dropdown.Toggle variant="" id="dropdown-basic">
                                        <img src={calendar} /><span className="font-size-14 vertical-align px-2 text-light"> In 1 day </span><img src={arrow_down} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div> */}

                            <img src={images} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} />

                            <img src={calendar} className="ps-4" /><span className="font-size-14 vertical-align px-2"> In 1 day </span><img src={arrow_down} />
                        </div>
                        <div className="col-sm-6 text-end">
                            <NavLink exact="true" activeclassname="active" to="/" className="login-link">View All</NavLink>
                        </div>
                    </div>
                    <div className="row pt-2 collection-name-tab-d">
                        {nfts && nfts.length > 0 && nfts.map((nft, index) => {
                            if (index < 8) {
                                return (
                                    <div className="col-sm-3 pb-4" key={index}>
                                        <div className="top-sec-box">
                                            <div className="row p-3">
                                                <div className="col-sm-4">
                                                    <div className="numbers float-start">0{index + 1}</div>
                                                    <div className="r-text float-end">R</div>
                                                </div>
                                                <div className="col-sm-8 text-light font-size-18">
                                                    <div className="collect-name">{nft?.nftData?.metadata?.title}</div>
                                                    <div className="color-gray">{nft.nftData.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                        }
                        {/* <div className="col-sm-3 pb-4">
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
                        </div>*/}
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
    );

}

export default Home;