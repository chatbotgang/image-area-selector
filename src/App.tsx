import { BrowserRouter } from "react-router-dom";
import { StoreContext, useStoreData } from "./hooks/store";
import RouteConf from "./RouteConf";

export function App() {
  const store = useStoreData();
  return (
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        <RouteConf />
      </BrowserRouter>
    </StoreContext.Provider>
  );
}
