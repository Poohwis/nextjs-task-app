import { create } from "zustand";

type CurrentWorkspaceStore = {
  openedId: string;
  setOpenId: (id: string) => void;
  clear: () => void;
};

type SortType = { type: string; title: string; order: "asc" | "desc" };
type WorkspaceSortByStore = {
  sortBy: SortType;
  setSortBy: (option: SortType) => void;
};

export const useCurrentWorkspaceStore = create<CurrentWorkspaceStore>(
  (set) => ({
    openedId: "",
    setOpenId: (id) => set({ openedId: id }),
    clear: () => set({ openedId: "" }),
  })
);

export const SORTOPTION: SortType[] = [
  { type: "updatedAt", title: "Most recently active", order: "asc" },
  { type: "updatedAt", title: "Least recently active", order: "desc" },
  { type: "name", title: "Alphabetically A - Z", order: "asc" },
  { type: "name", title: "Alphabetically Z - A", order: "desc" },
];

export const useWorkspaceSortByStore = create<WorkspaceSortByStore>((set) => ({
  sortBy: SORTOPTION[0],
  setSortBy: (option) => set({ sortBy: option }),
}));
