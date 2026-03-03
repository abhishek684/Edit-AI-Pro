/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserDetails } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async (uid, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const profile = await getUserDetails(uid);
                if (profile) {
                    setUserProfile(profile);
                    return;
                }
                // Profile not yet created in Firestore, wait and retry
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }
    }, []);

    const refreshUserProfile = useCallback(async () => {
        if (currentUser) {
            await fetchUserProfile(currentUser.uid, 1);
        }
    }, [currentUser, fetchUserProfile]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await fetchUserProfile(user.uid);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [fetchUserProfile]);

    const value = {
        currentUser,
        userProfile,
        loading,
        refreshUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
