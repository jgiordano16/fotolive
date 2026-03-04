import { useState, useEffect } from 'react';
import {
    collection, doc, addDoc, updateDoc, deleteDoc,
    onSnapshot, query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebaseClient';

export function useClients(userId) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setClients([]);
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'clients'),
            where('userId', '==', userId)
        );
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setClients(list);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching clients:", error);
            setLoading(false);
        });
        return unsub;
    }, [userId]);

    const createClient = (data) =>
        addDoc(collection(db, 'clients'), {
            ...data,
            userId,
            createdAt: serverTimestamp(),
        });

    const updateClient = (id, data) =>
        updateDoc(doc(db, 'clients', id), { ...data, updatedAt: serverTimestamp() });

    const deleteClient = (id) => deleteDoc(doc(db, 'clients', id));

    return { clients, loading, createClient, updateClient, deleteClient };
}
