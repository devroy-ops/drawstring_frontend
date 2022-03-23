import { Modal} from 'react-bootstrap';
import creater from '../images/product/creater.svg';
import collection from '../images/product/collection.svg';
import heart from '../images/home/heart.svg';
import more from '../images/home/more.svg';
import copy_icon from '../images/users/copy_icon.svg';

const NftDetailModal=({nftData, isModalOpen, handleClose})=>{

    return(
        <div className="bg-darkmode product-pages">
             <Modal show={isModalOpen} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nft Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="container px-0">
                <div className="row mobile-reverce">
                    <div className="col-sm-6">
                        <div className="d-flex">
                            <div className="title">
                                {nftData.name}
                            </div>
                            <div>
                                <button type="button" className="btn heart-btn pt-3 px-5"><img src={heart} /> <span className="color-gray">{nftData.likes}</span></button>
                            </div>
                            <div className="explore-dot bg-black float-end mt-3"><img src={more} className="pb-1" /></div>
                        </div>

                        <div className="copy-btn pt-2 mt-3 mb-4"> #27513  0x47BE...6f4f <img src={copy_icon} className="float-end" /></div>

                        <div className="d-flex font-size-18 mt-4 mb-3 onsel-mob-text-16" >
                            <div className="me-5">On sale for 6.09 ETH</div>
                            <div>Highest bid 7 WETH</div>
                        </div>

                        <div className="row pt-3 tab-col-w-100">
                            <div className="col-sm-6">
                                <div className="pb-2">Creator</div>
                                <div><img src={creater} className="me-2 font-size-18" /> Creator</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="pb-2">Collection</div>
                                <div><img src={collection} className="me-2 font-size-18" /> Collection</div>
                            </div>
                        </div>

                    </div>
                    <div className="col-sm-6">
                        <img src={nftData.img} className="img-fluid border-bg product-profile-img" />
                    </div>
                </div>
            </div>
                    {/* <img src={nftData.img} /> */}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default NftDetailModal;