import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AgentData,
  PersistedSavedAgent,
  SavedAgent,
} from "../types/agent";

interface SaveAgentResult {
  ok: boolean;
  message: string;
}

const isPersistedSavedAgent = (
  value: unknown,
): value is PersistedSavedAgent => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<PersistedSavedAgent>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.profileId === "string" &&
    Array.isArray(candidate.skillIds) &&
    candidate.skillIds.every((id) => typeof id === "string") &&
    Array.isArray(candidate.layerIds) &&
    candidate.layerIds.every((id) => typeof id === "string") &&
    (candidate.provider === undefined || typeof candidate.provider === "string") &&
    (candidate.id === undefined || typeof candidate.id === "string")
  );
};

interface AgentBuilderState {
  data: AgentData | null;
  loading: boolean;
  error: string | null;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  agentName: string;
  savedAgents: SavedAgent[];
  sessionTime: number;
  fetchAgentData: () => Promise<void>;
  setSelectedProfile: (profileId: string) => void;
  addSkill: (skillId: string) => void;
  removeSkill: (skillId: string) => void;
  addLayer: (layerId: string) => void;
  removeLayer: (layerId: string) => void;
  setSelectedProvider: (provider: string) => void;
  setAgentName: (name: string) => void;
  saveCurrentAgent: () => SaveAgentResult;
  loadSavedAgent: (agent: SavedAgent) => void;
  deleteSavedAgent: (idToRemove: string) => void;
  clearAllSavedAgents: () => void;
  incrementSessionTime: () => void;
}

const normalizeSavedAgents = (savedAgents: unknown): SavedAgent[] => {
  if (!Array.isArray(savedAgents)) {
    return [];
  }

  return savedAgents.filter(isPersistedSavedAgent).map((agent) => ({
    ...agent,
    id: agent.id ?? crypto.randomUUID(),
  }));
};

export const useAgentBuilderStore = create<AgentBuilderState>()(
  persist(
    (set, get) => {
      let latestRequestId = 0;

      return {
        data: null,
        loading: false,
        error: null,
        selectedProfile: "",
        selectedSkills: [],
        selectedLayers: [],
        selectedProvider: "",
        agentName: "",
        savedAgents: [],
        sessionTime: 0,

        fetchAgentData: async () => {
          const requestId = ++latestRequestId;
          set({ loading: true, error: null });

          try {
            // Simulate network delay and randomness (1 to 3 seconds)
            const delay = Math.floor(Math.random() * 2000) + 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));

            const response = await fetch("/data.json");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData: AgentData = await response.json();
            if (requestId !== latestRequestId) {
              return;
            }

            set({ data: jsonData, loading: false });
          } catch (err: unknown) {
            if (requestId !== latestRequestId) {
              return;
            }

            console.error("Error fetching data:", err);
            set({
              error:
                err instanceof Error ? err.message : "Failed to fetch agent data",
              loading: false,
            });
          }
        },

        setSelectedProfile: (profileId) => {
          set({ selectedProfile: profileId });
        },

        addSkill: (skillId) => {
          set((state) => {
            if (!skillId || state.selectedSkills.includes(skillId)) {
              return state;
            }

            return { selectedSkills: [...state.selectedSkills, skillId] };
          });
        },

        removeSkill: (skillId) => {
          set((state) => ({
            selectedSkills: state.selectedSkills.filter((id) => id !== skillId),
          }));
        },

        addLayer: (layerId) => {
          set((state) => {
            if (!layerId || state.selectedLayers.includes(layerId)) {
              return state;
            }

            return { selectedLayers: [...state.selectedLayers, layerId] };
          });
        },

        removeLayer: (layerId) => {
          set((state) => ({
            selectedLayers: state.selectedLayers.filter((id) => id !== layerId),
          }));
        },

        setSelectedProvider: (provider) => {
          set({ selectedProvider: provider });
        },

        setAgentName: (name) => {
          set({ agentName: name });
        },

        saveCurrentAgent: () => {
          const {
            agentName,
            selectedProfile,
            selectedSkills,
            selectedLayers,
            selectedProvider,
            savedAgents,
          } = get();

          if (!agentName.trim()) {
            return { ok: false, message: "Please enter a name for your agent." };
          }

          if (!selectedProfile) {
            return {
              ok: false,
              message: "Please select a base profile before saving.",
            };
          }

          if (selectedSkills.length === 0) {
            return {
              ok: false,
              message: "Please add at least one skill before saving.",
            };
          }

          if (selectedLayers.length === 0) {
            return {
              ok: false,
              message: "Please add at least one personality layer before saving.",
            };
          }

          if (!selectedProvider) {
            return {
              ok: false,
              message: "Please select an AI provider before saving.",
            };
          }

          const newAgent: SavedAgent = {
            id: crypto.randomUUID(),
            name: agentName,
            profileId: selectedProfile,
            skillIds: selectedSkills,
            layerIds: selectedLayers,
            provider: selectedProvider,
          };

          set({
            savedAgents: [...savedAgents, newAgent],
            agentName: "",
          });

          return {
            ok: true,
            message: `Agent "${newAgent.name}" saved successfully!`,
          };
        },

        loadSavedAgent: (agent) => {
          set({
            selectedProfile: agent.profileId || "",
            selectedSkills: agent.skillIds || [],
            selectedLayers: [...(agent.layerIds || [])],
            agentName: agent.name,
            selectedProvider: agent.provider || "",
          });
        },

        deleteSavedAgent: (idToRemove) => {
          set((state) => ({
            savedAgents: state.savedAgents.filter(
              (agent) => agent.id !== idToRemove,
            ),
          }));
        },

        clearAllSavedAgents: () => {
          set({ savedAgents: [] });
        },

        incrementSessionTime: () => {
          set((state) => ({ sessionTime: state.sessionTime + 1 }));
        },
      };
    },
    {
      name: "agent-builder-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedAgents: state.savedAgents,
      }),
      merge: (persistedState, currentState) => {
        const incoming = persistedState as
          | Partial<AgentBuilderState>
          | undefined;
        const persistedAgents = normalizeSavedAgents(incoming?.savedAgents);

        return {
          ...currentState,
          ...incoming,
          savedAgents: persistedAgents,
        };
      },
    },
  ),
);
