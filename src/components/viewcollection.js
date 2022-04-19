import '../App.css';
import { useParams, NavLink } from "react-router-dom";
import collection1 from '../images/collection/collection1.svg';
import copy_icon from '../images/users/copy_icon.svg';
import upload from '../images/users/upload.svg';
import more from '../images/home/more.svg';
import '../styles/user.css';
import category from '../images/home/category.svg';
import saletype from '../images/home/saletype.svg';
import price from '../images/home/price.svg';
import sort from '../images/home/sort.svg';
import images from '../images/home/images.svg';
import arrow_down from '../images/home/arrow_down.svg';
import explore1 from '../images/home/explore1.svg';
import explore2 from '../images/home/explore2.svg';
import explore3 from '../images/home/explore3.svg';
import explore4 from '../images/home/explore4.svg';
import explore5 from '../images/home/explore5.svg';
import explore6 from '../images/home/explore6.svg';
import explore7 from '../images/home/explore7.svg';
import explore8 from '../images/home/explore8.svg';
import {initSmartContract} from '../services/helper';
import heart from '../images/home/heart.svg';
import { Tabs, Tab } from 'react-bootstrap';
import NftDetailModal from './nftmodal';
import React, { useEffect, useState } from "react";
import { init, author } from "../services/helper";
import { smartContractName } from '../services/utils';
import { Loader } from "../services/ui";

import { getUser, getUserForUpdateDb } from '../db/mongodb';

