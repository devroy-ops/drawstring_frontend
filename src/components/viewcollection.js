import '../App.css';
import { useParams, NavLink } from "react-router-dom";
import avtar from '../images/users/avtar.svg';
import collection1 from '../images/collection/collection1.svg';
import bg_users from '../images/users/bg_users.svg';
import copy_icon from '../images/users/copy_icon.svg';
import upload from '../images/users/upload.svg';
import more from '../images/home/more.svg';

import '../styles/user.css';
import blockchain from '../images/home/blockchain.svg';
import category from '../images/home/category.svg';
import saletype from '../images/home/saletype.svg';
import price from '../images/home/price.svg';
import sort from '../images/home/sort.svg';
import images from '../images/home/images.svg';
import calendar from '../images/home/calendar.svg';
import arrow_down from '../images/home/arrow_down.svg';

import explore1 from '../images/home/explore1.svg';
import explore2 from '../images/home/explore2.svg';
import explore3 from '../images/home/explore3.svg';
import explore4 from '../images/home/explore4.svg';
import explore5 from '../images/home/explore5.svg';
import explore6 from '../images/home/explore6.svg';
import explore7 from '../images/home/explore7.svg';
import explore8 from '../images/home/explore8.svg';

import heart from '../images/home/heart.svg';

import { Tabs, Tab } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";
import { init, author, GAS, mint_txFee } from "../services/helper";
import { Loader } from "../services/ui";

const ViewCollection = ({ contractX, account, wallet }) => {

    const [activeTab, setActive] = useState(1);
    const [collection, setCollection] = useState({});
    const [contracts, setContract] = useState();
    const [isLoading, setLoader] = useState(false);

    const handleSelect = (selectedTab) => {
        setActive(parseInt(selectedTab))
    }

    const { authorId, collectionId } = useParams();

    const init1 = async () => {
        setLoader(true);
        var auther = await author(authorId);
        contract = await init(wallet, auther);
        setContract(contract);
        const response = await viewCollection();
        setCollection(response);

        setLoader(false);
    };

    useEffect(() => {
        //return init();
        return init1()
    }, []);

    let contract;


    /**
   * View the metadata of the contract(collection) using the contract.nft_metadata
   */
    const viewCollection = async () => {
        try {
            const response = await contract.nft_token({ token_id: collectionId });
            console.log(response);

            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-darkmode">
             {isLoading ? <Loader /> : null}
            <div className="pos-rel pb-5">
                <div className="bg-users height-240">

                </div>
                <div className="container pb-5 px-0">
                    <img src={collection?.metadata?.media ? collection?.metadata?.media : collection1} className="avtar-position" width="182" height="182"/>
                </div>
            </div>
            <div className="container pb-5 px-0">
                <div className="text-light font-size-32 font-w-700">{collection?.metadata?.title}</div>
                <div className="text-light pt-2">
                    <div className="copy-btn"> #27513 0x47BE...6f4f  <img src={copy_icon} className="float-end" /></div>
                </div>

                <div className="d-flex text-light pt-3 viw-call-details">
                    <div className="pe-5">
                        <div className="font-size-18"><b className="font-w-700">$1.4M</b></div>
                        <div className="font-size-16">Highest Sale</div>
                    </div>
                    <div className="pe-5">
                        <div className="font-size-18"><b className="font-w-700">$24.1K</b></div>
                        <div className="font-size-16">Floor price</div>
                    </div>
                    <div className="pe-5">
                        <div className="font-size-18"><b className="font-w-700">$252.8M</b></div>
                        <div className="font-size-16">Market Cap</div>
                    </div>
                    <div className="pe-5">
                        <div className="font-size-18"><b className="font-w-700">17.1K</b></div>
                        <div className="font-size-16">Items</div>
                    </div>
                    <div className="pe-5">
                        <div className="font-size-18"><b className="font-w-700">11.6K</b></div>
                        <div className="font-size-16">Owners</div>
                    </div>
                    <div>
                        <div className="font-size-18"><b className="font-w-700">$745.1M</b></div>
                        <div className="font-size-16">Total Volume</div>
                    </div>
                </div>

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
                                    </div>
                                </div>
                                {/* <div>Requested topic ID: {userId}</div>
            <div>Users Page </div> */}
                            </div>
                        </Tab>
                        <Tab eventKey={2} title="Activity">Tab 2 content</Tab>
                        <Tab eventKey={3} title="Stats">Tab 3 content</Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default ViewCollection;