import '../App.css';
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import product from '../images/product/product.svg';
import creater from '../images/product/creater.svg';
import collection from '../images/product/collection.svg';
import heart from '../images/home/heart.svg';
import more from '../images/home/more.svg';
import copy_icon from '../images/users/copy_icon.svg';
import { Tabs, Tab } from 'react-bootstrap';
import { getUser, getUserForUpdateDb } from '../db/mongodb';
import { Loader } from '../services/ui';
import { init } from '../services/helper';

const Nft = ({ wallet }) => {
    const [activeTab, setActiveTab] = useState(1);
    const [isLoading, setLoader] = useState(false);
    const [nft, setNft] = useState({});
    const [owner, setOwner] = useState({});
    const [creator, setCreator] = useState({});
    const [collection, setCollection] = useState({});

    const handleSelect = (selectedTab) => {
        setActiveTab(parseInt(selectedTab))
    }

    const { collectionId, tokenId } = useParams();

    useEffect(() => {

        return init(wallet, collectionId).then((contract) => {
            viewNFTs(contract);
        });
        //return getNft();
    }, []);

    // const getNft = async () => {
    //     setLoader(true);
    //     const user = await getUser();
    //     const nft = await user.functions.get_nft_by_token_id(tokenId, collectionId);
    //     console.log("nft ", nft);
    //     setNft(nft[0]);
    //     setLoader(false);
    // }

    const viewNFTs = async (contract) => {
        try {
            const response = await contract.nft_token({ "token_id": tokenId });
            console.log(response);
            const extra = JSON.parse(response.metadata.extra);
            response.price = extra.price;
            setNft(response);
            debugger;
            const user = await getUserForUpdateDb();
            const owner = await getProfile(user, response.owner_id);
            setOwner(owner);
           const creator = await getProfile(user, extra.creator_id);
           debugger;
           setCreator(creator);
            getCollection(contract);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const getProfile = async (user, accountId) => {
        setLoader(true);
        const response = await user.functions.get_profile(accountId);
        console.log(response);
        //setOwner(response);
        setLoader(false);
        return response;
    }

    const getCollection = async (contract) => {
        try {
            const response = await contract.nft_metadata();
            console.log(response);
            debugger;
            setCollection(response)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    const addLike = async () => {

        // nft.likes = nft.likes ? nft.likes + 1 : 1;
        // setNft({ ...nft });

        // const walletId = wallet.getAccountId();
        // const user = await getUserForUpdateDb();
        // await user.functions.add_like(walletId, nft.id, nft.contract_id);
    }

    return (
        <div className="bg-darkmode pt-4 product-pages">
            {isLoading ? <Loader /> : null}

            <div className="container text-light px-0">
                <div className="row mobile-reverce">
                    <div className="col-sm-6">
                        <div className="d-flex">
                            <div className="title">
                                {/* Product Name */}
                                {nft.metadata?.title}
                            </div>
                            <div>
                                <button type="button" className="btn heart-btn pt-3 px-5" onClick={addLike}><img src={heart} /> <span className="color-gray">{nft.likes}</span></button>

                            </div>
                            <div className="explore-dot bg-black float-end mt-3"><img src={more} className="pb-1" /></div>
                        </div>

                        <div className="copy-btn pt-2 mt-3 mb-4"> #27513  0x47BE...6f4f <img src={copy_icon} className="float-end" /></div>

                        <div className="d-flex font-size-18 mt-4 mb-3 onsel-mob-text-16" >
                            <div className="me-5">On sale for {nft.price} ETH</div>
                            {/* <div>Highest bid 7 WETH</div> */}
                        </div>

                        <div className="row pt-3 tab-col-w-100">
                            <div className="col-sm-6">
                                <div className="pb-2">Creator</div>
                                {/* {console.log(JSON.parse(nft?.metadata?.extra))} */}
                                <div><img src={creator?.profile_pic ? creator?.profile_pic : creater} className="me-2 border-radius-50" width="48" />{ creator.display_name}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="pb-2">Collection</div>
                                <div><img src={collection.icon ? collection.icon : collection} className="me-2 border-radius-50" width="48" />{collection?.name}</div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="tabs-links mt-4">
                                <Tabs activeKey={activeTab} onSelect={handleSelect}>
                                    <Tab eventKey={1} title="Details" className="mt-3">
                                        <div className="font-size-16 pt-3 pb-2">Owner</div>
                                        <div className="d-flex font-size-18">
                                            <div><img className="mr-2 border-radius-50" src={owner?.profile_pic ? owner?.profile_pic : creater} width="48" /> {nft?.owner_id}</div>
                                        </div>

                                        <div className="font-size-16 pt-5 pb-2">Properties</div>
                                        <div className="d-flex mb-5 properties-box-row">
                                            {nft?.metadata?.extra && Object.keys(JSON.parse(nft?.metadata?.extra).properties).map((key, index) => {
                                                return (
                                                    <div className="properties-box p-3 me-3" key={index.toString()}>
                                                        <div className="font-size-16 color-pink">Property</div>
                                                        <div className="font-size-18 my-1" >{key}</div>
                                                        <div className="font-size-14">{JSON.parse(nft?.metadata?.extra)[key]}</div>
                                                    </div>
                                                )
                                            })}

                                            {!nft?.metadata?.extra && (
                                                <div className="properties-box p-3 me-3">
                                                    <div className="font-size-16 color-pink">No property added for the nft</div>
                                                </div>
                                            )}

                                        </div>

                                        <div className="d-flex font-size-18 border-top-2 border-bottom-2 py-3">
                                            <div className="me-2"><img className="mr-2" src={creater} /></div>
                                            <div>
                                                <div className="gray-textsn"><span>Highest bid by</span>   0x381f673af...a810</div>
                                                <div className="gray-textsn">7 WETH   <span>$22,305 for 1 edition</span></div>
                                            </div>
                                        </div>

                                        <div className="pb-5 pt-4">
                                            <button type="button" className="btn-submit text-light me-3 font-w-700 text-light-mode">Buy for {nft.price} ETH</button>
                                            <button type="button" className="btn-submit text-light bg-darkmode border-2-solid font-w-700">Place a bid</button>
                                        </div>
                                    </Tab>
                                    <Tab eventKey={2} title="Bids" className="mt-3">Tab 2 content</Tab>
                                    <Tab eventKey={3} title="History" className="mt-3">Tab 3 content</Tab>
                                </Tabs>

                            </div>
                        </div>

                    </div>
                    <div className="col-sm-6">
                        {/* <div className="min-height-468">  */}
                        <img src={nft.metadata?.media} className="img-fluid border-bg product-profile-img" />
                        {/* <video width="400" controls>
                            <source src={nft.metadata?.media} type="video/mp4" />
                        </video> */}

                        {/* <img src={product} className="img-fluid border-bg product-profile-img" /> */}

                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Nft;
