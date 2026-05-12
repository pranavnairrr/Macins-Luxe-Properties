'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useChat } from 'ai/react';
import { X, Send, Loader2, Maximize2, Minimize2, Sparkles, Building2, PhoneCall, TrendingUp, Landmark } from 'lucide-react';
import ChatPropertyCard from '@/components/ChatPropertyCard';

const ORACLE_QUESTIONS = [
  'Show me 3BHK villas under AED 5 million…',
  'Off-plan apartments in Dubai Marina…',
  'Best ROI areas in Dubai right now…',
  'Penthouse with sea view under AED 8M…',
  'Ready 2-bed in Downtown Dubai…',
  'Villa with pool in Palm Jumeirah…',
  'Off-plan studio under AED 800,000…',
  'Show me Emaar properties…',
];

interface ListingResult {
  id: string;
  name: string;
  price: string;
  location: string;
  beds: string;
  badge?: string;
  developer: string;
  imageUrl?: string | null;
  category?: string;
}

interface SearchResult {
  listings: ListingResult[];
  noExactMatch?: boolean;
}

function SkeletonLoader() {
  return (
    <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            height: 14,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.08)',
            width: i === 1 ? '85%' : i === 2 ? '70%' : '55%',
            animation: 'chat-shimmer 1.4s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );
}

