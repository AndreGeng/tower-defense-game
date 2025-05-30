import { useState, useEffect, useCallback } from "react";

export const useBackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => new Audio("/src/assets/music.mp3"));
  const [victoryAudio] = useState(() => new Audio("/src/assets/victory.mp3"));
  const [deathAudio] = useState(() => new Audio("/src/assets/death.mp3"));

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
      victoryAudio.pause();
      deathAudio.pause();
    };
  }, [audio, victoryAudio, deathAudio]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [audio, isPlaying]);

  const playVictory = useCallback(() => {
    if (!isPlaying) {
      return;
    }
    audio.pause();
    victoryAudio.play();
  }, [audio, victoryAudio, isPlaying]);

  const playDeath = useCallback(() => {
    if (!isPlaying) {
      return;
    }
    audio.pause();
    deathAudio.play();
  }, [audio, deathAudio, isPlaying]);

  return { isPlaying, toggleMusic, playVictory, playDeath };
};
