import '../App.css';
import '../styles/collection.css';
import collection1 from '../images/collection/collection1.svg';
import * as nearAPI from "near-api-js";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink, useSearchParams } from "react-router-dom";
import { init, author, GAS, mint_txFee } from "../services/helper";
import { Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { Loader } from "../services/ui";
import { toast } from 'react-toastify';

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
        //return init();
        return init1();
    }, []);
    /**
     * View the metadata of the contract(collection) using the contract.nft_metadata
     */
    
    let navigate = useNavigate();

    const viewNFTs = async () => {
        try {
            const response = await contract.nft_tokens({ from_index: "0", limit: 10 });
            debugger;
            console.log(response);

            return response;
        } catch (error) {
            debugger;

            toast(error.toString(), {type: "error"});

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
            mintNFT();
        }
        setValidated(true);

    };

    const [searchParams, setSearchParams] = useSearchParams();
    var transactionHashes = searchParams.get("transactionHashes");
    if(transactionHashes){
       // toast("Mint added successfully!", {type: 'success'})
    }

    const mintNFT = async () => {
        try {

            handleClose();

            var accountId = wallet.getAccountId();

            if(!accountId){
                toast("Wallet is not connected, Please connect the near wallet and try again!", {type: 'error'});
                return;
            }
        

            const response = await contracts.nft_mint(
                {
                    token_id: nft.token,
                    metadata: {
                        title: nft.title,
                        description: nft.description,
                        media: nft.media,
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
                },
                GAS,
                mint_txFee
            );

            console.log(response);
            //toast("Author added successfully!", {type: 'success'});

        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setNft((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

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
                                        <td > <img src={collection1} /> {collection.metadata.title}</td>
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
                            {/* <tr>
                                <td></td>
                                <td> <img src={collection1} /> Collection name name</td>
                                <td>1050</td>
                                <td>7896</td>
                                <td>98%</td>
                                <td>298.39</td>
                                <td>$28 369</td>
                                <td>360,00</td>
                                <td>$52 852</td>
                                <td>$159 196 200</td>
                                <td> <button type="button" className="btn btn-danger">Show Data</button> </td>
                            </tr>
                             */}
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
                                <Form.Control
                                    type="text"
                                    placeholder="Media link"
                                    required
                                    name="media"
                                    defaultValue={nft.media}
                                    onChange={handleChange}
                                />
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