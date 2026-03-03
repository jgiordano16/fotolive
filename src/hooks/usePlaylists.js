// usePlaylists.js — Firestore playlist management hook
import { useState, useEffect } from 'react';
import {
    collection, addDoc, updateDoc, doc, deleteDoc,
    onSnapshot, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

export function usePlaylists(eventId) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId) return;
        const q = query(
            collection(db, 'playlists'),
            where('eventId', '==', eventId)
        );
        const unsub = onSnapshot(q, (snap) => {
            const rawPlaylists = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const sortedPlaylists = rawPlaylists.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });
            setPlaylists(sortedPlaylists);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching playlists:", error);
            setLoading(false);
        });
        return unsub;
    }, [eventId]);

    const createPlaylist = (name) =>
        addDoc(collection(db, 'playlists'), {
            name,
            eventId,
            createdAt: serverTimestamp(),
        });

    const deletePlaylist = (id) =>
        deleteDoc(doc(db, 'playlists', id));

    return { playlists, loading, createPlaylist, deletePlaylist };
}
