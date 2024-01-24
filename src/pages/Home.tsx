import { FC } from "react";
import ImgUpload from "../components/ImgUpload";
import { useStore } from "../hooks/store";
import PreviewImg from "../components/PreviewImg";

const Home: FC = () => {
  const [previewer] = useStore((store) => store.imgUrl);
  return (
    <div className="pt-14 mx-auto">
      <ImgUpload />
      {previewer && <PreviewImg imgUrl={previewer} />}
    </div>
  );
};

export default Home;
