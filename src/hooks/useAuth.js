// useAuth.js — Firebase Auth hook
import { useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../firebaseClient';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    const register = async (email, password, displayName) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName });
        return cred.user;
    };

    const login = async (email, password) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred.user;
    };

    const logout = () => signOut(auth);

    return { user, loading, register, login, logout };
}
