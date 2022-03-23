import '../App.css';
import '../styles/collection.css';
import collection1 from '../images/collection/collection1.svg';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { init, author, GAS, mint_txFee, transfer_txFee, txFee, storage1 } from "../services/helper";
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Loader } from "../services/ui";
import { toast } from 'react-toastify';
import { db, storage, fb } from '../db/firebase';
import { FileUploader } from "react-drag-drop-files";
import { ObjectID } from 'bson';
import { getUser, mongodb } from '../db/mongodb';

const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];

const Nfts = ({ contractX, account, wallet }) => {

    const [nfts, setNfts] = useState([]);
    var [contract, setContract] = useState();
    const [isLoading, setLoader] = useState(false);

    const { authorId } = useParams();

    // const init1 = async () => {
    //     setLoader(true);
    //     var auther = await author(authorId);
    //     contract = await init(wallet, auther);
    //     setContract(contract);
    //     const response = await viewNFTs();
    //     setCollections(response);
    //     setLoader(false);
    // };

    const getAllNfts = async() =>{
        setLoader(true);
        const user = await getUser();
        const response = await user.functions.get_all_listed_nfts(40, 0);
        console.log(response);
        setNfts(response);
        setLoader(false);
    }

    useEffect(() => {
        //return init1();
        return getAllNfts();
    }, []);

    let navigate = useNavigate();

    const viewNFTs = async () => {
        try {

            const response = await contract.nft_tokens({ from_index: "0", limit: 100 });
            console.log(response);

            return response;
        } catch (error) {

            toast(error.toString(), { type: "error" });

            navigate(-1);

            console.log(error);
        }
    };

    const routeChange = (collectionId, tokenId) => {
        let path = `/nft/${collectionId}/${tokenId}`;
        navigate(path);
    }

    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    // const [validated, setValidated] = useState(false);

    // const [nft, setNft] = useState({
    //     token: "",
    //     title: "",
    //     media: "",
    //     description: ""
    // });

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const form = event.currentTarget;
    //     if (form.checkValidity() === false) {
    //         event.stopPropagation();
    //     } else {
    //         //mintNFT();
    //         uploadFile();
    //     }
    //     setValidated(true);
    // };

    // const uploadFile = async () => {
    //     if (nft.media) {
    //         setLoader(true);
    //         storage.ref(nft.media.name).put(nft.media).then(() => {
    //             storage.ref(nft.media.name).getDownloadURL().then((url) => {
    //                 mintNFT(url);
    //                 setLoader(false);
    //             });
    //         });
    //     } else {
    //         toast("Media is reqired.", { type: "error" })
    //     }
    // }

    // const mintNFT = async (mediaLink) => {
    //     try {

    //         var accountId = wallet.getAccountId();

    //         if (!accountId) {
    //             toast("Wallet is not connected, Please connect the near wallet and try again!", { type: 'error' });
    //             return;
    //         } else {
    //             handleClose();
    //         }

    //         var nftData = {
    //             token_id: nft.token,
    //             metadata: {
    //                 title: nft.title,
    //                 description: nft.description,
    //                 media: mediaLink,
    //                 media_hash: null,
    //                 copies: null,
    //                 issued_at: null, // Unix epoch in milliseconds
    //                 expires_at: null,
    //                 starts_at: null, // When token starts being valid, Unix epoch in milliseconds
    //                 updated_at: null, // When token was last updated, Unix epoch in milliseconds
    //                 extra: null, // anything extra the NFT wants to store on-chain. Can be stringified JSON.
    //                 referance: null, // URL to a JSON file with more info
    //                 referance_hash: null,
    //             },
    //             receiver_id: "rough.testnet",
    //             perpetual_royalties: null,
    //             price: "$2593251"
    //         };

    //         var data = {};
    //         data.nftData = nftData;
    //         // const docId = db.collection('nfts').doc().id;
    //         // data.docId = docId;
    //         data.createdDate = new Date().toDateString(); //fb.firestore.FieldValue.serverTimestamp();
    //         data.authorId = authorId;
    //         data._id = new ObjectID();
    //         // await db.collection("nfts").doc(docId).set(data);
    //         await mongodb.collection('nfts').insertOne(data);
            
    //         const response = await contract.nft_mint(
    //             nftData,
    //             GAS,
    //             mint_txFee
    //         );

    //         console.log(response);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const handleChange = (e) => {
    //     setNft((prev) => {
    //         if (e.target.name === "media") {
    //             return { ...prev, [e.target.name]: e };
    //         } else {
    //             return { ...prev, [e.target.name]: e.target.value };
    //         }
    //     });
    // };

    // const handleFileChange = (file) => {
    //     setNft((prev) => { return { ...prev, "media": file } });
    // };

    // const onSizeError = (error) => {
    // }

    return (
        <div className="menu">
            {isLoading ? <Loader /> : null}
            <div className="">
                <div className=" title text-light pb-3 container px-0">
                    {/* NFT Collections */}
                    <div className="row">
                        <div className="col-sm-6">
                            NFT(S)
                        </div>
                        <div className="col-sm-6 text-end">
                            {/* <button type="button" className="btn red-btn" onClick={handleShow}>Mint NFT</button> */}
                            <button type="button" className="btn red-btn" onClick={()=>{navigate('/mintnft')}}>Mint NFT</button>
                        </div>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-dark table-striped font-size-14 collection-table">
                        <thead>
                            <tr>
                                <th width="11%"></th>
                                <th width="250px">Project</th>
                                <th># Tokens</th>
                                <th>Owners</th>
                                <th>Listed %</th>
                                <th>Floor</th>
                                <th>USD</th>
                                <th>Median</th>
                                <th>USD</th>
                                <th>Total Floor Value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="border-top-none">
                            {nfts && nfts.length > 0 && nfts.map((nft, index) => {
                                return (
                                    <tr key={index}>
                                        <td></td>
                                        <td> <img src={nft.media_link ? nft.media_link : collection1} width="42" height="42" className="border-radius-50" alt="nft media"/> {nft.name}</td>
                                        <td>{nft.id}</td>
                                        <td>{nft.owner}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        {/* <td>7896</td>
                                        <td>98%</td>
                                        <td>298.39</td>
                                        <td>$28 369</td>
                                        <td>360,00</td>
                                        <td>$52 852</td>
                                        <td>$159 196 200</td> */}
                                        <td> <button type="button" className="btn btn-danger" onClick={() => routeChange(nft.contract_id, nft.id)}>Show Data</button> </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default Nfts;