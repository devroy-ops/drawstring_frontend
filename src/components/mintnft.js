import '../App.css';
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useParams, useSearchParams } from "react-router-dom";
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
import { create } from "ipfs-http-client";
const client = create('https://ipfs.infura.io:5001/api/v0');

const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];

var tableRowIndex = 0;

export default function MintNft({ contractX, account, wallet }) {

    const [currentAuthor, setAuthor] = useState({});
    var [contract, setContract] = useState({});
    const [isLoading, setLoader] = useState(false);
    const [collections, setCollections] = useState([]);
    const [options, setOptions] = useState([]);

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

    const { authorId } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();

    const init1 = async () => {
        var authors = await author(authorId);
        setAuthor(authors);
        let contract = await init(wallet, authors);
        setContract(contract);
        getCollections();
    }

    useEffect(() => {
        return init1();
    }, []);

    const getCollections = async () => {
        setLoader(true);
        const user = await getUser();
        const response = await user.functions.get_collections();
        setCollections(response);

        const options = [];
        response.forEach(col => {
            options.push({
                label: col.name,
                value: col.contractId,
                image: col.img
            });
        });
        setOptions(options);
        setLoader(false);
    }

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
       
        setLoader(true)
        const created = await client.add(nft.media);
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        setLoader(false);

        mintNFT(url);
    }

    const uploadFile1 = async () => {
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
                price: "10"
            };
            
            const user = await getUserForUpdateDb();
            await user.functions.add_new_nft_listing(
                nft.title, 
                nft.token, 
                mediaLink, 
                mediaLink, 
                "10", 
                nft.collection.contractId, 
                accountId, 
                nft.collection.name, 
                nft.description, 
                "image"
            )

            // var data = {};
            // data.nftData = nftData;
            // data.createdDate = new Date().toDateString(); 
            // data.authorId = authorId;
            // data._id = new ObjectID();
            // await mongodb.collection('nfts').insertOne(data);
            
            const response = await contract.nft_mint(
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
            // if (e.target.name === "media") {
            //     return { ...prev, [e.target.name]: e };
            // } else {
            return { ...prev, [e.target.name]: e.target.value };
            //}
        });
    };

    const handleChangeCollection = (e) =>{
        setNft((prev) => {
            return { ...prev, "collection": e };
        });
    }

    const handleFileChange = (file) => {
        setNft((prev) => { return { ...prev, "media": file } });
    };

    const onSizeError = (error) => {
    }

    // const options = [
    //     {
    //         label: 'Collection name name',
    //         value: 0,
    //         image: dp,
    //     },
    //     {
    //         label: 'Collection name name',
    //         value: 1,
    //         image: dp,
    //     }
    // ];


const { SingleValue, Option } = components;

const IconSingleValue = (props) => (
    <SingleValue {...props}>
        <img src={props.data.image} style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}/>
        {props.data.label}
    </SingleValue>
);

const IconOption = (props) => (
    <Option {...props}>
        <img src={props.data.image} style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}/>
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
                                    <FileUploader handleChange={handleFileChange} defaultValue={nft.media} name="media" types={fileTypes} label="PNG, GIF, WEBP, SVG. Max 100mb." maxSize="2" onTypeError={onSizeError} />
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
                                    type="text"
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
                            <div className="border-bottom-2"></div>
                            <div>
                                <div className="font-size-18 text-light py-3">Description <span className="color-gray"> (Optional)</span></div>
                                <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. “Redeemable T-Shirt withLogo”'
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
                                    components={{SingleValue: IconSingleValue, Option: IconOption }}
                                    options={options}
                                    name="collection"
                                    defaultValue={nft.collection}
                                    onChange={handleChangeCollection}
                                />

                            </div>
                            <div className="border-bottom-2"></div>

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

                            <div className="font-size-18 mob-f-16 text-light py-3">Properties <span className="color-gray"> (Optional)</span></div>
                            <div className="row bid-mobile-100">
                                <div className="col-sm-6">
                                    <div>
                                        <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. Size'
                                            
                                        />
                                    </div>
                                    <div className="border-bottom-2"></div>
                                </div>
                                <div className="col-sm-6">
                                    <div>
                                        <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. M'
                                            
                                        />
                                    </div>
                                    <div className="border-bottom-2"></div>
                                </div>
                            </div>
                            <div className="row pt-3 pb-5 bid-mobile-100">
                                <div className="col-sm-6">
                                    <button type="submit" className="btn-submit text-light font-w-700 text-light-mode"
                                        // onClick={() => {
                                        //     // setCreateBtn("Initializing contract 🚀🚀🚀");
                                        //     handleSubmit().then(() => {
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
                </Form>
            </div>
        </div>
    );
}