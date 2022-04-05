import '../App.css';
import '../styles/collection.css';
import collection1 from '../images/collection/collection1.svg';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { init, author, GAS, mint_txFee, transfer_txFee, txFee } from "../services/helper";
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Loader } from "../services/ui";
import { toast } from 'react-toastify';
import { db, storage, fb } from '../db/firebase';
import { FileUploader } from "react-drag-drop-files";
import { ObjectID } from 'bson';
import { getUser, mongodb } from '../db/mongodb';

const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];

const Nfts = ({ contractX, account, wallet }) => {

    const [nfts, setNfts] = useState([]);
    var [contract, setContract] = useState();
    const [isLoading, setLoader] = useState(false);
    const [count, setCount] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchString, setSearchString] = useState("");

    const { authorId } = useParams();

    const getAllNfts = async () => {
        setLoader(true);
        const searchString = searchParams.get("searchString") || '';
        setSearchString(searchString);
        const user = await getUser();
        const response = await user.functions.search_listed_nfts_by_name(10, count * 10, searchString);

        //const response = await user.functions.get_all_listed_nfts(10, count * 10);
        console.log(response);
        setNfts([...nfts, ...response]);
        setLoader(false);
    }

    const loadMore = () => {
        setCount((prev) => prev + 1)
    }

    useEffect(() => {
        return getAllNfts();
    }, [count]);

    let navigate = useNavigate();

    const viewNFTs = async () => {
        try {

            const response = await contract.nft_tokens({ from_index: "0", limit: 100 });
            console.log(response);

            return response;
        } catch (error) {

            toast(error.toString(), { type: "error" });

            navigate(-1);

            console.log(error);
        }
    };

    const routeChange = (collectionName, tokenId) => {
        //let path = `/nft/${collectionId}/${tokenId}`;
        let path = `/nft/${collectionName.toLowerCase().replace(/ /g, "_")}/${tokenId}`;
        navigate(path);
    }

    return (
        <div className="menu">
            {isLoading ? <Loader /> : null}
            <div>
                <div className=" title text-light pb-3 container px-0">
                    <div className="row">
                        <div className="col-sm-6">
                            NFT(S)
                        </div>
                        <div className="col-sm-6 text-end">
                            {searchString && (
                                <div> Search Results for "{searchString}"</div>
                            )}

                            {/* <button type="button" className="btn red-btn" onClick={() => { navigate('/mintnft') }}>Mint NFT</button> */}
                        </div>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-dark table-striped font-size-14 collection-table">
                        <thead>
                            <tr>
                                <th width="11%"></th>
                                <th width="250px">Project</th>
                                <th># Tokens</th>
                                <th>Owners</th>
                                <th>Listed %</th>
                                <th>Floor</th>
                                <th>USD</th>
                                <th>Median</th>
                                <th>USD</th>
                                <th>Total Floor Value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="border-top-none">
                            {nfts && nfts.length > 0 && nfts.map((nft, index) => {
                                return (
                                    <tr key={index}>
                                        <td></td>
                                        <td> <img src={nft.media_link ? nft.media_link : collection1} width="42" height="42" className="border-radius-50" alt="nft media" /> {nft.name}</td>
                                        <td>{nft.id}</td>
                                        <td>{nft.owner}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        {/* <td>7896</td>
                                        <td>98%</td>
                                        <td>298.39</td>
                                        <td>$28 369</td>
                                        <td>360,00</td>
                                        <td>$52 852</td>
                                        <td>$159 196 200</td> */}
                                        <td> <button type="button" className="btn btn-danger" onClick={() => routeChange(nft.collection_name, nft.id)}>Show Data</button> </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                    {nfts && nfts.length == 0 && (
                        <div className='text-light text-center'>No data found</div>
                    )}
                    {nfts && nfts.length > 0 && (
                        <div className='load'>
                            <button onClick={loadMore} className="load-more">
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Nfts;