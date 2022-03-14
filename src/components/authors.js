import '../App.css';
import '../styles/collection.css';
import collection1 from '../images/collection/collection1.svg';
import { db, fb } from "../db/firebase";
import { Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import more from '../images/home/more.svg';
import { Loader } from "../services/ui";
import { toast } from 'react-toastify';
import { mongodb } from '../db/mongodb';
// import * as Realm from "realm-web";
// import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
// import { gql, useMutation, useQuery } from '@apollo/client';
import { ObjectID } from 'bson';
import { init, author, GAS, deploy_txFee } from "../services/helper";

const Authors = ({ contractX, account, wallet }) => {

    const [authors, setAuthers] = useState([]);
    const [isLoading, setLoader] = useState(false);

    const getAuthors = () => {
        setLoader(true);
        // db.collection('authors').get().then((querySnapshot) => {
        //     let authors = [];
        //     querySnapshot.forEach(element => {
        //         var data = element.data();
        //         authors = [...authors, data];
        //     });
        //     setAuthers(authors);
        //     console.log(authors);
        //     setLoader(false);
        // });

        mongodb.collection('authors').find().then((authors)=>{
            setAuthers(authors);
            setLoader(false);
        }, error=>{
            toast(error, { type: 'error' });
        });

    }

    useEffect(() => {
        return getAuthors();
    }, []);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);

    const [author, setAuthor] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        description: ""
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            saveAuthor(author);
        }
        setValidated(true);

    };

    const saveAuthor = (data) => {
        // const docId = db.collection('authors').doc().id;
        // data.docId = docId;
        // data.createdDate = fb.firestore.FieldValue.serverTimestamp();
        // db.collection('authors').doc(docId).set(data).then(() => {
        //     handleClose();
        //     toast("Author added successfully!", { type: 'success' });
        //     getAuthors();
        // });

        //AddAuthor({ variables: { type: input.value } });
        
        data.createdDate = new Date().toDateString();
        data._id = new ObjectID();

        //const id  = new ObjectID();
        mongodb.collection('authors').insertOne(data).then((res)=>{
            handleClose();
            toast("Author added successfully!", { type: 'success' });
            getAuthors();
        }, error=>{
            toast(error, { type: 'error' });
        });

    }

    const handleChange = (e) => {
        setAuthor((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    let navigate = useNavigate();

    const openPage = (link, authorId) => {
        let path = `/${link}/${authorId}`;
        navigate(path);
    }

   
    const deployContract = async(userName) =>{
        try {
            // load and deploy smart contract
            const respons = await contractX.deploy_contract_code(
                {
                    account_id: `${userName}.stingy.testnet` //"jitendra.stingy.testnet" //"pack.stingy.testnet",
                },
                GAS,
                deploy_txFee
            );
            console.log(respons);
        } catch (error) {
            console.log(error);
        }
    }

     

    return (
        <div className="menu">
            {isLoading ? <Loader /> : null}
            <div className="">
                <div className="title text-light pb-3 container px-0">
                    <div className="row">
                        <div className="col-sm-6">
                            Authors
                        </div>
                        <div className="col-sm-6 text-end">
                            <button type="button" className="btn red-btn" onClick={handleShow}>Add New Author</button>
                        </div>
                    </div>

                </div>
                {/* table-responsive */}
                <div className="">
                    <table className="table table-dark table-striped font-size-14 collection-table">
                        <thead>
                            <tr>
                                <th width="11%"></th>
                                <th width="250px">First Name</th>
                                <th>Last Name</th>
                                <th>User Name</th>
                                <th width="500">Description</th>
                                <th>Created Date</th>
                                <th></th>
                                <td>Actions</td>
                            </tr>
                        </thead>
                        <tbody className="border-top-none">
                            {authors && authors.length > 0 && authors.map((author, index) => {
                                return (
                                    <tr key={index}>
                                        <td></td>
                                        <td > <img src={collection1} alt="author media"/> {author.firstName}</td>
                                        <td>{author.lastName}</td>
                                        <td>{author.userName}</td>
                                        <td>{author.description}</td>
                                        <td>{author.createdDate}</td>
                                        <td></td>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="" id="dropdown-basic">
                                                    <img src={more} alt="more icon"/>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => openPage('authors', author._id.toString())}>View Author</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => deployContract(author.userName)}>Deploy Contract</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => openPage('createcollection', author._id.toString())}>Create Collection</Dropdown.Item>
                                                    {/* openPage('createcollection', author._id.toString()) */}
                                                    <Dropdown.Item onClick={() => openPage('collections', author._id.toString())}>View Collections</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            {/* <NavLink href={void(0)} exact="true" activeclassname="active" to={`/authors/${author.docId}`}>View</NavLink> */}
                                        </td>
                                        {/* <td> <button type="button" className="btn btn-danger">Show data</button> </td> */}
                                    </tr>
                                )
                            })
                            }

                        </tbody>
                    </table>
                </div>
            </div>

            {/* modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Author</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="First name"
                                    name="firstName"
                                    defaultValue={author.firstName}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">First name is required!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Last name"
                                    name="lastName"
                                    defaultValue={author.lastName}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">Last name is required!</Form.Control.Feedback>
                            </Form.Group>

                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" controlId="validationCustomUsername">
                                <Form.Label>Username</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                        name="userName"
                                        defaultValue={author.userName}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a username.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" controlId="validationCustom04">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    required
                                    name="description"
                                    defaultValue={author.description}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide the author description.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        {/* <Button type="submit">Submit form</Button> */}
                        <div className="text-end">
                            <Button variant="secondary" type="button" onClick={handleClose} className="me-3">
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Authors;