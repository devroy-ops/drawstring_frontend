import '../App.css';
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useParams, NavLink, useSearchParams } from "react-router-dom";

import '../styles/createcollection.css';

import Big from "big.js";
import * as nearAPI from "near-api-js";
import { db, auth, fb } from "../db/firebase";

const fileTypes = ["JPG", "JPEG" , "PNG", "GIF", "WEBP", "SVG"];

const mint_txFee = Big(0.1)
    .times(10 ** 24)
    .toFixed();

const deploy_txFee = Big(4)
    .times(10 ** 24)
    .toFixed();

const transfer_txFee = Big(1)
    .times(10 ** 24)
    .toFixed();

const GAS = Big(20)
    .times(10 ** 13)
    .toFixed();

var tableRowIndex = 0;

export default function CreateCollection({ contractX, account, wallet }) {

    const [author, setAuthor] = useState({});

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

    const handleFileChange = (file) => {
        setFile(file);
    };

    // const [createBtn, setCreateBtn] = useState("Deploy contract and initialize");
    let contract;

    const [collection, setCollection] = useState({
        spec: "nft-1.0.0",
        name: "Chemical Rain",
        symbol: "CHM-10",
    });
    console.log(account);

    /**
   * Deploys to an account, and initialize the smart contract with NFTContractMetadata
   * @function
   * @returns Promise<void>
   */

    const { authorId } = useParams();

    const getAuthor = async () => {
        await db.collection('authors').doc(authorId).get().then((querySnapshot) => {
            let author = querySnapshot.data();
            setAuthor(author);
            return author;
        });
    }

    useEffect(() => {
        return getAuthor();
    }, []);


    const deploy = async () => {
        try {
            // load and deploy smart contract
            const respons = await contractX.deploy_contract_code(
                {
                    account_id: `${author.userName}.stingy.testnet` //"jitendra.stingy.testnet" //"pack.stingy.testnet",
                },
                GAS,
                deploy_txFee
            );
            console.log(respons);
        } catch (error) {
            console.log(error);
        }
    };

    const init = async (author) => {
        try {
            // Load the NFT from the subaccount created in the deploy function
            contract = new nearAPI.Contract(
                wallet.account(),
                `${author.userName}.stingy.testnet`, //"jitendra.stingy.testnet", // newly created subaccount
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
                    ],
                    sender: wallet.getAccountId(),
                }
            );
        } catch (error) {
            console.log(error);
        }

        try {
          // Create a collection by initializing the NFT contract
          localStorage.setItem("isContractInitialized", true);
          const response = await contract.new({
            owner_id: account.accountId,
            metadata: {
              "spec": collection.spec,
              "name": collection.name,
              "symbol": collection.symbol,
              "icon": null,
              "base_uri": null,
              "referance": null,
              "referance_hash": null, // must exist if the "referance" field exists.
            },
          }, GAS);
          console.log(response);
        } catch (error) {
          console.log(error);
        }

        try {
            const response = await viewCollection();//viewNFTs();//mintNFT();//
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * View the metadata of the contract(collection) using the contract.nft_metadata
     */
    const viewCollection = async () => {
        try {
            const response = await contract.nft_metadata({});
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };


    const [searchParams, setSearchParams] = useSearchParams();
    var transactionHashes = searchParams.get("transactionHashes")
    var isContractInitialized = localStorage.getItem("isContractInitialized");

    if (transactionHashes && !isContractInitialized) {
        db.collection('authors').doc(authorId).get().then((querySnapshot) => {
            init(querySnapshot.data());
        })
    }

    const transferNFT = async () => {
        try {
            const response = await contract.nft_transfer(
                {
                    receiver_id: "ruger.testnet",
                    token_id: "beat-is-chemical",
                    approval_id: 0,
                    memo: "Happy birthday Granny",
                },
                GAS,
                "1"
            );

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };


    const viewNFTs = async () => {
        try {
            const response = await contract.nft_tokens(
                { from_index: "0", limit: 10 },
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const mintNFT = async () => {
        try {
            const response = await contract.nft_mint(
                {
                    token_id: "high-on-substance",
                    metadata: {
                        title: "Methylphenidate (Ritalin)",
                        description: "Forgotten industry of drunks",
                        media:
                            "https://media.giphy.com/media/xTiTniuHdUjpOlNo1q/giphy.gif",
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
        } catch (error) {
            console.log(error);
        }
    };

    const approveMarketplace = async () => {
        try {
            const response = await contract.nft_approve({
                token_id: "high-on-substance",
                account_id: account.accountId,
                msg: "foo",
            });

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };


    //init()

    const handleChange = (e) => {
        switch (e.target.name) {
            case "name":
                setCollection((prev) => {
                    return { ...prev, name: e.target.value };
                });
                break;
            case "symbol":
                setCollection((prev) => ({ ...prev, symbol: e.target.value }));
                break;
            case "icon":
                setCollection((prev) => ({ ...prev, icon: e.target.value }));
                break;
            case "base_uri":
                setCollection((prev) => ({ ...prev, base_uri: e.target.value }));
                break;
            case "reference":
                setCollection((prev) => ({ ...prev, reference: e.target.value }));
                break;
            default:
                return;
        }
    };

    return (
        <div className="bg-darkmode">
            <div className="container text-light createcollection p-0">
                <div className="py-3 title">Create Collection</div>
                <form id="contact" action="" method="post">
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
                            <div>
                                <div className="font-size-18 text-light py-3">Number of copies</div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='E. g. 10”'
                                    placeholder="Collection spec"
                                    name="spec"
                                    type="text"
                                    defaultValue={collection.spec}
                                    required
                                />
                            </div>
                            <div className="border-bottom-2"></div>
                            <div className="font-size-14 color-gray pt-2">Amount of tokens</div>

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


                            <button type="button" className="btn-submit text-light bg-darkmode border-2-solid" onClick={addNewRow}><b>+ </b> add more loyalties</button>

                            <div className="row bid-mobile-100">
                                <div className="col-sm-6">
                                    <div>
                                        <div className="font-size-18 mob-f-16 text-light py-3">Properties <span className="color-gray"> (Optional)</span></div>
                                        <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. Size'
                                            placeholder="Collection symbol"
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
                                            placeholder="Collection icon link"
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
                            </div>
                            <div className="row pt-3 pb-5 bid-mobile-100">
                                <div className="col-sm-6">
                                    <button type="button" className="btn-submit text-light font-w-700 text-light-mode"
                                        onClick={() => {
                                            // setCreateBtn("Initializing contract 🚀🚀🚀");
                                            deploy().then(() => {
                                                // setCreateBtn("Deploy contract and initialize");
                                            });
                                        }}
                                    >Create item</button>
                                </div>
                                <div className="col-sm-6 text-end">
                                    <div className="d-flex justify-content-end color-gray">
                                        <div className="pt-2 font-w-700">Unsaved changes</div> <div className="help ms-3">?</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-sm-6 mobile-none">
                            <div className="pb-2">Preview</div>
                            <div className="img-preview-box font-size-16">
                                <div className="no-img-txt color-gray">
                                    Upload file to preview your
                                    brand new NFT
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}