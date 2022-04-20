import '../App.css';
import React, { useEffect, useState, useContext } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import '../styles/createcollection.css';
import { init, author, GAS, mint_txFee, transfer_txFee, apr_mint_txFee, txFee, initMarketplaceContract, storageDeposit } from "../services/helper";
import { Loader } from "../services/ui";
import { toast } from 'react-toastify';
import { getUser, getUserForUpdateDb, mongodb } from '../db/mongodb';
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { components } from 'react-select';
import Select from 'react-select';
import dp from '../images/header/dp.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import logo1 from '../images/collection/logo1.png';
import { create } from "ipfs-http-client";
import { transactions } from 'near-api-js';
import * as nearAPI from "near-api-js";
import { marketContractName, smartContractName } from '../services/utils';

import { FileTypes } from '../enums/filetypes';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

const { utils } = nearAPI;

const client = create('https://ipfs.infura.io:5001/api/v0');

const fileTypes = ["PNG", "JPEG", "GIF", "WEBP", "SVG", "JPG", "MOV", "AVI", "MP3", "MP4", "WAV", "FLAC"];//

var tableRowIndex = 0;
var propertyRowIndex = 0;

export default function MintNft({ contractX, account, wallet }) {

    const [currentAuthor, setAuthor] = useState({});
    var [contract, setContract] = useState({});
    const [isLoading, setLoader] = useState(false);
    const [submitted, setSubmitted] = useState(false);
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
    const [tabs, setTabs] = useState(1);
    const [validated, setValidated] = useState(false);

    const [nft, setNft] = useState({
        token: `token-${Date.now()}`,
        title: "",
        media: "",
        description: "",
        copies: 1,
        price: 1,
        isLive: true,
        collection: { label: "drawstringmarketplace", value: "drawstring_v2.near", image: logo1 }
    });

    const accountId = wallet.getAccountId();
    let tot;
    // Add New Table Row
    const addNewRow = (event) => {
        event.preventDefault()
        setTabs((tab) => tab + 1);
        tableRowIndex = parseFloat(tableRowIndex) + 1
        var updatedRows = [...talbeRows]
        updatedRows[tableRowIndex] = { royalty: "", walletaddress: "" }
        setRows(updatedRows)
    }
    // Remove row
    const deleteRow = (items, index, type) => {
        if (items.length > 1) {

            var updatedRows = [...items];
            if (index) {
                updatedRows.splice(index, 1);
                if (type == "properties") {
                    setProperties(updatedRows);
                } else {
                    setRows(updatedRows);
                }
            }
            setTabs((tab) => tab - 1);
        }
    }

    const addNewProperty = (event) => {
        event.preventDefault();
        propertyRowIndex = parseFloat(propertyRowIndex) + 1;
        var allProperties = [...properties]
        allProperties[propertyRowIndex] = { key: "", value: "" }
        setProperties(allProperties)
    }

    const [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();

    const pageLoad = async () => {
        const subaccount = ("drawstringmarketplace").toLowerCase().replace(/ /g, "_");
        let contract = await init(wallet, subaccount);
        setContract(contract);
        getCollections();
        var transactionHashes = searchParams.get("transactionHashes");
        if (transactionHashes) {
            const nft = JSON.parse(localStorage.getItem("nft"));

            if (nft) {
                setLoader(true);
                debugger;

                const user = await getUserForUpdateDb();
                await user.functions.add_new_nft_listing(
                    nft.title,
                    nft.tokenId,
                    nft.mediaLink,
                    nft.mediaLink,
                    parseInt(nft.price),
                    nft.nft_contract_id,
                    accountId,
                    nft.contractName,
                    nft.description,
                    nft.type,
                    wallet.getAccountId(),
                    nft.isLive
                );

                setLoader(false);

                //navigate(`/nft/${nft.contractId}/${nft.tokenId}`);
                const collectionId = nft.contractName.toLowerCase().replace(/ /g, "_");
                navigate(`/nft/${collectionId}/${nft.tokenId}`);

                toast("Nft minted successfully.", { type: "success" });

                localStorage.removeItem("nft");
            }
        }
    }

    const initMarketPlace = async () => {
        await storageDeposit(wallet);
    }

    useEffect(() => {
        return initMarketPlace();
    }, [])

    useEffect(() => {
        return pageLoad();
    }, [colCount]);

    const getCollections = async () => {
        // setLoader(true);
        const user = await getUser();
        // const response = await user.functions.get_collections(40, colCount * 40);
        const response = await user.functions.get_collections_by_createdBy(40, colCount, accountId);
        var allCollections = [...collections, ...response];
        setCollections(allCollections);

        const options = [{ label: "drawstringmarketplace", value: "drawstring_v2.near", image: logo1 }];
        allCollections.forEach(col => {
            options.push({
                label: col.name,
                value: col.contractId,
                image: col.img
            });
        });
        setOptions(options);
        // setLoader(false);
        console.log("collections ", response);

    }
    const loadMore = (options) => {
        setColCount((prev) => prev + 1)
        console.log(options);
    }


    const handleSubmit = async (event) => {
        console.log("event ", nft);
        setSubmitted(true);
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
            const royt = {};
            const total_unit = 10000;

            talbeRows.forEach((item) => {
                console.log(item, 'item');
                let royaltyPercentage = parseInt(item.royalty)
                let royalty = royaltyPercentage / 100 * total_unit;
                console.log(royalty);
                if (item.royalty) {
                    royt[item.walletaddress] = item.royalty
                    let keys = Object.values(royt);
                    const keynum = keys.map(str => {
                        return Number(str);
                    });
                    tot = keynum.reduce((a, b) => a + b, 0)
                    console.log(tot, 'lmaoo');

                    perpetualRoyalties[item.walletaddress] = parseInt(parseFloat(royalty).toFixed(0));
                }
            });
            if (tot > 35) {
                alert("royalties for NFT can't be more than 35")
                navigate('/mintnft')
                return;
            }
            console.log(royt);
            console.log(perpetualRoyalties, 'ppr');

            debugger;
            const contract_id = `${nft.collection.value}.${smartContractName}`;
            const allProperties = {
                creator_id: accountId,
                collection_name: nft.collection.label,
                contract_id: contract_id,
                media_size: nft.media.size,
                media_type: nft.media.type,
                price: nft.price,
                properties: {}
            };

            properties.forEach((item) => {
                if (item.key) {
                    allProperties["properties"][item.key] = item.value;
                }
            });

            var data = {
                nft_contract_id: contract_id, //`${nft.collection.label}.${nft.collection.value}`,
                contractName: nft.collection.label,
                tokenId: nft.token,
                title: nft.title,
                mediaLink: mediaLink,
                price: nft.price,
                description: nft.description,
                type: nft.media.type,
                isLive: nft.isLive
            };
            localStorage.setItem("nft", JSON.stringify(data));

            const metadata = {
                title: nft.title,
                description: nft.description,
                media: mediaLink,
                // media_hash: undefined,
                copies: parseInt(nft.copies),
                issued_at: Date.now(), // Unix epoch in milliseconds
                // expires_at: undefined,
                // starts_at: undefined, // When token starts being valid, Unix epoch in milliseconds
                // updated_at: undefined, // When token was last updated, Unix epoch in milliseconds
                extra: Object.keys(allProperties).length > 0 ? JSON.stringify(allProperties) : undefined, // anything extra the NFT wants to store on-chain. Can be stringified JSON.
                // referance: undefined, // URL to a JSON file with more info
                // referance_hash: undefined,
            };

            const allTransactions = [
                transactions.functionCall(
                    'nft_mint',
                    Buffer.from(
                        JSON.stringify({
                            token_id: nft.token,
                            metadata,
                            receiver_id: accountId,
                            perpetual_royalties: Object.keys(perpetualRoyalties).length > 0 ? perpetualRoyalties : undefined,
                        }),
                    ),
                    GAS / 2,
                    mint_txFee
                )
            ]

            if (nft.isLive) {
                allTransactions.push(
                    transactions.functionCall(
                        'nft_approve',
                        Buffer.from(
                            JSON.stringify({
                                token_id: nft.token,
                                account_id: marketContractName,
                                msg: JSON.stringify({
                                    sale_conditions: utils.format.parseNearAmount(nft.price.toString()), is_auction: false,
                                }),
                            })
                        ),
                        GAS / 2,
                        apr_mint_txFee
                    ),
                )
            }

            const response = await contract.account.signAndSendTransaction(contract.contractId,
                allTransactions
            );

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {

        setNft((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });

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

    const handleChangeCollection = async (e) => {
        setNft((prev) => {
            return { ...prev, "collection": e };
        });
        const subaccount = e.label.toLowerCase().replace(/ /g, "_");

        let contract = await init(wallet, subaccount);
        setContract(contract);
    }

    const handleFileChange = (file) => {
        setNft((prev) => { return { ...prev, "media": file } });

        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setImage((prev) => { return { ...prev, image: e.target.result } });
                // setImage({ image: e.target.result });
            };
            reader.readAsDataURL(file);
        }

        setTimeout(() => {
            if (file.type.includes(FileTypes.VIDEO)) {
                var video = document.getElementById('video');
                video.load();
            }
            if (file.type.includes(FileTypes.AUDIO)) {
                var audio = document.getElementById('audio');
                audio.load();
            }
        }, 1000);
    };

    const onSizeError = (error) => {
        console.log(error)
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
            {isLoading ? <Loader /> : null}
            <div className="container text-light createcollection p-0">
                <div className="py-3 title">Mint NFT</div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>

                    {/* <form id="contact" action="" method="post"> */}
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="pb-3">
                                <div className="pb-2 upload-text">Upload file</div>
                                <div className="file-upload">
                                    <FileUploader handleChange={handleFileChange} defaultValue={nft.media} name="media" types={fileTypes} label="PNG, GIF, WEBP, SVG, JPG, MOV, AVI, MP3, MP4, WAV, FLAC, Max 100mb." maxSize="100" onTypeError={onSizeError} />
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
                                <input type="number" className="profile-input pb-3 w-100" placeholder='E. g. 10”'
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

                            <div className='pt-4'>

                                <div className="font-size-18 text-light py-3">List nft on marketplace?</div>
                                <BootstrapSwitchButton checked={nft.isLive} onstyle="danger" onlabel="Yes" offlabel='No'
                                    onChange={(checked) => {
                                        console.log("triggered")
                                        setNft((prev) => {
                                            return { ...prev, 'isLive': checked };
                                        });
                                    }}
                                />
                            </div>

                            <div>
                                <div className="font-size-18 text-light py-3">Price (Near)</div>
                                <input type="number" min="1" step="any" className="profile-input pb-3 w-100" placeholder='E. g. 10”'
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
                                                <div className="col-sm-5">
                                                    <div>
                                                        <div className="font-size-18 text-light py-3">Royalties</div>
                                                        <input type="number" max={35} min={0} className="profile-input pb-3 w-100" placeholder='10%'
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
                                                    <div className="font-size-14 color-gray py-2 suggested-text">Maximum is 35%</div>
                                                </div>
                                                <div className="col-sm-5">
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
                                                <div className='col-sm-2 text-center pt-4'>
                                                    {index != 0 && (
                                                        <OverlayTrigger overlay={<Tooltip>Remove item</Tooltip>}>
                                                            <Button variant="link" type='button' onClick={() => deleteRow(talbeRows, index, 'royalties')}> <FontAwesomeIcon icon={faTrash} className="color-theme" /></Button>
                                                        </OverlayTrigger>
                                                    )}
                                                </div>
                                            </div>

                                        )
                                })
                            }

                            <button disabled={tabs > 3} type="button" className="btn-submit text-light bg-darkmode border-2-solid" onClick={addNewRow}><b>+ </b> more royalties</button>

                            <p style={{ display: tabs > 3 ? 'block' : 'none', color: 'red', fontSize: '13px' }}>You can only set 4 royalties</p>
                            <div className="font-size-18 mob-f-16 text-light py-3">Properties <span className="color-gray"> (Optional)</span></div>

                            {properties.map((item, index) => {
                                if (item)
                                    return (
                                        <div className="row bid-mobile-100" key={index.toString()}>
                                            <div className="col-sm-5">
                                                <div>
                                                    <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. Size'
                                                        name="key"
                                                        value={item.key}
                                                        onChange={(e) => {
                                                            handlePropertyChange(e, index);
                                                        }}
                                                        required={item.value ? true : false}
                                                    />

                                                </div>
                                                <div className="border-bottom-2"></div>
                                                <Form.Control.Feedback type="invalid" className={submitted && item.value && !item.key ? 'd-block' : ''}>
                                                    Property key is required.
                                                </Form.Control.Feedback>
                                            </div>
                                            <div className="col-sm-5">
                                                <div>
                                                    <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. M'
                                                        name="value"
                                                        value={item.value}
                                                        onChange={(e) => {
                                                            handlePropertyChange(e, index);
                                                        }}
                                                        required={item.key ? true : false}
                                                    />

                                                </div>
                                                <div className="border-bottom-2"></div>
                                                <Form.Control.Feedback type="invalid" className={submitted && item.key && !item.value ? 'd-block' : ''}>
                                                    Property key is required.
                                                </Form.Control.Feedback>
                                            </div>

                                            <div className='col-sm-2 text-center pt-4'>
                                                {index != 0 && (
                                                    <OverlayTrigger overlay={<Tooltip>Remove item</Tooltip>}>
                                                        <Button variant="link" type='button' onClick={() => deleteRow(properties, index, 'properties')}> <FontAwesomeIcon icon={faTrash} className="color-theme" /></Button>
                                                    </OverlayTrigger>
                                                )}
                                            </div>
                                        </div>
                                    )
                            })}

                            {/* {properties.length > 0 && properties[properties.length - 1]["key"] && properties[properties.length - 1]["value"] && ( */}
                            <button type="button" className="btn-submit text-light bg-darkmode border-2-solid mt-3" onClick={addNewProperty} ><b>+ </b> more properties</button>
                            {/* )} */}

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
                            {/* style={{ backgroundImage: `url('${image?.image}')` }} */}
                            <div className="img-preview-box font-size-16 bg-options" >
                                {image?.image && nft?.media && nft?.media.type.includes(FileTypes.IMAGE) && (
                                    <img src={image?.image} className="img-fluid w-100" />
                                )}
                                {image?.image && nft?.media && nft?.media.type.includes(FileTypes.VIDEO) && (
                                    <video width="100%" height="400" controls id="video">
                                        <source src={image?.image} type="video/mp4" />
                                    </video>
                                )}
                                {image?.image && nft?.media && nft?.media.type.includes(FileTypes.AUDIO) && (
                                    <div className='p-5'>
                                        <audio controls src={image?.image} id="audio">
                                            Your browser does not support the
                                            <code>audio</code> element.
                                        </audio>
                                    </div>
                                )}

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