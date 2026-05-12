'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageSquare, Phone, Mail, User, RefreshCw, Bot, ExternalLink } from 'lucide-react';

interface ChatSession {
  id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  page_url: string | null;
  last_message: string | null;
}

interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

function fullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function msgTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === now.toDateString()) return time;
  if (new Date(now.getTime() - 86400000).toDateString() === d.toDateString()) return `Yesterday ${time}`;
  return `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })} ${time}`;
}

export default function ChatsTab() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadSessions() {
    setLoading(true);
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });
    setSessions(data ?? []);
    setLoading(false);
  }

  async function loadMessages(sessionId: string) {
    setMsgLoading(true);
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    setMessages(data ?? []);
    setMsgLoading(false);
  }

  const selected = sessions.find(s => s.session_id === selectedId);
  const filtered = sessions.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.contact_name?.toLowerCase().includes(q) ||
      s.contact_phone?.includes(q) ||
      s.contact_email?.toLowerCase().includes(q) ||
      s.last_message?.toLowerCase().includes(q)
    );
  });

  const hasContact = selected?.contact_name || selected?.contact_phone || selected?.contact_email;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', borderRadius: 12, border: '1px solid var(--border)', background: '#fff' }}>

      {/* ── Left panel ── */}
      <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>

        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--heading)' }}>
              AI Chats
              <span style={{ marginLeft: 8, fontSize: '0.75rem', fontWeight: 500, background: 'var(--navy)', color: '#fff', borderRadius: 10, padding: '1px 7px' }}>
                {sessions.length}
              </span>
            </div>
            <button
              onClick={loadSessions}
              title="Refresh"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}
            >
              <RefreshCw size={14} strokeWidth={1.6} />
            </button>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, message…"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
              padding: '7px 10px', fontFamily: 'var(--font)', fontSize: '0.8125rem',
              color: 'var(--heading)', outline: 'none',
            }}
          />
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '20px 16px', color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'var(--font)' }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '20px 16px', color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'var(--font)', textAlign: 'center' }}>
              <MessageSquare size={28} strokeWidth={1} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
              {search ? 'No results' : 'No chats yet'}
            </div>
          ) : filtered.map(session => {
            const isActive = selectedId === session.session_id;
            return (
              <button
                key={session.session_id}
                onClick={() => setSelectedId(session.session_id)}
                style={{
                  width: '100%', padding: '12px 16px', textAlign: 'left', cursor: 'pointer',
                  background: isActive ? 'rgba(3,33,61,0.06)' : 'transparent',
                  border: 'none', borderBottom: '1px solid var(--border)',
                  borderLeft: `3px solid ${isActive ? 'var(--navy)' : 'transparent'}`,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                  <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.contact_name ?? 'Anonymous'}
                  </div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: '0.6875rem', color: 'var(--muted)', flexShrink: 0 }}>
                    {relativeTime(session.updated_at)}
                  </div>
                </div>

                {(session.contact_phone || session.contact_email) && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    {session.contact_phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.6875rem', color: '#0a6e3f', fontFamily: 'var(--font)', fontWeight: 500 }}>
                        <Phone size={9} strokeWidth={1.8} />{session.contact_phone}
                      </span>
                    )}
                    {session.contact_email && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.6875rem', color: 'var(--navy)', fontFamily: 'var(--font)', fontWeight: 500 }}>
                        <Mail size={9} strokeWidth={1.8} />{session.contact_email.split('@')[0]}…
                      </span>
                    )}
                  </div>
                )}

                {session.last_message && (
                  <div style={{ fontFamily: 'var(--font)', fontSize: '0.8125rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.last_message}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {!selectedId ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
            <div style={{ textAlign: 'center' }}>
              <MessageSquare size={44} strokeWidth={1} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '0.9375rem', fontWeight: 500, marginBottom: 6 }}>Select a conversation</div>
              <div style={{ fontSize: '0.8125rem' }}>All AI chat sessions appear in the left panel</div>
            </div>
          </div>
        ) : (
          <>
            {/* Contact header */}
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: '#fff', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: hasContact ? 'var(--navy)' : '#e9edf2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={20} color={hasContact ? '#fff' : 'var(--muted)'} strokeWidth={1.5} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--heading)', marginBottom: 3 }}>
                  {selected?.contact_name ?? 'Anonymous Visitor'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
                  {selected?.contact_phone ? (
                    <a href={`tel:${selected.contact_phone}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem', color: '#0a6e3f', fontFamily: 'var(--font)', fontWeight: 500, textDecoration: 'none' }}>
                      <Phone size={13} strokeWidth={1.6} />{selected.contact_phone}
                    </a>
                  ) : null}
                  {selected?.contact_email ? (
                    <a href={`mailto:${selected.contact_email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem', color: 'var(--navy)', fontFamily: 'var(--font)', fontWeight: 500, textDecoration: 'none' }}>
                      <Mail size={13} strokeWidth={1.6} />{selected.contact_email}
                    </a>
                  ) : null}
                  {!hasContact && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontFamily: 'var(--font)', fontStyle: 'italic' }}>No contact details captured yet</span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font)', marginBottom: 3 }}>
                  Started {fullDate(selected?.created_at ?? '')}
                </div>
                {selected?.page_url && (
                  <a
                    href={selected.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--navy)', fontFamily: 'var(--font)', textDecoration: 'none', opacity: 0.7 }}
                  >
                    <ExternalLink size={11} strokeWidth={1.6} />
                    {selected.page_url.replace(/^https?:\/\/[^/]+/, '').slice(0, 40) || '/'}
                  </a>
                )}
              </div>
            </div>

            {/* Message thread */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f2f4f7' }}>
              {msgLoading ? (
                <div style={{ color: 'var(--muted)', fontFamily: 'var(--font)', fontSize: '0.875rem' }}>Loading messages…</div>
              ) : messages.length === 0 ? (
                <div style={{ color: 'var(--muted)', fontFamily: 'var(--font)', fontSize: '0.875rem', textAlign: 'center', marginTop: 40 }}>No messages saved yet</div>
              ) : messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 3 }}>
                  {msg.role === 'assistant' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 1 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={10} color="#fff" strokeWidth={1.8} />
                      </div>
                      <span style={{ fontFamily: 'var(--font)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        AI Concierge
                      </span>
                    </div>
                  )}
                  <div style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? 'var(--navy)' : '#fff',
                    color: msg.role === 'user' ? '#fff' : 'var(--heading)',
                    fontFamily: 'var(--font)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'rgba(0,0,0,0.35)', fontFamily: 'var(--font)', paddingLeft: 2, paddingRight: 2 }}>
                    {msgTime(msg.created_at)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
