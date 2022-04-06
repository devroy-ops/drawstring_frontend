import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUser, getUserForUpdateDb } from "../db/mongodb";
import { Loader } from "../services/ui";
import more from '../images/home/more.svg';
import { toast } from "react-toastify";
import NftDetailModal from "./nftmodal";

const Search = ({ wallet }) => {

    const [nfts, setNfts] = useState([]);
    const [users, setUsers] = useState([]);
    const [collections, setCollections] = useState([]);
    const [isLoading, setLoader] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [count, setCount] = useState(0);
    const [colCount, setColCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    const [nft, setNft] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (nftData) => {
        setNft(nftData);
        setShow(true);
    }
    const [searchString, setSearchString] = useState("");

    const getAllNfts = async () => {
        setLoader(true);
        const searchString = searchParams.get("searchString") || '';
        setSearchString(searchString);
        const user = await getUser();
        const nftsResponse = await user.functions.search_listed_nfts_by_name(8, count * 8, searchString);
        console.log(nftsResponse);

        setNfts([...nfts, ...nftsResponse]);
        setLoader(false);
    }

    const getCollections = async () => {
        setLoader(true);
        const searchString = searchParams.get("searchString") || '';
        setSearchString(searchString);
        const user = await getUser();
        const response = await user.functions.search_collections_by_name(8, colCount * 8, searchString);
        console.log(response);
        setCollections([...collections, ...response]);
        setLoader(false);
    }

    const getUsers = async () => {
        try {
            setLoader(true);
            const searchString = searchParams.get("searchString") || '';
            setSearchString(searchString);
            const user = await getUserForUpdateDb();
            const response = await user.functions.search_profiles_by_name(8, userCount * 8, searchString);
            console.log("users ", response)
            setUsers([...users, ...response]);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            setUsers([]);
            console.log(error);
        }
    }

    useEffect(() => {
        return getAllNfts();
    }, [count]);

    useEffect(() => {
        return getCollections();
    }, [colCount]);

    useEffect(() => {
        return getUsers();
    }, [userCount]);

    const loadMore = (type) => {
        if (type === 'collections') {
            setColCount((prev) => prev + 1)
        } else if (type === 'nfts') {
            setCount((prev) => prev + 1)
        } else {
            setUserCount((prev) => prev + 1)
        }
    }

    return (
        <div className="menu">
            {isLoading ? <Loader /> : null}
            <div className="container">
                <div className="title text-light pb-3 px-0">
                    <div className="row">
                        <div className="col-sm-6">
                            NFTs
                        </div>
                        <div className="col-sm-6 text-end">
                            {searchString && (
                                <div> Search Results for "{searchString}"</div>
                            )}
                        </div>
                    </div>

                </div>
                <div className="row home_explore">
                    {/* {isLoading ? <Loader /> : null} */}
                    {nfts && nfts.length > 0 && nfts.map((nft, index) => {
                        return (
                            <div className="col-sm-3 pb-4" key={index}>
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" alt="more icon" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={nft.media_link} className="w-100" height="270" alt="nft media" onClick={() => handleShow(nft)} />
                                    <div className="text-light font-size-18 p-3">
                                        <div>{nft.name}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}
                    {/* <div className='load'>
                        <button onClick={() => loadMore('nfts')} className="load-more">
                            {isLoading ? 'Loading...' : 'Load More'}
                        </button>
                    </div> */}
                    {nfts && nfts.length > 0 &&
                        <div className='load'>
                            <button onClick={() => loadMore('nfts')} className="load-more">
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    }
                    {nfts && nfts.length == 0 && (
                        <div className='text-light text-center'>No data found</div>
                    )}
                </div>
            </div>

            <div className="container">
                <div className="title text-light pb-3 px-0">
                    <div className="row">
                        <div className="col-sm-6">
                            Collections
                        </div>
                    </div>

                </div>
                <div className="row home_explore">
                    {/* {isLoading ? <Loader /> : null} */}
                    {collections && collections.length > 0 && collections.map((collection, index) => {
                        return (
                            <div className="col-sm-3 pb-4" key={index}>
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" alt="more icon" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={collection.img} className="w-100" height="270" alt="collection media" />
                                    {/* onClick={() => handleShow(nft)}  */}
                                    <div className="text-light font-size-18 p-3">
                                        <div>{collection.name}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}

                    {collections && collections.length > 0 &&
                        <div className='load'>
                            <button onClick={() => loadMore('collections')} className="load-more">
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    }
                    {collections && collections.length == 0 && (
                        <div className='text-light text-center'>No data found</div>
                    )}
                    {/* <div className='load'>
                        <button onClick={() => loadMore('collections')} className="load-more">
                            {isLoading ? 'Loading...' : 'Load More'}
                        </button>
                    </div> */}
                </div>
            </div>

            <div className="container">
                <div className="title text-light pb-3 px-0">
                    <div className="row">
                        <div className="col-sm-6">
                            Profiles
                        </div>
                    </div>

                </div>
                <div className="row home_explore">
                    {/* {isLoading ? <Loader /> : null} */}
                    {users && users.length > 0 && users.map((user, index) => {
                        return (
                            <div className="col-sm-3 pb-4" key={index}>
                                <div className="top-sec-box">
                                    <div className="row py-2 px-3">
                                        <div className="col-sm-8">
                                            <div className="d-flex">
                                                <div className="explore-dot bg-pink"></div>
                                                <div className="explore-dot bg-blue"></div>
                                                <div className="explore-dot bg-green"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ">
                                            <div className="explore-dot bg-black float-end">
                                                <img src={more} className="pb-1" alt="more icon" />
                                            </div>
                                        </div>
                                    </div>
                                    <img src={user.profile_pic} className="w-100" height="270" alt="collection media" />
                                    {/* onClick={() => handleShow(nft)}  */}
                                    <div className="text-light font-size-18 p-3">
                                        <div>{user.display_name}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}
                    {users && users.length > 0 &&
                        <div className='load'>
                            <button onClick={() => loadMore('users')} className="load-more">
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    }
                    {users && users.length == 0 && (
                        <div className='text-light text-center'>No data found</div>
                    )}
                </div>
            </div>
            {show && (
                <NftDetailModal nftData={nft} isModalOpen={show} handleClose={handleClose} wallet={wallet} />
            )}
        </div>


    )
}

export default Search;