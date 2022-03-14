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
import { mongodb } from '../db/mongodb';

const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];

const Collections = ({ contractX, account, wallet }) => {

    let contract;
    const [collections, setCollections] = useState([]);
    const [contracts, setContract] = useState();
    const [isLoading, setLoader] = useState(false);

    const { authorId } = useParams();

    const init1 = async () => {
        setLoader(true);
        var auther = await author(authorId);
        contract = await init(wallet, auther);
        setContract(contract);
        const response = await viewNFTs();
        setCollections(response);
        setLoader(false);
    };

    useEffect(() => {
        return init1();
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

    const routeChange = (collectionId) => {
        let path = `/viewcollection/${authorId}/${collectionId}`;
        navigate(path);
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);

    const [nft, setNft] = useState({
        token: "",
        title: "",
        media: "",
        description: ""
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            //mintNFT();
            uploadFile();
        }
        setValidated(true);
    };

    const uploadFile = async () => {
        if (nft.media) {
            setLoader(true);
            storage.ref(nft.media.name).put(nft.media).then(() => {
                storage.ref(nft.media.name).getDownloadURL().then((url) => {
                    mintNFT(url);
                    setLoader(false);
                });
            });
        } else {
            toast("Media is reqired.", { type: "error" })
        }
    }

    const mintNFT = async (mediaLink) => {
        try {

            var accountId = wallet.getAccountId();

            if (!accountId) {
                toast("Wallet is not connected, Please connect the near wallet and try again!", { type: 'error' });
                return;
            } else {
                handleClose();
            }

            var nftData = {
                token_id: nft.token,
                metadata: {
                    title: nft.title,
                    description: nft.description,
                    media: mediaLink,
                    media_hash: null,
                    copies: null,
                    issued_at: null, // Unix epoch in milliseconds
                    expires_at: null,
                    starts_at: null, // When token starts being valid, Unix epoch in milliseconds
                    updated_at: null, // When token was last updated, Unix epoch in milliseconds
                    extra: null, // anything extra the NFT wants to store on-chain. Can be stringified JSON.
                    referance: null, // URL to a JSON file with more info
                    referance_hash: null,
                },
                receiver_id: "rough.testnet",
                perpetual_royalties: null,
                price: "$2593251"
            };

            var data = {};
            data.nftData = nftData;
            // const docId = db.collection('nfts').doc().id;
            // data.docId = docId;
            data.createdDate = new Date().toDateString(); //fb.firestore.FieldValue.serverTimestamp();
            data.authorId = authorId;
            data._id = new ObjectID();
            // await db.collection("nfts").doc(docId).set(data);
            await mongodb.collection('nfts').insertOne(data);
            
            const response = await contracts.nft_mint(
                nftData,
                GAS,
                mint_txFee
            );

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setNft((prev) => {
            if (e.target.name === "media") {
                return { ...prev, [e.target.name]: e };
            } else {
                return { ...prev, [e.target.name]: e.target.value };
            }
        });
    };

    const handleFileChange = (file) => {
        setNft((prev) => { return { ...prev, "media": file } });
    };

    const onSizeError = (error) => {
        debugger;
    }

    // const initializeContract = async (contract) => {
    //     try {
    //         // Create a collection by initializing the NFT contract
    //         const response = await contract.new({
    //             owner_id: account.accountId,
    //             metadata: {
    //                 "spec": null,
    //                 "name": null,
    //                 "symbol": null,
    //                 "icon": null,
    //                 "base_uri": null,
    //                 "referance": null,
    //                 "referance_hash": null,
    //             },
    //         }, GAS);
    //         console.log(response);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const checkApis = async () => {
        try {
            debugger;
            // const response = await contract.storage_minimum_balance({})
            const response = await contract.storage_deposit(
                {
                    "account_id": account.accountId
                },
                GAS,
                txFee
            )
            debugger;
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="menu">
            {isLoading ? <Loader /> : null}
            <div className="">
                <div className=" title text-light pb-3 container px-0">
                    {/* NFT Collections */}
                    <div className="row">
                        <div className="col-sm-6">
                            NFT Collections
                        </div>
                        <div className="col-sm-6 text-end">
                            <button type="button" className="btn red-btn" onClick={handleShow}>Mint NFT</button>
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
                            {collections && collections.length > 0 && collections.map((collection, index) => {
                                return (
                                    <tr key={index}>
                                        <td></td>
                                        <td> <img src={collection.metadata.media ? collection.metadata.media : collection1} width="42" height="42" className="border-radius-50" alt="nft media"/> {collection.metadata.title}</td>
                                        <td>{collection.token_id}</td>
                                        <td></td>
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
                                        <td> <button type="button" className="btn btn-danger" onClick={() => routeChange(collection.token_id)}>Show Data</button> </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New NFT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                <Form.Label>NFT Token</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="NFT Token"
                                    name="token"
                                    defaultValue={nft.token}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">NFT Token is required!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Title"
                                    name="title"
                                    defaultValue={nft.title}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">Title is required!</Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" controlId="validationCustom03">
                                <Form.Label>Media</Form.Label>
                                {/* <Form.Control
                                    type="file"
                                    placeholder="Media link"
                                    required
                                    name="media"
                                    //defaultValue={nft.media}
                                    onChange={handleChange}
                                /> */}
                                {/* <input type="file" onChange={handleChange} /> */}
                                <FileUploader handleChange={handleFileChange} defaultValue={nft.media} name="media" types={fileTypes} label="PNG, GIF, WEBP, SVG. Max 100mb." maxSize="2" onTypeError={onSizeError} required />
                                <Form.Control.Feedback type="invalid">
                                    Media is required
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" controlId="validationCustom04">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    required
                                    name="description"
                                    defaultValue={nft.description}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide the nft description.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        {/* <Button type="submit">Submit form</Button> */}
                        <div className="text-end">
                            <Button variant="secondary" type="button" onClick={handleClose} className="me-3">
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Collections;