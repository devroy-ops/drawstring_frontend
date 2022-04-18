import '../App.css';
import '../styles/createcollection.css';

import * as nearAPI from "near-api-js";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { init, author, GAS, deploy_txFee } from "../services/helper";
// import { getUser, mongodb, mongoUser } from '../db/mongodb';
import * as Realm from "realm-web";
import { ObjectID } from 'bson';
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getUser, getUserForUpdateDb } from '../db/mongodb';
import { storage } from '../db/firebase';
import { toast } from 'react-toastify';
import { Loader } from '../services/ui';
import { create } from "ipfs-http-client";
import { generateSeedPhrase } from "near-seed-phrase";
import { transactions } from 'near-api-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { smartContractName } from '../services/utils';

const client = create('https://ipfs.infura.io:5001/api/v0');

const fileTypes = ['PNG', 'GIF', 'JPG', 'WEBP', 'JPEG'];

var tableRowIndex = 0;

export default function CreateCollection({ contractX, account, wallet, nearConfig }) {

    const [isLoading, setLoader] = useState(false);
    const [image, setImage] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [talbeRows, setRows] = useState([{
        royalty: '5',
        walletaddress: wallet.getAccountId()
    }
    ]);

    // Add New Row
    // const addNewRow = (event) => {
    //     event.preventDefault()
    //     tableRowIndex = parseFloat(tableRowIndex) + 1
    //     var updatedRows = [...talbeRows]
    //     updatedRows[tableRowIndex] = { royalty: 0, walletaddress: "" }
    //     setRows(updatedRows)
    // }

    // const deleteRow = (index) => {
    //     if (talbeRows.length > 1) {
    //         var updatedRows = [...talbeRows]
    //         // var indexToRemove = updatedRows.findIndex(x => x.index == index);
    //         if (index) {
    //             updatedRows.splice(index, 1)
    //             setRows(updatedRows);
    //         }
    //     }
    // }


    const handleRoyaltyChange = (e, index) => {
        var updatedRows = [...talbeRows];
        updatedRows[index][e.target.name] = e.target.value;
        setRows(updatedRows)
    }

    const [file, setFile] = useState(null);
    // const [createBtn, setCreateBtn] = useState("Deploy contract and initialize");

    const [collection, setCollection] = useState({
        spec: "nft-1.0.0", // nft-1.0.0
        name: "", // Chemical Rain
        symbol: "CHM-10", //CHM-10
    });

    // const { authorId } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();
    const pageLoad = async () => {
        var transactionHashes = searchParams.get("transactionHashes");
        if (transactionHashes) {
            let col = JSON.parse(localStorage.getItem("collection"));
            if (col) {

                const subaccount = col.name.toLowerCase().replace(/ /g, "_");
                var isContractInitialized = localStorage.getItem(subaccount + "_isContractInitialized");
                if (!isContractInitialized) {
                    localStorage.setItem(subaccount + "_isContractInitialized", true);
                    initializeContract(col);
                } else {

                    // if (col.royalties) {
                    //     const isRoyaltiesSet = localStorage.getItem(subaccount+ "_isSetRoyalties");
                    //     if(!isRoyaltiesSet){
                    //     localStorage.setItem(subaccount + "_isSetRoyalties", true);
                    //         setRoyalties();
                    //     }else{
                    //         saveContract()
                    //     }
                    // } else {
                    saveContract(col, subaccount);
                    //}
                }
            }
        }
    }

    const saveContract = async (col, subaccount) => {
        setLoader(true);
        const user = await getUserForUpdateDb();
        await user.functions.add_collection(col.name.toLowerCase(), col.fileUrl, subaccount, wallet.getAccountId());
        setLoader(false);

        navigate(`/viewcollection/${subaccount}`);
        toast("Collection created successfully.", { type: "success" });

        localStorage.removeItem("collection");
        localStorage.removeItem(subaccount + "_isContractInitialized");
        //localStorage.removeItem(subaccount + "_isSetRoyalties");
    }

    useEffect(() => {
        return pageLoad();
    }, []);


    const deploy = async () => {

        try {
            let {publicKey} = generateSeedPhrase();
            
            const subaccount = collection.name.toLowerCase().replace(/ /g, "_");
            // load and deploy smart contract
            const respons = await contractX.deploy_contract_code(
                {
                    subaccount_id: `${subaccount}.${smartContractName}`, //"${subaccount}.stingy.testnet" //"pack.stingy.testnet",
                    new_public_key: publicKey,
                },
                GAS,
                deploy_txFee
            );
            console.log(respons);
        } catch (error) {
            console.log(error);
        }
    };

    const initializeContract = async (col) => {

        try {
            // let col = JSON.parse(localStorage.getItem("collection"));

            const subaccount = col.name.toLowerCase().replace(/ /g, "_");

            const contract = await init(wallet, subaccount);

            const allTransactions = [
                transactions.functionCall(
                    'new',
                    Buffer.from(
                        JSON.stringify({
                            owner_id: account.accountId,
                            metadata: {
                                "spec": col.spec,
                                "name": col.name.toLowerCase(),
                                "symbol": col.symbol,
                                "icon": col.fileUrl,
                                "base_uri": null,
                                "referance": null,
                                "referance_hash": null, // must exist if the "referance" field exists.
                            },
                        }),
                    ),
                    GAS / 2
                )
            ];
            
            if (col.royalties) {
                let col_royalty = col.royalties;
                let royal = Object.values(col_royalty)[0]
                allTransactions.push(
                    transactions.functionCall(
                        'set_contract_royalty',
                        Buffer.from(
                            JSON.stringify(
                                { contract_royalty: royal }// col.royalties
                            )
                        ),
                        GAS / 2
                    ),
                )
            }
            const response = await contract.account.signAndSendTransaction(contract.contractId,
                allTransactions
            );

        } catch (error) {
            console.log(error);
        }
    }

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        setSubmitted(true);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            uploadFile();
        }
        setValidated(true);
    };

    const handleFileChange = (file) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = () => {
            setFile(Buffer(reader.result));
        };

        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setImage({ image: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadFile = async () => {
        if (file) {
            setLoader(true)
            const created = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${created.path}`;
            setLoader(false);

            let col = collection;
            col.fileUrl = url;

            const royalties = {};
            const total_unit = 10000;

            talbeRows.forEach((item) => {
                let colroyalty = parseInt(item.royalty)
                let royalty = colroyalty / 100 * total_unit;
                console.log(royalty);
                if (item.royalty) {
                    royalties[item.walletaddress] = royalty;
                }
            });
            if (Object.keys(royalties).length > 0) {
                col.royalties = royalties;
            }

            localStorage.setItem("collection", JSON.stringify(col));

            deploy();

        } else {
            toast("File is required", { type: "error" })
        }
    }

    const handleChange = (e) => {
        setCollection((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    return (
        <div className="bg-darkmode">
            {isLoading ? <Loader /> : null}
            <div className="container text-light createcollection p-0">
                <div className="pt-3 title">Create Collection</div>
                <div className='pb-3'>Creating a collections deploys a custom smart contract to your Near wallet.  You can only do this once per wallet.  This costs a bit more (~4 Near) but allows you to create a unique group of NFTs on the blockchain. You can claim a unique name, description, cover, and default set of royalties for any NFTs you mint using your custom contract. You can also <a href="mint page">mint NFTs directly to the Drawstring collection</a> without creating a custom collection.</div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* <form id="contact" action="" method="post"> */}
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="pb-3">
                                <div className="pb-2 upload-text">Upload cover</div>
                                <div className="file-upload">
                                    <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} label="PNG, GIF, JPG, WEBP. Max 100mb." maxSize="100" />
                                    {/* <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p> */}
                                    <span className='file-upload-cosef'>Choose file</span>
                                </div>
                                <div className="desk-none mobile-block">
                                    <div className="pb-2">Preview</div>
                                    <div className="img-preview-box font-size-16">
                                        <div className="no-img-txt color-gray">
                                            Upload file to preview your
                                            brand new NFT
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-bottom-2"></div>
                            <div>
                                <div className="font-size-18 text-light py-3">Name</div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='"e.g. My new album"'
                                    name="name"
                                    value={collection.name}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Name is required.
                                </Form.Control.Feedback>
                            </div>
                            <div className="border-bottom-2"></div>

                            {/* <div>
                                <div className="font-size-18 text-light py-3">Spec</div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. “nft-1.0.0”'
                                    name="spec"
                                    value={collection.spec}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Spec is required.
                            </Form.Control.Feedback>
                            </div>
                            <div className="border-bottom-2"></div> */}

                            {/* <div>
                                <div className="font-size-18 text-light py-3">Symbol</div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. “CHM-10”'
                                    name="symbol"
                                    value={collection.symbol}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Symbol is required.
                            </Form.Control.Feedback>
                            </div>
                            <div className="border-bottom-2"></div> */}

                            <div>
                                <div className="font-size-18 text-light py-3">Description <span className="color-gray"> (Optional)</span></div>
                                <textarea className="profile-input pb-3 w-100" placeholder='"e.g. My newest collection is finally here! Holders will receive some exciting things in the future ;)"'
                                    value={collection.reference}
                                    name="reference"
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                ></textarea>
                            </div>
                            <div className="border-bottom-2"></div>
                            {/* <div>
                                <div className="font-size-18 text-light py-3">Number of copies</div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='E. g. 10”'
                                    name="spec"
                                    defaultValue={collection.spec}
                                    required
                                />
                            </div>
                            <div className="border-bottom-2"></div>
                            <div className="font-size-14 color-gray pt-2">Amount of tokens</div> */}

                            {
                                talbeRows.map((item, index) => {
                                    if (item)
                                        return (
                                            <div key={index.toString()}>
                                                <div className="row bid-mobile-100">
                                                    <div className="col-sm-6">
                                                        <div>
                                                            <div className="font-size-18 text-light py-3">Royalties</div>
                                                            <input type="number" max={35} className="profile-input pb-3 w-100" placeholder='10%'
                                                                name="royalty"
                                                                value={item.royalty && Math.max(0, item.royalty)}
                                                                onChange={(e) => {
                                                                    handleRoyaltyChange(e, index);
                                                                }}
                                                                required={item.walletaddress ? true : false}
                                                            />
                                                        </div>
                                                        <div className="border-bottom-2"></div>
                                                        <Form.Control.Feedback type="invalid" className={submitted && item.walletaddress && !item.royalty ? 'd-block' : ''}>
                                                            Royalty is required.
                                                        </Form.Control.Feedback>
                                                        {/* <div className="font-size-14 color-gray py-2 suggested-text">Suggested: 0%, 10%, 20%, 30%. Maximum is 50%</div> */}
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div>
                                                            <div className="font-size-18 text-light py-3">Wallet address</div>
                                                            <input type="text" className="profile-input pb-3 w-100" placeholder='|'
                                                                name="walletaddress"
                                                                value={item.walletaddress}
                                                                onChange={(e) => {
                                                                    handleRoyaltyChange(e, index);
                                                                }}
                                                                required={item.royalty ? true : false}
                                                            />
                                                        </div>
                                                        <div className="border-bottom-2"></div>
                                                        <Form.Control.Feedback type="invalid" className={submitted && item.royalty && !item.walletaddress ? 'd-block' : ''}>
                                                            Wallet address is required.
                                                        </Form.Control.Feedback>
                                                    </div>

                                                    {/* {index != 0 && (
                                                    <div className='col-sm-2 pt-5'>
                                                        <button className='btn btn-danger mt-4' type='button' onClick={() => deleteRow(index)}>Remove</button>
                                                    </div>
                                                )} */}
                                                </div>
                                                {/* <div className='text-end'>
                                                    {index != 0 && (
                                                        <OverlayTrigger overlay={<Tooltip>Remove item</Tooltip>}>
                                                            <Button variant="link" type='button' onClick={() => deleteRow(index)}> <FontAwesomeIcon icon={faTrash} className="color-theme" /></Button>
                                                        </OverlayTrigger>
                                                    )}
                                                </div> */}
                                            </div>
                                        )
                                })
                            }
                            <div className="font-size-14 color-gray py-2 suggested-text">Royalties for a collection are received whenever any NFT in the collection is sold.  Maximum total royalties cannot exceed 10% for a collection.  Additional royalties can be added when each NFT is minted.</div>
                            {/* <div className="row bid-mobile-100">
                                <div className="col-sm-6">
                                    <div>
                                        <div className="font-size-18 text-light py-3">Royalties</div>
                                        <input type="text" className="profile-input pb-3 w-100"
                                            placeholder='10%'/>
                                    </div>
                                    <div className="border-bottom-2"></div>
                                    <div className="font-size-14 color-gray py-2 suggested-text">Suggested: 0%, 10%, 20%, 30%. Maximum is 50%</div>
                                </div>
                                <div className="col-sm-6">
                                    <div>
                                        <div className="font-size-18 text-light py-3">Wallet address</div>
                                        <input type="text" className="profile-input pb-3 w-100" placeholder='|' />
                                    </div>
                                    <div className="border-bottom-2"></div>
                                </div>
                            </div> */}


                            {/* <button type="button" className="btn-submit text-light bg-darkmode border-2-solid" onClick={addNewRow}><b>+ </b> more royalties</button> */}

                            {/* <div className="row bid-mobile-100">
                                <div className="col-sm-6">
                                    <div>
                                        <div className="font-size-18 mob-f-16 text-light py-3">Properties <span className="color-gray"> (Optional)</span></div>
                                        <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. Size'
                                            name="symbol"
                                            value={collection.symbol}
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="border-bottom-2"></div>
                                </div>
                                <div className="col-sm-6">
                                    <div>
                                        <div className="font-size-18 mob-f-16 text-light py-3">Wallet address</div>
                                        <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. M'
                                            name="icon"
                                            value={collection.icon || ''}
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="border-bottom-2"></div>
                                </div>
                            </div> */}
                            <div className="row pt-3 pb-5 bid-mobile-100">
                                <div className="col-sm-6">
                                    <button type="submit" className="btn-submit text-light font-w-700 text-light-mode">Create Collection</button>
                                </div>
                                {/* <div className="col-sm-6 text-end">
                                    <div className="d-flex justify-content-end color-gray">
                                        <div className="pt-2 font-w-700">Unsaved changes</div> <div className="help ms-3">?</div>
                                    </div>
                                </div> */}
                            </div>

                        </div>
                        <div className="col-sm-6 mobile-none">
                            <div className="pb-2">Preview</div>
                            <div className="img-preview-box font-size-16 bg-options" style={{ backgroundImage: `url('${image?.image}')` }}>
                                <div className={"no-img-txt color-gray " + (image?.image ? 'd-none' : '')} >
                                    Upload file to preview your
                                    brand new NFT
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}