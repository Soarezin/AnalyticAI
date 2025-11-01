import { create } from "zustand";
import client from "../api/client.js";

const initialState = {
  documents: [],
  total: 0,
  page: 1,
  pageSize: 12,
  query: "",
  collectionId: "",
  tagIds: [],
  order: "created_desc",
  loading: false,
  plan: null,
  remainingToday: null,
  collections: [],
  tags: []
};

const useLibraryStore = create((set, get) => ({
  ...initialState,
  setFilters(filters) {
    set((state) => ({ ...state, ...filters }));
  },
  async fetchDocuments(params = {}) {
    set({ loading: true });
    try {
      const { data } = await client.get("/documents", {
        params: {
          page: get().page,
          pageSize: get().pageSize,
          query: get().query,
          collectionId: get().collectionId || undefined,
          tagIds: get().tagIds?.join(",") || undefined,
          order: get().order,
          ...params
        }
      });
      set({
        documents: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        plan: data.meta?.plan ?? get().plan,
        remainingToday: data.meta?.remainingToday ?? get().remainingToday
      });
    } catch (error) {
      console.error(error);
      set({ documents: [], total: 0 });
    } finally {
      set({ loading: false });
    }
  },
  async fetchCollections() {
    try {
      const { data } = await client.get("/collections");
      set({ collections: data });
    } catch (error) {
      console.error(error);
    }
  },
  async fetchTags() {
    try {
      const { data } = await client.get("/tags");
      set({ tags: data });
    } catch (error) {
      console.error(error);
    }
  },
  reset() {
    set(initialState);
  }
}));

export default useLibraryStore;
