import '../App.css';
import * as nearAPI from "near-api-js";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
const { transactions } = require("near-api-js");

const fileTypes = ['PNG', 'GIF', 'JPG', 'WEBP'];

var tableRowIndex = 0;

export default function CreateCollection({ contractX, account, wallet }) {

    const [currentAuthor, setAuthor] = useState({});
    const [contract, setContract] = useState({});
    const [isLoading, setLoader] = useState(false);

    const [talbeRows, setRows] = useState([{
        royalty: "",
        walletaddress: wallet.getAccountId()
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
        updatedRows[tableRowIndex] = { royalty: "", walletaddress: "" }
        setRows(updatedRows)
    }

    const deleteRow = (index) => {
        debugger
        if(talbeRows.length > 1){
           var updatedRows = [...talbeRows]
           var indexToRemove = updatedRows.findIndex(x => x.index == index);
           if(indexToRemove === -1){
              updatedRows.splice(indexToRemove, 1)
              setRows(updatedRows);
           }
        }
     }
  

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
    const init1 = async () => {
        var transactionHashes = searchParams.get("transactionHashes");
        if (transactionHashes) {
            let col = JSON.parse(localStorage.getItem("collection"));
            if (col) {
                const subaccount = col.name.toLowerCase().replace(/ /g, "_");
                var isContractInitialized = localStorage.getItem(subaccount + "_isContractInitialized");
                if (!isContractInitialized) {
                    localStorage.setItem(subaccount + "_isContractInitialized", true);
                    initializeContract();
                }else{
                    let col = JSON.parse(localStorage.getItem("collection"));
                    const subaccount = col.name.toLowerCase().replace(/ /g, "_");
                    navigate(`/viewcollection/${subaccount}`);
                    toast("Collection created successfully.", {type: "success"});
                }
            }
        }
    }

    // const init1 = async () => {
    //    var authors = await author(authorId);
    //    setAuthor(authors);
    //     let contract = await init(wallet);
    //     setContract(contract);
    // }

    const init2 = async (subaccount) => {
        try {
            // Load the NFT from the subaccount created in the deploy function
            return await new nearAPI.Contract(
                wallet.account(),
                `${subaccount}.stingy.testnet`,//"jitendra.stingy.testnet", // newly created subaccount
                {
                    // View methods
                    viewMethods: [
                        "nft_token",
                        "nft_tokens",
                        "nft_tokens_for_owner",
                        "nft_metadata",
                        "nft_total_supply",
                        "nft_supply_for_owner",
                        "nft_is_approved",
                        "nft_payout",
                        "nft_whitelist"
                    ],
                    // Change methods
                    changeMethods: [
                        "nft_mint",
                        "new",
                        "nft_transfer",
                        "nft_transfer_call",
                        "nft_approve",
                        "nft_revoke",
                        "nft_revoke_all",
                        "burn_nft",
                        "add_to_whitelist",
                        "remove_from_whitelist",
                        "toggle_whitelisting"
                    ],
                    sender: wallet.getAccountId(),
                }
            );

        } catch (error) {
            console.log(error);
            return error;
        }
    };

    useEffect(() => {
        return init1();
    }, []);


    /**
   * Deploys to an account, and initialize the smart contract with NFTContractMetadata
   * @function
   * @returns Promise<void>
   */
    const deploy = async () => {
        try {
            debugger;
            // load and deploy smart contract
            const subaccount = collection.name.toLowerCase().replace(/ /g, "_");
            const respons = await contractX.deploy_contract_code(
                {
                    account_id: `${subaccount}.stingy.testnet` //"jitendra.stingy.testnet" //"pack.stingy.testnet",
                },
                GAS,
                deploy_txFee
            );
            console.log(respons);
        } catch (error) {
            console.log(error);
        }
    };

    const initializeContract = async () => {

        let col = JSON.parse(localStorage.getItem("collection"));

        const subaccount = col.name.toLowerCase().replace(/ /g, "_");

        const contract = await init2(subaccount);

        try {
            setLoader(true);
            getUserForUpdateDb().then(user => {
                // account.accountId
                debugger
                user.functions.add_collection(col.name.toLowerCase(), col.fileUrl, subaccount).then(async () => {
                    setLoader(false);
                    //Create a collection by initializing the NFT contract
                    const response = await contract.new({
                        owner_id: account.accountId,
                        metadata: {
                            "spec": col.spec,
                            "name": col.name.toLowerCase(),
                            "symbol": col.symbol,
                            "icon": col.fileUrl,
                            "base_uri": null,
                            "referance": null,
                            "referance_hash": null, // must exist if the "referance" field exists.
                        }
                    }, GAS);
                    //console.log(response);
                }, error => {
                    toast(error, { type: "error" });
                })
            });
        } catch (error) {
            console.log(error);
        }
    }

    // const deployAndInitializeContract = async (iconUrl) => {
    //     try {
    //         const result = await account.signAndSendTransaction({
    //             receiverId: "rough.testnet",//account.accountId,
    //             actions: [
    //                 //deploy(),
    //                 initializeContract(iconUrl)
    //                 // transactions.deployContract(
    //                 //     {
    //                 //         account_id: `${collection.name.replace(/ /g,"_")}.stingy.testnet` //"jitendra.stingy.testnet" //"pack.stingy.testnet",
    //                 //     },
    //                 //     GAS,
    //                 //     deploy_txFee
    //                 // ),
    //                 // transactions.functionCall(
    //                 //     "new",
    //                 //     Buffer.from(JSON.stringify(newArgs)),
    //                 //     GAS,
    //                 //     "0"
    //                 // ),
    //             ],
    //         });
    //         console.log(result);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            // deployAndInitializeContract("https://ipfs.infura.io/ipfs/QmSKypcja9efixmHLzrpVupi1UNFYdVcARPrxJ3fuvLbLg");
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
        if (file) {
            setLoader(true)
            const created = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${created.path}`;
            setLoader(false);

            let col = collection;
            col.fileUrl = url;

            localStorage.setItem("collection", JSON.stringify(col));

            deploy();
            //initializeContract(url);
        }else{
            toast("File is required", {type: "error"})
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
                <div className='pb-3'>A collection is a unique group of NFTs stored on the blockchain.  Creating a collection lets you claim a unique name, description, and default set of royalties for any NFTs you want to mint.  You can also mint NFTs directly to the Drawstring collection without creating a custom collection.</div>
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
                                            <div className="row bid-mobile-100" key={index.toString()}>
                                                <div className="col-sm-6">
                                                    <div>
                                                        <div className="font-size-18 text-light py-3">Royalties</div>
                                                        <input type="text" className="profile-input pb-3 w-100" placeholder='10%'
                                                            name="royalty"
                                                            value={item.royalty}
                                                            onChange={(e) => {
                                                                handleRoyaltyChange(e, index);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="border-bottom-2"></div>
                                                    <div className="font-size-14 color-gray py-2 suggested-text">Suggested: 0%, 10%, 20%, 30%. Maximum is 50%</div>
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
                                                        />
                                                    </div>
                                                    <div className="border-bottom-2"></div>
                                                </div>
                                                {/* {index != 0 && (
                                                    <div className='col-sm-2 pt-5'>
                                                        <button className='btn btn-danger mt-4' type='button' onClick={() => deleteRow(index)}>Remove</button>
                                                    </div>
                                                )} */}
                                            </div>
                                        )
                                })
                            }
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


                            <button type="button" className="btn-submit text-light bg-darkmode border-2-solid" onClick={addNewRow}><b>+ </b> more royalties</button>

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