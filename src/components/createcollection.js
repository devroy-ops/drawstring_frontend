import '../App.css';
import { useParams } from "react-router-dom";
import { useState } from "react";
// import React from 'react';
import avtar from '../images/users/avtar.svg';
import { FileUploader } from "react-drag-drop-files";
import '../styles/createcollection.css';

const fileTypes = ["JPG", "PNG", "GIF", "WEBP", "MP4", "MP3"];

export default function CreateCollection() {

    const [file, setFile] = useState(null);

    const handleChange = (file) => {
        setFile(file);
    };

    return (
        <div className="bg-darkmode">
            <div className="container text-light createcollection p-0">
                <div className="py-3 title">Create Collection</div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="pb-3">
                            <div className="pb-2 upload-text">Upload file</div>
                            <div className="file-upload">
                                <FileUploader handleChange={handleChange} name="file" types={fileTypes} label="PNG, GIF, WEBP, MP4 or MP3. Max 100mb." maxSize="100" />
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
                            <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. “Redeemable T-Shirt withLogo”' />
                        </div>
                        <div className="border-bottom-2"></div>
                        <div>
                            <div className="font-size-18 text-light py-3">Description <span className="color-gray"> (Optional)</span></div>
                            <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. “Redeemable T-Shirt withLogo”' />
                        </div>
                        <div className="border-bottom-2"></div>
                        <div>
                            <div className="font-size-18 text-light py-3">Number of copies</div>
                            <input type="text" className="profile-input pb-3 w-100" placeholder='E. g. 10”' />
                        </div>
                        <div className="border-bottom-2"></div>
                        <div className="font-size-14 color-gray pt-2">Amount of tokens</div>
                        <div className="row bid-mobile-100">
                            <div className="col-sm-6">
                                <div>
                                    <div className="font-size-18 text-light py-3">Royalties</div>
                                    <input type="text" className="profile-input pb-3 w-100" placeholder='10%' />
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


                        <button type="button" className="btn-submit text-light bg-darkmode border-2-solid"><b>+ </b> add more loyalties</button>
                        <div className="row bid-mobile-100">
                            <div className="col-sm-6">
                                <div>
                                    <div className="font-size-18 mob-f-16 text-light py-3">Properties <span className="color-gray"> (Optional)</span></div>
                                    <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. Size' />
                                </div>
                                <div className="border-bottom-2"></div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div className="font-size-18 mob-f-16 text-light py-3">Wallet address</div>
                                    <input type="text" className="profile-input pb-3 w-100" placeholder='e.g. M' />
                                </div>
                                <div className="border-bottom-2"></div>
                            </div>
                        </div>
                        <div className="row pt-3 pb-5 bid-mobile-100">
                            <div className="col-sm-6">
                                <button type="button " className="btn-submit text-light font-w-700 text-light-mode">Create item</button>
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
            </div>
        </div>
    );
}