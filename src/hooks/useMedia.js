// useMedia.js — Firestore + Firebase Storage media hook
import { useState, useEffect } from 'react';
import {
    collection, addDoc, updateDoc, doc,
    onSnapshot, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import {
    ref, uploadBytesResumable, getDownloadURL,
} from 'firebase/storage';
import { db, storage } from '../firebaseClient';

// Real-time media listener for an event (filtered by status and/or playlist)
export function useMedia(eventId, status = null, playlistId = null) {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId) return;
        const constraints = [where('eventId', '==', eventId)];
        if (status) constraints.push(where('status', '==', status));
        if (playlistId) constraints.push(where('playlistIds', 'array-contains', playlistId));

        const q = query(collection(db, 'media'), ...constraints);
        const unsub = onSnapshot(q, (snap) => {
            const rawMedia = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            // Ordenar localmente por createdAt (descendente) 
            // Esto evita el error de índice compuesto en Firebase
            const sortedMedia = rawMedia.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });

            setMedia(sortedMedia);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching media:", error);
            setLoading(false);
        });
        return unsub;
    }, [eventId, status, playlistId]);

    // Moderate a single media item with optional playlist tagging
    const moderate = (mediaId, newStatus, playlistId = null) => {
        const updates = { status: newStatus };
        if (newStatus === 'approved' && playlistId) {
            // Usamos un array para permitir que una foto esté en múltiples listas si se quiere más adelante
            // Por ahora, lo añadimos si se pasa el ID.
            return updateDoc(doc(db, 'media', mediaId), {
                ...updates,
                playlistIds: [playlistId] // Sobrescribimos o podríamos usar arrayUnion
            });
        }
        return updateDoc(doc(db, 'media', mediaId), updates);
    };

    return { media, loading, moderate };
}

// Upload hook: handle file → Storage → Firestore
export function useUpload(eventId, uploaderName = 'Invitado', autoApprove = false) {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFiles = async (files, customUploaderName = null) => {
        setUploading(true);
        setError(null);
        const total = files.length;
        let done = 0;

        const finalName = customUploaderName || uploaderName;

        for (const file of files) {
            try {
                const isVideo = file.type.startsWith('video/');
                const path = `events/${eventId}/${Date.now()}_${file.name}`;
                const storageRef = ref(storage, path);

                await new Promise((resolve, reject) => {
                    const task = uploadBytesResumable(storageRef, file);
                    task.on(
                        'state_changed',
                        (snap) => {
                            const pct = ((done + snap.bytesTransferred / snap.totalBytes) / total) * 100;
                            setProgress(Math.round(pct));
                        },
                        reject,
                        async () => {
                            const url = await getDownloadURL(task.snapshot.ref);
                            await addDoc(collection(db, 'media'), {
                                eventId,
                                uploaderName: finalName,
                                fileUrl: url,
                                mediaType: isVideo ? 'video' : 'image',
                                status: autoApprove ? 'approved' : 'pending',
                                createdAt: serverTimestamp(),
                            });
                            done++;
                            setProgress(Math.round((done / total) * 100));
                            resolve();
                        }
                    );
                });
            } catch (err) {
                setError(err.message);
            }
        }
        setUploading(false);
    };

    return { uploadFiles, progress, uploading, error };
}
