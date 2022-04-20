import * as nearAPI from "near-api-js";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MarketplaceTypes } from "../../enums/filetypes";
import { initSmartContract } from "../../services/helper";
import { marketContractName } from "../../services/utils";
const { utils } = nearAPI;

const SaleNft = ({nft,  isModalOpen, handleClose, wallet}) => {
    const { register, handleSubmit, getValues, formState: { errors, touched } } = useForm();

    const onSubmit = async (formdata) => {
        try {

            const contractId = JSON.parse(nft.metadata.extra).contract_id;
            const contract = await initSmartContract(wallet, contractId);
           
            const data = nft;
            data.marketType = MarketplaceTypes.SALE; //"sale"
            data.price = formdata.price;
            localStorage.setItem("nft", JSON.stringify(data));

            await contract.nft_approve({
                token_id: nft.token_id,
                account_id: marketContractName,
                msg: {
                    sale_conditions: utils.format.parseNearAmount(formdata.price.toString()), is_auction: false,
                },
            });

        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <>
            <div className="bg-darkmode product-pages">
                <Modal show={isModalOpen} onHide={handleClose} size="md">
                    <Modal.Header closeButton>
                        <Modal.Title>Sale {nft?.metadata?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <input type="number" className="form-control" placeholder="price" {...register("price", { required: true })} />
                                {errors.price && <p className='error-msg'>Price is required</p>}
                            </div>
                            <div className="text-end">
                                <button type="button" className="btn-submit text-light bg-darkmode border-2-solid font-w-700 me-2" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="btn-submit text-light font-w-700 text-light-mode">Put on sale</button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default SaleNft;