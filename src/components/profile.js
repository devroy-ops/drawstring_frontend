// import logo from '../logo.svg';
import '../App.css';
// import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
// import avtar from '../images/users/avatar.svg';
import twitter from '../images/users/twitterlogo.svg';
// import bg_users from '../images/users/bg_users.svg';
import copy_icon from '../images/users/copy_icon.svg';
import upload from '../images/users/upload.svg';
import more from '../images/home/more.svg';
import '../styles/user.css';
import { NavLink, useParams } from "react-router-dom";
// import blockchain from '../images/home/blockchain.svg';
import category from '../images/home/category.svg';
import saletype from '../images/home/saletype.svg';
import price from '../images/home/price.svg';
import sort from '../images/home/sort.svg';
import images from '../images/home/images.svg';
import arrow_down from '../images/home/arrow_down.svg';
// import explore1 from '../images/home/explore1.svg';
// import explore2 from '../images/home/explore2.svg';
// import explore3 from '../images/home/explore3.svg';
// import explore4 from '../images/home/explore4.svg';
// import explore5 from '../images/home/explore5.svg';
// import explore6 from '../images/home/explore6.svg';
// import explore7 from '../images/home/explore7.svg';
// import explore8 from '../images/home/explore8.svg';
import heart from '../images/home/heart.svg';
import { toast } from 'react-toastify';
import { Tabs, Tab } from 'react-bootstrap';
import { getUser, getUserForUpdateDb } from '../db/mongodb';
import { Loader } from '../services/ui';
import NftsLists from './nftslist';


