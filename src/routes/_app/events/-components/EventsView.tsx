import { Activity, useState } from "react";
import { RefreshCw } from "lucide-react";

import { manualSyncLibraryEvents } from "#/data-access-layer/sync/sync-events";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InboxList } from "./InboxList";
import { OutboxList } from "./OutboxList";

type EventTab = "outbox" | "inbox";

export function EventsView() {
  const [tab, setTab] = useState<EventTab>("outbox");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncMessage(null);

    try {
      const result = await manualSyncLibraryEvents();

      if (result.errors.length > 0) {
        setSyncMessage(`Sync failed: ${result.errors[0]?.message ?? "Unknown error"}`);
        return;
      }

      setSyncMessage(
        `Pushed ${result.pushed}, pulled ${result.pulled}, replayed ${result.replayed} inbox event(s).`,
      );
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="island-kicker mb-2">Observability</p>
          <h1 className="display-title text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Events
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inspect the local outbox and inbox event log.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => void handleManualSync()}
          disabled={syncing}
          className="shrink-0"
        >
          {syncing ? <Spinner className="size-4" /> : <RefreshCw className="size-4" />}
          Sync now
        </Button>
      </div>

      {syncMessage ? <p className="-mt-4 mb-6 text-sm text-muted-foreground">{syncMessage}</p> : null}

      <Tabs value={tab} onValueChange={(value) => setTab(value as EventTab)}>
        <TabsList>
          <TabsTrigger value="outbox">Outbox</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        <Activity mode={tab === "outbox" ? "visible" : "hidden"}>
          <OutboxList />
        </Activity>
        <Activity mode={tab === "inbox" ? "visible" : "hidden"}>
          <InboxList />
        </Activity>
      </div>
    </section>
  );
}
