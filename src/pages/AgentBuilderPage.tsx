import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import {
  AgentDeploymentPanel,
  ConfigurationOptions,
  CurrentAgentConfiguration,
  SavedAgentsPanel,
  SessionStatus,
} from "../components";
import { useAnalyticsHeartbeat } from "../hooks/useAnalyticsHeartbeat";
import { useSessionTicker } from "../hooks/useSessionTicker";
import { useAgentBuilderStore } from "../store";
import type { SavedAgent } from "../types/agent";
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
  const workspaceSectionRef = useRef<HTMLElement | null>(null);

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

  const handleLoadAgent = (agent: SavedAgent) => {
    loadSavedAgent(agent);
    requestAnimationFrame(() => {
      workspaceSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8">
        <header className="space-y-4 border-b border-border pb-6 motion-safe:animate-fade-up">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              AI Agent <span className="text-indigo-600">Builder</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Design your custom AI personality and capability set. Build your
              best team with precision.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="outline"
              onClick={() => void fetchAgentData()}
              disabled={loading}
              size="lg"
              className="font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Fetching Configuration...
                </>
              ) : (
                "Reload Configuration Data"
              )}
            </Button>
            <SessionStatus />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-8 motion-safe:animate-fade-up [animation-delay:100ms]">
          <section
            ref={workspaceSectionRef}
            className="grid gap-10 lg:grid-cols-2 lg:items-stretch"
            aria-label="Agent configuration workspace"
          >
            <ConfigurationOptions
              data={data}
              loading={loading}
              error={error}
              validationErrors={validationErrors}
              selectedProfile={selectedProfile}
              selectedSkills={selectedSkills}
              selectedLayers={selectedLayers}
              selectedProvider={selectedProvider}
              onProfileChange={setSelectedProfile}
              onSkillSelect={addSkill}
              onLayerSelect={addLayer}
              onProviderChange={setSelectedProvider}
            />
            <CurrentAgentConfiguration
              data={data}
              loading={loading}
              selectedProfile={selectedProfile}
              selectedSkills={selectedSkills}
              selectedLayers={selectedLayers}
              selectedProvider={selectedProvider}
              onRemoveSkill={removeSkill}
              onRemoveLayer={removeLayer}
            />
          </section>

          <AgentDeploymentPanel
            loading={loading}
            validationErrors={validationErrors}
            agentName={agentName}
            onAgentNameChange={setAgentName}
            onSaveAgent={handleSaveAgent}
          />

          <div className="motion-safe:animate-fade-up [animation-delay:180ms]">
            <SavedAgentsPanel
              data={data}
              savedAgents={savedAgents}
              onLoadAgent={handleLoadAgent}
              onDeleteAgent={deleteSavedAgent}
              onClearAll={handleClearAllSavedAgents}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
