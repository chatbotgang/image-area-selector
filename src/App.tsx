import ImgUpload from "./components/ImgUpload";
import NavBar from "./components/NavBar";
import { StoreContext, useStoreData } from "./hooks/store";

export function App() {
  const store = useStoreData();
  return (
    <StoreContext.Provider value={store}>
      <NavBar />
      <ImgUpload />
    </StoreContext.Provider>
  );
}
