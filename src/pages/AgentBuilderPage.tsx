import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import {
  ConfigurationOptions,
  CurrentAgentConfiguration,
  SavedAgentsPanel,
  SessionStatus,
} from "../components";
import { useAnalyticsHeartbeat } from "../hooks/useAnalyticsHeartbeat";
import { useSessionTicker } from "../hooks/useSessionTicker";
import { useAgentBuilderStore } from "../store";
import { Button } from "../components/ui";

export function AgentBuilderPage() {
  const {
    selectedProfile,
    selectedSkills,
    selectedLayers,
    selectedProvider,
    agentName,
    validationErrors,
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
  } = useAgentBuilderStore(
    useShallow((state) => ({
      selectedProfile: state.selectedProfile,
      selectedSkills: state.selectedSkills,
      selectedLayers: state.selectedLayers,
      selectedProvider: state.selectedProvider,
      agentName: state.agentName,
      validationErrors: state.validationErrors,
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
    })),
  );

  const { data, loading, error, fetchAgentData } = useAgentBuilderStore(
    useShallow((state) => ({
      data: state.data,
      loading: state.loading,
      error: state.error,
      fetchAgentData: state.fetchAgentData,
    })),
  );

  const savedAgents = useAgentBuilderStore((state) => state.savedAgents);

  useEffect(() => {
    void fetchAgentData();
  }, [fetchAgentData]);

  useSessionTicker();

  useAnalyticsHeartbeat(agentName);

  const handleSaveAgent = () => {
    const result = saveCurrentAgent();
    if (result.ok) {
      toast.success(result.message);
      return;
    }

    toast.error(result.message);
  };

  const handleClearAllSavedAgents = () => {
    if (savedAgents.length === 0) {
      toast.info("There are no saved agents to clear.");
      return;
    }

    clearAllSavedAgents();
    toast.success("Saved agents cleared.");
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8">
      <header className="space-y-4 pb-6 border-b border-border">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            AI Agent Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Design your custom AI personality and capability set. Build your best team with precision.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button variant="outline" onClick={() => void fetchAgentData()} disabled={loading} size="lg" className="font-semibold shadow-sm">
            {loading
              ? "Fetching Configuration..."
              : "Reload Configuration Data"}
          </Button>
          <SessionStatus />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-12">
        <section
          className="grid gap-10 lg:grid-cols-2 lg:items-start"
          aria-label="Agent configuration workspace"
        >
          <ConfigurationOptions
            data={data}
            loading={loading}
            error={error}
            validationErrors={validationErrors}
            selectedProfile={selectedProfile}
            selectedProvider={selectedProvider}
            onProfileChange={setSelectedProfile}
            onSkillSelect={addSkill}
            onLayerSelect={addLayer}
            onProviderChange={setSelectedProvider}
          />
          <CurrentAgentConfiguration
            data={data}
            validationErrors={validationErrors}
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
        </section>

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