const ViewCollection = ({ contractX, account, wallet }) => {

    const [activeTab, setActive] = useState(1);
    const [collection, setCollection] = useState({});
    // const [contracts, setContract] = useState();
    const [isLoading, setLoader] = useState(false);
    const [listedNfts, setListedNfts] = useState([]);
    const [stats, setStats] = useState({});
    const [collectionNfts, setCollectionNfts] =useState([]);

    const handleSelect = (selectedTab) => {
        setActive(parseInt(selectedTab))
    }

// modal code
    const [nft, setNft] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleShow = (nftData) => {
        setNft(nftData);
        setShow(true);
    }

    const { collectionId } = useParams();
  
    const accountId = wallet.getAccountId();
    useEffect(() => {
        getAllListedNfts();
        return viewCollection();
    }, []);

    let contract = `${collectionId}.${smartContractName}`;
    /**
   * View the metadata of the contract(collection) using the contract.nft_metadata
   */
    const viewCollection = async () => {
        try {
            viewCollectionNfts()
            setLoader(true);
            const user = await getUser();
            const collection = await user.functions.get_collection_with_id(collectionId);
            console.log(collection);
            setCollection(collection[0]);

            // get stats
            const stat = await user.functions.get_stats(collection[0].contractId);
            const ownerStats = await user.functions.get_owner_stats(collection[0].contractId);
            var statData = stat[0];
            statData.ownerStats = ownerStats;

            setStats(statData);
            debugger;

            const response = await user.functions.get_nfts_in_collection(collectionId);
            console.log(response);
            setListedNfts(response);

            setLoader(false);

            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const viewCollectionNfts = async () => {
        
        try {
            let colNfts = []
            const colContract = await initSmartContract(wallet, contract)
            const response = await colContract.nft_tokens({
                "from_index": '0',
                "limit": 500
              });
            
            colNfts= response
            setCollectionNfts(colNfts)
            
           
            return response;
        } catch (error) {
            console.log(error);
        }
    };
   console.log(collectionNfts);
    const getAllListedNfts = async () => {
        setLoader(true);
        const user = await getUser();
        const allListedNfts = await user.functions.get_all_listed_nfts(40, 0);
        console.log(allListedNfts)
        setListedNfts(allListedNfts);
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
        <div className="bg-darkmode">
            {isLoading ? <Loader /> : null}
            <div className="pos-rel pb-5">
                <div className="bg-users height-240">

                </div>
                <div className="container pb-5 px-0">
                    <img src={collection?.img ? collection?.img : collection1} className="avtar-position" width="182" height="182" />

                </div>
            </div>
            <div className="container pb-5 px-0">
                <div className="text-light font-size-32 font-w-700">{collection?.name}</div>
                <div className="text-light pt-2">
                    <div className="copy-btn"> {accountId}<img src={copy_icon} className="float-end" /></div>
                </div>

                {stats && (
                    <div className="d-flex text-light pt-3 viw-call-details">
                        <div className="pe-5">
                            <div className="font-size-18"><b className="font-w-700">${stats.highest_sale}</b></div>
                            <div className="font-size-16">Highest Sale</div>
                        </div>
                        <div className="pe-5">
                            <div className="font-size-18"><b className="font-w-700">${stats.floor_price}</b></div>
                            <div className="font-size-16">Floor price</div>
                        </div>
                        <div className="pe-5">
                            <div className="font-size-18"><b className="font-w-700">${stats.marketCap}</b></div>
                            <div className="font-size-16">Market Cap</div>
                        </div>
                        <div className="pe-5">
                            <div className="font-size-18"><b className="font-w-700">{stats.count}</b></div>
                            <div className="font-size-16">Items</div>
                        </div>
                        <div className="pe-5">
                            <div className="font-size-18"><b className="font-w-700">{stats.ownerStats}</b></div>
                            <div className="font-size-16">Owners</div>
                        </div>
                        {/* <div>
                        <div className="font-size-18"><b className="font-w-700">$745.1M</b></div>
                        <div className="font-size-16">Total Volume</div>
                    </div> */}
                    </div>
                )}

                <div className="d-flex py-3 mt-4">
                    <button type="button" className="btn me-4 up-btn"><img src={upload} /></button>
                    <button type="button" className="btn more-btn"><img src={more} /></button>
                </div>
            </div>
            <div className="">
                <div className="container tabs-links px-0">
                    <Tabs activeKey={activeTab} onSelect={handleSelect}>
                        <Tab eventKey={1} title="Items">
                            {/* <div className="border-bottom-2"></div> */}
                            <div className="pb-4">
                                <div className="row title text-light pt-3 mb-2">
                                    <div className="col-sm-9">
                                        <img src={category} /><span className="font-size-14 vertical-align px-2"> Category </span><img src={arrow_down} />
                                        <img src={images} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Collections </span><img src={arrow_down} />
                                        <img src={saletype} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sale type </span><img src={arrow_down} />
                                        <img src={price} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Price range </span><img src={arrow_down} />
                                    </div>
                                    <div className="col-sm-3 text-end">
                                        <img src={sort} className="ps-4" /><span className="font-size-14 vertical-align px-2"> Sort By </span><img src={arrow_down} />
                                    </div>
                                </div>
                                <div className="row pt-2 view-collection-on-tab">
                                    {collectionNfts && collectionNfts.length > 0 && collectionNfts.map((nft, index) => {
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
                                                    <img src={nft.metadata.media} onClick={() => handleShow(nft)} className="w-100" height="270" alt="nft media" />
                                                    <div className="text-light font-size-18 p-3">
                                                        <div>{nft.metadata.title}</div>
                                                        <div className="row pt-2 bid-mobile-100">
                                                            {/* <div className="col-sm-6">
                                                                {nft.price} Near <span className="color-gray">1/1</span>
                                                            </div> */}
                                                            {/* <div className="col-sm-6 text-end">
                                                                <NavLink exact="true" activeclassname="active" to="/" className="bid-btn">Bid</NavLink>
                                                            </div> */}
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
                                            <div className="row py-2 px-3 ">
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
                                            <div className="row py-2 px-3 ">
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
                                                <div className="row pt-2 bid-mobile-100 ">
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
                                            <div className="row py-2 px-3 ">
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
                                            <div className="row py-2 px-3 ">
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
                                            <div className="row py-2 px-3 ">
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
                                    </div> */}
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey={2} title="Activity">Tab 2 content</Tab>
                        {/* <Tab eventKey={3} title="Stats">Tab 3 content</Tab> */}
                    </Tabs>
                </div>
            </div>
            {show && (
                <NftDetailModal nftData={nft} isModalOpen={show} handleClose={handleClose} wallet={wallet} />
            )}
        </div>
    );
}

export default ViewCollection;