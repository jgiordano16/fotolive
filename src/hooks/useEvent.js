// useEvent.js — Firestore event CRUD hook
import { useState, useEffect } from 'react';
import {
    collection, doc, addDoc, updateDoc, deleteDoc,
    onSnapshot, query, where, orderBy, serverTimestamp, getDocs
} from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseClient';

export function useEvents(organizerId) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!organizerId) {
            setEvents([]);
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'events'),
            where('organizerId', '==', organizerId)
        );
        const unsub = onSnapshot(q, (snap) => {
            const rawEvents = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            // Ordenar localmente por createdAt (descendente) para evitar problemas de índices compuestos
            const sortedEvents = rawEvents.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });
            setEvents(sortedEvents);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching events:", error);
            setLoading(false);
        });
        return unsub;
    }, [organizerId]);

    const createEvent = (data) =>
        addDoc(collection(db, 'events'), {
            ...data,
            organizerId,
            createdAt: serverTimestamp(),
        });

    const updateEvent = (id, data) =>
        updateDoc(doc(db, 'events', id), { ...data, updatedAt: serverTimestamp() });

    const deleteEvent = async (id) => {
        try {
            // 1. Borrar archivos de Storage
            const eventStorageRef = ref(storage, `events/${id}`);
            try {
                const fileList = await listAll(eventStorageRef);
                const deletePromises = fileList.items.map((itemRef) => deleteObject(itemRef));
                await Promise.all(deletePromises);
            } catch (storageErr) {
                console.warn("Error borrando archivos de storage (puede que no haya):", storageErr);
            }

            // 2. Borrar documentos de media de Firestore
            const mediaQuery = query(collection(db, 'media'), where('eventId', '==', id));
            const mediaSnapshot = await getDocs(mediaQuery);
            const deleteMediaPromises = mediaSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
            await Promise.all(deleteMediaPromises);

            // 3. Borrar el documento del evento
            await deleteDoc(doc(db, 'events', id));
        } catch (error) {
            console.error("Error en borrado en cascada:", error);
            throw error;
        }
    };

    return { events, loading, createEvent, updateEvent, deleteEvent };
}

export const updateEventDoc = (id, data) => updateDoc(doc(db, 'events', id), { ...data, updatedAt: serverTimestamp() });

export function useEvent(eventId) {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId) return;
        const unsub = onSnapshot(doc(db, 'events', eventId), (d) => {
            setEvent(d.exists() ? { id: d.id, ...d.data() } : null);
            setLoading(false);
        });
        return unsub;
    }, [eventId]);

    return { event, loading };
}
