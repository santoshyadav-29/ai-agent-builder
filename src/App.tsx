import { useState, useEffect } from 'react'
import { ConfigurationOptions } from './components/ConfigurationOptions'
import { useAgentData } from './hooks/useAgentData'
import type { PersistedSavedAgent, SavedAgent } from './types/agent'

const loadSavedAgents = (): SavedAgent[] => {
  const saved = localStorage.getItem('savedAgents')
  if (!saved) {
    return []
  }

  try {
    const parsed: PersistedSavedAgent[] = JSON.parse(saved)
    return parsed.map((agent) => ({
      ...agent,
      id: agent.id ?? crypto.randomUUID(),
    }))
  } catch (e) {
    console.error('Failed to parse saved agents', e)
    return []
  }
}

function App() {
  const { data, loading, error, fetchAgentData } = useAgentData()

  // Selection states
  const [selectedProfile, setSelectedProfile] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])

  // Saving states
  const [agentName, setAgentName] = useState('')
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>(loadSavedAgents)
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  const handleDeleteAgent = (idToRemove: string) => {
    const updatedAgents = savedAgents.filter((agent) => agent.id !== idToRemove)
    setSavedAgents(updatedAgents)
  }

  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    localStorage.setItem('savedAgents', JSON.stringify(savedAgents))
  }, [savedAgents])

  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      if (agentName !== '') {
        console.log(`[Analytics Heartbeat] User is working on agent named: "${agentName}"`)
      } else {
        console.log(`[Analytics Heartbeat] User is working on an unnamed agent draft...`)
      }
    }, 8000)

    return () => clearInterval(analyticsInterval)
  }, [agentName])

  const handleLayerSelect = (layerId: string) => {
    if (layerId && !selectedLayers.includes(layerId)) {
      setSelectedLayers([...selectedLayers, layerId])
    }
  }

  const handleSkillSelect = (skillId: string) => {
    if (skillId && !selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId])
    }
  }

  const handleSaveAgent = () => {
    if (!agentName.trim()) {
      alert('Please enter a name for your agent.')
      return
    }

    if (!selectedProfile) {
      alert('Please select a base profile before saving.')
      return
    }

    if (selectedSkills.length === 0) {
      alert('Please add at least one skill before saving.')
      return
    }

    if (selectedLayers.length === 0) {
      alert('Please add at least one personality layer before saving.')
      return
    }

    if (!selectedProvider) {
      alert('Please select an AI provider before saving.')
      return
    }

    const newAgent: SavedAgent = {
      id: crypto.randomUUID(),
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    }

    const updatedAgents = [...savedAgents, newAgent]
    setSavedAgents(updatedAgents)
    setAgentName('')
    alert(`Agent "${newAgent.name}" saved successfully!`)
  }

  const handleLoadAgent = (agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || '')
    setSelectedSkills(agent.skillIds || [])
    setSelectedLayers([...(agent.layerIds || [])])
    setAgentName(agent.name)
    setSelectedProvider(agent.provider || '')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '1rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>AI Agent Builder</h1>
        <p>Design your custom AI personality and capability set.</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => void fetchAgentData()} disabled={loading}>
            {loading ? 'Fetching Configuration...' : 'Reload Configuration Data'}
          </button>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            Session Active: {sessionTime}s
          </span>
        </div>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'row' }}>
          <ConfigurationOptions
            data={data}
            loading={loading}
            error={error}
            selectedProfile={selectedProfile}
            selectedProvider={selectedProvider}
            onProfileChange={setSelectedProfile}
            onSkillSelect={handleSkillSelect}
            onLayerSelect={handleLayerSelect}
            onProviderChange={setSelectedProvider}
          />

          {/* Right pane: Selected configuration preview */}
          <section style={{ flex: '1 1 50%', paddingLeft: '1rem' }}>
            <h2>Current Agent Configuration</h2>

            <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', minHeight: '300px' }}>
              <h3 style={{ marginTop: 0 }}>Profile</h3>
              {selectedProfile && data ? (
                <p>
                  <strong>{data.agentProfiles.find(p => p.id === selectedProfile)?.name}</strong>:
                  {' '}{data.agentProfiles.find(p => p.id === selectedProfile)?.description}
                </p>
              ) : (
                <p style={{ color: '#888' }}>No profile selected.</p>
              )}

              <h3>Selected Skills</h3>
              {selectedSkills.length > 0 && data ? (
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {selectedSkills.map(skillId => {
                    const skill = data.skills.find(s => s.id === skillId);
                    return (
                      <li key={skillId} style={{ marginBottom: '0.5rem' }}>
                        {skill?.name}
                        <button
                          onClick={() => setSelectedSkills(selectedSkills.filter(id => id !== skillId))}
                          style={{ marginLeft: '1rem', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p style={{ color: '#888' }}>No skills added.</p>
              )}

              <h3>Selected Layers</h3>
              {selectedLayers.length > 0 && data ? (
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {selectedLayers.map(layerId => {
                    const layer = data.layers.find(l => l.id === layerId);
                    return (
                      <li key={layerId} style={{ marginBottom: '0.5rem' }}>
                        {layer?.name}
                        <button
                          onClick={() => setSelectedLayers(selectedLayers.filter(id => id !== layerId))}
                          style={{ marginLeft: '1rem', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p style={{ color: '#888' }}>No layers added.</p>
              )}

              <h3>Selected Provider</h3>
              {selectedProvider ? (
                <p><strong>{selectedProvider}</strong></p>
              ) : (
                <p style={{ color: '#888' }}>No provider selected.</p>
              )}

              <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <h3 style={{ marginTop: 0 }}>Save This Agent</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter agent name..."
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem' }}
                  />
                  <button onClick={handleSaveAgent} style={{ padding: '0.5rem 1rem' }}>
                    Save Agent
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Panel: Saved Agents */}
        {savedAgents.length > 0 && (
          <section style={{ padding: '1.5rem', background: '#e0f7fa', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Saved Agents</h2>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all saved agents?')) {
                    setSavedAgents([])
                  }
                }}
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
                    <strong>Profile:</strong> {data?.agentProfiles.find(p => p.id === agent.profileId)?.name || 'None Selected'}
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
                      onClick={() => handleLoadAgent(agent)}
                      style={{ flex: 1, padding: '0.5rem', background: '#00838f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id)}
                      style={{ padding: '0.5rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
