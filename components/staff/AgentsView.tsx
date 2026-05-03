'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import AgentForm, { type AgentRecord } from './AgentForm'

export default function AgentsView() {
  const [agents, setAgents]         = useState<AgentRecord[]>([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [editing, setEditing]       = useState<AgentRecord | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchAgents = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: false })
    setAgents((data ?? []) as AgentRecord[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAgents() }, [fetchAgents])

  const handleSave = (agent: AgentRecord) => {
    setAgents(prev => {
      const idx = prev.findIndex(a => a.id === agent.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = agent; return next }
      return [agent, ...prev]
    })
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this agent?')) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('agents').delete().eq('id', id)
    setAgents(prev => prev.filter(a => a.id !== id))
    setDeletingId(null)
  }

  const handleToggleActive = async (agent: AgentRecord) => {
    const supabase = createClient()
    await supabase.from('agents').update({ is_active: !agent.is_active }).eq('id', agent.id)
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, is_active: !a.is_active } : a))
  }

  if (showForm || editing) {
    return (
      <AgentForm
        initial={editing ?? undefined}
        onSave={handleSave}
        onCancel={() => { setShowForm(false); setEditing(null) }}
      />
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 4, fontFamily: 'var(--font)' }}>
            Team & Agents
          </h1>
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font)', fontSize: '0.9375rem' }}>
            Manage agents assigned to property listings and PDFs.
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
          color: '#fff', background: '#1B3079', border: '1px solid #1B3079',
          borderRadius: 6, padding: '10px 18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          + Add Agent
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--font)' }}>Loading…</p>
      ) : agents.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
          padding: '64px 48px', textAlign: 'center', boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>👥</div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 8, fontFamily: 'var(--font)' }}>
            No agents yet
          </h2>
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font)', fontSize: '0.9375rem', marginBottom: 24 }}>
            Add your first team member to assign them to listings and PDFs.
          </p>
          <button onClick={() => setShowForm(true)} style={{
            fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
            color: '#fff', background: '#1B3079', border: '1px solid #1B3079',
            borderRadius: 6, padding: '10px 20px', cursor: 'pointer',
          }}>Add First Agent</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {agents.map(agent => (
            <div key={agent.id} style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 12, padding: '24px', boxShadow: 'var(--shadow-card)',
              display: 'flex', flexDirection: 'column', gap: 0,
              opacity: agent.is_active ? 1 : 0.55,
              transition: 'opacity 0.2s',
            }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                {agent.photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={agent.photo_url} alt={agent.name} style={{
                    width: 56, height: 56, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid var(--border)', flexShrink: 0,
                  }} />
                ) : (
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                    background: '#1B3079', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.25rem', color: '#D5BA8C',
                  }}>
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--heading)', fontFamily: 'var(--font)', marginBottom: 2 }}>
                    {agent.name}
                  </div>
                  {agent.title && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontFamily: 'var(--font)' }}>
                      {agent.title}
                    </div>
                  )}
                  <span style={{
                    display: 'inline-block', marginTop: 4,
                    fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.04em',
                    padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font)',
                    background: agent.is_active ? '#e6f4ea' : '#f5f5f5',
                    color: agent.is_active ? '#2e7d32' : '#777',
                  }}>
                    {agent.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                {agent.phone && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--body)', fontFamily: 'var(--font)', display: 'flex', gap: 6 }}>
                    <span style={{ color: 'var(--muted)', flexShrink: 0 }}>📞</span> {agent.phone}
                  </div>
                )}
                {agent.email && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--body)', fontFamily: 'var(--font)', display: 'flex', gap: 6 }}>
                    <span style={{ color: 'var(--muted)', flexShrink: 0 }}>✉️</span> {agent.email}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex', gap: 8, paddingTop: 14,
                borderTop: '1px solid var(--border)', flexWrap: 'wrap',
              }}>
                <button onClick={() => setEditing(agent)} style={{
                  flex: 1, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600,
                  color: 'var(--heading)', background: 'var(--white-section)',
                  border: '1px solid var(--border)', borderRadius: 6,
                  padding: '7px 0', cursor: 'pointer', minWidth: 60,
                }}>Edit</button>
                <button onClick={() => handleToggleActive(agent)} style={{
                  flex: 1, fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500,
                  color: 'var(--muted)', background: 'transparent',
                  border: '1px solid var(--border)', borderRadius: 6,
                  padding: '7px 0', cursor: 'pointer', minWidth: 60,
                }}>
                  {agent.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(agent.id)}
                  disabled={deletingId === agent.id}
                  style={{
                    fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 500,
                    color: '#c62828', background: 'transparent',
                    border: '1px solid #ffc9c9', borderRadius: 6,
                    padding: '7px 12px', cursor: 'pointer',
                  }}
                >
                  {deletingId === agent.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
