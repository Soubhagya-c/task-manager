let setRefreshing: ((v: boolean) => void) | null = null;

export const registerLoadingSetter = (fn: (v: boolean) => void) => {
  setRefreshing = fn;
};

export const getGlobalLoadingSetter = () => setRefreshing;
