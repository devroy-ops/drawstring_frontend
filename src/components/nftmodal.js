import { Modal, Tabs, Tab} from 'react-bootstrap';
import creater from '../images/product/creater.svg';
import collection from '../images/product/collection.svg';
import heart from '../images/home/heart.svg';
import more from '../images/home/more.svg';
import copy_icon from '../images/users/copy_icon.svg';
import { useState } from 'react';

const NftDetailModal=({nftData, isModalOpen, handleClose})=>{
    const [activeTab, setActiveTab] = useState(1);
    const handleSelect = (selectedTab) => {
        setActiveTab(parseInt(selectedTab))
    }

    return(
        <div className="bg-darkmode product-pages">
             <Modal show={isModalOpen} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nft Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="container px-0">
                <div className="row mobile-reverce">
                    <div className="col-sm-6">
                        <div className="d-flex">
                            <div className="title">
                                {nftData.name}
                            </div>
                            <div>
                                <button type="button" className="btn heart-btn pt-3 px-5"><img src={heart} /> <span className="color-gray">{nftData.likes}</span></button>
                            </div>
                            <div className="explore-dot bg-black float-end mt-3"><img src={more} className="pb-1" /></div>
                        </div>

                        <div className="copy-btn pt-2 mt-3 mb-4"> #27513  0x47BE...6f4f <img src={copy_icon} className="float-end" /></div>

                        <div className="d-flex font-size-18 mt-4 mb-3 onsel-mob-text-16" >
                            <div className="me-5">On sale for 6.09 ETH</div>
                            <div>Highest bid 7 WETH</div>
                        </div>

                        <div className="row pt-3 tab-col-w-100">
                            <div className="col-sm-6">
                                <div className="pb-2">Creator</div>
                                <div><img src={creater} className="me-2 font-size-18" /> Creator</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="pb-2">Collection</div>
                                <div><img src={collection} className="me-2 font-size-18" /> Collection</div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="tabs-links mt-4">
                                <Tabs activeKey={activeTab} onSelect={handleSelect}>
                                    <Tab eventKey={1} title="Details" className="mt-3">
                                        <div className="font-size-16 pt-3 pb-2">Owner</div>
                                        <div className="d-flex font-size-18">
                                            <div><img className="mr-2" src={creater} /> 0x3864a2619...c416</div>
                                        </div>

                                        <div className="font-size-16 pt-5 pb-2">Properties</div>
                                        <div className="d-flex mb-5 properties-box-row">
                                            <div className="properties-box p-3 me-3">
                                                <div className="font-size-16 color-pink">Backgrounds</div>
                                                <div className="font-size-18 my-1">M1 Army Green</div>
                                                <div className="font-size-14">10,5% rarity</div>
                                            </div>
                                            <div className="properties-box p-3 me-3">
                                                <div className="font-size-16 color-pink">Clothes</div>
                                                <div className="font-size-18 my-1">M1 Guayabera</div>
                                                <div className="font-size-14">10,5% rarity</div>
                                            </div>
                                            <div className="properties-box p-3">
                                                <div className="font-size-16 color-pink">Eyes</div>
                                                <div className="font-size-18 my-1">M1 X Eyes</div>
                                                <div className="font-size-14">10,5% rarity</div>
                                            </div>
                                        </div>

                                        <div className="d-flex font-size-18 border-top-2 border-bottom-2 py-3">
                                            <div className="me-2"><img className="mr-2" src={creater} /></div>
                                            <div>
                                                <div className="gray-textsn"><span>Highest bid by</span>   0x381f673af...a810</div>
                                                <div className="gray-textsn">7 WETH   <span>$22,305 for 1 edition</span></div>
                                            </div>
                                        </div>

                                        <div className="pb-5 pt-4">
                                            <button type="button" className="btn-submit text-light me-3 font-w-700 text-light-mode">Buy for {nftData?.price} ETH</button>
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
                        <img src={nftData.img} className="img-fluid border-bg product-profile-img" />
                    </div>
                </div>
            </div>
                    {/* <img src={nftData.img} /> */}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default NftDetailModal;