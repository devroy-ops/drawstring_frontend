import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mongodb } from "../../db/mongodb";
import { init } from "../../services/helper";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { toast } from "react-toastify";
import WizardBar from "./wizardbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faBackward } from "@fortawesome/free-solid-svg-icons";

const StepThree = ({ contractX, account, wallet }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [searchParams, setSearchParams] = useSearchParams();
    const [claimLinks, setClaimLinks] = useState([]);
    let navigate = useNavigate();

    const tokenId = searchParams.get("tokenId");
    const collectionId = searchParams.get("collectionId");

    const onSubmit = async (data) => {
        console.log(data);

        const contract = await init(wallet, collectionId);
        const nft = await contract.nft_token({ "token_id": tokenId });

        const claimData = {
            collectionId: collectionId,
            tokenId: tokenId,
            image: nft.metadata.media,
            // claimLink: claimLink,
            isClaimed: false
        };

        const claimDataLinks = [];
        for (let i = 0; i < data.linksCount; i++) {
            // const claimLinkId = uuidv4();// ${window.location.origin}
            const claimLink = `https://drawstring.io/?token=${tokenId}&collection=${collectionId}`; // /${claimLinkId}
            // claimData.id = claimLinkId;
            claimData.claimLink = claimLink;

            claimDataLinks.push(claimData);
        }

        setClaimLinks(claimDataLinks);

        mongodb.collection('claimLinks').insertOne(claimDataLinks[0]).then((res) => {
            //mongodb.collection('claimLinks').insertMany(claimDataLinks).then((res)=>{
            debugger
            toast("Claim link added successfully!", { type: 'success' });
        }, error => {
            console.log(error);
        });
    };

    return (
        <div className="container p-5 text-light">
            {/* <WizardBar /> */}
            <h1>Generate claim links</h1>
            <div className="row">
                <div className='col-sm-6'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <b>Nft token id</b>
                            <input type="text" className="form-control" placeholder="token id" defaultValue={tokenId} readOnly {...register("tokenId", { required: true })} />
                            {errors.name && <p className='error-msg'>Token Id is required</p>}
                        </div>
                        <div className="mb-3">
                            <b>Number of claim links</b>
                            <input type="number" className="form-control" placeholder="Number of links" defaultValue={1} readOnly {...register("linksCount", { required: true })} />
                            {errors.name && <p className='error-msg'>Token Id is required</p>}
                        </div>

                        <button type="button" className="btn-submit text-light font-w-700 text-light-mode mt-3 me-3" onClick={(event) => { event.preventDefault(); navigate(`/wizard/steptwo?collectionName=${collectionId}`) }}>
                            <FontAwesomeIcon icon={faBackward} /> Go back
                        </button>

                        <button type="submit" className="btn-submit text-light font-w-700 text-light-mode mt-3">Create claim link</button>
                        {/* <button type="submit" className="btn btn-primary">Create claim link</button> */}
                    </form>
                </div>
                <div className="col-sm-6">
                    <ul>
                        {claimLinks && claimLinks.length > 0 && claimLinks.map((link, index) => {
                            return (
                                <li key={index}>{link.claimLink}</li>
                            )
                        })}

                    </ul>
                </div>
            </div>

        </div>
    );
}

export default StepThree;