import { z } from "zod";

export const agentDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter a name for your agent.")
    .max(60, "Agent name must be 60 characters or fewer."),
  profileId: z.string().min(1, "Please select a base profile before saving."),
  skillIds: z
    .array(z.string())
    .min(1, "Please add at least one skill before saving."),
  layerIds: z
    .array(z.string())
    .min(1, "Please add at least one personality layer before saving."),
  provider: z.string().min(1, "Please select an AI provider before saving."),
});

export type AgentDraftInput = z.infer<typeof agentDraftSchema>;
