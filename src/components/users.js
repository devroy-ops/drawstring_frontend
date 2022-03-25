import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUser, getUserForUpdateDb } from "../db/mongodb";
import { Loader } from "../services/ui";

import collection1 from '../images/collection/collection1.svg';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setLoader] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [count, setCount] = useState(0);
    const [searchString, setSearchString] = useState("");
    
    useEffect(() => {
        return getUsers();
    }, [count]);

    const getUsers = async () => {
        try {
            setLoader(true);
            const searchString = searchParams.get("searchString") || '';
            setSearchString(searchString);
            const user = await getUserForUpdateDb();
            const response = await user.functions.search_profiles_by_name(10, count * 10, searchString);
            console.log("users ", response)
            setUsers([...users, ...response]);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            setUsers([]);
            console.log(error);
        }
    }

    const loadMore = () => {
        setCount((prev) => prev + 1)
    }


    return (
        <div className="menu">
            {isLoading ? <Loader /> : null}
            <div className="">
                <div className="title text-light pb-3 container px-0">
                    <div className="row">
                        <div className="col-sm-6">
                            Users
                        </div>
                        <div className="col-sm-6 text-end">
                             {searchString && (
                                <div> Search Results for "{searchString}"</div>
                            )}
                        </div>
                    </div>

                </div>
                <div className="">
                    <table className="table table-dark table-striped font-size-14 collection-table">
                        <thead>
                            <tr>
                                <th width="11%"></th>
                                <td></td>
                                <th>User Name</th>
                                <th>Twitter</th>
                                <th>Personal site</th>
                                <th>Custom url</th>
                                {/* <th>Bio</th> */}
                                <th>Email</th>
                                <th>Wallet Id</th>

                            </tr>
                        </thead>

                        <tbody className="border-top-none">
                            {users && users.length > 0 && users.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td></td>
                                        <td > <img src={user.profile_pic} alt="author media" width="42" height="42" className="border-radius-50"/> {user.firstName}</td>
                                        <td>{user.display_name}</td>
                                        <td>{user.twitter}</td>
                                        <td>{user.personal_site}</td>
                                        <td>{user.custom_url}</td>
                                        {/* <td>{user.bio}</td> */}
                                        <td>{user.email}</td>
                                        <td>{user.walletId}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                    {users && users.length == 0 && (
                        <div className='text-light text-center'>No data found</div>
                    )}
                    {users && users.length > 0 && (
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

export default Users;