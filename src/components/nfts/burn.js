import { Modal } from "react-bootstrap";
import { MarketplaceTypes } from "../../enums/filetypes";
import { initSmartContract } from "../../services/helper";

const BurnNft = ({nft,  isModalOpen, handleClose, wallet}) => {

    const burnNft = async () => {

        try {
            const contractId = JSON.parse(nft.metadata.extra).contract_id;
            const contract = await initSmartContract(wallet, contractId);
           
            const data = nft;
            data.marketType = MarketplaceTypes.BURN; //"burned"
            localStorage.setItem("nft", JSON.stringify(data));
            
            await contract.burn_nft({
                "token_id": nft.token_id
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
                        <Modal.Title>Burn {nft?.metadata?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="text-warning">Warning: burning and NFT permanently destroys the NFT.</div>
                    </Modal.Body>
                    <Modal.Footer>
                         <button type="button" className="btn-submit text-light bg-darkmode border-2-solid font-w-700 me-2" onClick={handleClose}>Cancel</button>
                         <button type="button" className="btn-submit text-light font-w-700 text-light-mode" onClick={burnNft}>Burn NFT</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )

}

export default BurnNft;