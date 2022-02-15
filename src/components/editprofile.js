import '../App.css';
import { useParams } from "react-router-dom";
import React from 'react';
import avtar from '../images/users/avtar.svg';

class EditProfile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

        // let { userId } = useParams();
    }

    render() {
        return this.profile();
    }

    profile() {
        return (
            <div className="bg-darkmode edit-profile">
                <div className="pos-rel pb-5">
                    <div className="bg-profile height-240">
                    </div>
                    <div className="container pb-5">
                        {/* <img src={avtar} className="avtar-position" /> */}
                        <div className="avtar-position edit-profile-pic-input">
                            <div className="edit-prifile-pic-text"> Choose file </div>
                        </div>
                        <div className="ps-ralative">
                            <div className="font-size-14 color-gray img-hint">
                                We recomended an image of at least 300x300. Gifs work too.
                            </div>
                        </div>
                        {/* <input type="file" className="avtar-position edit-profile-pic-input" id="upload" /> */}
                    </div>
                </div>
                <div className="container pb-5">
                    <div className="text-light text-edit font-size-32">Edit Profile</div>
                    <div className="row pt-3">
                        <div className="col-sm-6 auther-desc">
                            You can set preferred display name, create your branded profile URL and mansge other personal settings
                    </div>
                    </div>
                </div>

                <div className="container">
                    <div className="font-size-18 text-light pb-3">Display name</div>
                    <input type="text" defaultValue="author_name.tez" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>

                <div className="container">
                    <div className="font-size-18 text-light py-3">Custom URL</div>
                    <input type="text" defaultValue="drawstring.io" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Bio</div>
                    <input type="text" defaultValue="excuse me" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Twitter Username</div>
                    <div className="d-flex">
                        <input type="text" defaultValue="@author_name" className="profile-input pb-3 me-5 w-25" />
                        <div className="color-pink">Veriefied Twitter</div>
                    </div>
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Personal site or portfolio</div>
                    <input type="text" defaultValue="https://link.com" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Email</div>
                    <div className="d-flex">
                        <input type="text" defaultValue="Enter your email" className="profile-input pb-3 me-5 w-25" />
                        <div className="color-pink">Confirm</div>
                    </div>
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Verification</div>
                    <div className="d-flex">
                        <div className="profile-input pb-3 me-5 w-25">
                            <div className="desc-text">
                                Proceed with verification process
                                to get more visibility and gain trust
                                on Rarible Marketplace.
                                Pleace allow up to several weeks for
                                the process.
                    </div>
                        </div>
                        <div className="color-pink">Get verified</div>
                    </div>
                </div>

                <div className="container pb-5 pt-4">
                    <button type="button" className="btn-submit text-light text-light-mode">Update profile</button>
                </div>
            </div>
        );
    }

}
export default EditProfile;