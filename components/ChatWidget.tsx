'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { X, Send, Loader2, Maximize2, Minimize2, Sparkles, Building2, PhoneCall, TrendingUp, Landmark, Calculator, MapPin, MessageCircle, CalendarCheck } from 'lucide-react';
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

interface MortgageResult {
  propertyPrice: number;
  downPaymentPct: number;
  downPayment: number;
  loanAmount: number;
  monthly: number;
  totalInterest: number;
  totalCost: number;
  rate: number;
  termYears: number;
  ltv: number;
}

interface AreaResult {
  found: boolean;
  area?: string;
  name?: string;
  slug?: string;
  tagline?: string;
  avgPricePerSqft?: number;
  rentalYield?: number;
  propertyTypes?: unknown;
  highlights?: unknown;
}

interface BudgetResult {
  listings: ListingResult[];
  noExactMatch: boolean;
  mortgageEstimate?: { budget: number; downPayment: number; monthly: number; rate: number; termYears: number };
}

// In ai@6, static tool parts use type 'tool-{toolName}' (not 'tool-invocation').
// Fields are flat on the part — no nested .toolInvocation wrapper.
interface ToolPart {
  type: string;      // e.g. 'tool-searchListings', 'tool-saveContactInfo'
  toolCallId: string;
  state: string;
  input?: unknown;
  output?: unknown;
}

// Update to the actual WhatsApp number (digits only, country code prefix, no '+')
const WHATSAPP_NUMBER = '971501234567';

