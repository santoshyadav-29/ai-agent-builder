import { AI_PROVIDERS } from '../constants/providers'
import type { AgentData } from '../types/agent'

interface ConfigurationOptionsProps {
  data: AgentData | null
  loading: boolean
  error: string | null
  selectedProfile: string
  selectedProvider: string
  onProfileChange: (profileId: string) => void
  onSkillSelect: (skillId: string) => void
  onLayerSelect: (layerId: string) => void
  onProviderChange: (provider: string) => void
}

export function ConfigurationOptions({
  data,
  loading,
  error,
  selectedProfile,
  selectedProvider,
  onProfileChange,
  onSkillSelect,
  onLayerSelect,
  onProviderChange,
}: ConfigurationOptionsProps) {
  return (
    <section style={{ flex: '1 1 50%', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
      <h2>Configuration Options</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}

      {loading && (
        <div style={{ padding: '2rem', background: '#f0f8ff', border: '1px dashed #0066cc', marginBottom: '1rem' }}>
          Fetching simulated API... (this takes 1-3 seconds to test loading states)
        </div>
      )}

      {!data && !loading && !error && <p>No data loaded.</p>}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="profile-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Base Profile:</label>
            <select
              id="profile-select"
              value={selectedProfile}
              onChange={(e) => {
                onProfileChange(e.target.value)
              }}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">-- Select a Profile --</option>
              {data.agentProfiles.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="skill-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Add Skill:</label>
            <select
              id="skill-select"
              onChange={(e) => {
                onSkillSelect(e.target.value)
                e.target.value = ''
              }}
              defaultValue=""
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="" disabled>-- Select a Skill to Add --</option>
              {data.skills.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="layer-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Add Personality Layer:</label>
            <select
              id="layer-select"
              onChange={(e) => {
                onLayerSelect(e.target.value)
                e.target.value = ''
              }}
              defaultValue=""
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="" disabled>-- Select a Layer to Add --</option>
              {data.layers.map((l) => (
                <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="provider-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Provider:</label>
            <select
              id="provider-select"
              value={selectedProvider}
              onChange={(e) => onProviderChange(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">-- Select an AI Provider --</option>
              {AI_PROVIDERS.map((provider) => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>

        </div>
      )}
    </section>
  )
}
