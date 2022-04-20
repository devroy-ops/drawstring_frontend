import '../App.css';
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import '../styles/home.css';
import calendar from '../images/home/calendar.svg';
import arrow_down from '../images/home/arrow_down.svg';
import audio from '../images/collection/audio_bg.png';
import price from '../images/home/price.svg';
import React, { useEffect, useState } from "react";
import { Loader } from "../services/ui";
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { getUser, getUserForUpdateDb, mongodb } from '../db/mongodb';

import * as Realm from 'realm-web'
import Nft from './viewnft';
import NftDetailModal from './nftmodal';
import { FileTypes, MarketplaceTypes } from '../enums/filetypes';
import { toast } from 'react-toastify';
import NftsLists from './nftslist';
import { buyOrRemoveFromSale, init, initSmartContract, initMarketplaceContract } from '../services/helper';

const app = new Realm.App({ id: "drawstringrealmapp-vafye" });

const Home = ({ contractX, account, wallet }) => {
    var [nfts, setNfts] = useState([]);
    const [isLoading, setLoader] = useState(false);
    const [listedNfts, setListedNfts] = useState([]);
    const [featuredNfts, setFeatured] = useState([]);
    const [topCollections, setTopCollections] = useState([]);
    const [count, setCount] = useState(0)
    const [nft, setNft] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleShow = (nftData) => {
        setNft(nftData);
        setShow(true);
    }

    useEffect(() => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_id: 'jkp123' })
        };
        fetch('http://drawstring.io:3000/create_account', requestOptions)
            .then(response => response.json())
            .then(data => {
                debugger;
            });

        const transactionHashes = searchParams.get("transactionHashes");
        buyOrRemoveFromSale(transactionHashes, wallet.getAccountId());
    }, []);


    // useEffect(() => {
    //     return getNfts();
    // }, [count]);

    useEffect(() => {
        return getNftsFromBlockChain();
    }, [count]);

    const getNftsFromBlockChain = async () => {
        // if (wallet.isSignedIn()) {

            setLoader(true);
            const user = await getUser();
            const contract = await initMarketplaceContract(wallet);

            const onSaleNfts = await contract.get_sales({
                from_index: (count * 12).toString(),
                limit: 12,
            });
            console.log("get_sales ", onSaleNfts);

            const sales = [];

            for (const sale of onSaleNfts) {
                const contract = await initSmartContract(wallet, sale.nft_contract_id)
                const nft = await contract.nft_token({ token_id: sale.token_id });
                const extra = nft.metadata.extra ? JSON.parse(nft.metadata.extra) : {};
                const nftData = {
                    id: nft.token_id,
                    name: nft.metadata.title,
                    owner: nft.owner_id,
                    createdBy: extra.creator_id || "",
                    contract_id: extra.contract_id || "",
                    collection_name: "",
                    media_link: nft.metadata.media,
                    type: extra.media_type || 'image',
                    price: extra.price || ""
                }
                sales.push({ ...nftData, ...sale, });
            }

            setListedNfts([...listedNfts, ...sales]);
            setLoader(false);
            console.log("listed nfts 1 ", listedNfts);
            console.log("sales 1 ", sales);

            getNfts(user);
            // after load nft get the more info to display from mongo db

            const nftsWithProfiles = [];
            for(const sale of sales){
                 const response = await user.functions.get_urls(sale.id);
                 console.log(" response ", response)
                //  sale.nftData = response ? response[0] : null;
                //  nftsWithProfiles.push(sale);
                const res = response[0];
                
                const profile = {
                    collectionName: res ? res.collection_details.name : "",
                    contractId: res ? res.collection_details.contractId : "",
                    collectionImage: res ? res.collection_details.img : "",
                    ownerImage: res ? res.owner_details.profile_pic : "" ,
                    //// TODO
                    //creatorImage: res ?  ,
                }

               nftsWithProfiles.push({...sale, ...profile});
            }

            setListedNfts([...listedNfts, ...nftsWithProfiles]);
            // console.log("listed nfts 2 ", nftsWithProfiles);

        // }
    }

    const getNfts = async (user) => {
        // setLoader(true);
      
        // const user = await getUser();
        // const featured = await user.functions.get_featured();
        // setFeatured(featured);
        // const allListedNfts = await user.functions.get_all_listed_nfts(12, count * 12);
        // console.log(allListedNfts)
        // setListedNfts([...listedNfts, ...allListedNfts]);

        const top = await user.functions.get_top_collections();
        console.log("top collections ", top)
        setTopCollections(top);
        // setLoader(false);
        // mongodb.collection('nfts').find().then(nftss => {
        //     setNfts(nftss);
        //     setLoader(false);
        // })
    }

    const viewDrop = async (e) => {
        e.preventDefault();
    }

    const addLike = async (nft, index) => {
        const newItems = [...listedNfts];
        newItems[index].likes = newItems[index].likes ? newItems[index].likes + 1 : 1;
        setListedNfts(newItems);

        const walletId = wallet.getAccountId();
        const user = await getUserForUpdateDb();
        await user.functions.add_like(walletId, nft.id, nft.contract_id);
    }

    const loadMore = () => {
        setCount((prev) => prev + 1)
    }

    let carousel;

    return (
        <div className="main-sec-full">
            {isLoading ? <Loader /> : null}

            <div className="pos-rel home_banner-section">
                {/* <AliceCarousel ref={(el) => (carousel = el)} disableButtonsControls="true" disableDotsControls="true">
                    {listedNfts && listedNfts.length > 0 && listedNfts.filter(x => x.isMainSlideNft === true).map((nft, index) => {
                        return (
                            <div className="sliderimg" key={index}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-7 pe-4">
                                            <div className="row first-box">
                                                <div className="col-sm-6 p-5 pb-3">
                                                    <div className="title text-light mb-3">Drawstring a NFT experience platform</div>
                                                    <div className="slide-desc text-light mb-3">The newest marketplace on Near</div>
                                                  * <div className="my-5">
                                                        <NavLink exact="true" activeclassname="active" to="/" className="create-link" onClick={viewDrop}>View Drop</NavLink>
                                                    </div> *
                                                    <div className="pos-rel">
                                                        <div className="long-line"></div>
                                                        <div className="short-line"></div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 first-box-image bg-size-100" style={{ backgroundImage: `url('${nft.media_link}')` }}></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-5">
                                            <div className="row">
                                                {listedNfts && listedNfts.length > 0 && listedNfts.filter(x => x.isChildSlideNft === true).slice(index * 4, index === 0 ? 4 : index * 4 + 4).map((nft, i) => {
                                                    return (
                                                        <div className="col-sm-6 col-xs-12 mb-4" key={i}>
                                                            <div className="bg-img1 pos-rel bg-size-100" style={{ backgroundImage: `url('${nft.media_link}')` }}>
                                                                * <div className="img-title">
                                                                    <div>{nft?.name}</div>
                                                                    <div>Collection</div>
                                                                </div> *
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
                </AliceCarousel> */}


                <AliceCarousel ref={(el) => (carousel = el)} disableButtonsControls="true" disableDotsControls="true">
                    {/* {listedNfts && listedNfts.length > 0 && listedNfts.filter(x => x.isMainSlideNft === true).map((nft, index) => { */}
                    {/* return ( */}
                    <div className="sliderimg" >
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-7 pe-4">
                                    <div className="row first-box">
                                        <div className="col-sm-6 p-5 pb-3">
                                            <div className="title text-light mb-3">Drawstring a NFT experience platform</div>
                                            <div className="slide-desc text-light mb-3">The newest marketplace on Near</div>
                                            {/* <div className="my-5">
                                                        <NavLink exact="true" activeclassname="active" to="/" className="create-link" onClick={viewDrop}>View Drop</NavLink>
                                                    </div> */}
                                            <div className="pos-rel">
                                                <div className="long-line"></div>
                                                <div className="short-line"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 first-box-image bg-size-100" style={{ backgroundImage: `url('${listedNfts && listedNfts[0]?.media_link}')` }} onClick={() => handleShow(listedNfts[0])}></div>
                                    </div>
                                </div>
                                <div className="col-sm-5">
                                    <div className="row">
                                        {listedNfts && listedNfts.length > 0 && listedNfts.slice(1, 5).map((nft, i) => {
                                            return (
                                                <div className="col-sm-6 col-xs-12 mb-4" key={i}>
                                                    <div className="bg-img1 pos-rel bg-size-100" style={{ backgroundImage: `url('${nft?.media_link}')` }} onClick={() => handleShow(nft)}>

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
                    {/* )
                    }
                    )} */}
                </AliceCarousel>

                {/* <div>
                    <a href="/#" className="left-icon" onClick={(e) => { e.preventDefault(); carousel.slidePrev() }}><img src={arrow_back} alt="back icon for slider"/></a>
                    <a href="/#" className="right-icon" onClick={(e) => { e.preventDefault(); carousel.slideNext() }}><img src={arrow_fwd} alt="nack icon for slider"/></a>
                </div> */}
            </div>

            <div className="container home_featured mt-60">
                {/* <div className="text-light title pb-3">
                    Featured NFT's
                </div> */}
                <div className="row pt-2">
                    {listedNfts && listedNfts.length > 0 && listedNfts.slice(0, 4).map((nft, i) => {
                        //{listedNfts && listedNfts.length > 0 && listedNfts.filter(x => x.isChildSlideNft === true).map((nft, i) => {
                        return (
                            <div className="col-sm-3" key={i}>
                                <img src={nft?.media_link} className="img-fluid w-100 featured-img" alt="nft media" onClick={() => handleShow(nft)} />
                            </div>
                        )
                    })
                    }
                </div>

                <div className="home-top-collection mt-60 ">
                    <div className="row pb-4">
                        <div className="col-sm-6 title text-light d-flex">
                            Top
                            {/* <img src={images} className="ps-4" alt="file icon" /><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} alt="dropdown icon" /> */}

                            <Dropdown className="ps-2" align="end">
                                <Dropdown.Toggle variant="" className='text-white font-size-14 vertical-align' id="dropdown-basic">
                                    <img src={calendar} className="ps-4" alt="calendar icon" /><span className="font-size-14 vertical-align px-2"> In 1 day </span><img src={arrow_down} alt="dropdown icon" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>1 day</Dropdown.Item>
                                    <Dropdown.Item>1 week</Dropdown.Item>
                                    <Dropdown.Item>1 month</Dropdown.Item>
                                    <Dropdown.Item>all time</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* <img src={calendar} className="ps-4" alt="calendar icon" /><span className="font-size-14 vertical-align px-2"> In 1 day </span><img src={arrow_down} alt="dropdown icon" /> */}
                        </div>
                        <div className="col-sm-6 text-end">
                            <NavLink exact="true" activeclassname="active" to="/collections" className="login-link">View All</NavLink>
                        </div>
                    </div>
                    <div className="row pt-2 collection-name-tab-d">
                        {topCollections && topCollections.length > 0 && topCollections.slice(0, 8).map((collection, index) => {
                            return (
                                <div className="col-sm-3 pb-4" key={index} >
                                    <div className="top-sec-box" onClick={() => { debugger; navigate(`/viewcollection/${collection.contract_id}`) }}>
                                        <div className="row p-3">
                                            <div className="col-sm-4">
                                                <div className="numbers float-start">0{index + 1}</div>
                                                <div>
                                                    {/* <img src={collection.img} alt="" className="border-radius-50" width="50" height="50"/> */}
                                                    {collection?.type.includes(FileTypes.IMAGE) && (
                                                        <img src={collection.media_link} className="border-radius-50" width="50" height="50" />
                                                    )}
                                                    {collection?.type.includes(FileTypes.VIDEO) && (
                                                        <video id="video1" className="border-radius-50" width="50" height="50">
                                                            <source src={nft.media_link} type="video/mp4" />
                                                        </video>
                                                    )}
                                                    {collection.type.includes(FileTypes.AUDIO) && (
                                                        <img src={audio} className="border-radius-50" width="50" height="50" alt="nft media" />
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-sm-8 text-light font-size-18">
                                                <OverlayTrigger overlay={<Tooltip>{collection.collection_name}</Tooltip>}>
                                                    <div className="collect-name text-ellipsis">{collection.collection_name}</div>
                                                </OverlayTrigger>
                                                <div className="color-gray">{collection.price} Near</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>

                    <div className="row title text-light pb-4 mt-60">
                        <div className="explore col-sm-9">
                            Discover
                            {/* <img src={blockchain} className="ps-4" alt="blockchain icon"/><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} alt="dropdown icon"/> */}
                            <div className='row'>
                                {/* <Dropdown className="col-sm-3" align="end">
                                <Dropdown.Toggle variant="" className='text-white font-size-14 vertical-align px-2' id="dropdown-basic">
                                <img src={category} className="ps-4" alt="category icon"/><span className="font-size-14 vertical-align px-2"> Category </span><img src={arrow_down} alt="dropdown icon"/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item>Music</Dropdown.Item>
                                <Dropdown.Item>Video</Dropdown.Item>
                                <Dropdown.Item>Animation</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                                {/* <Dropdown className="col-sm-3 ps-2" align="end">
                                    <Dropdown.Toggle variant="" className='text-white font-size-14 vertical-align' id="dropdown-basic">
                                        <img src={images} className="ps-4" alt="images icon" /><span className="font-size-14 vertical-align px-1">Collections</span><img src={arrow_down} alt="dropdown icon" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Music</Dropdown.Item>
                                        <Dropdown.Item>Video</Dropdown.Item>
                                        <Dropdown.Item>Animation</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown> */}
                                {/* <Dropdown className="col-sm-3" align="end">
                                <Dropdown.Toggle variant="" className='text-white font-size-14 vertical-align px-2' id="dropdown-basic">
                                <img src={saletype} className="ps-4" alt="saletype icon"/><span className="font-size-14 vertical-align px-2"> Sale type </span><img src={arrow_down} alt="dropdown icon"/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item>Auction</Dropdown.Item>
                                <Dropdown.Item>On Sale</Dropdown.Item>
                                <Dropdown.Item>Not on Sale</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                                <Dropdown className="col-sm-3" align="end">
                                    <Dropdown.Toggle variant="" className='text-white font-size-14 vertical-align px-4' id="dropdown-basic">
                                        <img src={price} className="ps-4" alt="price icon" /><span className="font-size-14 vertical-align px-6"> Price range </span><img src={arrow_down} alt="dropdown icon" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Free</Dropdown.Item>
                                        <Dropdown.Item>0 - 1 Near</Dropdown.Item>
                                        <Dropdown.Item>1-10 Near</Dropdown.Item>
                                        <Dropdown.Item>10+ Near</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        {/* <div className="col-sm-3 text-end">
                        <Dropdown className="col-sm-3" align="end">
                                <Dropdown.Toggle variant="" className='text-white font-size-14 vertical-align px-2' id="dropdown-basic">
                                <img src={images} className="ps-4" alt="images icon"/><span className="font-size-14 vertical-align px-2"> sort by </span><img src={arrow_down} alt="dropdown icon"/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item>Newest</Dropdown.Item>
                                <Dropdown.Item>Longest Price</Dropdown.Item>
                                <Dropdown.Item>Highest Price</Dropdown.Item>
                                <Dropdown.Item>Active Auctions</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div> */}
                    </div>

                    <div className="row home_explore">
                        {console.log("listedNfts html ", listedNfts)}
                        {listedNfts && listedNfts.length > 0 && (
                            <NftsLists nfts={listedNfts} wallet={wallet} />
                        )}

                        {show && (
                            <NftDetailModal nftData={nft} isModalOpen={show} handleClose={handleClose} wallet={wallet} />
                        )}
                        {/* {listedNfts && listedNfts.length > 0 && listedNfts.map((nft, index) => {
                            return (
                                <div className="col-sm-3 pb-4" key={index}>
                                    <div className="top-sec-box">
                                        <div className="row py-2 px-3">
                                            <div className="col-sm-8">
                                                <div className="d-flex">
                                                    <OverlayTrigger overlay={<Tooltip>Owner: {nft?.owner}</Tooltip>}>
                                                        <span className="d-inline-block" onClick={(e) => { e.preventDefault(); navigate(`/user/${nft.owner}`) }}>
                                                            <div className="explore-dot bg-pink"></div>
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>Creater: {nft?.owner}</Tooltip>}>
                                                        <span className="d-inline-block" onClick={(e) => { e.preventDefault(); navigate(`/user/${nft.owner}`) }}>
                                                            <div className="explore-dot bg-blue"></div>
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>Collection: {nft?.contract_id}</Tooltip>}>
                                                        <span className="d-inline-block" onClick={(e) => { e.preventDefault(); nft?.contract_id != "DrawstringMarketplace.near" ? navigate(`viewcollection/${nft.collection_name.toLowerCase().replace(/ /g, "_")}`) : e.preventDefault(); }}>
                                                            <div className="explore-dot bg-green"></div>
                                                        </span>
                                                    </OverlayTrigger>

                                                </div>
                                            </div>
                                            <div className="col-sm-4 ">
                                                <div className="explore-dot bg-black float-end" onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin.toString()}/nft/${nft.collection_name.toLowerCase().replace(/ /g, "_")}/${nft.id}`);
                                                    toast("copied user profile url", { type: "success" })
                                                }}>
                                                    <img src={upload} className="up-icon" />

                                                </div>
                                            </div>
                                        </div>

                                        {nft?.type.includes(FileTypes.IMAGE) && (
                                            <img src={nft.media_link} className="w-100" height="270" alt="nft media" onClick={() => handleShow(nft)} />
                                        )}
                                        {nft?.type.includes(FileTypes.VIDEO) && (
                                            <video width="100%" id="video" height="270" onClick={() => handleShow(nft)}>
                                                <source src={nft.media_link} type="video/mp4" />
                                            </video>
                                        )}
                                        {nft.type.includes(FileTypes.AUDIO) && (

                                            <img src={audio} className="w-100" height="270" alt="nft media" onClick={() => handleShow(nft)} />
                                        )}


                                        <div className="text-light font-size-18 p-3">
                                            <div>{nft.name}</div>
                                            <p className="color-gray col-name">{!nft.collection_name ? "" : nft.collection_name + " collection"}</p>
                                            <div className="row pt-2 bid-mobile-100">
                                                <div className="col-sm-6">
                                                    {nft.price} Near <span className="color-gray">1/1</span>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        )} */}
                        <div className='load'>
                            <button onClick={loadMore} className="load-more">
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* {show && (
                <NftDetailModal nftData={nft} isModalOpen={show} handleClose={handleClose} wallet={wallet} />
            )} */}

        </div>
    );
}

export default Home;