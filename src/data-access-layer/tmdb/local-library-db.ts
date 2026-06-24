import { BasicIndex } from "@tanstack/db";
import { createBrowserEventSourcedDB } from "event-sourced-collection/browser";
import type { CollectionDef, EventSourcedDB } from "event-sourced-collection";
import { pullEvents, pushEvents } from "#/data-access-layer/sync/sync-transport";
import type { SavedMovieRef } from "#/types/movie";

type LocalLibraryCollectionDefs = {
  favorites: CollectionDef<SavedMovieRef, number>;
  watchlist: CollectionDef<SavedMovieRef, number>;
};

export type LocalLibraryDb = EventSourcedDB<LocalLibraryCollectionDefs>;

const { ensureDb, db } = createBrowserEventSourcedDB<LocalLibraryCollectionDefs>({
  databaseName: "voyeur.sqlite",
  coordinatorDbName: "voyeur",
  debug: import.meta.env.DEV,
  collections: {
    favorites: {
      getKey: (item: SavedMovieRef) => item.movieId,
      indexes: [{ select: (item: SavedMovieRef) => item.movieId, indexType: BasicIndex }],
    },
    watchlist: {
      getKey: (item: SavedMovieRef) => item.movieId,
      indexes: [{ select: (item: SavedMovieRef) => item.movieId, indexType: BasicIndex }],
    },
  },
  sync: { pushEvents, pullEvents },
  syncEnabled: false,
  load: async () => {
    const { createCollection } = await import("@tanstack/react-db");
    const {
      BrowserCollectionCoordinator,
      createBrowserWASQLitePersistence,
      openBrowserWASQLiteOPFSDatabase,
      persistedCollectionOptions,
    } = await import("@tanstack/browser-db-sqlite-persistence");

    return {
      openBrowserWASQLiteOPFSDatabase,
      createBrowserWASQLitePersistence,
      BrowserCollectionCoordinator,
      createCollection,
      persistedCollectionOptions,
    };
  },
});

export { db, ensureDb };
