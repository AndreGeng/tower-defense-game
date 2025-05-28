import NormalTowerImg from "../assets/normal_tower.png";
import SlowTowerImg from "../assets/slow_tower.png";
import useImage from "use-image";

export const useTowerImg = () => {
  const [normalTowerImg] = useImage(NormalTowerImg);
  const [slowTowerImg] = useImage(SlowTowerImg);
  const assetMap = {
    NORMAL: normalTowerImg,
    SLOW: slowTowerImg,
  };
  return assetMap;
};