function fmtChatAED(n: number): string {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `AED ${Math.round(n / 1_000)}K`;
  return `AED ${Math.round(n).toLocaleString()}`;
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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [oracleIdx, setOracleIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [heroScrolled, setHeroScrolled] = useState(false);
  const [input, setInput] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobileRef = useRef(false);

  const [sessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const key = 'macins_chat_sid';
    let id = localStorage.getItem(key);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
    return id;
  });

  const { messages, status, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat', body: { sessionId } }),
  });

  useEffect(() => { if (error) setErrorVisible(true); }, [error]);

  const isLoading = status === 'submitted' || status === 'streaming';

  const doSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    setErrorVisible(false);
    sendMessage({ text: input });
    setInput('');
  }, [input, isLoading, sendMessage]);

  /* Detect mobile — also kept in a ref so event-handler closures can read it */
  useEffect(() => {
    const check = () => {
      const m = window.innerWidth <= 640;
      isMobileRef.current = m;
      setIsMobile(m);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Expand pill after scrolling past hero */
  useEffect(() => {
    const onScroll = () => setHeroScrolled(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
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
        sendMessage({ text: detail.query });
      }, 150);
    };
    window.addEventListener('macins-chat-search', handler);
    return () => window.removeEventListener('macins-chat-search', handler);
  }, [sendMessage]);

  /* Listen for Macins AI nav button — open fullscreen */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { fullscreen?: boolean };
      setIsOpen(true);
      if (detail?.fullscreen) setIsExpanded(true);
      if (!isMobileRef.current) setTimeout(() => inputRef.current?.focus(), 320);
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

  /* Focus input when opening (desktop only — mobile auto-focus triggers keyboard flicker) */
  useEffect(() => {
    if (isOpen) {
      setErrorVisible(false);
      if (!isMobileRef.current) setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault();
      doSend();
    }
  }, [input, doSend]);

  /* Panel positioning — three modes. */
  const panelStyle: React.CSSProperties = isMobile
    ? {
        // Anchor from bottom + use dynamic viewport height so the panel
        // shrinks naturally when the software keyboard opens, keeping
        // the input bar visible just above the keyboard.
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100dvh',
        borderRadius: '20px 20px 0 0',
        zIndex: 1001,
        transform: isOpen ? 'translateY(0)' : 'translateY(105%)',
        transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1)',
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
        bottom: 88,
        right: 20,
        width: 320,
        height: 460,
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

      {/* Backdrop — fades in on mobile / desktop-expanded; always mounted so transition works */}
      <div
        onClick={() => { setIsOpen(false); setIsExpanded(false); }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 1000,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: isOpen && (isMobile || isExpanded) ? 1 : 0,
          pointerEvents: isOpen && (isMobile || isExpanded) ? 'auto' : 'none',
          transition: 'opacity 280ms ease',
        }}
      />

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
          padding: '10px 13px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26,
              borderRadius: '50%',
              background: 'rgba(213,186,140,0.1)',
              border: '1px solid rgba(213,186,140,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={13} color="var(--gold)" strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
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
            padding: '12px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
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
                padding: '11px 13px',
                fontFamily: 'var(--font)',
                fontSize: 11,
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
                    onClick={() => sendMessage({ text: query })}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(213,186,140,0.22)',
                      borderRadius: 10,
                      padding: '7px 11px',
                      fontFamily: 'var(--font)',
                      fontSize: 11,
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

          {(() => {
            const assistantMsgCount = messages.filter(m => m.role === 'assistant').length;
            const hasContactEverSaved = messages.some(m =>
              (m.parts as unknown[]).some((p): p is ToolPart =>
                typeof p === 'object' && p !== null &&
                (p as ToolPart).type === 'tool-saveContactInfo' &&
                (p as ToolPart).state === 'output-available'
              )
            );
            return messages.map((message, msgIdx) => {
            const isLastMsg = msgIdx === messages.length - 1;

            /* Extract text content from parts */
            const textContent = message.parts
              .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map(p => p.text)
              .join('');

            /* Extract tool invocations from parts (ai@6: type is 'tool-{name}') */
            const toolParts = (message.parts as unknown[]).filter(
              (p): p is ToolPart =>
                typeof p === 'object' && p !== null &&
                typeof (p as { type: string }).type === 'string' &&
                (p as { type: string }).type.startsWith('tool-')
            );

            const getToolName = (p: ToolPart) =>
              p.type === 'dynamic-tool'
                ? (p as unknown as { toolName: string }).toolName
                : p.type.slice(5); // 'tool-searchListings' → 'searchListings'

            const hadContactSave = toolParts.some(p =>
              getToolName(p) === 'saveContactInfo' && p.state === 'output-available'
            );

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
              {textContent && (
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
                    padding: '8px 12px',
                    fontFamily: 'var(--font)',
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.92)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {textContent}
                  </div>
                </div>
              )}

              {/* Tool invocations */}
              {toolParts.map((part) => {
                const toolName = getToolName(part);

                /* ── getMortgageEstimate card ── */
                if (toolName === 'getMortgageEstimate') {
                  if (part.state === 'input-available' || part.state === 'input-streaming') {
                    return (
                      <div key={part.toolCallId} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '10px 13px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Loader2 size={14} color="var(--gold)" strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--gold)' }}>Calculating…</span>
                        </div>
                        <SkeletonLoader />
                      </div>
                    );
                  }
                  if (part.state === 'output-available') {
                    const r = part.output as MortgageResult;
                    return (
                      <div key={part.toolCallId} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(213,186,140,0.22)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Monthly Payment</div>
                          <div style={{ fontFamily: 'var(--font)', fontSize: 22, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                            {fmtChatAED(r.monthly)}<span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginLeft: 4 }}>/mo</span>
                          </div>
                          <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 5 }}>
                            {r.downPaymentPct}% down · {r.termYears}yr · {r.rate}% p.a.
                          </div>
                        </div>
                        <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 16px' }}>
                          {[
                            { label: 'Down Payment',    val: fmtChatAED(r.downPayment) },
                            { label: 'Loan Amount',     val: fmtChatAED(r.loanAmount) },
                            { label: 'Total Interest',  val: fmtChatAED(r.totalInterest) },
                            { label: 'Total Cost',      val: fmtChatAED(r.totalCost) },
                            { label: 'LTV Ratio',       val: `${r.ltv}%` },
                            { label: 'Property Price',  val: fmtChatAED(r.propertyPrice) },
                          ].map(({ label, val }) => (
                            <div key={label}>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 1 }}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <a href="/mortgage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: 'rgba(213,186,140,0.7)', textDecoration: 'none', letterSpacing: '0.04em' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(213,186,140,0.7)')}
                        >
                          <Calculator size={11} strokeWidth={1.5} /> Full mortgage calculator →
                        </a>
                      </div>
                    );
                  }
                  return null;
                }

                /* ── getAreaInsights card ── */
                if (toolName === 'getAreaInsights') {
                  if (part.state === 'input-available' || part.state === 'input-streaming') {
                    return (
                      <div key={part.toolCallId} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '10px 13px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Loader2 size={14} color="var(--gold)" strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--gold)' }}>Loading area data…</span>
                        </div>
                        <SkeletonLoader />
                      </div>
                    );
                  }
                  if (part.state === 'output-available') {
                    const r = part.output as AreaResult;
                    if (!r.found) {
                      return (
                        <div key={part.toolCallId} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '10px 13px', fontFamily: 'var(--font)', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                          No detailed data available for that area yet — ask me to search for properties there instead.
                        </div>
                      );
                    }
                    const types = Array.isArray(r.propertyTypes) ? (r.propertyTypes as string[]).join(' · ') : '';
                    return (
                      <div key={part.toolCallId} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(213,186,140,0.22)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <MapPin size={12} color="var(--gold)" strokeWidth={1.5} />
                            <span style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.name}</span>
                          </div>
                          {r.tagline && <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{r.tagline}</div>}
                        </div>
                        <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 16px' }}>
                          {r.avgPricePerSqft != null && (
                            <div>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Avg Price/sqft</div>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 1 }}>AED {r.avgPricePerSqft?.toLocaleString()}</div>
                            </div>
                          )}
                          {r.rentalYield != null && (
                            <div>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Rental Yield</div>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 1 }}>{r.rentalYield}%</div>
                            </div>
                          )}
                          {types && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Property Types</div>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>{types}</div>
                            </div>
                          )}
                        </div>
                        {r.slug && (
                          <a href={`/areas/${r.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: 'rgba(213,186,140,0.7)', textDecoration: 'none', letterSpacing: '0.04em' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(213,186,140,0.7)')}
                          >
                            View area guide →
                          </a>
                        )}
                      </div>
                    );
                  }
                  return null;
                }

                /* ── searchByBudget — same carousel as searchListings + budget header ── */
                if (toolName === 'searchByBudget') {
                  if (part.state === 'input-available' || part.state === 'input-streaming') {
                    return (
                      <div key={part.toolCallId} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '10px 13px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Loader2 size={14} color="var(--gold)" strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--gold)' }}>Finding properties within budget…</span>
                        </div>
                        <SkeletonLoader />
                      </div>
                    );
                  }
                  if (part.state === 'output-available') {
                    const r = part.output as BudgetResult;
                    const listings = r?.listings ?? [];
                    const me = r?.mortgageEstimate;
                    const shown = listings.slice(0, 2);
                    return (
                      <div key={part.toolCallId} style={{ width: '100%' }}>
                        {me && (
                          <div style={{ background: 'rgba(213,186,140,0.07)', border: '1px solid rgba(213,186,140,0.22)', borderRadius: 'var(--radius-md)', padding: '9px 13px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Budget snapshot · {me.downPayment && `${fmtChatAED(me.downPayment)} down`}</div>
                              <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginTop: 2 }}>{fmtChatAED(me.monthly)}<span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: 3 }}>/mo</span></div>
                            </div>
                            <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>
                              <div>{me.rate}% · {me.termYears}yr</div>
                              <div>20% down</div>
                            </div>
                          </div>
                        )}
                        <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                          {listings.length === 0 ? 'No exact matches' : `${listings.length} ${listings.length === 1 ? 'property' : 'properties'} within budget`}
                        </div>
                        {shown.length > 0 && (
                          <div className="chat-carousel" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollSnapType: 'x mandatory' }}>
                            {shown.map(listing => (
                              <div key={listing.id} style={{ scrollSnapAlign: 'start' }}>
                                <ChatPropertyCard {...listing} />
                              </div>
                            ))}
                          </div>
                        )}
                        {listings.length > 2 && (
                          <a href="/properties" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '7px 0', borderRadius: 'var(--radius-btn)', border: '1px solid rgba(213,186,140,0.35)', background: 'rgba(213,186,140,0.07)', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.04em' }}
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
                }

                if (getToolName(part) !== 'searchListings') return null;

                if (part.state === 'input-available' || part.state === 'input-streaming') {
                  return (
                    <div key={part.toolCallId} style={{
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

                if (part.state === 'output-available') {
                  const result = part.output as SearchResult;
                  const listings = result?.listings ?? [];
                  const noExactMatch = result?.noExactMatch ?? false;

                  if (listings.length === 0) {
                    return (
                      <div key={part.toolCallId} style={{
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
                  const viewMoreQuery = (part.input as { query?: string })?.query ?? '';

                  return (
                    <div key={part.toolCallId} style={{ width: '100%' }}>
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
                      onClick={() => sendMessage({ text: query })}
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

              {/* Proactive consultation chip — after 4th assistant message */}
              {message.role === 'assistant' && isLastMsg && !isLoading &&
               assistantMsgCount >= 4 && !hasContactEverSaved && !hadContactSave && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', marginTop: 4 }}>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                    Ready to take the next step?
                  </div>
                  <button
                    onClick={() => sendMessage({ text: "I'd like to speak with a Macins Luxe specialist. Can you help me arrange that?" })}
                    style={{
                      background: 'rgba(213,186,140,0.10)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(213,186,140,0.40)',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontFamily: 'var(--font)',
                      fontSize: 12,
                      color: 'var(--gold)',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.18s, border-color 0.18s',
                      lineHeight: 1.4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(213,186,140,0.18)';
                      e.currentTarget.style.borderColor = 'rgba(213,186,140,0.65)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(213,186,140,0.10)';
                      e.currentTarget.style.borderColor = 'rgba(213,186,140,0.40)';
                    }}
                  >
                    <CalendarCheck size={14} color="var(--gold)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    Book a consultation with a specialist
                  </button>
                </div>
              )}
            </div>
            );
          });
          })()}

          {/* API error */}
          {errorVisible && error && !isLoading && (
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
                onClick={() => { setErrorVisible(false); setTimeout(() => inputRef.current?.focus(), 50); }}
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

        {/* WhatsApp handoff — shown after first exchange */}
        {messages.length > 0 && (
          <div style={{ padding: '0 10px 6px', display: 'flex', justifyContent: 'center' }}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I was browsing Macins Luxe and would like to speak with an agent.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font)',
                fontSize: 10,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.35)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                padding: '4px 10px',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#25D366';
                e.currentTarget.style.borderColor = 'rgba(37,211,102,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <MessageCircle size={11} strokeWidth={1.5} />
              Continue on WhatsApp
            </a>
          </div>
        )}

        {/* Input area */}
        <div style={{
          padding: '8px 10px 12px',
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
            onChange={e => { setInput(e.target.value); if (errorVisible) setErrorVisible(false); }}
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
              padding: '8px 12px',
              fontFamily: 'var(--font)',
              fontSize: 12,
              color: '#fff',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(213,186,140,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
          />
          <button
            onClick={doSend}
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
            position: 'fixed', bottom: 76, right: 20, zIndex: 999,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(3,33,61,0.65)',
            backdropFilter: 'blur(16px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
            border: '1px solid rgba(213,186,140,0.40)',
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
        /* When closed — icon circle → pill on scroll */
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Concierge"
          style={{
            position: 'fixed', bottom: 76, right: 20, zIndex: 999,
            height: 40,
            width: heroScrolled ? 144 : 40,
            paddingLeft: heroScrolled ? 12 : 0,
            paddingRight: heroScrolled ? 14 : 0,
            borderRadius: 100,
            background: 'rgba(3,33,61,0.70)',
            backdropFilter: 'blur(16px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
            border: '1px solid rgba(213,186,140,0.45)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: heroScrolled ? 'flex-start' : 'center',
            gap: heroScrolled ? 7 : 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.30)',
            overflow: 'hidden',
            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Sparkles size={14} color="var(--gold)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0,
            opacity: heroScrolled ? 1 : 0,
            maxWidth: heroScrolled ? 100 : 0,
            overflow: 'hidden',
            transition: 'opacity 0.3s ease 0.1s, max-width 0.4s cubic-bezier(0.4,0,0.2,1)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '0.01em' }}>
              Macins AI
            </span>
            <span style={{ fontFamily: 'var(--font)', fontSize: 9, fontWeight: 400, color: 'rgba(213,186,140,0.82)', lineHeight: 1.2 }}>
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
