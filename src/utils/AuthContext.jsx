import React, { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const loginUser = async (userInfo) => {
        setLoading(true);

        console.log('userInfo', userInfo);

        try {
            let response = await account.createEmailPasswordSession(userInfo.email, userInfo.password);
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            alert("something went wrong");
        }
        setLoading(false);
    };

    const logoutUser = async () => {
        await account.deleteSession('current');
        setUser(null);
    };

    const registerUser = async (userInfo) => {
        setLoading(true);

        try {
            let response = await account.create(ID.unique(), userInfo.email, userInfo.password1, userInfo.name);
            await account.createEmailPasswordSession(userInfo.email, userInfo.password1);
            let accountDetails = await account.get();
            setUser(accountDetails);
            navigate('/');
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    const getCurrentUserInfo = async () => {
        try {
            return await account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUserInfo :: error", error);
        }

        return null;
    };

    const checkUserStatus = async () => {
        try {
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
        }
        setLoading(false);
    };

    const contextData = {
        user,
        loginUser,
        logoutUser,
        registerUser,
        getCurrentUserInfo
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;