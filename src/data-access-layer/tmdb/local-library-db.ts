import type { EventSourcedDB } from "event-sourced-collection";
import type { SavedMovieRef } from "#/types/movie";

type LocalLibraryCollectionDefs = {
  favorites: { getKey: (item: SavedMovieRef) => number };
  watchlist: { getKey: (item: SavedMovieRef) => number };
};

export type LocalLibraryDb = EventSourcedDB<LocalLibraryCollectionDefs>;

let dbInstance: LocalLibraryDb | null = null;
let initPromise: Promise<LocalLibraryDb> | null = null;

async function initDb(): Promise<LocalLibraryDb> {
  const { createCollection } = await import("@tanstack/react-db");
  const {
    BrowserCollectionCoordinator,
    createBrowserWASQLitePersistence,
    openBrowserWASQLiteOPFSDatabase,
    persistedCollectionOptions,
  } = await import("@tanstack/browser-db-sqlite-persistence");
  const { createEventSourcedDB } = await import("event-sourced-collection");
  const { createBrowserPlatform } = await import("event-sourced-collection/browser");

  const platform = await createBrowserPlatform(
    {
      openBrowserWASQLiteOPFSDatabase,
      createBrowserWASQLitePersistence,
      BrowserCollectionCoordinator,
    },
    { databaseName: "voyeur.sqlite", coordinatorDbName: "voyeur" },
  );

  return createEventSourcedDB({
    persistence: platform.persistence,
    createCollection,
    persistedCollectionOptions,
    debug: import.meta.env.DEV,
    // sync:{
    //   pullEvents:(since) => {
       
    //   },
    //   pushEvents: async (events) => {
        
    //   },
    // },
    collections: {
      favorites: { getKey: (item: SavedMovieRef) => item.movieId },
      watchlist: { getKey: (item: SavedMovieRef) => item.movieId },
    },
  });
}

export async function ensureDb(): Promise<LocalLibraryDb> {
  if (typeof window === "undefined") {
    throw new Error("Local library DB is only available in the browser");
  }

  if (dbInstance) {
    return dbInstance;
  }

  if (!initPromise) {
    initPromise = initDb().then((instance) => {
      dbInstance = instance;
      return instance;
    });
  }

  return initPromise;
}

function getDb(): LocalLibraryDb {
  if (!dbInstance) {
    throw new Error("Local library database is not initialized. Call ensureDb() first.");
  }

  return dbInstance;
}

export const db = new Proxy({} as LocalLibraryDb, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
