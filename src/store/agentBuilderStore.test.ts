import { useAgentBuilderStore } from "./agentBuilderStore";

const resetStoreState = () => {
  useAgentBuilderStore.setState({
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
  });
};

describe("useAgentBuilderStore", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    localStorage.clear();
    useAgentBuilderStore.persist.clearStorage();
    resetStoreState();
  });

  it("returns validation error when saving empty draft", () => {
    const result = useAgentBuilderStore.getState().saveCurrentAgent();

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Please enter a name for your agent.");
    expect(useAgentBuilderStore.getState().validationErrors.name).toBeDefined();
  });

  it("saves a valid agent and resets draft fields", () => {
    const randomUuidSpy = vi.spyOn(globalThis.crypto, "randomUUID");
    randomUuidSpy.mockReturnValue("00000000-0000-4000-8000-000000000001");

    const state = useAgentBuilderStore.getState();
    state.setAgentName("Alpha Agent");
    state.setSelectedProfile("profile-1");
    state.addSkill("skill-1");
    state.addLayer("layer-1");
    state.setSelectedProvider("ChatGPT");

    const result = useAgentBuilderStore.getState().saveCurrentAgent();
    const next = useAgentBuilderStore.getState();

    expect(result.ok).toBe(true);
    expect(next.savedAgents).toHaveLength(1);
    expect(next.savedAgents[0]).toMatchObject({
      id: "00000000-0000-4000-8000-000000000001",
      name: "Alpha Agent",
      profileId: "profile-1",
      skillIds: ["skill-1"],
      layerIds: ["layer-1"],
      provider: "ChatGPT",
    });
    expect(next.agentName).toBe("");
    expect(next.selectedProfile).toBe("");
    expect(next.selectedSkills).toEqual([]);
    expect(next.selectedLayers).toEqual([]);
    expect(next.selectedProvider).toBe("");
  });

  it("prevents duplicate names case-insensitively", () => {
    const randomUuidSpy = vi.spyOn(globalThis.crypto, "randomUUID");
    randomUuidSpy
      .mockReturnValueOnce("00000000-0000-4000-8000-000000000002")
      .mockReturnValueOnce("00000000-0000-4000-8000-000000000003");

    const state = useAgentBuilderStore.getState();
    state.setAgentName("Alpha");
    state.setSelectedProfile("p1");
    state.addSkill("s1");
    state.addLayer("l1");
    state.setSelectedProvider("Claude");
    useAgentBuilderStore.getState().saveCurrentAgent();

    const second = useAgentBuilderStore.getState();
    second.setAgentName(" alpha ");
    second.setSelectedProfile("p2");
    second.addSkill("s2");
    second.addLayer("l2");
    second.setSelectedProvider("Gemini");

    const result = useAgentBuilderStore.getState().saveCurrentAgent();

    expect(result.ok).toBe(false);
    expect(result.message).toBe("An agent with this name already exists.");
    expect(useAgentBuilderStore.getState().validationErrors.name).toBe(
      "An agent with this name already exists.",
    );
  });

  it("prevents duplicate configurations even if skill/layer order differs", () => {
    const randomUuidSpy = vi.spyOn(globalThis.crypto, "randomUUID");
    randomUuidSpy
      .mockReturnValueOnce("00000000-0000-4000-8000-000000000004")
      .mockReturnValueOnce("00000000-0000-4000-8000-000000000005");

    const state = useAgentBuilderStore.getState();
    state.setAgentName("Alpha");
    state.setSelectedProfile("p1");
    useAgentBuilderStore.setState({
      selectedSkills: ["s1", "s2"],
      selectedLayers: ["l1", "l2"],
    });
    state.setSelectedProvider("ChatGPT");
    useAgentBuilderStore.getState().saveCurrentAgent();

    const second = useAgentBuilderStore.getState();
    second.setAgentName("Beta");
    second.setSelectedProfile("p1");
    second.setSelectedProvider("ChatGPT");
    useAgentBuilderStore.setState({
      selectedSkills: ["s2", "s1"],
      selectedLayers: ["l2", "l1"],
    });

    const result = useAgentBuilderStore.getState().saveCurrentAgent();

    expect(result.ok).toBe(false);
    expect(result.message).toBe(
      "An identical agent configuration already exists.",
    );
    expect(useAgentBuilderStore.getState().validationErrors.form).toBe(
      "An identical agent configuration already exists.",
    );
  });

  it("loads a saved agent into current selections", () => {
    useAgentBuilderStore.setState({
      validationErrors: { form: "old error" },
    });

    useAgentBuilderStore.getState().loadSavedAgent({
      id: "saved-1",
      name: "Loaded Agent",
      profileId: "profile-2",
      skillIds: ["skill-3"],
      layerIds: ["layer-4"],
      provider: "Kimi",
    });

    const next = useAgentBuilderStore.getState();
    expect(next.agentName).toBe("Loaded Agent");
    expect(next.selectedProfile).toBe("profile-2");
    expect(next.selectedSkills).toEqual(["skill-3"]);
    expect(next.selectedLayers).toEqual(["layer-4"]);
    expect(next.selectedProvider).toBe("Kimi");
    expect(next.validationErrors).toEqual({});
  });

  it("fetchAgentData loads data and clears loading state", async () => {
    const mockData = {
      agentProfiles: [{ id: "p1", name: "Creative", description: "desc" }],
      skills: [
        { id: "s1", name: "Writing", category: "Core", description: "desc" },
      ],
      layers: [{ id: "l1", name: "Tone", type: "Style", description: "desc" }],
    };

    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const promise = useAgentBuilderStore.getState().fetchAgentData();

    expect(useAgentBuilderStore.getState().loading).toBe(true);

    await vi.runAllTimersAsync();
    await promise;

    const next = useAgentBuilderStore.getState();
    expect(next.loading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.data).toEqual(mockData);
  });
});