const Profile = ({ contractX, account, wallet }) => {

    //const accountId = wallet.getAccountId();
    const [collections, setCollections] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [author, setAuthor] = useState({});
    const [isLoading, setLoader] = useState(false);
    const [listedNfts, setListedNfts] = useState([]);
    debugger;
    const { userId } = useParams();

    const accountId = userId ? userId : wallet.getAccountId();

    const handleSelect = (selectedTab) => {
        setActiveTab(parseInt(selectedTab))
    }

    useEffect(() => {
        return getProfile();
    }, []);

    const getProfile = async () => {
        debugger;
        setLoader(true);
        const user = await getUserForUpdateDb();
        const response = await user.functions.get_profile(accountId);
        console.log(response);
        setAuthor(response);
        setLoader(false);

        getAllListedNfts();
        getCollections();
    }

    const getAllListedNfts = async () => {
        setLoader(true);
        const user = await getUser();
        const allListedNfts = await user.functions.get_nfts_by_owner(accountId);
        console.log(allListedNfts);
        setListedNfts(allListedNfts);
        setLoader(false);
    }

    const getCollections = async () => {
        setLoader(true);
        const user = await getUser();
        //const top = await user.functions.get_collections(limit, offset)
        const response = await user.functions.get_collections(500, 0);
        console.log(response);
        debugger
        setCollections(response);
        setLoader(false);
    }

    const addLike = async (nft, index) => {
        const newItems = [...listedNfts];
        newItems[index].likes = newItems[index].likes ? newItems[index].likes + 1 : 1;
        setListedNfts(newItems);

        const walletId = wallet.getAccountId();
        const user = await getUserForUpdateDb();
        await user.functions.add_like(walletId, nft.id, nft.contract_id);
    }

    return (
        <div className="bg-darkmode ueser-pages">
            {isLoading ? <Loader /> : null}
            <div className="pos-rel pb-5">
                <div className="bg-profile height-240 banner-bg" style={{ backgroundImage: `url('${author?.bannerImageUrl}')` }}>

                </div>
                <div className="container pb-5 px-0">
                    <img src={author?.profile_pic} className="avtar-position edit-profile-pic-input" width="186" height="186" />
                </div>
            </div>
            <div className="container pb-5 px-0">
                <div className="text-light font-size-32 font-w-700">{author?.display_name}</div>
                <div className="d-flex text-light">
                    <div className="pt-1 pe-4 font-size-24"> <a href={author?.twitter} target="_blank" rel="noopener noreferrer"><img src={twitter} alt="twitter link" width="30" height="30" /></a> </div>
                    <div className="copy-btn"> {accountId} <img src={copy_icon} className="float-end" 
                    onClick={() => {
                        navigator.clipboard.writeText(`${author?.twitter}`);
                        toast("copied twitter profile link", { type: "success" })
                    }}/></div>
                </div>

                <div className="row pt-3">
                    <div className="col-sm-6 auther-desc mt-2">
                        {author?.bio}
                        {/* Author's name is a travel and documentary photographer based in Quebec, Canada. She documents streets, cultures and landscapes. */}
                    </div>
                </div>
                {/* <div className="d-flex text-light pt-4 font-size-18 color-white">
                    <div className="pe-5">150 followers</div>
                    <div>150 following</div>
                </div> */}
                <div className="d-flex py-4">
                    {/* <button type="button" className="btn follow-btn">Follow</button> */}
                    <button type="button" onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin.toString() + "/user/" + accountId}`);
                        toast("copied user profile url", { type: "success" })
                    }} className="btn mx-4 up-btn"><img src={upload} /></button>
                    <button type="button" className="btn more-btn"><img src={more} /></button>
                </div>
            </div>
            <div className="">
                <div className="container tabs-links px-0">
                    <Tabs activeKey={activeTab} onSelect={handleSelect}>
                        <Tab eventKey={1} title={`On sale ${listedNfts.filter(x=>x.is_live === true).length}`}>
                            {/* <div className="border-bottom-2"></div> */}
                            <div className="pb-4">
                                <div className="row title text-light pt-3">
                                    <div className="col-sm-9">
                                        {/* <img src={blockchain} className="" /><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} /> */}
                                        <img src={category} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Category </span><img src={arrow_down} />
                                        <img src={images} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} />
                                        <img src={saletype} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sale type </span><img src={arrow_down} />
                                        <img src={price} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Price range </span><img src={arrow_down} />
                                    </div>
                                    <div className="col-sm-3 text-end">
                                        <img src={sort} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sort By </span><img src={arrow_down} />
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    {listedNfts && listedNfts.length > 0 && listedNfts.filter(x=>x.is_live === true).map((nft, index) => {
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
                                                                <img src={more} className="pb-1" alt="more icon" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <img src={nft.media_link} className="w-100" height="270" alt="nft media" />
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
                                                            <button type="button" className="btn heart-btn p-0" onClick={() => addLike(nft, index)}><img src={heart} alt="heart icon" /> <span className="color-gray">{nft.likes}</span></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}

                                    {/* {listedNfts && listedNfts.filter(x=>x.is_live === true) > 0 && (
                                        <NftsLists nfts={listedNfts.filter(x=>x.is_live === true)} wallet={wallet}/>
                                    )} */}

                                    {listedNfts && listedNfts.length == 0 && (
                                        <div className="alert alert-secondary" role="alert">
                                        No data available
                                        </div>
                                    )}
                                    
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey={2} title={`Created ${listedNfts.filter(x=>x.owner === accountId).length}`}>
                        <div className="pb-4">
                                <div className="row title text-light pt-3">
                                    <div className="col-sm-9">
                                        {/* <img src={blockchain} className="" /><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} /> */}
                                        <img src={category} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Category </span><img src={arrow_down} />
                                        <img src={images} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} />
                                        <img src={saletype} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sale type </span><img src={arrow_down} />
                                        <img src={price} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Price range </span><img src={arrow_down} />
                                    </div>
                                    <div className="col-sm-3 text-end">
                                        <img src={sort} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sort By </span><img src={arrow_down} />
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    {listedNfts && listedNfts.length > 0 && listedNfts.filter(x=>x.owner === accountId).map((nft, index) => {
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
                                                                <img src={more} className="pb-1" alt="more icon" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <img src={nft.media_link} className="w-100" height="270" alt="nft media" />
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
                                                            <button type="button" className="btn heart-btn p-0" onClick={() => addLike(nft, index)}><img src={heart} alt="heart icon" /> <span className="color-gray">{nft.likes}</span></button>
                                                            {/* <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} alt="heart icon"/> <span className="color-gray">{nft.likes}</span></NavLink> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}

                                    {listedNfts && listedNfts.length == 0 && (
                                        <div className="alert alert-secondary" role="alert">
                                        No data available
                                        </div>
                                    )}
                                    
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey={3} title={`Owned ${listedNfts.filter(x=>x.owner === accountId).length}`}>
                        <div className="pb-4">
                                <div className="row title text-light pt-3">
                                    <div className="col-sm-9">
                                        {/* <img src={blockchain} className="" /><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} /> */}
                                        <img src={category} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Category </span><img src={arrow_down} />
                                        <img src={images} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} />
                                        <img src={saletype} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sale type </span><img src={arrow_down} />
                                        <img src={price} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Price range </span><img src={arrow_down} />
                                    </div>
                                    <div className="col-sm-3 text-end">
                                        <img src={sort} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sort By </span><img src={arrow_down} />
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    {listedNfts && listedNfts.length > 0 && listedNfts.filter(x=>x.owner === accountId).map((nft, index) => {
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
                                                                <img src={more} className="pb-1" alt="more icon" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <img src={nft.media_link} className="w-100" height="270" alt="nft media" />
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
                                                            <button type="button" className="btn heart-btn p-0" onClick={() => addLike(nft, index)}><img src={heart} alt="heart icon" /> <span className="color-gray">{nft.likes}</span></button>
                                                            {/* <NavLink exact="true" activeclassname="active" to="/" className="heart-btn"><img src={heart} alt="heart icon"/> <span className="color-gray">{nft.likes}</span></NavLink> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}

                                    {listedNfts && listedNfts.length == 0 && (
                                        <div className="alert alert-secondary" role="alert">
                                        No data available
                                        </div>
                                    )}
                                    
                                </div>
                            </div>
                        </Tab>
                        {/* <Tab eventKey={4} title="Liked  18">Tab 4 content is displayed by default</Tab>
                        <Tab eventKey={5} title="Activity">Tab 5 content</Tab> */}
                        <Tab eventKey={6} title="Collabs">
                            <div className="alert alert-secondary" role="alert">
                                No data available
                            </div>
                        </Tab>
                        <Tab eventKey={7} title="Collections">
                            <div className='mt-4'>
                            <div className="row home_explore">
                                {/* {isLoading ? <Loader /> : null} */}
                                {collections && collections.length > 0 && collections.map((collection, index) => {
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
                                                            <img src={more} className="pb-1" alt="more icon" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <img src={collection.img} className="w-100" height="270" alt="collection media" />
                                                {/* onClick={() => handleShow(nft)}  */}
                                                <div className="text-light font-size-18 p-3">
                                                    <div>{collection.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                )}
                            </div>
                            </div>
                        </Tab>
                    </Tabs>



                </div>
            </div>
        </div>
    );

}
export default Profile;