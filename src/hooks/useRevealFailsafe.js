import { useEffect } from 'react';
import { observeRevealFailsafe } from './revealFailsafe.js';

// Ver revealFailsafe.js para el porqué (setTimeout, no rAF/ticker). Este hook es solo
// el envoltorio para usar esa red de seguridad con un único ref/sección — cada
// componente decide, dentro de forceReveal, qué revisar antes de forzar algo.
export default function useRevealFailsafe(targetRef, forceReveal, delay) {
  useEffect(() => observeRevealFailsafe(targetRef.current, forceReveal, delay), [targetRef, forceReveal, delay]);
}
