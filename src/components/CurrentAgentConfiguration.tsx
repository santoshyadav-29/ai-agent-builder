import type { AgentData } from "../types/agent";

interface CurrentAgentConfigurationProps {
  data: AgentData | null;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  agentName: string;
  onRemoveSkill: (skillId: string) => void;
  onRemoveLayer: (layerId: string) => void;
  onAgentNameChange: (name: string) => void;
  onSaveAgent: () => void;
}

export function CurrentAgentConfiguration({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  agentName,
  onRemoveSkill,
  onRemoveLayer,
  onAgentNameChange,
  onSaveAgent,
}: CurrentAgentConfigurationProps) {
  return (
    <section style={{ flex: "1 1 50%", paddingLeft: "1rem" }}>
      <h2>Current Agent Configuration</h2>

      <div
        style={{
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "8px",
          minHeight: "300px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Profile</h3>
        {selectedProfile && data ? (
          <p>
            <strong>
              {data.agentProfiles.find((p) => p.id === selectedProfile)?.name}
            </strong>
            :{" "}
            {
              data.agentProfiles.find((p) => p.id === selectedProfile)
                ?.description
            }
          </p>
        ) : (
          <p style={{ color: "#888" }}>No profile selected.</p>
        )}

        <h3>Selected Skills</h3>
        {selectedSkills.length > 0 && data ? (
          <ul style={{ paddingLeft: "1.5rem" }}>
            {selectedSkills.map((skillId) => {
              const skill = data.skills.find((s) => s.id === skillId);
              return (
                <li key={skillId} style={{ marginBottom: "0.5rem" }}>
                  {skill?.name}
                  <button
                    onClick={() => onRemoveSkill(skillId)}
                    style={{
                      marginLeft: "1rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ color: "#888" }}>No skills added.</p>
        )}

        <h3>Selected Layers</h3>
        {selectedLayers.length > 0 && data ? (
          <ul style={{ paddingLeft: "1.5rem" }}>
            {selectedLayers.map((layerId) => {
              const layer = data.layers.find((l) => l.id === layerId);
              return (
                <li key={layerId} style={{ marginBottom: "0.5rem" }}>
                  {layer?.name}
                  <button
                    onClick={() => onRemoveLayer(layerId)}
                    style={{
                      marginLeft: "1rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ color: "#888" }}>No layers added.</p>
        )}

        <h3>Selected Provider</h3>
        {selectedProvider ? (
          <p>
            <strong>{selectedProvider}</strong>
          </p>
        ) : (
          <p style={{ color: "#888" }}>No provider selected.</p>
        )}

        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid #ddd",
            paddingTop: "1rem",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Save This Agent</h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="Enter agent name..."
              value={agentName}
              onChange={(e) => onAgentNameChange(e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}
            />
            <button onClick={onSaveAgent} style={{ padding: "0.5rem 1rem" }}>
              Save Agent
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
