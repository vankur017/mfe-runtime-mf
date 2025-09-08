declare module "@mfeshared/store" {
  export interface SessionStoreState {
    hasRole: (role: string) => boolean;
    // add any other fields from your store here
  }

  export const useSessionStore: (
    selector: (state: SessionStoreState) => any
  ) => any;
}
