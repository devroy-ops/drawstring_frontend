import '../App.css';
import '../styles/collection.css';
import collection1 from '../images/collection/collection1.svg';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { init, author, GAS, mint_txFee, transfer_txFee, txFee } from "../services/helper";
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Loader } from "../services/ui";
import { toast } from 'react-toastify';
import { db, storage, fb } from '../db/firebase';
import { FileUploader } from "react-drag-drop-files";
import { ObjectID } from 'bson';
import { getUser, getUserForUpdateDb, mongodb } from '../db/mongodb';

const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"];

const Collections = ({ contractX, account, wallet }) => {

    // var contract;
    const [collections, setCollections] = useState([]);
    var [contract, setContract] = useState();
    const [isLoading, setLoader] = useState(false);
    const [count, setCount] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchString, setSearchString] = useState("");

    const { authorId } = useParams();


    const getCollections = async () => {
        setLoader(true);
        const searchString = searchParams.get("searchString") || '';
        setSearchString(searchString);
        const user = await getUser();
        const response = await user.functions.search_collections_by_name(10, count * 10, searchString);
        // const response = await user.functions.get_collections(10, count * 10);
        console.log(response);
        setCollections([...collections, ...response]);
        setLoader(false);
    }

    useEffect(() => {
        return getCollections();
    }, [count]);

    const loadMore = () => {
        setCount((prev) => prev + 1)
    }

    let navigate = useNavigate();

    const routeChange = (collectionId) => {
        let path = `/viewcollection/${collectionId}`;
        //let path = `/nfts/${authorId}`;
        navigate(path);
    }

    return (
        <div className="menu">
            {isLoading ? <Loader /> : null}
            <div className="">
                <div className=" title text-light pb-3 container px-0">
                    {/* NFT Collections */}
                    <div className="row">
                        <div className="col-sm-6">
                            NFT Collections
                        </div>
                        <div className="col-sm-6 text-end">
                             {searchString && (
                                <div> Search Results for "{searchString}"</div>
                            )}
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
                            {collections && collections.length > 0 && collections.map((collection, index) => {
                                return (
                                    <tr key={index}>
                                        <td></td>
                                        <td> <img src={collection.img ? collection.img : collection1} width="42" height="42" className="border-radius-50" alt="nft media" /> {collection.name}</td>
                                        <td>{collection.spec}</td>
                                        <td>{collection.symbol}</td>
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
                                        <td>$159 196 200</td> */ collection.token_id}
                                        <td> <button type="button" className="btn btn-danger" onClick={() => routeChange(collection.contractId)}>Show Data</button> </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                    {collections && collections.length == 0 && (
                        <div className='text-light text-center'>No data found</div>
                    )}
                    {collections && collections.length > 0 && (
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

export default Collections;