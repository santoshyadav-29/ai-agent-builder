import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AgentValidationErrors,
  AgentData,
  PersistedSavedAgent,
  SavedAgent,
} from "../types/agent";
import { agentDraftSchema } from "../schemas/agent";

interface SaveAgentResult {
  ok: boolean;
  message: string;
}

const VALIDATION_FIELD_ORDER: Array<keyof AgentValidationErrors> = [
  "name",
  "profileId",
  "skillIds",
  "layerIds",
  "provider",
  "form",
];

const getPrimaryValidationMessage = (
  errors: AgentValidationErrors,
  fallback: string,
): string => {
  for (const field of VALIDATION_FIELD_ORDER) {
    const message = errors[field];
    if (message) {
      return message;
    }
  }

  return fallback;
};

const clearValidationFields = (
  errors: AgentValidationErrors,
  fieldsToClear: Array<keyof AgentValidationErrors>,
): AgentValidationErrors => {
  const next = { ...errors };
  for (const field of fieldsToClear) {
    delete next[field];
  }

  return next;
};

const normalizeSelection = (ids: string[]): string[] => {
  return [...new Set(ids)].sort();
};

const buildConfigurationFingerprint = (agent: {
  profileId: string;
  provider?: string;
  skillIds: string[];
  layerIds: string[];
}): string => {
  return [
    agent.profileId,
    agent.provider ?? "",
    normalizeSelection(agent.skillIds).join("|"),
    normalizeSelection(agent.layerIds).join("|"),
  ].join("::");
};

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
  validationErrors: AgentValidationErrors;
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
        validationErrors: {},
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
          set((state) => ({
            selectedProfile: profileId,
            validationErrors: clearValidationFields(state.validationErrors, [
              "profileId",
              "form",
            ]),
          }));
        },

        addSkill: (skillId) => {
          set((state) => {
            if (!skillId) {
              return state;
            }

            if (state.selectedSkills.includes(skillId)) {
              return {
                validationErrors: clearValidationFields(state.validationErrors, [
                  "skillIds",
                  "form",
                ]),
              };
            }

            return {
              selectedSkills: [...state.selectedSkills, skillId],
              validationErrors: clearValidationFields(state.validationErrors, [
                "skillIds",
                "form",
              ]),
            };
          });
        },

        removeSkill: (skillId) => {
          set((state) => ({
            selectedSkills: state.selectedSkills.filter((id) => id !== skillId),
          }));
        },

        addLayer: (layerId) => {
          set((state) => {
            if (!layerId) {
              return state;
            }

            if (state.selectedLayers.includes(layerId)) {
              return {
                validationErrors: clearValidationFields(state.validationErrors, [
                  "layerIds",
                  "form",
                ]),
              };
            }

            return {
              selectedLayers: [...state.selectedLayers, layerId],
              validationErrors: clearValidationFields(state.validationErrors, [
                "layerIds",
                "form",
              ]),
            };
          });
        },

        removeLayer: (layerId) => {
          set((state) => ({
            selectedLayers: state.selectedLayers.filter((id) => id !== layerId),
          }));
        },

        setSelectedProvider: (provider) => {
          set((state) => ({
            selectedProvider: provider,
            validationErrors: clearValidationFields(state.validationErrors, [
              "provider",
              "form",
            ]),
          }));
        },

        setAgentName: (name) => {
          set((state) => ({
            agentName: name,
            validationErrors: clearValidationFields(state.validationErrors, [
              "name",
              "form",
            ]),
          }));
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

          const draft = {
            name: agentName.trim(),
            profileId: selectedProfile,
            skillIds: selectedSkills,
            layerIds: selectedLayers,
            provider: selectedProvider,
          };

          const validationResult = agentDraftSchema.safeParse(draft);
          if (!validationResult.success) {
            const fieldErrors = validationResult.error.flatten().fieldErrors;
            const nextErrors: AgentValidationErrors = {
              name: fieldErrors.name?.[0],
              profileId: fieldErrors.profileId?.[0],
              skillIds: fieldErrors.skillIds?.[0],
              layerIds: fieldErrors.layerIds?.[0],
              provider: fieldErrors.provider?.[0],
            };

            set({ validationErrors: nextErrors });
            return {
              ok: false,
              message: getPrimaryValidationMessage(
                nextErrors,
                "Please fix validation errors before saving.",
              ),
            };
          }

          const normalizedName = validationResult.data.name.toLowerCase();
          const hasDuplicateName = savedAgents.some(
            (agent) => agent.name.trim().toLowerCase() === normalizedName,
          );

          if (hasDuplicateName) {
            const nextErrors: AgentValidationErrors = {
              name: "An agent with this name already exists.",
            };
            set({ validationErrors: nextErrors });
            return {
              ok: false,
              message: getPrimaryValidationMessage(
                nextErrors,
                "An agent with this name already exists.",
              ),
            };
          }

          const draftFingerprint = buildConfigurationFingerprint(validationResult.data);
          const hasDuplicateConfiguration = savedAgents.some(
            (agent) => buildConfigurationFingerprint(agent) === draftFingerprint,
          );

          if (hasDuplicateConfiguration) {
            const nextErrors: AgentValidationErrors = {
              form: "An identical agent configuration already exists.",
            };
            set({ validationErrors: nextErrors });
            return {
              ok: false,
              message: getPrimaryValidationMessage(
                nextErrors,
                "An identical agent configuration already exists.",
              ),
            };
          }

          const newAgent: SavedAgent = {
            id: crypto.randomUUID(),
            name: validationResult.data.name,
            profileId: validationResult.data.profileId,
            skillIds: validationResult.data.skillIds,
            layerIds: validationResult.data.layerIds,
            provider: validationResult.data.provider,
          };

          set({
            savedAgents: [...savedAgents, newAgent],
            agentName: "",
            selectedProfile: "",
            selectedSkills: [],
            selectedLayers: [],
            selectedProvider: "",
            validationErrors: {},
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
            validationErrors: {},
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
