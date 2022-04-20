import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MarketplaceTypes } from "../../enums/filetypes";
import { GAS, initSmartContract } from "../../services/helper";

const TransferNft = ({ nft, isModalOpen, handleClose, wallet }) => {
    const { register, handleSubmit, getValues, formState: { errors, touched } } = useForm();

    const onSubmit = async (formData) => {
        try {
            const contractId = JSON.parse(nft.metadata.extra).contract_id;
            const contract = await initSmartContract(wallet, contractId);
           
            const data = nft;
            data.marketType = MarketplaceTypes.TRANSFER; //"transfer"
            data.receiver_id = formData.receiver_id;
            localStorage.setItem("nft", JSON.stringify(data));
            debugger;
            await contract.nft_transfer({
                receiver_id: formData.receiver_id,
                token_id: nft.token_id,
                approval_id: 0
            },
                GAS,
                1
            );
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="bg-darkmode product-pages">
                <Modal show={isModalOpen} onHide={handleClose} size="md">
                    <Modal.Header closeButton>
                        <Modal.Title>Transfer {nft?.metadata?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Reciever Id" {...register("receiver_id", { required: true })} />
                                {errors.receiver_id && <p className='error-msg'>Reciever Id is required</p>}
                            </div>
                            <div className="text-end">
                                <button type="button" className="btn-submit text-light bg-darkmode border-2-solid font-w-700 me-2" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="btn-submit text-light font-w-700 text-light-mode">Transfer NFT</button>
                            </div>
                        </form>

                    </Modal.Body>

                </Modal>
            </div>
        </>
    )
}

export default TransferNft;