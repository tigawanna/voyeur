import type { SavedMovieRef } from "#/types/movie";
import {
  BrowserCollectionCoordinator,
  createBrowserWASQLitePersistence,
  openBrowserWASQLiteOPFSDatabase,
  persistedCollectionOptions,
} from "@tanstack/browser-db-sqlite-persistence";
import { createCollection } from "@tanstack/db";
import { createEventSourcedDB } from "event-sourced-collection";
import { createBrowserPlatform } from "event-sourced-collection/browser";

const platform = await createBrowserPlatform(
  {
    openBrowserWASQLiteOPFSDatabase,
    createBrowserWASQLitePersistence,
    BrowserCollectionCoordinator,
  },
  { databaseName: "voyeur.sqlite", coordinatorDbName: "voyeur" },
);

export const localLibraryDb = await createEventSourcedDB({
  persistence: platform.persistence,
  createCollection,
  persistedCollectionOptions,
  collections: {
    favorites: {
      getKey: (item: SavedMovieRef) => item.movieId,
    },
    watchlist: {
      getKey: (item: SavedMovieRef) => item.movieId,
    },
  },
});

export const favoritesCollection = localLibraryDb.collections.favorites;
export const watchlistCollection = localLibraryDb.collections.watchlist;

favoritesCollection.createIndex((row) => row.movieId);
watchlistCollection.createIndex((row) => row.movieId);
