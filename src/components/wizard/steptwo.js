import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { create } from "ipfs-http-client";
import { FileUploader } from "react-drag-drop-files";
import { transactions } from 'near-api-js';
import { apr_mint_txFee, GAS, init, mint_txFee, storageDeposit } from "../../services/helper";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as nearAPI from "near-api-js";
import { marketContractName, smartContractName } from "../../services/utils";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getUser, getUserForUpdateDb } from "../../db/mongodb";
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { components } from 'react-select';
import Select from 'react-select';
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { Loader } from "../../services/ui";
const { utils } = nearAPI;

const client = create('https://ipfs.infura.io:5001/api/v0');


var tableRowIndex = 0;
var propertyRowIndex = 0;

const StepTwo = ({ contractX, account, wallet }) => {
    const fileTypes = ["PNG", "JPEG", "GIF", "WEBP", "SVG", "JPG", "MOV", "AVI", "MP3", "MP4", "WAV", "FLAC"];//

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [image, setImage] = useState();
    const [file, setFile] = useState(null);

    const [talbeRows, setRows] = useState([{
        royalty: "",
        walletaddress: wallet.getAccountId()
    }]);
    const [properties, setProperties] = useState([{
        key: "",
        value: ""
    }]);

    const [nft, setNft] = useState({
        // token: `token-${Date.now()}`,
        title: "",
        media: "",
        description: "",
        copies: 1,
        price: 1,
        isLive: true,
        // collection: {}
    });
    const [options, setOptions] = useState([]);

    const [tabs, setTabs] = useState(1);
    const [isLoading, setLoader] = useState(false);
    var [contract, setContract] = useState({});
    const [colCount, setColCount] = useState(0)
    const [collections, setCollections] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();

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

    useEffect(() => {
        // return init(wallet, );
        setTimeout(() => {
            initMarketPlace()
        }, 1000);
    }, []);

    useEffect(() => {
        return loadStepThree();
    }, [colCount]);

    const loadStepThree = async () => {
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

                const collectionId = searchParams.get("collectionName");//nft.contractName.toLowerCase().replace(/ /g, "_");
                navigate(`/wizard/stepthree?collectionId=${collectionId}&tokenId=${nft.tokenId}`);

                toast("Nft minted successfully.", { type: "success" });

                localStorage.removeItem("nft");
            }
        }
    }

    const initMarketPlace = async () => {
        await storageDeposit(wallet);
    }

    const onSubmit = async (data) => {

        try {
            var fileUrl = await uploadFile(data);

            const tokenId = `token-${Date.now()}`;

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
            debugger
            const accountId = wallet.getAccountId();
debugger;
            const contract_id = `${nft.collection.value}.${smartContractName}`;
            const allProperties = {
                creator_id: accountId,
                collection_name: nft.collection.label,
                contract_id: contract_id,
                media_size: nft.media.size,
                media_type: nft.media.type,
                price: data.price,
                properties: {}
            };

            properties.forEach((item) => {
                if (item.key) {
                    allProperties["properties"][item.key] = item.value;
                }
            });
            debugger
            var datadb = {
                nft_contract_id: contract_id, //`${nft.collection.label}.${nft.collection.value}`,
                contractName: nft.collection.label,
                tokenId: tokenId,//nft.token,
                title: data.title,
                mediaLink: fileUrl,
                price: data.price,
                description: data.description,
                type: nft.media.type,
                isLive: nft.isLive
            };
            //localStorage.setItem("nft", JSON.stringify(data));

            data.tokenId = tokenId;
            localStorage.setItem("nft", JSON.stringify(datadb));
            console.log(data);
            debugger;
            const metadata = {
                //reference: App.HASH_SOURCE,
                title: data.title,
                description: data.description,
                media: fileUrl,
                // media_hash: null,
                copies: parseInt(data.copies),
                issued_at: Date.now(),
                // expires_at: null,
                // starts_at: null,
                // updated_at: null,
                extra: Object.keys(allProperties).length > 0 ? JSON.stringify(allProperties) : undefined,
                // referance: null,
                // referance_hash: null
            };

            const subaccount = searchParams.get("collectionName");
            debugger;
            const contract = await init(wallet, subaccount);

            const allTransactions = [
                transactions.functionCall(
                    'nft_mint',
                    Buffer.from(
                        JSON.stringify({
                            token_id: tokenId,
                            metadata,
                            //metadata:JSON.stringify(metadata),
                            receiver_id: contract_id, // `${subaccount}.${smartContractName}`,
                            perpetual_royalties: Object.keys(perpetualRoyalties).length > 0 ? perpetualRoyalties : undefined,
                        })
                    ),
                    GAS / 2,
                    mint_txFee
                )
            ];

            if (nft.isLive) {
                allTransactions.push(
                    transactions.functionCall(
                        'nft_approve',
                        Buffer.from(
                            JSON.stringify({
                                token_id: tokenId,
                                account_id: marketContractName,
                                msg: JSON.stringify({
                                    sale_conditions: utils.format.parseNearAmount(data.price.toString()), is_auction: false
                                }),
                            })
                        ),
                        GAS / 2,
                        apr_mint_txFee
                    )
                )
            }

            await contract.account.signAndSendTransaction(contract.contractId,
                allTransactions
            );

        } catch (err) {
            debugger;
            console.log(err);
        }

    };

    const uploadFile = async (data) => {
        var url = "";
        if (file) {
             setLoader(true);
            const created = await client.add(file);
            url = `https://ipfs.infura.io/ipfs/${created.path}`;
             setLoader(false);

        }
        return url;
    }

    const handleFileChange = (file) => {
        setNft((prev) => { return { ...prev, "media": file } });
        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);

            const reader1 = new window.FileReader();
            reader1.readAsArrayBuffer(file);

            reader1.onloadend = () => {
                setFile(Buffer(reader1.result));
            };
        }
    };

    const getCollections = async () => {
        // setLoader(true);
        const user = await getUser();
        // const response = await user.functions.get_collections(40, colCount * 40);
        const response = await user.functions.get_collections_by_createdBy(40, colCount, accountId);
        var allCollections = [...collections, ...response];
        setCollections(allCollections);

        const options = [];
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

        const collectionId = searchParams.get("collectionName");
        const collection = options.find(x => x.value == collectionId);

        if(collection){
            handleChangeCollection(collection);
        }

    }

    const loadMore = (options) => {
        setColCount((prev) => prev + 1)
        console.log(options);
    }

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
        <div className="container p-5 text-light">
            {isLoading ? <Loader /> : null}
            <div className="row">
                <div className='col-sm-6'>
                    <h1>Mint NFT</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="mb-3 file-upload">
                            <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} label="PNG, GIF, WEBP, MP4 or MP3. Max 100mb." maxSize="100" />
                            <span className='file-upload-cosef'>Choose file</span>
                        </div>

                        <div className="mb-3">
                            <Select placeholder="Choose a collection"
                                styles={customStyles}
                                components={{ SingleValue: IconSingleValue, Option: IconOption, Menu: CustomMenu }}
                                options={options}
                                name="collection"
                                value={nft.collection}
                                onChange={handleChangeCollection}
                                //validate="required"
                                required
                            />
                            <div style={{ display: !nft.collection ? "block" : "none" }} className="color-red"> Please select collection.</div>

                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Title" {...register("title", { required: true, maxLength: 80 })} />
                            {errors.title && <p className='error-msg'>Title is required</p>}
                        </div>

                        <div className="mb-3">
                            <textarea type="text" className="form-control" placeholder="Description" {...register("description", { required: true, maxLength: 80 })} ></textarea>
                            {errors.description && <p className='error-msg'>Description is required</p>}
                        </div>

                        <div className="mb-3">
                            <input type="number" min={1} className="form-control" placeholder="Number of copies(Ex: 10)" {...register("copies")} />
                            {errors.copies && <p className='error-msg'>Number of copies is required</p>}
                        </div>

                        <div className="mb-3">
                            <input type="number" min={1} className="form-control" placeholder="Price" {...register("price", { required: true, maxLength: 80 })} />
                            {errors.price && <p className='error-msg'>Price is required</p>}
                        </div>

                        {
                            talbeRows.map((item, index) => {
                                if (item) {
                                    return (
                                        <div className="row mb-3" key={index.toString()}>
                                            <div className="col-sm-5">
                                                <input type="number" min={1} className="form-control" placeholder="Royalty"
                                                    name="royalty"
                                                    value={item.royalty && Math.max(0, item.royalty)}
                                                    onChange={(e) => {
                                                        handleRoyaltyChange(e, index);
                                                    }}
                                                    required={item.walletaddress ? true : false}
                                                />
                                                {/* {errors.royalty && <p className='error-msg'>Royalty is required</p>} */}
                                            </div>
                                            <div className="col-sm-5">
                                                <input type="text" className="form-control" placeholder="Wallet Address"
                                                    // defaultValue={wallet.getAccountId()}
                                                    name="walletaddress"
                                                    value={item.walletaddress}
                                                    onChange={(e) => {
                                                        handleRoyaltyChange(e, index);
                                                    }}
                                                    required={item.royalty ? true : false}
                                                />
                                                {/* {errors.walletAddress && <p className='error-msg'>Wallet address is required</p>} */}
                                            </div>
                                            <div className='col-sm-2 text-center'>
                                                {index != 0 && (
                                                    <OverlayTrigger overlay={<Tooltip>Remove item</Tooltip>}>
                                                        <Button variant="link" type='button' onClick={() => deleteRow(talbeRows, index, 'royalties')}> <FontAwesomeIcon icon={faTrash} className="color-theme" /></Button>
                                                    </OverlayTrigger>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                            })}

                        <button disabled={tabs > 3} type="button" className="btn-submit text-light bg-darkmode border-2-solid" onClick={addNewRow}><b>+ </b> more royalties</button>

                        <p style={{ display: tabs > 3 ? 'block' : 'none', color: 'red', fontSize: '13px' }}>You can only set 4 royalties</p>
                        <div className="font-size-18 mob-f-16 text-light py-3">Properties <span className="color-gray"> (Optional)</span></div>

                        {properties.map((item, index) => {
                            if (item) {
                                return (
                                    <div className="row mb-3" key={index.toString()}>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Size"
                                                name="key"
                                                value={item.key}
                                                onChange={(e) => {
                                                    handlePropertyChange(e, index);
                                                }}
                                                required={item.value ? true : false}
                                            />
                                            {/* {errors.royalty && <p className='error-msg'>Royalty is required</p>} */}
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="M"
                                                name="value"
                                                value={item.value}
                                                onChange={(e) => {
                                                    handlePropertyChange(e, index);
                                                }}
                                                required={item.key ? true : false}
                                            />
                                            {/* {errors.walletAddress && <p className='error-msg'>Wallet address is required</p>} */}
                                        </div>

                                        <div className='col-sm-2 text-center'>
                                            {index != 0 && (
                                                <OverlayTrigger overlay={<Tooltip>Remove item</Tooltip>}>
                                                    <Button variant="link" type='button' onClick={() => deleteRow(properties, index, 'properties')}> <FontAwesomeIcon icon={faTrash} className="color-theme" /></Button>
                                                </OverlayTrigger>
                                            )}
                                        </div>
                                    </div>
                                )
                            }
                        }
                        )}
                        <button type="button" className="btn-submit text-light bg-darkmode border-2-solid" onClick={addNewProperty} ><b>+ </b> more properties</button>
                        <div className='pt-4'>

                            <div className="font-size-18 text-light py-3">List nft on marketplace?</div>
                            <BootstrapSwitchButton checked={nft.isLive} onstyle="danger"
                                onChange={(checked) => {
                                    setNft((prev) => {
                                        return { ...prev, 'isLive': checked };
                                    });
                                }}
                            />
                        </div>
                        <button type="submit" className="btn-submit text-light font-w-700 text-light-mode mt-3">Mint NFT</button>
                        {/* <button type="submit" className="btn btn-primary">Mint NFT</button> */}
                    </form>
                </div>
                <div className="col-sm-6 mobile-none">
                    <div className="pb-2">Preview</div>
                    <div className="img-preview-box font-size-16 bg-options" style={{ backgroundImage: `url('${image}')` }}>
                        <div className={"no-img-txt color-gray " + (image ? 'd-none' : '')} >
                            Upload file to preview your
                            brand new NFT
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StepTwo;