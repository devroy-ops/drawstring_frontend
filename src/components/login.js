import React, { useCallback, useContext } from "react";
import { Navigate } from 'react-router-dom';

import { auth } from "../db/firebase";

import { AuthContext } from "../auth/auth";

export default function Login() {

    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
                await auth
                    .signInWithEmailAndPassword(email.value, password.value);
            } catch (error) {
                alert(error);
            }
        }
    );

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container">
            <div className="py-5 text-light">
                <h1>Log in</h1>
                <form onSubmit={handleLogin}>
                    <label>
                        Email
                <input name="email" type="email" placeholder="Email" />
                    </label>
                    <label>
                        Password
                <input name="password" type="password" placeholder="Password" />
                    </label>
                    <button type="submit">Log in</button>
                </form>
            </div>
        </div>
    );
};

// auth.createUserWithEmailAndPassword('jitendra@ugi.co.il', 'Abc@123').then(res => {
//     auth.signInWithEmailAndPassword('jitendra@ugi.co.il', 'Abc@123').then(res => {
//     }).catch(e => {
//     });
// }).catch(e => {
// });