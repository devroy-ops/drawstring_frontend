
import audio from '../images/collection/audio_bg.png';
import upload from '../images/users/upload.svg';
import iconOwner from '../images/users/icon-owner.png';
import iconCreator from '../images/users/icon-creator.png';
import iconCollection from '../images/users/icon-collection.png';
import React, { useEffect, useState } from "react";
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Realm from 'realm-web'
import Nft from './viewnft';
import NftDetailModal from './nftmodal';
import { FileTypes } from '../enums/filetypes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NftsLists = ({nfts, wallet}) => {

    const [nft, setNft] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const navigate = useNavigate();

    const handleShow = (nftData) => {
        setNft(nftData);
        setShow(true);
    }

    return (
        <>
        
            {nfts && nfts.length > 0 && nfts.map((nft, index) => {
                            return (
                                <div className="col-sm-3 pb-4" key={index}>
                                    <div className="top-sec-box">
                                        <div className="row py-2 px-3">
                                            <div className="col-sm-8">
                                                <div className="d-flex">
                                                    <OverlayTrigger overlay={<Tooltip>Owner: {nft?.owner}</Tooltip>}>
                                                        <span className="d-inline-block" onClick={(e) => { e.preventDefault(); navigate(`/user/${nft.owner}`);window.location.reload(); }}>
                                                            {/* <div className="explore-dot bg-pink"></div> */}
                                                            <img src={nft?.ownerImage ? nft?.ownerImage : iconOwner } width="24" height="24" className='border-radius-50 me-1'/>
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>Creator: {nft?.createdBy || nft?.owner}</Tooltip>}>
                                                        <span className="d-inline-block" onClick={(e) => { e.preventDefault(); navigate(`/user/${nft.createdBy || nft?.owner}`);window.location.reload(); }}>
                                                            {/* <div className="explore-dot bg-blue"></div> */}
                                                            <img src={nft?.ownerImage ? nft?.ownerImage : iconCreator } width="24" height="24" className='border-radius-50 me-1'/>
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>Collection: {nft?.contractId}</Tooltip>}>
                                                        <span className="d-inline-block" onClick={(e) => { e.preventDefault(); navigate(`/viewcollection/${nft.collectionName.toLowerCase().replace(/ /g, "_")}`);  }}>
                                                            {/* <div className="explore-dot bg-green"></div> */}
                                                            <img src={nft?.collectionImage ? nft?.collectionImage : iconCollection } width="24" height="24" className='border-radius-50 me-1'/>
                                                        </span>
                                                    </OverlayTrigger>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 ">
                                                <div className="explore-dot bg-black float-end" 
                                                onClick={() => {
                                                    debugger;
                                                    navigator.clipboard.writeText(`${window.location.origin.toString()}/nft/${nft.collectionName.toLowerCase().replace(/ /g, "_")}/${nft.id}`);
                                                    toast("nft link copied to clipboard", { type: "success" })
                                                }}
                                                >
                                                    <img src={upload} className="up-icon" />

                                                </div>
                                            </div>
                                        </div>
                                        {nft?.type && nft?.type.includes(FileTypes.IMAGE) && (
                                            <img src={nft.media_link} className="w-100" height="270" alt="nft media" onClick={() => handleShow(nft)} />
                                        )}
                                        {nft?.type && nft?.type.includes(FileTypes.VIDEO) && (
                                            <video width="100%" id="video" height="270" onClick={() => handleShow(nft)}>
                                                <source src={nft.media_link} type="video/mp4" />
                                            </video>
                                        )}
                                        {nft?.type && nft?.type.includes(FileTypes.AUDIO) && (
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
                        )}

            {show && (
                <NftDetailModal nftData={nft} isModalOpen={show} handleClose={handleClose} wallet={wallet} />
            )}
        </>
    )
}

export default NftsLists;