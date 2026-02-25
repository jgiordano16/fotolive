import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Music, MessageSquare, UserCheck, Send, ArrowLeft, Clock, Plus, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useMessages, useMusicSuggestions, useCheckins } from '../hooks/useMessages';

export default function GuestInteraction() {
    const { eventId } = useParams();
    const [tab, setTab] = useState('music');

    const { songs, suggestSong } = useMusicSuggestions(eventId);
    const { messages, sendMessage } = useMessages(eventId);
    const { checkins, checkin } = useCheckins(eventId);

    const [newSong, setNewSong] = useState({ title: '', artist: '' });
    const [newMessage, setNewMessage] = useState('');
    const [checkName, setCheckName] = useState('');
    const [msgAuthor, setMsgAuthor] = useState('');

    const addSong = async (e) => {
        e.preventDefault();
        if (!newSong.title) return;
        await suggestSong('Invitado', newSong.title, newSong.artist);
        setNewSong({ title: '', artist: '' });
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!newMessage) return;
        await sendMessage(msgAuthor || 'Invitado', newMessage);
        setNewMessage('');
    };

    const doCheckin = async (e) => {
        e.preventDefault();
        if (!checkName) return;
        await checkin(checkName);
        setCheckName('');
    };

    const tabs = [
        { key: 'music', label: 'Música', icon: Music },
        { key: 'messages', label: 'Mensajes', icon: MessageSquare },
        { key: 'checkin', label: 'Check-in', icon: UserCheck },
    ];

    return (
        <div className="interaction-page">
            <Navbar />
            <div className="container" style={{ paddingTop: 'var(--space-4)' }}>
                <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>
                <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-6)' }}>
                    Interacción del <span className="gradient-text">Evento</span>
                </h1>

                <div className="interaction-tabs">
                    {tabs.map((t) => (
                        <button key={t.key} className={`interaction-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                            <t.icon size={16} /> {t.label}
                        </button>
                    ))}
                </div>

                {/* Music */}
                {tab === 'music' && (
                    <div className="animate-fade-in">
                        <form onSubmit={addSong} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                            <input className="input" placeholder="Nombre de la canción" value={newSong.title} onChange={(e) => setNewSong({ ...newSong, title: e.target.value })} style={{ flex: 2, minWidth: 200 }} />
                            <input className="input" placeholder="Artista" value={newSong.artist} onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })} style={{ flex: 1, minWidth: 150 }} />
                            <button type="submit" className="btn btn-primary"><Plus size={16} /> Sugerir</button>
                        </form>
                        {songs.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--neutral-500)', padding: 'var(--space-8)' }}>Todavía no hay sugerencias. ¡Sé el primero!</div>
                        ) : (
                            <div className="music-list">
                                {songs.map((song) => (
                                    <div key={song.id} className="music-item">
                                        <div className="music-icon"><Music size={20} /></div>
                                        <div className="music-info" style={{ flex: 1 }}>
                                            <h4>{song.title}</h4>
                                            <p>{song.artist} — sugerido por {song.guest}</p>
                                        </div>
                                        <button className="btn btn-secondary btn-icon btn-sm"><Heart size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Messages */}
                {tab === 'messages' && (
                    <div className="animate-fade-in">
                        <div className="messages-feed">
                            {messages.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--neutral-500)', padding: 'var(--space-8)' }}>No hay mensajes todavía. ¡Mandá el primero!</div>
                            ) : messages.map((msg) => (
                                <div key={msg.id} className="message-bubble">
                                    <div className="message-author">{msg.author}</div>
                                    <div className="message-text">{msg.text}</div>
                                    <div className="message-time">{msg.createdAt?.toDate?.()?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) || '—'}</div>
                                </div>
                            ))}
                        </div>
                        <form className="message-input-area" onSubmit={submit}>
                            <input className="input" placeholder="Tu nombre" value={msgAuthor} onChange={(e) => setMsgAuthor(e.target.value)} style={{ maxWidth: 150 }} />
                            <input className="input" placeholder="Escribí un mensaje..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1 }} />
                            <button type="submit" className="btn btn-primary"><Send size={16} /></button>
                        </form>
                    </div>
                )}

                {/* Check-in */}
                {tab === 'checkin' && (
                    <div className="animate-fade-in">
                        <form onSubmit={doCheckin} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                            <input className="input" placeholder="Tu nombre completo" value={checkName} onChange={(e) => setCheckName(e.target.value)} style={{ flex: 1 }} />
                            <button type="submit" className="btn btn-primary"><UserCheck size={16} /> Check-in</button>
                        </form>
                        {checkins.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--neutral-500)', padding: 'var(--space-8)' }}>Todavía no hay check-ins.</div>
                        ) : (
                            <div className="checkin-list">
                                {checkins.map((c) => (
                                    <div key={c.id} className="checkin-item">
                                        <div className="checkin-avatar">{c.name?.charAt(0)?.toUpperCase()}</div>
                                        <div className="checkin-info">
                                            <h4>{c.name}</h4>
                                            <p><Clock size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {c.createdAt?.toDate?.()?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) || '—'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>
                            {checkins.length} invitados registrados
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
