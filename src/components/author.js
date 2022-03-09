import logo from '../logo.svg';
import '../App.css';
import { useParams, useNavigate, NavLink } from "react-router-dom";
import avtar from '../images/users/avtar.svg';
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
import { db } from "../db/firebase";
import { Dropdown } from 'react-bootstrap';
import { Loader } from "../services/ui";
import { mongodb } from '../db/mongodb';
import { ObjectID } from 'bson';

const Author = () => {
    const [activeTab, setActive] = useState(1);
    const [author, setAuthor] = useState({});
    const [isLoading, setLoader] = useState(false);

    const handleSelect = (selectedTab) => {
        setActive(parseInt(selectedTab))
    }

    const { authorId } = useParams();

    const getAuthor = () => {
        setLoader(true);
        // db.collection('authors').doc(authorId).get().then((querySnapshot) => {
        //     let author = querySnapshot.data();
        //     setAuthor(author);
        //     setLoader(false);
        // });

        const id = ObjectID(authorId);
        mongodb.collection('authors').findOne({_id: id}).then(response=>{
            setAuthor(response);
            setLoader(false);
        });
    }

    let navigate = useNavigate();

    useEffect(() => {
        return getAuthor();
    }, []);

    const routeChange = () => {
        let path = `/createcollection/${authorId}`;
        navigate(path);
    }


    return (
        <div className="bg-darkmode ueser-pages">
            {isLoading ? <Loader /> : null}
            <div className="pos-rel pb-5">
                <div className="bg-users height-240">

                </div>
                <div className="container pb-5 px-0">
                    <img src={avtar} className="avtar-position" />
                </div>
            </div>
            <div className="container pb-5 px-0">
                <div className="text-light font-size-32 font-w-700">{author.firstName} {author.lastName}</div>
                <div className="d-flex text-light">
                    <div className="pt-1 pe-4 font-size-24"> {author.userName}</div>
                    <div className="copy-btn"> #27513 0x47BE...6f4f  <img src={copy_icon} className="float-end" /></div>
                </div>

                <div className="row pt-3">
                    <div className="col-sm-6 auther-desc mt-2">
                        {author.description}
                        {/* Author's name is a travel and documentary photographer based in Quebec, Canada. She documents streets, cultures and landscapes. */}
                    </div>
                </div>
                <div className="d-flex text-light pt-4 font-size-18 color-white">
                    <div className="pe-5">150 followers</div>
                    <div>150 following</div>
                </div>
                <div className="d-flex py-4">
                    <button type="button" className="btn follow-btn">Follow</button>
                    <button type="button" className="btn mx-4 up-btn"><img src={upload} /></button>
                    {/* <button type="button" className="btn more-btn"><img src={more} /></button> */}

                    <Dropdown>
                        <Dropdown.Toggle variant="" id="dropdown-basic" className="btn more-btn">
                            <img src={more} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={routeChange}>Create Collection</Dropdown.Item>
                            {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className="">
                <div className="container tabs-links px-0">
                    <Tabs activeKey={activeTab} onSelect={handleSelect}>
                        <Tab eventKey={1} title="On sale 9">
                            {/* <div className="border-bottom-2"></div> */}
                            <div className="pb-4">
                                <div className="row title text-light pt-3">
                                    <div className="col-sm-9">
                                        <img src={blockchain} className="" /><span className="font-size-14 vertical-align px-2"> Blockchain </span><img src={arrow_down} />
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
                                                <div className="row pt-2">
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
                                                <div className="row pt-2">
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
                                                <div className="row pt-2">
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
                                                <div className="row pt-2">
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
                                                <div className="row pt-2">
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
                                                <div className="row pt-2">
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
                                                <div className="row pt-2">
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
                                                <div className="row pt-2">
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
                        </Tab>
                        <Tab eventKey={2} title="Owned  12">Tab 2 content</Tab>
                        <Tab eventKey={3} title="Created  8">Tab 3 content</Tab>
                        <Tab eventKey={4} title="Liked  18">Tab 4 content is displayed by default</Tab>
                        <Tab eventKey={5} title="Activity">Tab 5 content</Tab>
                        <Tab eventKey={6} title="Collabs">Tab 6 content</Tab>
                        <Tab eventKey={7} title="Collections">Tab 7 content</Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default Author;