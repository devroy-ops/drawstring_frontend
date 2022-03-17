import '../App.css';
import { NavLink } from "react-router-dom";
import '../styles/home.css';
import arrow_back from '../images/home/arrow_back.svg';
import arrow_fwd from '../images/home/arrow_fwd.svg';
import images from '../images/home/images.svg';
import calendar from '../images/home/calendar.svg';
import arrow_down from '../images/home/arrow_down.svg';
import blockchain from '../images/home/blockchain.svg';
import category from '../images/home/category.svg';
import saletype from '../images/home/saletype.svg';
import price from '../images/home/price.svg';
import sort from '../images/home/sort.svg';
import more from '../images/home/more.svg';
import heart from '../images/home/heart.svg';
import { db } from "../db/firebase";
import React, { useEffect, useState } from "react";
import { Loader } from "../services/ui";
// import { Dropdown } from 'react-bootstrap';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { getUser, getUserForUpdateDb, mongodb } from '../db/mongodb';

import * as Realm from 'realm-web'
const app = new Realm.App({ id: "drawstringrealmapp-vafye"});

const Home = ({ contractX, account, wallet }) => {
    var [nfts, setNfts] = useState([]);
    const [isLoading, setLoader] = useState(false);
    const [listedNfts, setListedNfts] = useState([]);
    const [topNfts, setTopNfts] = useState([])
    const [featuredNfts, setFeaturedNfts] = useState([])
    const [allListing, setAllListing] = useState([])
    
    useEffect(() => {
        return getNFTs()
      }, [])
    
      const getNFTs = async () => {
        const credentials = Realm.Credentials.anonymous()
        const user = await app.logIn(credentials) // Authenticate the user
    
        const featured = await user.functions.get_featured()
        setFeaturedNfts(featured)
    
        const top = await user.functions.get_top_collections()
        setTopNfts(top)

        const allNftListing = await user.functions.get_all_listed_nfts()
        setAllListing(allNftListing)
      }
      console.log(topNfts);
      console.log(featuredNfts);
      console.log(allListing);

    useEffect(() => {
        return getNfts();
    }, []);

    const getNfts = async () => {
        setLoader(true);

        const user = await getUser();
        // const featured = await user.functions.get_featured();
         const allListedNfts = await user.functions.get_all_listed_nfts();
         console.log(allListedNfts)
         setListedNfts(allListedNfts);
        // const top = await user.functions.get_top_collections();

        mongodb.collection('nfts').find().then(nftss=>{
            setNfts(nftss);
            setLoader(false);
        })
    }

    const viewDrop = async (e) => {
        e.preventDefault();
    }

    const addLike = async (nft, index) =>{
        const newItems = [...listedNfts];
        newItems[index].likes = newItems[index].likes ? newItems[index].likes + 1 : 1;
        setListedNfts(newItems);

        const walletId = wallet.getAccountId();
        const user = await getUserForUpdateDb();
        await user.functions.add_like(walletId,nft.id, nft.contract_id);
    }

    let carousel;

    return (
        <div className="main-sec-full">
            {isLoading ? <Loader /> : null}

            <div className="pos-rel home_banner-section">
                <AliceCarousel ref={(el) => (carousel = el)} autoPlay infinite autoPlayInterval="3000" disableButtonsControls="true" disableDotsControls="true">
                    {nfts && nfts.length > 0 && nfts.filter(x => x.isMainSlideImage === true).map((nft, index) => {
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
                                                        <NavLink exact="true" activeclassname="active" to="/" className="create-link" onClick={viewDrop}>View Drop</NavLink>
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
                                                {nfts && nfts.length > 0 && nfts.filter(x => x.isSliderNft === true).slice(index * 4, index === 0 ? 4 : index * 4 + 4).map((nft, i) => {
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
                    <a href="/#" className="left-icon" onClick={(e) => { e.preventDefault(); carousel.slidePrev() }}><img src={arrow_back} alt="back icon for slider"/></a>
                    <a href="/#" className="right-icon" onClick={(e) => { e.preventDefault(); carousel.slideNext() }}><img src={arrow_fwd} alt="nack icon for slider"/></a>
                </div>
            </div>

            <div className="container home_featured mt-60">
                <div className="text-light title pb-3">
                    Featured NFT's
                </div>
                <div className="row pt-2">
                    {nfts && nfts.length > 0 && nfts.slice(0, 4).map((nft, index) => {
                            return (
                                <div className="col-sm-3" key={index}>
                                    <img src={nft?.nftData?.metadata?.media} className="img-fluid w-100 featured-img" alt="nft media"/>
                                </div>
                            )
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

                            <img src={images} className="ps-4" alt="file icon"/><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} alt="dropdown icon"/>

                            <img src={calendar} className="ps-4" alt="calendar icon"/><span className="font-size-14 vertical-align px-2"> In 1 day </span><img src={arrow_down} alt="dropdown icon"/>
                        </div>
                        <div className="col-sm-6 text-end">
                            <NavLink exact="true" activeclassname="active" to="/" className="login-link">View All</NavLink>
                        </div>
                    </div>
                    <div className="row pt-2 collection-name-tab-d">
                        {nfts && nfts.length > 0 && nfts.slice(0, 8).map((nft, index) => {
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
                        <img src={blockchain} className="ps-4" alt="blockchain icon"/><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} alt="dropdown icon"/>
                            <img src={category} className="ps-4" alt="category icon"/><span className="font-size-14 vertical-align px-2"> Category </span><img src={arrow_down} alt="dropdown icon"/>
                            <img src={images} className="ps-4" alt="images icon"/><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} alt="dropdown icon"/>
                            <img src={saletype} className="ps-4" alt="saletype icon"/><span className="font-size-14 vertical-align px-2"> Sale type </span><img src={arrow_down} alt="dropdown icon"/>
                            <img src={price} className="ps-4" alt="price icon"/><span className="font-size-14 vertical-align px-2"> Price range </span><img src={arrow_down} alt="dropdown icon"/>
                        </div>
                        <div className="col-sm-3 text-end">
                            <img src={sort} className="ps-4" alt="sort icon"/><span className="font-size-14 vertical-align px-2"> Sort By </span><img src={arrow_down} alt="dropdown icon"/>
                        </div>
                    </div>

                    <div className="row home_explore">
                        {listedNfts && listedNfts.length > 0 && listedNfts.map((nft, index) => {
                            return (
                                <div className="col-sm-3 pb-4" key={index}>
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
                                                    <img src={more} className="pb-1" alt="more icon"/>
                                                </div>
                                            </div>
                                        </div>
                                        <img src={nft.media_link} className="w-100" height="270" alt="nft media"/>
                                        <div className="text-light font-size-18 p-3">
                                            <div>{nft.name}</div>
                                            <div className="row pt-2 bid-mobile-100">
                                                <div className="col-sm-6">
                                                    {nft.price} ETN <span className="color-gray">1/1</span>
                                                </div>
                                                <div className="col-sm-6 text-end">
                                                    <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <button type="button" className="btn heart-btn p-0" onClick={()=>addLike(nft, index)}><img src={heart} alt="heart icon"/> <span className="color-gray">{nft.likes}</span></button>
                                                {/* <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} alt="heart icon"/> <span className="color-gray">{nft.likes}</span></NavLink> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        )}
                        {/* <div className="col-sm-3 pb-4">
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
                     */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;