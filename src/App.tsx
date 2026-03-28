import { useState, useEffect } from "react";
import { ConfigurationOptions } from "./components/ConfigurationOptions";
import { CurrentAgentConfiguration } from "./components/CurrentAgentConfiguration";
import { SavedAgentsPanel } from "./components/SavedAgentsPanel";
import { useAnalyticsHeartbeat } from "./hooks/useAnalyticsHeartbeat";
import { useAgentData } from "./hooks/useAgentData";
import { useSessionTime } from "./hooks/useSessionTime";
import type { PersistedSavedAgent, SavedAgent } from "./types/agent";

const loadSavedAgents = (): SavedAgent[] => {
  const saved = localStorage.getItem("savedAgents");
  if (!saved) {
    return [];
  }

  try {
    const parsed: PersistedSavedAgent[] = JSON.parse(saved);
    return parsed.map((agent) => ({
      ...agent,
      id: agent.id ?? crypto.randomUUID(),
    }));
  } catch (e) {
    console.error("Failed to parse saved agents", e);
    return [];
  }
};

function App() {
  const { data, loading, error, fetchAgentData } = useAgentData();

  // Selection states
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);

  // Saving states
  const [agentName, setAgentName] = useState("");
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>(loadSavedAgents);
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  const handleDeleteAgent = (idToRemove: string) => {
    const updatedAgents = savedAgents.filter(
      (agent) => agent.id !== idToRemove,
    );
    setSavedAgents(updatedAgents);
  };

  const sessionTime = useSessionTime();

  useEffect(() => {
    localStorage.setItem("savedAgents", JSON.stringify(savedAgents));
  }, [savedAgents]);
  useAnalyticsHeartbeat(agentName);

  const handleLayerSelect = (layerId: string) => {
    if (layerId && !selectedLayers.includes(layerId)) {
      setSelectedLayers([...selectedLayers, layerId]);
    }
  };

  const handleSkillSelect = (skillId: string) => {
    if (skillId && !selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
  };

  const handleRemoveLayer = (layerId: string) => {
    setSelectedLayers(selectedLayers.filter((id) => id !== layerId));
  };

  const handleSaveAgent = () => {
    if (!agentName.trim()) {
      alert("Please enter a name for your agent.");
      return;
    }

    if (!selectedProfile) {
      alert("Please select a base profile before saving.");
      return;
    }

    if (selectedSkills.length === 0) {
      alert("Please add at least one skill before saving.");
      return;
    }

    if (selectedLayers.length === 0) {
      alert("Please add at least one personality layer before saving.");
      return;
    }

    if (!selectedProvider) {
      alert("Please select an AI provider before saving.");
      return;
    }

    const newAgent: SavedAgent = {
      id: crypto.randomUUID(),
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    };

    const updatedAgents = [...savedAgents, newAgent];
    setSavedAgents(updatedAgents);
    setAgentName("");
    alert(`Agent "${newAgent.name}" saved successfully!`);
  };

  const handleLoadAgent = (agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || "");
    setSelectedSkills(agent.skillIds || []);
    setSelectedLayers([...(agent.layerIds || [])]);
    setAgentName(agent.name);
    setSelectedProvider(agent.provider || "");
  };

  const handleClearAllSavedAgents = () => {
    if (confirm("Are you sure you want to clear all saved agents?")) {
      setSavedAgents([]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "1rem",
        fontFamily: "sans-serif",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1>AI Agent Builder</h1>
        <p>Design your custom AI personality and capability set.</p>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => void fetchAgentData()} disabled={loading}>
            {loading
              ? "Fetching Configuration..."
              : "Reload Configuration Data"}
          </button>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            Session Active: {sessionTime}s
          </span>
        </div>
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", gap: "2rem", flexDirection: "row" }}>
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
          <CurrentAgentConfiguration
            data={data}
            selectedProfile={selectedProfile}
            selectedSkills={selectedSkills}
            selectedLayers={selectedLayers}
            selectedProvider={selectedProvider}
            agentName={agentName}
            onRemoveSkill={handleRemoveSkill}
            onRemoveLayer={handleRemoveLayer}
            onAgentNameChange={setAgentName}
            onSaveAgent={handleSaveAgent}
          />
        </div>

        <SavedAgentsPanel
          data={data}
          savedAgents={savedAgents}
          onLoadAgent={handleLoadAgent}
          onDeleteAgent={handleDeleteAgent}
          onClearAll={handleClearAllSavedAgents}
        />
      </main>
    </div>
  );
}

export default App;
