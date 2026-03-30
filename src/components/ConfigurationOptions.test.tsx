import { render, screen } from "@testing-library/react";
import { ConfigurationOptions } from "./ConfigurationOptions";
import type { AgentData } from "../types/agent";

const mockData: AgentData = {
  agentProfiles: [
    { id: "p1", name: "Creative Writer", description: "desc" },
    { id: "p2", name: "Analyst", description: "desc" },
  ],
  skills: [
    { id: "s1", name: "Manage Calendar", category: "Ops", description: "desc" },
    { id: "s2", name: "Database Query", category: "Data", description: "desc" },
    { id: "s3", name: "Data Analysis", category: "Data", description: "desc" },
  ],
  layers: [
    { id: "l1", name: "Pirate Persona", type: "Tone", description: "desc" },
    { id: "l2", name: "Reflexion", type: "Reasoning", description: "desc" },
  ],
};

const baseProps = {
  data: mockData,
  loading: false,
  error: null,
  validationErrors: {},
  selectedProfile: "",
  selectedSkills: [] as string[],
  selectedLayers: [] as string[],
  selectedProvider: "",
  onProfileChange: () => {},
  onSkillSelect: () => {},
  onLayerSelect: () => {},
  onProviderChange: () => {},
};

describe("ConfigurationOptions", () => {
  it("shows empty placeholders when nothing is selected", () => {
    render(<ConfigurationOptions {...baseProps} />);

    expect(screen.getByText("Select a skill to add")).toBeInTheDocument();
    expect(screen.getByText("Select a layer to add")).toBeInTheDocument();
  });

  it("shows selected item summaries for multi-select fields", () => {
    render(
      <ConfigurationOptions
        {...baseProps}
        selectedSkills={["s1", "s2", "s3"]}
        selectedLayers={["l1", "l2"]}
      />,
    );

    expect(screen.getByText("Manage Calendar, Database Query +1")).toBeInTheDocument();
    expect(screen.getByText("Pirate Persona, Reflexion")).toBeInTheDocument();
  });

  it("shows loading skeleton when loading without data", () => {
    render(
      <ConfigurationOptions
        {...baseProps}
        data={null}
        loading
      />,
    );

    expect(screen.getByText("Configuration Options")).toBeInTheDocument();
    expect(screen.queryByText("Base Profile")).not.toBeInTheDocument();
  });
});
