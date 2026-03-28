import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  ConfigurationOptions,
  CurrentAgentConfiguration,
  SavedAgentsPanel,
} from "../components";
import { useAnalyticsHeartbeat } from "../hooks/useAnalyticsHeartbeat";
import { useAgentBuilderStore } from "../store";

export function AgentBuilderPage() {
  const {
    data,
    loading,
    error,
    selectedProfile,
    selectedSkills,
    selectedLayers,
    selectedProvider,
    agentName,
    savedAgents,
    sessionTime,
    fetchAgentData,
    setSelectedProfile,
    addSkill,
    removeSkill,
    addLayer,
    removeLayer,
    setSelectedProvider,
    setAgentName,
    saveCurrentAgent,
    loadSavedAgent,
    deleteSavedAgent,
    clearAllSavedAgents,
    incrementSessionTime,
  } = useAgentBuilderStore(
    useShallow((state) => ({
      data: state.data,
      loading: state.loading,
      error: state.error,
      selectedProfile: state.selectedProfile,
      selectedSkills: state.selectedSkills,
      selectedLayers: state.selectedLayers,
      selectedProvider: state.selectedProvider,
      agentName: state.agentName,
      savedAgents: state.savedAgents,
      sessionTime: state.sessionTime,
      fetchAgentData: state.fetchAgentData,
      setSelectedProfile: state.setSelectedProfile,
      addSkill: state.addSkill,
      removeSkill: state.removeSkill,
      addLayer: state.addLayer,
      removeLayer: state.removeLayer,
      setSelectedProvider: state.setSelectedProvider,
      setAgentName: state.setAgentName,
      saveCurrentAgent: state.saveCurrentAgent,
      loadSavedAgent: state.loadSavedAgent,
      deleteSavedAgent: state.deleteSavedAgent,
      clearAllSavedAgents: state.clearAllSavedAgents,
      incrementSessionTime: state.incrementSessionTime,
    })),
  );

  useEffect(() => {
    void fetchAgentData();
  }, [fetchAgentData]);

  useEffect(() => {
    const interval = setInterval(() => {
      incrementSessionTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [incrementSessionTime]);

  useAnalyticsHeartbeat(agentName);

  const handleSaveAgent = () => {
    const result = saveCurrentAgent();
    alert(result.message);
  };

  const handleClearAllSavedAgents = () => {
    if (confirm("Are you sure you want to clear all saved agents?")) {
      clearAllSavedAgents();
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
            onSkillSelect={addSkill}
            onLayerSelect={addLayer}
            onProviderChange={setSelectedProvider}
          />
          <CurrentAgentConfiguration
            data={data}
            selectedProfile={selectedProfile}
            selectedSkills={selectedSkills}
            selectedLayers={selectedLayers}
            selectedProvider={selectedProvider}
            agentName={agentName}
            onRemoveSkill={removeSkill}
            onRemoveLayer={removeLayer}
            onAgentNameChange={setAgentName}
            onSaveAgent={handleSaveAgent}
          />
        </div>

        <SavedAgentsPanel
          data={data}
          savedAgents={savedAgents}
          onLoadAgent={loadSavedAgent}
          onDeleteAgent={deleteSavedAgent}
          onClearAll={handleClearAllSavedAgents}
        />
      </main>
    </div>
  );
}
