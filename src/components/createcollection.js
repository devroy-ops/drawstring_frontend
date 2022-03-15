import '../App.css';
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useParams, useSearchParams } from "react-router-dom";
import '../styles/createcollection.css';
import { init, author, GAS, deploy_txFee } from "../services/helper";
// import { getUser, mongodb, mongoUser } from '../db/mongodb';
import * as Realm from "realm-web";
import { ObjectID } from 'bson';
import { Form } from 'react-bootstrap';
import { getUser, getUserForUpdateDb } from '../db/mongodb';
import { storage } from '../db/firebase';
import { toast } from 'react-toastify';
import { Loader } from '../services/ui';
import { create } from "ipfs-http-client";
const client = create('https://ipfs.infura.io:5001/api/v0');

const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];

var tableRowIndex = 0;

export default function CreateCollection({ contractX, account, wallet }) {

    const [currentAuthor, setAuthor] = useState({});
    const [contract, setContract] = useState({});
    const [isLoading, setLoader] = useState(false);

    const [talbeRows, setRows] = useState([{
        index: 0,
        royalty: "",
        walletaddress: ""
    }
    ]);

    // Receive data from TableRow 
    //  const handleChange = data => {
    //     talbeRows[data.index] = data
    //  }

    // Add New Table Row
    const addNewRow = (event) => {
        event.preventDefault()

        tableRowIndex = parseFloat(tableRowIndex) + 1
        var updatedRows = [...talbeRows]
        updatedRows[tableRowIndex] = { index: tableRowIndex, royalty: "", walletaddress: "" }
        setRows(updatedRows)
    }

    const [file, setFile] = useState(null);

    // const handleFileChange = (file) => {
    //     setFile(file);
    // };

    // const [createBtn, setCreateBtn] = useState("Deploy contract and initialize");


    const [collection, setCollection] = useState({
        spec: "", // nft-1.0.0
        name: "", // Chemical Rain
        symbol: "", //CHM-10
    });

    const { authorId } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();

    // const init1 = async () => {
    //     var authors = await author(authorId);
    //     setAuthor(authors);
    //     var transactionHashes = searchParams.get("transactionHashes");
    //     var isContractInitialized = localStorage.getItem(authors.userName + "isContractInitialized");
    //     if (transactionHashes && !isContractInitialized) {
    //         contract = await init(wallet, authors);
    //         localStorage.setItem(authors.userName + "isContractInitialized", true);
    //         initializeContract(contract);
    //     }
    // }

    const init1 = async () => {
        var authors = await author(authorId);
        setAuthor(authors);
        let contract = await init(wallet, authors);
        setContract(contract);
    }

    useEffect(() => {
        return init1();
    }, []);


    /**
   * Deploys to an account, and initialize the smart contract with NFTContractMetadata
   * @function
   * @returns Promise<void>
   */
    // const deploy = async () => {
    //     try {
    //         // load and deploy smart contract
    //         const respons = await contractX.deploy_contract_code(
    //             {
    //                 account_id: `${currentAuthor.userName}.stingy.testnet` //"jitendra.stingy.testnet" //"pack.stingy.testnet",
    //             },
    //             GAS,
    //             deploy_txFee
    //         );
    //         console.log(respons);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const initializeContract = async (iconUrl) => {
        try {

            setLoader(true);
            getUserForUpdateDb().then(user => {
                user.functions.add_collection(collection.name, iconUrl, account.accountId).then(async () => {
                    setLoader(false);
                    //Create a collection by initializing the NFT contract
                    const response = await contract.new({
                        owner_id: account.accountId,
                        metadata: {
                            "spec": collection.spec,
                            "name": collection.name,
                            "symbol": collection.symbol,
                            "icon": iconUrl,
                            "base_uri": null,
                            "referance": null,
                            "referance_hash": null, // must exist if the "referance" field exists.
                        }
                    }, GAS);
                    //console.log(response);
                }, error => {
                    toast(error)
                })
            });


        } catch (error) {
            console.log(error);
        }
    }

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
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
        //setCollection((prev) => { return { ...prev, "icon": file } });
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = () => {
            setFile(Buffer(reader.result));
        };
    };

    const uploadFile = async () => {
       
        setLoader(true)
        const created = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        setLoader(false);

        initializeContract(url);
    }


    const uploadFile1 = async () => {
        if (collection.icon) {

            const reader = new FileReader();

            reader.addEventListener("load", function () {
                // convert image file to base64 string
                //preview.src = reader.result;
                initializeContract(reader.result);
            }, false);

            if (collection.icon) {
                reader.readAsDataURL(collection.icon);
            }

            //setLoader(true);
            // storage.ref(collection.icon.name).put(collection.icon).then(() => {
            //     storage.ref(collection.icon.name).getDownloadURL().then((url) => {
            //         initializeContract(url);
            //         setLoader(false);
            //     });
            // });
        } else {
            toast("Media is reqired.", { type: "error" })
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
                <div className="py-3 title">Create Collection</div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* <form id="contact" action="" method="post"> */}
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="pb-3">
                                <div className="pb-2 upload-text">Upload file</div>
                                <div className="file-upload">
                                    <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} label="PNG, GIF, WEBP, MP4 or MP3. Max 100mb." maxSize="100" />
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
                                <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. “Redeemable T-Shirt withLogo”'
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

                            <div>
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
                            <div className="border-bottom-2"></div>

                            <div>
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
                            <div className="border-bottom-2"></div>

                            <div>
                                <div className="font-size-18 text-light py-3">Description <span className="color-gray"> (Optional)</span></div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. “Redeemable T-Shirt withLogo”'
                                    value={collection.reference}
                                    name="reference"
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                />
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

                            {/* {
                                talbeRows.map((item, index) => {
                                    if (item)
                                        return (
                                            <div className="row bid-mobile-100" key={index.toString()}>
                                                <div className="col-sm-6">
                                                    <div>
                                                        <div className="font-size-18 text-light py-3">Royalties</div>
                                                        <input type="text" className="profile-input pb-3 w-100" placeholder='10%'
                                                            placeholder="Base URI (optional)"
                                                            type="url"
                                                            name="base_uri"
                                                            value={collection.URI}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                            }}
                                                        />
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
                                            </div>
                                        )
                                })
                            } */}
                            <div className="row bid-mobile-100">
                                <div className="col-sm-6">
                                    <div>
                                        <div className="font-size-18 text-light py-3">Royalties</div>
                                        <input type="text" className="profile-input pb-3 w-100"
                                            placeholder='10%'
                                        // name="base_uri"
                                        // value={collection.URI}
                                        // onChange={(e) => {
                                        //     handleChange(e);
                                        // }}
                                        />
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
                            </div>


                            <button type="button" className="btn-submit text-light bg-darkmode border-2-solid" onClick={addNewRow}><b>+ </b> add more loyalties</button>

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
                                    <button type="submit" className="btn-submit text-light font-w-700 text-light-mode"
                                    // onClick={() => {
                                    //     // setCreateBtn("Initializing contract 🚀🚀🚀");
                                    //     initializeContract().then(() => {
                                    //         // setCreateBtn("Deploy contract and initialize");
                                    //     });
                                    // }}
                                    >Create item</button>
                                </div>
                                <div className="col-sm-6 text-end">
                                    <div className="d-flex justify-content-end color-gray">
                                        <div className="pt-2 font-w-700">Unsaved changes</div> <div className="help ms-3">?</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* <div className="col-sm-6 mobile-none">
                            <div className="pb-2">Preview</div>
                            <div className="img-preview-box font-size-16">
                                <div className="no-img-txt color-gray">
                                    Upload file to preview your
                                    brand new NFT
                                </div>
                            </div>
                        </div> */}
                    </div>
                </Form>
            </div>
        </div>
    );
}