import NormalMonsterImg from "../assets/normal_monster.png";
import EliteMonsterImg from "../assets/elite_monster.png";
import useImage from "use-image";

export const useMonsterImg = () => {
  const [normalMonsterImg] = useImage(NormalMonsterImg);
  const [eliteMonsterImg] = useImage(EliteMonsterImg);
  const assetMap = {
    NORMAL: normalMonsterImg,
    ELITE: eliteMonsterImg,
  };
  return assetMap;
};
