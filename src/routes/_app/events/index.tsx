import { AppConfig } from "#/utils/system";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader } from "lucide-react";

const EventsView = lazy(() =>
  import("./-components/EventsView").then((mod) => ({ default: mod.EventsView })),
);

export const Route = createFileRoute("/_app/events/")({
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Events` }],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <Suspense fallback={<Loader className="mx-auto mt-16 size-8 animate-spin" />}>
      <EventsView />
    </Suspense>
  );
}
