// useMessages.js — Firestore live messages hook
import { useState, useEffect } from 'react';
import {
    collection, addDoc, onSnapshot,
    query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

export function useMessages(eventId) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!eventId) return;
        const q = query(
            collection(db, 'messages'),
            where('eventId', '==', eventId)
        );
        const unsub = onSnapshot(q, (snap) => {
            const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const sorted = raw.sort((a, b) => {
                const tA = a.createdAt?.toMillis?.() || 0;
                const tB = b.createdAt?.toMillis?.() || 0;
                return tA - tB; // asc
            });
            setMessages(sorted.slice(-100)); // limit 100
        });
        return unsub;
    }, [eventId]);

    const sendMessage = (author, text) =>
        addDoc(collection(db, 'messages'), {
            eventId,
            author,
            text,
            createdAt: serverTimestamp(),
        });

    return { messages, sendMessage };
}

// useMusic.js logic is here too to avoid too many files
export function useMusicSuggestions(eventId) {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        if (!eventId) return;
        const q = query(
            collection(db, 'music_suggestions'),
            where('eventId', '==', eventId)
        );
        const unsub = onSnapshot(q, (snap) => {
            const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const sorted = raw.sort((a, b) => {
                const tA = a.createdAt?.toMillis?.() || 0;
                const tB = b.createdAt?.toMillis?.() || 0;
                return tB - tA; // desc
            });
            setSongs(sorted);
        });
        return unsub;
    }, [eventId]);

    const suggestSong = (guest, title, artist) =>
        addDoc(collection(db, 'music_suggestions'), {
            eventId,
            guest,
            title,
            artist,
            createdAt: serverTimestamp(),
        });

    return { songs, suggestSong };
}

export function useCheckins(eventId) {
    const [checkins, setCheckins] = useState([]);

    useEffect(() => {
        if (!eventId) return;
        const q = query(
            collection(db, 'checkins'),
            where('eventId', '==', eventId)
        );
        const unsub = onSnapshot(q, (snap) => {
            const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const sorted = raw.sort((a, b) => {
                const tA = a.createdAt?.toMillis?.() || 0;
                const tB = b.createdAt?.toMillis?.() || 0;
                return tB - tA; // desc
            });
            setCheckins(sorted);
        });
        return unsub;
    }, [eventId]);

    const checkin = (name) =>
        addDoc(collection(db, 'checkins'), {
            eventId,
            name,
            createdAt: serverTimestamp(),
        });

    return { checkins, checkin };
}
