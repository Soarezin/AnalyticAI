import { create } from "zustand";
import client from "../api/client.js";

const initialState = {
  document: null,
  loading: false,
  selectedIssueId: null
};

const useAnalysisStore = create((set, get) => ({
  ...initialState,
  async fetchDocument(documentId) {
    set({ loading: true });
    try {
      const { data } = await client.get(`/documents/${documentId}`);
      set({ document: data, selectedIssueId: data?.analysis?.issues?.[0]?.id ?? null });
    } catch (error) {
      console.error(error);
      set({ document: null });
    } finally {
      set({ loading: false });
    }
  },
  selectIssue(issueId) {
    set({ selectedIssueId: issueId });
  },
  clear() {
    set(initialState);
  }
}));

export default useAnalysisStore;