function formatMsgTime(date?: Date): string {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === d.toDateString();
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return time;
  if (isYesterday) return `Yesterday ${time}`;
  return `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })} ${time}`;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [oracleIdx, setOracleIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const key = 'macins_chat_sid';
    let id = localStorage.getItem(key);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
    return id;
  });

  const { messages, input, setInput, handleSubmit, status, append, error, setError } = useChat({
    api: '/api/chat',
    body: { sessionId },
    maxSteps: 5,
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  /* Visual viewport height + keyboard offset (keeps header visible when keyboard opens) */
  const [vpHeight, setVpHeight] = useState<number>(() => window.innerHeight);
  const [vpOffset, setVpOffset] = useState<number>(0);

  useEffect(() => {
    const vp = window.visualViewport;
    if (!vp) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setVpHeight(vp.height);
        setVpOffset(Math.max(0, window.innerHeight - vp.height - vp.offsetTop));
      });
    };
    vp.addEventListener('resize', update);
    vp.addEventListener('scroll', update);
    update();
    return () => {
      vp.removeEventListener('resize', update);
      vp.removeEventListener('scroll', update);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Oracle placeholder cycling */
  useEffect(() => {
    const t = setInterval(() => setOracleIdx(i => (i + 1) % ORACLE_QUESTIONS.length), 3200);
    return () => clearInterval(t);
  }, []);

  /* Auto-scroll to latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* Listen for hero search bar events */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { query: string };
      if (!detail?.query?.trim()) return;
      setIsOpen(true);
      setTimeout(() => {
        append({ role: 'user', content: detail.query });
      }, 150);
    };
    window.addEventListener('macins-chat-search', handler);
    return () => window.removeEventListener('macins-chat-search', handler);
  }, [append]);

  /* Listen for Macins AI nav button — open fullscreen */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { fullscreen?: boolean };
      setIsOpen(true);
      if (detail?.fullscreen) setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 320);
    };
    window.addEventListener('macins-chat-open', handler);
    return () => window.removeEventListener('macins-chat-open', handler);
  }, []);

  /* Auto-popup on first visit — once per browser session */
  useEffect(() => {
    if (sessionStorage.getItem('macins_chat_popped')) return;
    const t = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('macins_chat_popped', '1');
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  /* Focus input when opening, clear any stale error */
  useEffect(() => {
    if (isOpen) {
      setError(undefined);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, setError]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault();
      setError(undefined);
      handleSubmit(e as unknown as React.FormEvent);
    }
  }, [input, handleSubmit, setError]);

  /* Panel positioning — three modes */
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        /* sit above keyboard: bottom = keyboard height when open, off-screen when closed */
        bottom: isOpen ? vpOffset : -(vpHeight + 20),
        left: 0,
        right: 0,
        /* height = visible area above keyboard, capped at 88% so there's always a gap */
        height: Math.max(Math.floor(vpHeight * 0.88), 320),
        borderRadius: '20px 20px 0 0',
        zIndex: 1001,
        transition: 'bottom 320ms cubic-bezier(0.4,0,0.2,1)',
      }
    : isExpanded
    ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.96)',
        width: 'min(820px, 94vw)',
        height: 'min(82vh, 720px)',
        borderRadius: 'var(--radius-lg)',
        zIndex: 1001,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        transition: 'opacity 300ms var(--ease), transform 300ms var(--ease)',
      }
    : {
        position: 'fixed',
        bottom: 172,
        right: 28,
        width: 390,
        height: 540,
        borderRadius: 'var(--radius-lg)',
        zIndex: 1001,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        transition: 'opacity 280ms var(--ease), transform 280ms var(--ease)',
      };

  return (
    <>
      {/* Keyframe styles */}
      <style>{`
        @keyframes chat-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(213,186,140,0.45); }
          50%       { box-shadow: 0 0 0 10px rgba(213,186,140,0); }
        }
        @keyframes chat-dot-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes chat-shimmer {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.9; }
          100% { opacity: 0.4; }
        }
        .chat-input::placeholder { color: rgba(255,255,255,0.35); }
        .chat-input:focus { outline: none; }
        .chat-msg-scroll::-webkit-scrollbar { width: 4px; }
        .chat-msg-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-msg-scroll::-webkit-scrollbar-thumb { background: rgba(213,186,140,0.25); border-radius: 4px; }
        .chat-carousel::-webkit-scrollbar { height: 3px; }
        .chat-carousel::-webkit-scrollbar-thumb { background: rgba(213,186,140,0.2); border-radius: 3px; }
      `}</style>

      {/* Backdrop — mobile always, desktop when expanded */}
      {isOpen && (isMobile || isExpanded) && (
        <div
          onClick={() => { setIsOpen(false); setIsExpanded(false); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 1000,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        />
      )}

      {/* Chat panel */}
      <div style={{
        ...panelStyle,
        background: 'rgba(6, 18, 42, 0.78)',
        backdropFilter: 'blur(28px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
        border: '1px solid rgba(213,186,140,0.18)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: 'rgba(213,186,140,0.1)',
              border: '1px solid rgba(213,186,140,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={16} color="var(--gold)" strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                AI Concierge
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--gold)',
                  animation: 'chat-dot-pulse 2s ease-in-out infinite',
                }} />
                <span style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.08em' }}>
                  LIVE
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Expand / collapse — desktop only */}
            {!isMobile && (
              <button
                onClick={() => setIsExpanded(e => !e)}
                title={isExpanded ? 'Minimise' : 'Expand'}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: 6, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.5, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
              >
                {isExpanded
                  ? <Minimize2 size={16} color="#fff" strokeWidth={1.5} />
                  : <Maximize2 size={16} color="#fff" strokeWidth={1.5} />
                }
              </button>
            )}
            <button
              onClick={() => { setIsOpen(false); setIsExpanded(false); }}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 6, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0.6, transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
            >
              <X size={18} color="#fff" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="chat-msg-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Welcome + quick actions */}
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontFamily: 'var(--font)',
                fontSize: 13,
                color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.65,
              }}>
                Welcome to <strong style={{ color: 'var(--gold)' }}>Macins Luxe AI</strong>. I can help you find properties, explore locations, understand payment plans, and more. How can I help?
              </div>
              {/* Quick action chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { Icon: Building2,  label: 'Show me available properties in Dubai',      query: 'Show me available properties in Dubai' },
                  { Icon: PhoneCall,  label: 'Arrange a priority agent callback',           query: 'I would like to arrange a priority callback with an agent' },
                  { Icon: TrendingUp, label: 'Best ROI areas in Dubai right now',           query: 'What are the best ROI areas in Dubai for investment right now?' },
                  { Icon: Landmark,   label: 'Off-plan properties under AED 2 million',     query: 'Show me off-plan properties under AED 2 million' },
                ].map(({ Icon, label, query }) => (
                  <button
                    key={query}
                    onClick={() => append({ role: 'user', content: query })}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(213,186,140,0.22)',
                      borderRadius: 10,
                      padding: '9px 13px',
                      fontFamily: 'var(--font)',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.80)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.18s, border-color 0.18s',
                      lineHeight: 1.4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(213,186,140,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(213,186,140,0.45)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(213,186,140,0.22)';
                    }}
                  >
                    <Icon size={14} color="var(--gold)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, msgIdx) => {
            const isLastMsg = msgIdx === messages.length - 1;
            const hadContactSave = message.toolInvocations?.some(
              inv => inv.toolName === 'saveContactInfo' && inv.state === 'result'
            ) ?? false;

            return (
            <div
              key={message.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 8,
              }}
            >
              {/* Text bubble */}
              {message.content && (
                <div style={{ maxWidth: '88%', display: 'flex', flexDirection: 'column', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start', gap: 3 }}>
                  <div style={{
                    background: message.role === 'user'
                      ? 'rgba(213,186,140,0.14)'
                      : 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: message.role === 'user'
                      ? '1px solid rgba(213,186,140,0.30)'
                      : '1px solid rgba(255,255,255,0.09)',
                    borderRadius: message.role === 'user'
                      ? '14px 14px 3px 14px'
                      : '14px 14px 14px 3px',
                    padding: '10px 14px',
                    fontFamily: 'var(--font)',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.92)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {message.content}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font)', paddingLeft: 2, paddingRight: 2 }}>
                    {formatMsgTime(message.createdAt)}
                  </div>
                </div>
              )}

              {/* Tool invocations — property carousel */}
              {message.toolInvocations?.map(invocation => {
                if (invocation.toolName !== 'searchListings') return null;

                if (invocation.state === 'call' || invocation.state === 'partial-call') {
                  return (
                    <div key={invocation.toolCallId} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 13px',
                      width: '100%',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Loader2 size={14} color="var(--gold)" strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--gold)' }}>
                          Searching our listings…
                        </span>
                      </div>
                      <SkeletonLoader />
                    </div>
                  );
                }

                if (invocation.state === 'result') {
                  const result = invocation.result as SearchResult;
                  const listings = result?.listings ?? [];
                  const noExactMatch = result?.noExactMatch ?? false;

                  if (listings.length === 0) {
                    return (
                      <div key={invocation.toolCallId} style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 13px',
                        fontFamily: 'var(--font)',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.55)',
                      }}>
                        No matching properties found — try different criteria or ask me to broaden the search.
                      </div>
                    );
                  }

                  const shown = listings.slice(0, 2);
                  const hasMore = listings.length > 2;
                  const viewMoreQuery = (invocation as { args?: { query?: string } }).args?.query ?? '';

                  return (
                    <div key={invocation.toolCallId} style={{ width: '100%' }}>
                      <div style={{
                        fontFamily: 'var(--font)',
                        fontSize: 11,
                        color: 'var(--gold)',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: 8,
                      }}>
                        {noExactMatch ? 'Top picks from our portfolio' : `${listings.length} ${listings.length === 1 ? 'property' : 'properties'} found`}
                      </div>
                      <div
                        className="chat-carousel"
                        style={{
                          display: 'flex',
                          gap: 10,
                          overflowX: 'auto',
                          paddingBottom: 6,
                          scrollSnapType: 'x mandatory',
                        }}
                      >
                        {shown.map(listing => (
                          <div key={listing.id} style={{ scrollSnapAlign: 'start' }}>
                            <ChatPropertyCard {...listing} />
                          </div>
                        ))}
                      </div>
                      {hasMore && (
                        <a
                          href={`/properties${viewMoreQuery ? `?q=${encodeURIComponent(viewMoreQuery)}` : ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            marginTop: 10,
                            padding: '7px 0',
                            borderRadius: 'var(--radius-btn)',
                            border: '1px solid rgba(213,186,140,0.35)',
                            background: 'rgba(213,186,140,0.07)',
                            fontFamily: 'var(--font)',
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--gold)',
                            textDecoration: 'none',
                            letterSpacing: '0.04em',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(213,186,140,0.15)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(213,186,140,0.07)')}
                        >
                          View all {listings.length} properties →
                        </a>
                      )}
                    </div>
                  );
                }

                return null;
              })}

              {/* Follow-up chips after contact capture */}
              {hadContactSave && isLastMsg && !isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', marginTop: 2 }}>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                    What would you like to explore?
                  </div>
                  {[
                    { Icon: Building2,  label: 'Show me premium properties in Dubai',    query: 'Show me premium properties in Dubai' },
                    { Icon: Landmark,   label: 'Off-plan apartments under AED 2 million', query: 'Show me off-plan apartments under AED 2 million' },
                    { Icon: TrendingUp, label: 'Best ROI investment areas right now',      query: 'What are the best ROI areas in Dubai for investment right now?' },
                    { Icon: PhoneCall,  label: 'How soon will the agent call me?',         query: 'How soon will a Macins Luxe agent call me?' },
                  ].map(({ Icon, label, query }) => (
                    <button
                      key={query}
                      onClick={() => append({ role: 'user', content: query })}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(213,186,140,0.22)',
                        borderRadius: 10,
                        padding: '9px 13px',
                        fontFamily: 'var(--font)',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.80)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.18s, border-color 0.18s',
                        lineHeight: 1.4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 9,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(213,186,140,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(213,186,140,0.45)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(213,186,140,0.22)';
                      }}
                    >
                      <Icon size={14} color="var(--gold)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            );
          })}

          {/* API error */}
          {error && !isLoading && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'rgba(255,80,80,0.08)',
              border: '1px solid rgba(255,100,100,0.20)',
              borderRadius: '12px 12px 12px 2px',
              padding: '10px 14px',
              fontFamily: 'var(--font)',
              fontSize: 12,
              color: 'rgba(255,160,160,0.90)',
              maxWidth: '88%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span>Something went wrong. Please try again.</span>
              <button
                onClick={() => { setError(undefined); setTimeout(() => inputRef.current?.focus(), 50); }}
                style={{
                  background: 'rgba(255,100,100,0.15)',
                  border: '1px solid rgba(255,100,100,0.30)',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontFamily: 'var(--font)',
                  fontSize: 11,
                  color: 'rgba(255,180,180,0.95)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Streaming skeleton */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px 12px 12px 2px',
              padding: '10px 13px',
              width: '75%',
            }}>
              <SkeletonLoader />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '10px 12px 14px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <input
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={e => { setInput(e.target.value); if (error) setError(undefined); }}
            onKeyDown={onKeyDown}
            placeholder={ORACLE_QUESTIONS[oracleIdx]}
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontFamily: 'var(--font)',
              fontSize: 13,
              color: '#fff',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(213,186,140,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
          />
          <button
            onClick={e => { if (input.trim()) { setError(undefined); handleSubmit(e as unknown as React.FormEvent); } }}
            disabled={isLoading || !input.trim()}
            style={{
              width: 38, height: 38,
              borderRadius: 'var(--radius-md)',
              background: input.trim() && !isLoading ? 'var(--gold)' : 'rgba(213,186,140,0.15)',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            {isLoading
              ? <Loader2 size={16} color="rgba(213,186,140,0.6)" strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={16} color={input.trim() ? '#1a1a1a' : 'rgba(213,186,140,0.4)'} strokeWidth={1.5} />
            }
          </button>
        </div>
      </div>

      {/* Floating trigger button */}
      {isOpen ? (
        /* When open — small close circle */
        <button
          onClick={() => { setIsOpen(false); setIsExpanded(false); }}
          aria-label="Close AI Concierge"
          style={{
            position: 'fixed', bottom: 100, right: 28, zIndex: 999,
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(6,18,42,0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(213,186,140,0.35)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.30)',
            transition: 'transform 0.2s, opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <X size={18} color="rgba(213,186,140,0.9)" strokeWidth={1.5} />
        </button>
      ) : (
        /* When closed — pill with label */
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Concierge"
          style={{
            position: 'fixed', bottom: 100, right: 20, zIndex: 999,
            width: 168, height: 46,
            paddingLeft: 16, paddingRight: 16,
            borderRadius: 100,
            background: 'linear-gradient(135deg, #03213d 0%, #0a3a5c 100%)',
            border: '1px solid rgba(213,186,140,0.50)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 9,
            boxShadow: '0 6px 24px rgba(0,0,0,0.35), 0 0 0 0 rgba(213,186,140,0.4)',
            animation: 'chat-pulse 2.8s ease-in-out infinite',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Sparkles size={16} color="var(--gold)" strokeWidth={1.5} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
            <span style={{
              fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700,
              color: '#fff', lineHeight: 1.2, letterSpacing: '0.01em',
            }}>
              Macins AI
            </span>
            <span style={{
              fontFamily: 'var(--font)', fontSize: 10, fontWeight: 400,
              color: 'rgba(213,186,140,0.80)', lineHeight: 1.2, letterSpacing: '0.03em',
            }}>
              Ask me anything
            </span>
          </div>
        </button>
      )}

      {/* Spin animation for loaders */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
