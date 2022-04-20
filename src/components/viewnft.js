import '../App.css';
import { useParams, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { getUser, getUserForUpdateDb } from '../db/mongodb';
import { Loader } from '../services/ui';
import { buyOrRemoveFromSale, GAS, init, initMarketplaceContract } from '../services/helper';
import avtar from '../images/users/avatar.svg';
import { FileTypes, MarketplaceTypes } from '../enums/filetypes';
import { smartContractName } from '../services/utils';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { Tabs, Tab } from 'react-bootstrap';
import BurnNft from './nfts/burn';
import SaleNft from './nfts/sale';
import TransferNft from './nfts/transfer';

const Nft = ({ wallet }) => {
    const [activeTab, setActiveTab] = useState(1);
    const [isLoading, setLoader] = useState(false);
    const [nft, setNft] = useState({});
    const [owner, setOwner] = useState({});
    const [creator, setCreator] = useState({});
    const [collection, setCollection] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [nftData, setNftData] = useState({});
    const [showBurnModal, setBurnModalShow] = useState(false);
    const closeBurnModal = () => setBurnModalShow(false);

    const [showTransferModal, setTransferModalShow] = useState(false);
    const closeTransferModal = () => setTransferModalShow(false);

    const [showSaleModal, setSaleModalShow] = useState(false);
    const closeSaleModal = () => setSaleModalShow(false);

    const handleSelect = (selectedTab) => {
        debugger;
        if(selectedTab == "2"){
            window.open(`https://explorer.testnet.near.org/accounts/${collection?.name}`, '_blank');

            return;
        }
        setActiveTab(parseInt(selectedTab))
    }

    const { collectionId, tokenId } = useParams();

    useEffect(() => {

        return init(wallet, collectionId).then((contract) => {
            viewNFTs(contract);
        });
        //return getNft();
    }, []);

    useEffect(() => {
        //checkForByOrRemovedFromSale()
        const transactionHashes = searchParams.get("transactionHashes");
        buyOrRemoveFromSale(transactionHashes, wallet.getAccountId());
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

            const user1 = await getUser();
            const nftData1 = await user1.functions.get_nft_by_token_id(tokenId);
            setNftData(nftData1);

            const extra = JSON.parse(response.metadata.extra);
            response.price = extra.price;
            setNft(response);
            const user = await getUserForUpdateDb();
            const owner = await getProfile(user, response.owner_id);
            setOwner(owner);
            const creator = await getProfile(user, extra.creator_id);
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

    const buyNft = async () => {
        try {
            setLoader(true);
            const contract = await initMarketplaceContract(wallet);
            // const user = await getUser();
            // const nftData = await user.functions.get_nft_by_token_id(tokenId);
            // debugger;
            const subaccount = nftData.collection_name.toLowerCase().replace(/ /g, "_");
            const data = nft;
            data.marketType = MarketplaceTypes.OFFER; //"offer"
            localStorage.setItem("nft", JSON.stringify(data));
            setLoader(false);

            await contract.offer(
                {
                    nft_contract_id: `${subaccount}.${smartContractName}`,
                    token_id: nft.token_id
                },
                GAS,
                parseNearAmount(nft.price.toString())
            );

        } catch (error) {
            console.log(error);
        }
    }

    const removeFromSale = async () => {
        try {
            setLoader(true);

            const contract = await initMarketplaceContract(wallet);
            // const user = await getUser();
            // const nftData = await user.functions.get_nft_by_token_id(tokenId);

            const subaccount = nftData.collection_name.toLowerCase().replace(/ /g, "_");
            const data = nft;
            data.marketType = MarketplaceTypes.REMOVED; //"removed"
            localStorage.setItem("nft", JSON.stringify(data));
            setLoader(false);
            await contract.remove_sale(
                {
                    nft_contract_id: `${subaccount}.${smartContractName}`,
                    token_id: nft.token_id
                },
                GAS,
                1
            );
        } catch (error) {
            console.log(error);
        }

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
                            {/* <div>
                                <button type="button" className="btn heart-btn pt-3 px-5" onClick={addLike}><img src={heart} /> <span className="color-gray">{nft.likes}</span></button>

                            </div>
                            <div className="explore-dot bg-black float-end mt-3"><img src={more} className="pb-1" /></div> */}
                        </div>

                        {/* <div className="copy-btn pt-2 mt-3 mb-4"> #27513  0x47BE...6f4f <img src={copy_icon} className="float-end" /></div> */}

                        <div className="d-flex font-size-18 mt-4 mb-3 onsel-mob-text-16" >
                            <div className="me-5">On sale for {nft.price} Near</div>
                            {/* <div>Highest bid 7 WETH</div> */}
                        </div>

                        <div className="row pt-3 tab-col-w-100">
                            <div className="col-sm-6">
                                <div className="pb-2">Creator</div>
                                {/* {console.log(JSON.parse(nft?.metadata?.extra))} */}
                                <div><img src={creator?.profile_pic ? creator?.profile_pic : avtar} className="me-2 border-radius-50" width="48" height="48" />{creator?.display_name || wallet.getAccountId()}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="pb-2">Collection</div>
                                <div><img src={collection.icon ? collection.icon : avtar} className="me-2 border-radius-50" width="48" height="48" />{collection?.name}</div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="tabs-links mt-4">
                                <Tabs activeKey={activeTab} onSelect={handleSelect}>
                                    <Tab eventKey={1} title="Details" className="mt-3">
                                        <div className="font-size-16 pt-3 pb-2">Owner</div>
                                        <div className="d-flex font-size-18">
                                            <div><img className="mr-2 border-radius-50" src={owner?.profile_pic ? owner?.profile_pic : avtar} width="48" height="48" /> {nft?.owner_id}</div>
                                        </div>

                                        <div className="font-size-16 pt-5 pb-2">Properties</div>
                                        <div className="d-flex mb-5 properties-box-row">
                                            {nft?.metadata?.extra && Object.keys(JSON.parse(nft?.metadata?.extra).properties).map((key, index) => {
                                                return (
                                                    <div className="properties-box p-3 me-3" key={index.toString()}>
                                                        <div className="font-size-16 color-pink">{key}</div>
                                                        {/* <div className="font-size-18 my-1" >{key}</div> */}
                                                        <div className="font-size-14">{JSON.parse(nft?.metadata?.extra).properties[key]}</div>
                                                    </div>
                                                )
                                            })}

                                            {nft.metadata && Object.keys(JSON.parse(nft.metadata.extra).properties).length == 0 && (
                                                <div className="properties-box p-3 me-3">
                                                    <div className="font-size-16 color-pink">No property added for the nft</div>
                                                </div>
                                            )}

                                        </div>

                                        {/* <div className="d-flex font-size-18 border-top-2 border-bottom-2 py-3">
                                            <div className="me-2"><img className="mr-2" src={creater} /></div>
                                            <div>
                                                <div className="gray-textsn"><span>Highest bid by</span>   0x381f673af...a810</div>
                                                <div className="gray-textsn">7 WETH   <span>$22,305 for 1 edition</span></div>
                                            </div>
                                        </div> */}

                                        <div className="pb-5 pt-4">
                                            {nft?.owner_id != wallet.getAccountId() && (
                                                <button type="button" className="btn-submit text-light me-3 font-w-700 text-light-mode me-2" onClick={buyNft}>Buy for {nft?.price} Near</button>
                                            )}
                                            {nft?.owner_id == wallet.getAccountId() && nftData.is_live && (
                                                <button type="button" className="btn-submit text-light bg-darkmode border-2-solid font-w-700 me-2" onClick={removeFromSale}>Remove from sale</button>
                                            )}
                                            {nft?.owner_id == wallet.getAccountId() && (
                                                <>
                                                    <button type="button" className="btn-submit text-light bg-darkmode border-2-solid font-w-700 me-2" onClick={() => {
                                                        // setNft(nft);
                                                        setBurnModalShow(true);
                                                    }}>Burn NFT</button>
                                                    <button type="button" className="btn-submit text-light bg-darkmode border-2-solid font-w-700 me-2" onClick={() => {
                                                        setTransferModalShow(true);
                                                    }}>Transfer NFT</button>
                                                </>
                                            )}
                                            {nft?.owner_id == wallet.getAccountId() && !nftData.is_live && (
                                                <button type="button" className="btn-submit text-light bg-darkmode border-2-solid font-w-700 me-2" onClick={()=>{
                                                    setSaleModalShow(true);
                                                }}>Put on sale</button>
                                            )}

                                            <BurnNft nft={nft} isModalOpen={showBurnModal} handleClose={closeBurnModal} wallet={wallet} />
                                            <TransferNft nft={nft} isModalOpen={showTransferModal} handleClose={closeTransferModal} wallet={wallet} />
                                            <SaleNft nft={nft} isModalOpen={showSaleModal} handleClose={closeSaleModal} wallet={wallet} />
                                            
                                        </div>
                                    </Tab>
                                    {/* <Tab eventKey={2} title="Bids" className="mt-3">Tab 2 content</Tab> */}
                                    <Tab eventKey={2} title="History" className="mt-3" role="button" onClick={(event)=>{
                                        event.preventDefault();
                                        debugger;
                                        window.open(`https://explorer.testnet.near.org/accounts/${collection?.name}`, '_blank');
                                    }}>
                                        {/* Tab 3 content */}
                                    </Tab>
                                </Tabs>

                            </div>
                        </div>

                    </div>
                    <div className="col-sm-6">
                        {/* <img src={nft.metadata?.media} className="img-fluid border-bg product-profile-img" /> */}
                        {nft.metadata && JSON.parse(nft.metadata.extra).media_type.includes(FileTypes.IMAGE) && (
                            <img src={nft?.metadata?.media} className="img-fluid border-bg product-profile-img" height="270" alt="nft media" />
                        )}
                        {nft.metadata && JSON.parse(nft.metadata.extra).media_type.includes(FileTypes.VIDEO) && (
                            <video width="100%" controls id="video" height="270">
                                <source src={nft?.metadata?.media} type="video/mp4" />
                            </video>
                        )}
                        {nft.metadata && JSON.parse(nft.metadata.extra).media_type.includes(FileTypes.AUDIO) && (

                            <div className='p-5'>
                                <audio controls src={nft.metadata.media} id="audio">
                                    Your browser does not support the
                                    <code>audio</code> element.
                                </audio>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Nft;
