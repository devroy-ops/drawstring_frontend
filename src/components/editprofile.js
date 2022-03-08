import '../App.css';
import React, { useEffect, useState } from 'react';
import { db } from '../db/firebase';
import { Loader } from "../services/ui";
// import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';

const EditProfile = ({ contractX, account, wallet }) => {
    
    const [file, setFile] = useState();
    const [author, setAuthor] = useState();
    const [isLoading, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        return getAuthor();
    }, []);

    const getAuthor = () => {
        const accountId = wallet.getAccountId();
        setLoader(true);
        
        db.collection('authors').where('userName', '==', accountId).limitToLast().get().then((querySnapshot) => {
            setLoader(false);
            if (querySnapshot.size > 0) {
                let authors = [];
                querySnapshot.forEach(element => {
                    var data = element.data();
                    authors = [...authors, data];
                });

                setAuthor(authors[0]);
            }
        });
    }

    const handleChange = (e) => {
        setAuthor((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fileSelectHandler = (event) => {

        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setFile({ image: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }

    }

    const upload = () => {
        document.getElementById("selectImage").click();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            debugger;

        }
        setValidated(true);

    };

    return (
        <div className="bg-darkmode edit-profile">
            {isLoading ? <Loader /> : null}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <div className="pos-rel pb-5">
                    <div className="bg-profile height-240">
                    </div>
                    <div className="container pb-5">
                        {/* <img src={avtar} className="avtar-position" /> */}
                        <div className="avtar-position edit-profile-pic-input" onClick={upload} style={{ backgroundImage: `url('${file?.image}')` }}>
                            <div className="pos-rel" style={{ width: '180px', height: '180px' }}>
                                <div className="edit-prifile-pic-text"> Choose file </div>
                                <input id='selectImage' hidden type="file" onChange={fileSelectHandler} accept="image/*" />
                            </div>
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
                    <input type="text" defaultValue="author_name.tez" onChange={handleChange} name="firstName" placeholder="Enter display name" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>

                <div className="container">
                    <div className="font-size-18 text-light py-3">Custom URL</div>
                    <input type="text" defaultValue="drawstring.io" onChange={handleChange} name="customUrl" placeholder="Enter custom url" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Bio</div>
                    <input type="text" defaultValue="excuse me" onChange={handleChange} name="bio" placeholder="Enter bio" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Twitter Username</div>
                    <div className="d-flex">
                        <input type="text" defaultValue="@author_name" onChange={handleChange} name="twitterUsername" placeholder="Enter twitter user name" className="profile-input pb-3 me-5 w-25" />
                        <div className="color-pink">Veriefied Twitter</div>
                    </div>
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Personal site or portfolio</div>
                    <input type="text" defaultValue="https://link.com" onChange={handleChange} name="siteOrPortfolioLink" placeholder="Enter personal site or portfolio" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Email</div>
                    <div className="d-flex">
                        <input type="text" defaultValue="Enter your email" onChange={handleChange} name="email" placeholder="Enter your email" className="profile-input pb-3 me-5 w-25" />
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
                    <button type="submit" className="btn-submit text-light text-light-mode">Update profile</button>
                </div>

            </Form>
        </div>
    );

}
export default EditProfile;