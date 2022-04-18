import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { create } from "ipfs-http-client";
import { FileUploader } from "react-drag-drop-files";
import { transactions } from 'near-api-js';
import { apr_mint_txFee, GAS, init, mint_txFee, storageDeposit } from "../../services/helper";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as nearAPI from "near-api-js";
import { marketContractName } from "../../services/utils";
import { smartContractName } from '../../services/utils';
import { toast } from "react-toastify";
const { utils } = nearAPI;

const client = create('https://ipfs.infura.io:5001/api/v0');

const StepTwo = ({ contractX, account, wallet }) => {
    const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [image, setImage] = useState();
    const [file, setFile] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();

    useEffect(() => {
       // return init(wallet, );
       setTimeout(() => {
            initMarketPlace()
       }, 1000);
    }, []);

    useEffect(() => {
       return loadStepThree();
    }, []);

    const loadStepThree = () =>{
        var transactionHashes = searchParams.get("transactionHashes");
        if (transactionHashes) {
          
            const nft = JSON.parse(localStorage.getItem("nft"));
            if (nft) {
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
        

        var fileUrl = await uploadFile(data);

        const tokenId = `token-${Date.now()}`;

        data.tokenId = tokenId;
        localStorage.setItem("nft", JSON.stringify(data));
        console.log(data);

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
            // extra: null,
            // referance: null,
            // referance_hash: null
          };

        const accountId = wallet.getAccountId();
        const subaccount = searchParams.get("collectionName");
        debugger;
        const contract = await init(wallet, subaccount);
          console.log(contract.contractId, 'con');
          debugger
        await contract.account.signAndSendTransaction(contract.contractId, [
            transactions.functionCall(
              'nft_mint',
              Buffer.from(
                JSON.stringify({
                  token_id: tokenId,
                  metadata,
                  //metadata:JSON.stringify(metadata),
                  receiver_id: `${subaccount}.${smartContractName}`,
                 // perpetual_royalties: null,
                })
              ),
              GAS/2,
              mint_txFee
            ),
            // transactions.functionCall(
            //   'nft_approve',
            //   Buffer.from(
            //     JSON.stringify({
            //       token_id: tokenId,
            //       account_id: marketContractName,
            //       msg: JSON.stringify({
            //         sale_conditions:  utils.format.parseNearAmount(data.price.toString()), is_auction: false
            //       }),
            //     })
            //   ),
            //   GAS/2,
            //   apr_mint_txFee
            // ),
          ]);
    };

    const uploadFile = async (data) => {
        var url = "";
        if (file) {
            // setLoader(true);
            const created = await client.add(file);
            url = `https://ipfs.infura.io/ipfs/${created.path}`;
            // setLoader(false);
            
        }
        return url;
    }

    const handleFileChange = (file) => {
        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setImage({ image: e.target.result });
            };
            reader.readAsDataURL(file);

            const reader1 = new window.FileReader();
            reader1.readAsArrayBuffer(file);

            reader1.onloadend = () => {
                setFile(Buffer(reader1.result));
            };
        }


    };

    return (
        <div className="container p-5 text-light">
            <h1>Mint Nft</h1>
            <div className='col-sm-6'>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-3 file-upload">
                        <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} label="PNG, GIF, WEBP, MP4 or MP3. Max 100mb." maxSize="100" />
                        <span className='file-upload-cosef'>Choose file</span>
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
                        <input type="text" className="form-control" placeholder="Number of copies(Ex: 10)" {...register("copies")} />
                        {errors.copies && <p className='error-msg'>Number of copies is required</p>}
                    </div>

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Price" {...register("price", { required: true, maxLength: 80 })} />
                        {errors.price && <p className='error-msg'>Price is required</p>}
                    </div>

                    <button type="submit" className="btn btn-primary">Create item</button>
                    {/* <input type="submit" /> */}
                </form>
            </div>
        </div>
    );
}

export default StepTwo;