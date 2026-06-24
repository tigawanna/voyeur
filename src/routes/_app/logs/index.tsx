import { AppConfig } from "#/utils/system";
import { createFileRoute } from "@tanstack/react-router";

import { LogsViewer } from "./-components/LogsViewer";

export const Route = createFileRoute("/_app/logs/")({
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Logs` }],
  }),
  component: LogsPage,
});

function LogsPage() {
  return <LogsViewer />;
}
