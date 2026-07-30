import { useEffect, useRef, useState } from 'react';

const START_TIME = 20;

export default function MusicToggle() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = START_TIME;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay bloqueado por el navegador (esperado en la mayoría de móviles):
        // se queda en estado "pausado / toca para reproducir", sin error visible.
      });
  }, []);

  const handleEnded = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = START_TIME;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setHasError(true));
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/song.mp3"
        preload="none"
        onEnded={handleEnded}
        onError={() => setHasError(true)}
      />
      <button
        type="button"
        onClick={toggle}
        disabled={hasError}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        aria-pressed={isPlaying}
        title={hasError ? 'Música no disponible' : undefined}
        className="fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bone shadow-lg transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-30 sm:right-8 sm:top-8"
      >
        {isPlaying ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M8 5v14M16 5v14" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>
    </>
  );
}
