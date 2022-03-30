import '../App.css';
import React, { useEffect, useState, useContext } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import '../styles/createcollection.css';
import { init, author, GAS, mint_txFee, transfer_txFee, txFee, storage1 } from "../services/helper";
import { Loader } from "../services/ui";
import { toast } from 'react-toastify';
import { db, storage, fb } from '../db/firebase';
import { ObjectID } from 'bson';
import { getUser, getUserForUpdateDb, mongodb } from '../db/mongodb';
import { Form } from 'react-bootstrap';
import { components } from 'react-select';
import Select from 'react-select';
import dp from '../images/header/dp.svg';
import logo1 from '../images/collection/logo1.png';
import { create } from "ipfs-http-client";
import { transactions } from 'near-api-js';
import * as nearAPI from "near-api-js";
const { utils } = nearAPI;

const client = create('https://ipfs.infura.io:5001/api/v0');

const fileTypes = ["PNG", "JPEG", "GIF", "WEBP", "SVG", "JPG", "MOV", "AVI", "MP3", "MP4", "WAV", "FLAC"];//["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];

var tableRowIndex = 0;
var propertyRowIndex = 0;

export default function MintNft({ contractX, account, wallet }) {

    const [currentAuthor, setAuthor] = useState({});
    var [contract, setContract] = useState({});
    const [isLoading, setLoader] = useState(false);
    const [colCount, setColCount] = useState(0)
    const [collections, setCollections] = useState([]);
    const [options, setOptions] = useState([]);
    const [image, setImage] = useState();
    const [talbeRows, setRows] = useState([{
        royalty: "",
        walletaddress: wallet.getAccountId()
    }]);

    const [properties, setProperties] = useState([{
        key: "",
        value: ""
    }]);

    const [validated, setValidated] = useState(false);
    //setOptions([{ label: "Drawstring Marketplace", value: "DrawstringMarketplace.near", image: logo1 },{ label: "Drawstring", value: "high_on_drip", image: logo1 }]);
    const [nft, setNft] = useState({
        token: `token-${Date.now()}`,
        title: "",
        media: "",
        description: "",
        copies: 1,
        price: 1,
        collection: { label: "Drawstring Marketplace", value: "DrawstringMarketplace.near", image: logo1 }
        //perpetual_royalties: talbeRows
    });

    const accountId = wallet.getAccountId();
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

    const addNewProperty = (event) => {
        event.preventDefault()
        propertyRowIndex = parseFloat(propertyRowIndex) + 1;
        var allProperties = [...properties]
        allProperties[propertyRowIndex] = { key: "", value: "" }
        setProperties(allProperties)
    }

    // const { authorId } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();

    const init1 = async (subaccount) => {
        // var authors = await author(authorId);
        // setAuthor(authors);
        let contract = await init(wallet, subaccount);
        setContract(contract);
        getCollections();
        var transactionHashes = searchParams.get("transactionHashes");
        if (transactionHashes) {
            const nft = JSON.parse(localStorage.getItem("nft"));

            // if(!nft.isApproved){
            //     nft.isApproved = true;
            //     localStorage.setItem("nft", JSON.stringify(nft));
            // }

            navigate(`/nft/${nft.contractId}/${nft.tokenId}`);

            toast("Nft minted successfully.", { type: "success" });
        }
    }

    useEffect(() => {
        console.log("useeffect aldkjfajlfdjlajdlfkj")
        return init1();
    }, [colCount]);

    const getCollections = async () => {
        setLoader(true);
        const user = await getUser();
        const response = await user.functions.get_collections(5, colCount * 5);

        var allCollections = [...collections, ...response];
        setCollections(allCollections);

        const options = [{ label: "Drawstring Marketplace", value: "DrawstringMarketplace.near", image: logo1 },{ label: "Drawstring", value: "high_on_drip", image: logo1 }];
        allCollections.forEach(col => {
            options.push({
                label: col.name,
                value: col.contractId,
                image: col.img
            });
        });
        setOptions(options);
        setLoader(false);
        console.log("collections ", response);

    }
    const loadMore = (options) => {
        setColCount((prev) => prev + 1)
        console.log(options);
    }


    const handleSubmit = async (event) => {
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
            setLoader(true)
            const created = await client.add(nft.media);
            const url = `https://ipfs.infura.io/ipfs/${created.path}`;
            setLoader(false);

            mintNFT(url);
        } else {
            toast("Please select file", { type: "error" })
        }
    }

    const mintNFT = async (mediaLink) => {
        try {

            if (!accountId) {
                toast("Wallet is not connected, Please connect the near wallet and try again!", { type: 'error' });
                return;
            }

            const perpetualRoyalties = {};

            talbeRows.forEach((item) => {
                if (item.royalty) {
                    perpetualRoyalties[item.walletaddress] = parseInt(item.royalty);
                }
            });

            const allProperties = {};
            properties.forEach((item) => {
                if (item.key) {
                    allProperties[item.key] = item.value;
                }
            });
debugger;
            var nftData = {
                token_id: nft.token,
                metadata: {
                    title: nft.title,
                    description: nft.description,
                    media: mediaLink,
                    media_hash: null,
                    copies: parseInt(nft.copies),
                    issued_at: null, // Unix epoch in milliseconds
                    expires_at: null,
                    starts_at: null, // When token starts being valid, Unix epoch in milliseconds
                    updated_at: null, // When token was last updated, Unix epoch in milliseconds
                    extra: Object.keys(allProperties).length > 0 ? JSON.stringify(allProperties) : null, // anything extra the NFT wants to store on-chain. Can be stringified JSON.
                    referance: null, // URL to a JSON file with more info
                    referance_hash: null,
                },
                receiver_id: accountId,
                perpetual_royalties: Object.keys(perpetualRoyalties).length > 0 ? perpetualRoyalties : null,
                price: parseInt(nft.price)
            };

            const user = await getUserForUpdateDb();
            debugger
            var data = { contractId: nft.collection.value, tokenId: nft.token };// price: nft.price, isApproved: false
            localStorage.setItem("nft", JSON.stringify(data));

            await user.functions.add_new_nft_listing(
                nft.title,
                nft.token,
                mediaLink,
                mediaLink,
                parseInt(nft.price),
                nft.collection.value,
                accountId,
                nft.collection.label,
                nft.description,
                "image"
            );

            const response = await contract.nft_mint(
                nftData,
                GAS,
                mint_txFee
            );

        //    const response = await contract.account.signAndSendTransaction(contract.contractId, [
        //         transactions.functionCall(
        //           'nft_mint',
        //           Buffer.from(
        //             JSON.stringify({
        //               token_id: nft.token,
        //               metadata: JSON.stringify(nftData.metadata),
        //               receiver_id: accountId,
        //               perpetual_royalties: Object.keys(perpetualRoyalties).length > 0 ? JSON.stringify(perpetualRoyalties) : null,
        //             })
        //           ),
        //           GAS,
        //           mint_txFee
        //         ),
        //         transactions.functionCall(
        //           'nft_approve',
        //           Buffer.from(
        //             JSON.stringify({
        //               token_id: nft.token,
        //               account_id: accountId,
        //               msg: JSON.stringify({
        //                 sale_conditions:  utils.format.parseNearAmount(nft.price.toString()), is_auction: true
        //               }),
        //             })
        //           ),
        //           GAS,
        //           mint_txFee
        //         ),
        //       ]);

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {

        setNft((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });

        // if(e.target.name === "title"){
        //     setNft((prev) => {
        //         return { ...prev, "token": e.target.value.toLowerCase().replace(/ /g, "-") + "-token" };
        //     });
        // }
    };

    const handleRoyaltyChange = (e, index) => {
        var updatedRows = [...talbeRows];
        updatedRows[index][e.target.name] = e.target.value;
        setRows(updatedRows);
    }

    const handlePropertyChange = (e, index) => {
        var allProperties = [...properties]
        allProperties[index][e.target.name] = e.target.value;
        setProperties(allProperties)
    }

    const handleChangeCollection = (e) => {
        setNft((prev) => {
            return { ...prev, "collection": e };
        });
        const subaccount = e.label.toLowerCase().replace(/ /g, "_");
        init1(subaccount);

    }

    const handleFileChange = (file) => {
        setNft((prev) => { return { ...prev, "media": file } });

        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setImage({ image: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSizeError = (error) => {
    }

    const CustomMenu = (props) => {
        return (
            <components.MenuList  {...props}>
                {props.children}
                <div className='text-center d-grid gap-2'>
                    <button className='load-col' onClick={() => { loadMore() }}>{isLoading ? 'Loading...' : 'Load More'}</button>
                </div>
            </components.MenuList >
        )
    }

    const { SingleValue, Option, Menu } = components;

    const IconSingleValue = (props) => (
        <SingleValue {...props}>
            <img src={props.data.image} style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }} />
            {props.data.label}
        </SingleValue>
    );

    const IconOption = (props) => (
        <Option {...props}>
            <img src={props.data.image} style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }} />
            {props.data.label}
        </Option>
    );


    // Step 3
    const customStyles = {
        option: (provided) => ({
            ...provided,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }),
        singleValue: (provided) => ({
            ...provided,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }),
    }

    return (
        <div className="bg-darkmode">
            <div className="container text-light createcollection p-0">
                <div className="py-3 title">Mint NFT</div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>

                    {/* <form id="contact" action="" method="post"> */}
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="pb-3">
                                <div className="pb-2 upload-text">Upload file</div>
                                <div className="file-upload">
                                    <FileUploader handleChange={handleFileChange} defaultValue={nft.media} name="media" types={fileTypes} label="PNG, GIF, WEBP, SVG, JPG, MOV, AVI, MP3, MP4, WAV, FLAC, Max 100mb." maxSize="2" onTypeError={onSizeError} />
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
                                <input type="text" className="profile-input pb-3 w-100" placeholder='"e.g. Redeemable T-Shirt with Original Art!"'
                                    name="title"
                                    defaultValue={nft.title}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Name is required.
                                </Form.Control.Feedback>
                            </div>
                            <div className="border-bottom-2"></div>
                            {/* <div>
                                <div className="font-size-18 text-light py-3">Token</div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. “nft-token”'
                                    type="text"
                                    name="token"
                                    defaultValue={nft.token}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Token is required.
                                </Form.Control.Feedback>
                            </div>
                            <div className="border-bottom-2"></div> */}
                            <div>
                                <div className="font-size-18 text-light py-3">Description <span className="color-gray"> (Optional)</span></div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='"e.g. This holder of this NFT is entitled to a free T-Shirt"'
                                    name="description"
                                    defaultValue={nft.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="border-bottom-2"></div>
                            <div>
                                <div className="font-size-18 text-light py-3">Number of copies</div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='E. g. 10”'
                                    name="copies"
                                    defaultValue={nft.copies}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="border-bottom-2"></div>
                            <div className="font-size-14 color-gray pt-2">Amount of tokens</div>



                            <div className="pt-4">
                                {/* <div className="font-size-18 text-light py-3">Collection</div> */}
                                <Select placeholder="Choose a collection"
                                    styles={customStyles}
                                    components={{ SingleValue: IconSingleValue, Option: IconOption, Menu: CustomMenu }}
                                    options={options}
                                    name="collection"
                                    defaultValue={nft.collection}
                                    onChange={handleChangeCollection}
                                    //validate="required"
                                    required
                                />
                                <div style={{ display: !nft.collection ? "block" : "none" }} className="color-red"> Please select collection.</div>
                                {/* <Form.Control.Feedback type="invalid" >
                                Please select collection.
                            </Form.Control.Feedback> */}
                            </div>
                            {/* <div className="border-bottom-2"></div> */}

                            <div>
                                <div className="font-size-18 text-light py-3">Price (Near)</div>
                                <input type="number" min="1" className="profile-input pb-3 w-100" placeholder='E. g. 10”'
                                    name="price"
                                    defaultValue={nft.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="border-bottom-2"></div>

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
                                            </div>
                                        )
                                })
                            }

                            {/* <div className="row bid-mobile-100">
                                <div className="col-sm-6">
                                    <div>
                                        <div className="font-size-18 text-light py-3">Royalties</div>
                                        <input type="text" className="profile-input pb-3 w-100"
                                            placeholder='10%'

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
                            </div> */}


                            <button type="button" className="btn-submit text-light bg-darkmode border-2-solid" onClick={addNewRow}><b>+ </b> more royalties</button>

                            <div className="font-size-18 mob-f-16 text-light py-3">Properties <span className="color-gray"> (Optional)</span></div>
                            
                            {properties.map((item, index) => {
                                if (item)
                                    return (
                                        <div className="row bid-mobile-100"  key={index.toString()}>
                                            <div className="col-sm-6">
                                                <div>
                                                    <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. Size'
                                                        name="key"
                                                        value={item.key}
                                                        onChange={(e) => {
                                                            handlePropertyChange(e, index);
                                                        }}
                                                    />
                                                </div>
                                                <div className="border-bottom-2"></div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div>
                                                    <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. M'
                                                        name="value"
                                                        value={item.value}
                                                        onChange={(e) => {
                                                            handlePropertyChange(e, index);
                                                        }}
                                                    />
                                                </div>
                                                <div className="border-bottom-2"></div>
                                            </div>
                                        </div>
                                    )
                            })}
                            <button type="button" className="btn-submit text-light bg-darkmode border-2-solid mt-3" onClick={addNewProperty}><b>+ </b> more properties</button>
                            
                            <div className="row pt-3 pb-5 bid-mobile-100">
                                <div className="col-sm-6">
                                    <button type="submit" className="btn-submit text-light font-w-700 text-light-mode">Mint NFT</button>
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