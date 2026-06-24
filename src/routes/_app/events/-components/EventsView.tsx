import { Activity, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InboxList } from "./InboxList";
import { OutboxList } from "./OutboxList";

type EventTab = "outbox" | "inbox";

export function EventsView() {
  const [tab, setTab] = useState<EventTab>("outbox");

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="island-kicker mb-2">Observability</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Events
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inspect the local outbox and inbox event log.
        </p>
      </div>

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
