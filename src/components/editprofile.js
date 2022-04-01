import '../App.css';
import React, { useEffect, useState } from 'react';
import { db } from '../db/firebase';
import { Loader } from "../services/ui";
// import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import { getUser, getUserForUpdateDb, mongodb } from '../db/mongodb';
import { ObjectID } from 'bson';
import { toast } from 'react-toastify';
import { create } from "ipfs-http-client";
const client = create('https://ipfs.infura.io:5001/api/v0');

const EditProfile = ({ contractX, account, wallet }) => {
   
    const accountId = wallet.getAccountId();

    // profile image
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const [isProfilePicChanged, setProfilePicChanged] = useState(false);

    //banner image
    const [bannerFile, setBannerFile] = useState();
    const [bannerImage, setBannerImage] = useState();
    const [isBannerChanged, setBannerChanged] = useState(false);
   
    const [isAuthor, setIsAuthor] = useState(false);
    const [isLoading, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const [author, setAuthor] = useState({
        userName: accountId,
        customUrl: accountId,
        bio: "",
        twitterUsername: "",
        siteOrPortfolioLink: "",
        email: "",
        bannerImageUrl:"",
        profile_pic:""
    });

    useEffect(() => {
        return getProfile();
    }, []);

    const getProfile = async () => {
    setLoader(true);        
      const user = await getUserForUpdateDb();
       const response = await user.functions.get_profile(accountId);
       setLoader(false); 
        if (response) {
            setImage({image:response.profile_pic});
            setBannerImage({bannerImage:response.bannerImageUrl});
            setIsAuthor(true);
            setAuthor({
                userName:response.display_name,
                customUrl:response.custom_url,
                bio: response.bio,
                twitterUsername: response.twitter,
                siteOrPortfolioLink: response.personal_site,
                email: response.email,
                bannerImageUrl: response.bannerImageUrl,
                profile_pic: response.profile_pic
            });
        } else {
            setIsAuthor(false);
        }

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
                setImage({ image: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
        
        // set file for save into ipfs
        const reader1 = new FileReader();
        reader1.readAsArrayBuffer(event.target.files[0]);
        reader1.onloadend = () => {
            setFile(Buffer(reader1.result));
        };

        setProfilePicChanged(true);
    }

    const fileSelectHandler1 = (event) => {

        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setBannerImage({ bannerImage: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
        
        // set file for save into ipfs
        const reader1 = new FileReader();
        reader1.readAsArrayBuffer(event.target.files[0]);
        reader1.onloadend = () => {
            setBannerFile(Buffer(reader1.result));
        };
        setBannerChanged(true);
    }

    const upload = () => {
        document.getElementById("selectImage").click();
    }

    const upload1 = () => {
        document.getElementById("selectImage1").click();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(isProfilePicChanged){
                uploadFile();
            }else{
                saveAuthor()
            }
        }
        setValidated(true);

    };

    const uploadBanner = async () =>{
        setLoader(true);
        const created = await client.add(bannerFile);
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        setLoader(false);
        return url;
    }

    const uploadFile = async () => {
       
        setLoader(true);
        const created = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        setLoader(false);

        saveAuthor(url);
    }

    const saveAuthor = async (profile_picture_url="") => {
        var bannerImageUrl="";
        if(isBannerChanged){
            bannerImageUrl = await uploadBanner();
        }
        setLoader(true);
        const user = await getUserForUpdateDb();
        await user.functions.update_profile(
            accountId,
            author.email,
            profile_picture_url ? profile_picture_url : author.profile_pic,
            author.userName,
            author.customUrl,
            author.bio,
            author.twitterUsername,
            author.siteOrPortfolioLink,
            bannerImageUrl ? bannerImageUrl : author.bannerImageUrl
        ).then(res => {
            toast("Your profile updated successfully!", { type: 'success' });
        }, error => {
            toast(error, { type: 'error' });
        });
        setLoader(false);
    }

    return (
        <div className="bg-darkmode edit-profile">
            {isLoading ? <Loader /> : null}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <div className="pos-rel pb-5">
                    {console.log(bannerImage)}
                    <div className="bg-profile height-240 banner-bg" onClick={upload1} style={{ backgroundImage: `url('${bannerImage?.bannerImage}')` }}>
                    <div className="edit-prifile-pic-text d-block-btext" style={{display: bannerImage?.bannerImage ? 'none' : 'block' }}> Change Banner (We recomended an image of at least 1200x240) </div>
                        <input id='selectImage1' hidden type="file" onChange={fileSelectHandler1} accept="image/*" />
                    </div>
                    <div className="container pb-5">
                        {/* <img src={avtar} className="avtar-position" /> */}
                        <div className="avtar-position edit-profile-pic-input" onClick={upload} style={{ backgroundImage: `url('${image?.image}')`}}>
                            <div className="pos-rel" style={{ width: '180px', height: '180px' }}>
                                {/* {!image?.image && ( */}
                                    <div className="edit-prifile-pic-text d-block-text" style={{display: image?.image ? 'none' : 'block' }}> Choose file </div>
                                {/* )} */}
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
                    <input type="text" defaultValue={author.userName} onChange={handleChange} name="userName" placeholder="Enter display name" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>

                <div className="container">
                    <div className="font-size-18 text-light py-3">Custom URL</div>
                    {/* "drawstring.io" */}
                    <input type="text" defaultValue={author.customUrl} onChange={handleChange} name="customUrl" placeholder="Enter custom url" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Bio</div>
                    {/* "excuse me" */}
                    <input type="text" defaultValue={author.bio} onChange={handleChange} name="bio" placeholder="Enter bio" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Twitter Username</div>
                    <div className="d-flex">
                        {/* "@author_name" */}
                        <input type="text" defaultValue={author.twitterUsername} onChange={handleChange} name="twitterUsername" placeholder="Enter twitter user name" className="profile-input pb-3 me-5 w-25" />
                        {/* <div className="color-pink">Veriefied Twitter</div> */}
                    </div>
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Personal site or portfolio</div>
                    {/* "https://link.com" */}
                    <input type="text" defaultValue={author.siteOrPortfolioLink} onChange={handleChange} name="siteOrPortfolioLink" placeholder="Enter personal site or portfolio" className="profile-input pb-3" />
                </div>
                <div className="border-bottom-2"></div>
                <div className="container">
                    <div className="font-size-18 text-light py-3">Email</div>
                    <div className="d-flex">
                        {/* "Enter your email" */}
                        <input type="text" defaultValue={author.email} onChange={handleChange} name="email" placeholder="Enter your email" className="profile-input pb-3 me-5 w-25" />
                        {/* <div className="color-pink">Confirm</div> */}
                    </div>
                </div>
                <div className="border-bottom-2"></div>

                <div className="container pb-5 pt-4">
                    <button type="submit" className="btn-submit text-light text-light-mode">Update profile</button>
                </div>

            </Form>
        </div>
    );

}
export default EditProfile;