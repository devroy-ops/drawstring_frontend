import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUser, getUserForUpdateDb } from "../db/mongodb";
import { Loader } from "../services/ui";

import collection1 from '../images/collection/collection1.svg';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setLoader] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [count, setCount] = useState(10);

    useEffect(() => {
        return getUsers();
    }, []);

    const getUsers = async () => {
        try {
            setLoader(true);

            var searchString = searchParams.get("searchString") || '';
            debugger;
            const user = await getUserForUpdateDb();
            const response = await user.functions.search_profiles_by_name(10, count*10, searchString);
            // const top = await user.functions.search_collections_by_name(100, 0, '');
            debugger;
            setUsers([...users, ...response]);
            setLoader(false);
        } catch (error) {
            console.log(error);
        }
    }

    const loadMore = () => {
        setCount((prev)=> prev + 1)
    }


    return (
        <div className="menu">
            {isLoading ? <Loader /> : null}
            <div className="">
                <div className="title text-light pb-3 container px-0">
                    <div className="row">
                        Users
                    </div>

                </div>
                <div className="">
                    <table className="table table-dark table-striped font-size-14 collection-table">
                        <thead>
                            <tr>
                                <th width="11%"></th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>User Name</th>
                            </tr>
                        </thead>

                        {/* <tbody className="border-top-none">
                            {users && users.length > 0 && users.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td > <img src={collection1} alt="author media"/> {user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.userName}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody> */}
                    </table>
                    <div className='load'>
                        <button onClick={loadMore} className="load-more">
                            {isLoading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Users;