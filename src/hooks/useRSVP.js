// useRSVP.js — Firestore RSVP hook
import { useState, useEffect } from 'react';
import {
    collection, addDoc, onSnapshot,
    query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

export function useRSVP(eventId) {
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId) return;
        const q = query(
            collection(db, 'rsvps'),
            where('eventId', '==', eventId)
        );
        const unsub = onSnapshot(q, (snap) => {
            const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const sorted = raw.sort((a, b) => {
                const tA = a.createdAt?.toMillis?.() || 0;
                const tB = b.createdAt?.toMillis?.() || 0;
                return tB - tA;
            });
            setRsvps(sorted);
            setLoading(false);
        });
        return unsub;
    }, [eventId]);

    const submitRSVP = (data) =>
        addDoc(collection(db, 'rsvps'), {
            ...data,
            eventId,
            createdAt: serverTimestamp(),
        });

    return { rsvps, loading, submitRSVP };
}
