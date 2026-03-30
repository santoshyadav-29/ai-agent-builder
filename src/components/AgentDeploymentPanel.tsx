import { BadgeCheck, Rocket } from "lucide-react";
import type { AgentValidationErrors } from "../types/agent";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
} from "./ui";

interface AgentDeploymentPanelProps {
  loading: boolean;
  agentName: string;
  validationErrors: AgentValidationErrors;
  onAgentNameChange: (name: string) => void;
  onSaveAgent: () => void;
}

export function AgentDeploymentPanel({
  loading,
  agentName,
  validationErrors,
  onAgentNameChange,
  onSaveAgent,
}: AgentDeploymentPanelProps) {
  if (loading) {
    return (
      <section className="motion-safe:animate-fade-up [animation-delay:170ms]">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">
              Make It Official
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-3 w-full max-w-md" />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 w-full sm:w-56" />
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="motion-safe:animate-fade-up [animation-delay:170ms]">
      <Card className="overflow-hidden border-gray-200 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50/60 via-white to-white pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <BadgeCheck className="h-5 w-5 text-indigo-600" />
            Make It Official
          </CardTitle>
          <p className="text-sm text-gray-600">
            Give your new AI team member a name and deploy them immediately.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex-1">
              <Label
                htmlFor="agent-name-input"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Agent Name
              </Label>
              <Input
                id="agent-name-input"
                type="text"
                placeholder="e.g., Support Specialist, Data Analyst..."
                value={agentName}
                onChange={(event) => onAgentNameChange(event.target.value)}
                className="h-11 bg-white border-gray-300 shadow-sm"
                aria-invalid={!!validationErrors.name}
              />
            </div>
            <Button
              onClick={onSaveAgent}
              className="h-11 lg:mt-[1.85rem] lg:w-56 font-bold shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Hire The Best Team
            </Button>
          </div>
          {validationErrors.name && (
            <p className="text-xs font-semibold text-red-600">
              {validationErrors.name}
            </p>
          )}
          {validationErrors.form && (
            <p className="text-xs font-semibold text-red-600">
              {validationErrors.form}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
