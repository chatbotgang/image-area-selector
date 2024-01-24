import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore,
} from "react";
import { RectInfo } from "../components/PreviewImg";

export enum Dir {
  TOP = "TOP",
  RIGHT = "RIGHT",
  BOTTOM = "BOTTOM",
  LEFT = "LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
  TOP_LEFT = "TOP_LEFT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
}

export interface Store {
  imgUrl: string | null;
  rects: RectInfo[];
  resizingInfo: {
    trigger: boolean;
    id: number | null;
    dir: Dir | null;
  };
}

export const useStoreData = () => {
  const store = useRef<Store>({
    imgUrl: null,
    rects: [],
    resizingInfo: {
      trigger: false,
      id: null,
      dir: null,
    },
  });
  const get = useCallback(() => store.current, []);

  const subscribers = useRef<Set<() => void>>(new Set());

  const set = useCallback((value: Partial<Store>) => {
    store.current = { ...store.current, ...value };
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  return {
    get,
    set,
    subscribe,
  };
};

export const StoreContext = createContext<{
  get: () => Store;
  set: (value: Partial<Store>) => void;
  subscribe: (callback: () => void) => () => void;
} | null>(null);

export const useStore = <T>(
  selector: (store: Store) => T,
): [T, (value: Partial<Store>) => void] => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("no store");
  }

  const state = useSyncExternalStore(store.subscribe, () =>
    selector(store.get()),
  );
  return [state, store.set];
};
