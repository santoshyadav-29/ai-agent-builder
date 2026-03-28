import type { AgentData, SavedAgent } from '../types/agent'

interface SavedAgentsPanelProps {
  data: AgentData | null
  savedAgents: SavedAgent[]
  onLoadAgent: (agent: SavedAgent) => void
  onDeleteAgent: (id: string) => void
  onClearAll: () => void
}

export function SavedAgentsPanel({
  data,
  savedAgents,
  onLoadAgent,
  onDeleteAgent,
  onClearAll,
}: SavedAgentsPanelProps) {
  if (savedAgents.length === 0) {
    return null
  }

  return (
    <section style={{ padding: '1.5rem', background: '#e0f7fa', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Saved Agents</h2>
        <button
          onClick={onClearAll}
          style={{ padding: '0.5rem 1rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear All
        </button>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {savedAgents.map((agent) => (
          <div key={agent.id} style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #b2ebf2', minWidth: '220px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#006064' }}>{agent.name}</h3>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>Profile:</strong> {data?.agentProfiles.find((p) => p.id === agent.profileId)?.name || 'None Selected'}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>Skills:</strong> {agent.skillIds?.length || 0} included
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>Layers:</strong> {agent.layerIds?.length || 0} included
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>Provider:</strong> {agent.provider || 'None'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={() => onLoadAgent(agent)}
                style={{ flex: 1, padding: '0.5rem', background: '#00838f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Load
              </button>
              <button
                onClick={() => onDeleteAgent(agent.id)}
                style={{ padding: '0.5rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
