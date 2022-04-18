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

const client = create('https://ipfs.infura.io:5001/api/v0');

const StepOne = ({ contractX, account, wallet }) => {
    const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [file, setFile] = useState(null);

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
                }else{
                
                    let col = JSON.parse(localStorage.getItem("collection"));
                    const subaccount = col.name.toLowerCase().replace(/ /g, "_");
                     navigate(`/wizard/steptwo?collectionName=${subaccount}`);
                   // navigate(`/steptwo`);
                    toast("Collection created successfully.", {type: "success"});
                    
                    localStorage.removeItem("collection");
                    localStorage.removeItem(subaccount + "_isContractInitialized");
                }
            }
        }
    }

    useEffect(() => {
        return pageLoad();
    }, []);


    const onSubmit = async(data) => {
        console.log(data);
        const subaccount = data.name.toLowerCase().replace(/ /g, "_");

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

        try {
            
            await contract.new({
                owner_id: `${subaccount}.${smartContractName}`,
                metadata: {
                    "spec": "nft-1.0.0",
                    "name": col.name.toLowerCase(),
                    "symbol": "CHM-10",
                    "icon": col.fileUrl,
                    "base_uri": null,
                    "referance": null,
                    "referance_hash": null, // must exist if the "referance" field exists.
                }
            }, GAS);
                   
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
    };

    const uploadFile = async (data) => {
        try{
            debugger;
            if (file) {
                const created = await client.add(file);
                const url = `https://ipfs.infura.io/ipfs/${created.path}`;
    
                let col = data;
                col.fileUrl = url;
                localStorage.setItem("collection", JSON.stringify(col));
    
                deploy(col);
            } else {
                toast("File is required", { type: "error" })
            }
        }catch(error){
            console.log(error);
        }
        
    }

    return (
        <div className="container p-5 text-light">
            <h1>Create Collection</h1>
            <div className='col-sm-6'>
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

                    <button type="submit" className="btn btn-primary">Create item</button>
                    {/* <input type="submit" /> */}
                </form>
            </div>
        </div>
    );
}

export default StepOne;