import React from 'react';
import { NavLink } from "react-router-dom";
import '../App.css';
import '../styles/collection.css';
import collection1 from '../images/collection/collection1.svg';

class Collections extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        return this.collections();
    }

    collections() {
        return (
            <div className="menu">
                <div className="">
                    <div className=" title text-light pb-3 container px-0">
                        NFT Collections
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
                                <tr>
                                    <td></td>
                                    <td > <img src={collection1} /> Collection name name</td>
                                    <td>1050</td>
                                    <td>7896</td>
                                    <td>98%</td>
                                    <td>298.39</td>
                                    <td>$28 369</td>
                                    <td>360,00</td>
                                    <td>$52 852</td>
                                    <td>$159 196 200</td>
                                    <td> <button type="button" className="btn btn-danger">Show Data</button> </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td> <img src={collection1} /> Collection name name</td>
                                    <td>1050</td>
                                    <td>7896</td>
                                    <td>98%</td>
                                    <td>298.39</td>
                                    <td>$28 369</td>
                                    <td>360,00</td>
                                    <td>$52 852</td>
                                    <td>$159 196 200</td>
                                    <td> <button type="button" className="btn btn-danger">Show Data</button> </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td> <img src={collection1} /> Collection name name</td>
                                    <td>1050</td>
                                    <td>7896</td>
                                    <td>98%</td>
                                    <td>298.39</td>
                                    <td>$28 369</td>
                                    <td>360,00</td>
                                    <td>$52 852</td>
                                    <td>$159 196 200</td>
                                    <td> <button type="button" className="btn btn-danger">Show Data</button> </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td> <img src={collection1} /> Collection name name</td>
                                    <td>1050</td>
                                    <td>7896</td>
                                    <td>98%</td>
                                    <td>298.39</td>
                                    <td>$28 369</td>
                                    <td>360,00</td>
                                    <td>$52 852</td>
                                    <td>$159 196 200</td>
                                    <td> <button type="button" className="btn btn-danger">Show Data</button> </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td> <img src={collection1} /> Collection name name</td>
                                    <td>1050</td>
                                    <td>7896</td>
                                    <td>98%</td>
                                    <td>298.39</td>
                                    <td>$28 369</td>
                                    <td>360,00</td>
                                    <td>$52 852</td>
                                    <td>$159 196 200</td>
                                    <td> <button type="button" className="btn btn-danger">Show Data</button> </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td> <img src={collection1} /> Collection name name</td>
                                    <td>1050</td>
                                    <td>7896</td>
                                    <td>98%</td>
                                    <td>298.39</td>
                                    <td>$28 369</td>
                                    <td>360,00</td>
                                    <td>$52 852</td>
                                    <td>$159 196 200</td>
                                    <td> <button type="button" className="btn btn-danger">Show Data</button> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Collections;