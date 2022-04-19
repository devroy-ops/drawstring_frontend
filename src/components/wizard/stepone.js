import { useForm } from 'react-hook-form';
import { FileUploader } from "react-drag-drop-files";
import { create } from "ipfs-http-client";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Buffer } from 'buffer';
import { transactions, nearAPI } from 'near-api-js';
import { init, author, GAS, deploy_txFee } from "../../services/helper";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { smartContractName } from '../../services/utils';
import { generateSeedPhrase } from "near-seed-phrase";
import { getUserForUpdateDb } from '../../db/mongodb';
import { Loader } from '../../services/ui';

const client = create('https://ipfs.infura.io:5001/api/v0');

const StepOne = ({ contractX, account, wallet }) => {
    const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];
    const { register, handleSubmit, getValues, formState: { errors, touched } } = useForm();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState();
    const [isLoading, setLoader] = useState(false);

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
                    initializeContract();
                } else {

                    saveContract(col, subaccount);

                    // let col = JSON.parse(localStorage.getItem("collection"));
                    // const subaccount = col.name.toLowerCase().replace(/ /g, "_");
                    // navigate(`/wizard/steptwo?collectionName=${subaccount}`);
                    // // navigate(`/steptwo`);
                    // toast("Collection created successfully.", { type: "success" });

                    // localStorage.removeItem("collection");
                    // localStorage.removeItem(subaccount + "_isContractInitialized");
                }
            }
        }
    }

    const saveContract = async (col, subaccount) => {
        setLoader(true);
        const user = await getUserForUpdateDb();
        await user.functions.add_collection(col.name.toLowerCase(), col.fileUrl, subaccount, wallet.getAccountId());
        setLoader(false);

        navigate(`/wizard/steptwo?collectionName=${subaccount}`);
        toast("Collection created successfully.", { type: "success" });

        localStorage.removeItem("collection");
        localStorage.removeItem(subaccount + "_isContractInitialized");
        //localStorage.removeItem(subaccount + "_isSetRoyalties");
    }

    useEffect(() => {
        return pageLoad();
    }, []);


    const onSubmit = async (data) => {
        console.log(data);
        debugger;
        uploadFile(data);

    };
    let {publicKey,secretKey,seedPhrase} = generateSeedPhrase();
    console.log(secretKey,seedPhrase);
    debugger
    const deploy = async (data) => {
        try { 

            // load and deploy smart contract
            const subaccount = data.name.toLowerCase().replace(/ /g, "_");
            const respons = await contractX.deploy_nftdrop_contract(
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

    const initializeContract = async () => {
        let col = JSON.parse(localStorage.getItem("collection"));
        const subaccount = col.name.toLowerCase().replace(/ /g, "_");
        const contract = await init(wallet, subaccount);
        const symbol = subaccount.substring(0,3)
        try {

            const allTransactions = [
                transactions.functionCall(
                    'new',
                    Buffer.from(
                        JSON.stringify({
                            owner_id: `${subaccount}.${smartContractName}`,
                            metadata: {
                                "spec": "nft-1.0.0",
                                "name": col.name.toLowerCase(),
                                "symbol": symbol,
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

            // const response = await contract.new({
            //     owner_id: account.accountId,
            //     metadata: {
            //         "spec": "nft-1.0.0",
            //         "name": col.name.toLowerCase(),
            //         "symbol": "CHM-10",
            //         "icon": col.fileUrl,
            //         "base_uri": null,
            //         "referance": null,
            //         "referance_hash": null, // must exist if the "referance" field exists.
            //     }
            // }, GAS);

        } catch (error) {
            console.log(error);
        }
    }

    console.log(errors);

    const handleFileChange = (file) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = () => {
            setFile(Buffer(reader.result));
        };

        let reader1 = new FileReader();
        reader1.onload = (e) => {
            setImage(e.target.result);
        };
        reader1.readAsDataURL(file);
    };

    const uploadFile = async (data) => {
        try {
            if (file) {
                const created = await client.add(file);
                const url = `https://ipfs.infura.io/ipfs/${created.path}`;

                let col = data;
                col.fileUrl = url;

                const royalties = {};
                const total_unit = 10000;

                let colroyalty = parseInt(data.royalty)
                let royalty = colroyalty / 100 * total_unit;
                console.log(royalty);
                if (data.royalty && data.walletAddress) {
                    royalties[data.walletAddress] = royalty;
                }
                delete col.walletAddress;
                delete col.royalty;

                col.royalties = royalties;
                debugger;
                localStorage.setItem("collection", JSON.stringify(col));

                deploy(col);
            } else {
                toast("File is required", { type: "error" })
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className="container p-5 text-light">
            {isLoading ? <Loader /> : null}
            <div className='row'>
                <div className='col-sm-6'>
                    <h1>Create Collection</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="mb-3 file-upload">
                            <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} label="PNG, GIF, WEBP, MP4 or MP3. Max 100mb." maxSize="100" />
                            <span className='file-upload-cosef'>Choose file</span>
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Name" {...register("name", { required: true, maxLength: 80 })} />
                            {errors.name && <p className='error-msg'>Name is required</p>}
                        </div>
                        <div className="mb-3">
                            <textarea type="text" className="form-control" placeholder="Description" {...register("description", { required: true, maxLength: 80 })} ></textarea>
                            {errors.description && <p className='error-msg'>Description is required</p>}
                        </div>

                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                {/* {console.log(touched["walletAddress"])} */}
                                <input type="number" min={1} className="form-control" placeholder="Royalty" {...register("royalty", { required: true })} />
                                {errors.royalty && <p className='error-msg'>Royalty is required</p>}
                            </div>
                            <div className="col-sm-6 mb-3">
                                <input type="text" className="form-control" placeholder="Wallet Address" {...register("walletAddress", { required: true })}
                                    defaultValue={wallet.getAccountId()} />
                                {errors.walletAddress && <p className='error-msg'>Wallet address is required</p>}
                            </div>
                        </div>

                        <button type="submit" className="btn-submit text-light font-w-700 text-light-mode">Create Collection</button>
                        {/* <button type="submit" className="btn btn-primary">Create collection</button> */}
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

export default StepOne;