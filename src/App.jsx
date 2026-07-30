import { useRef } from 'react';
import Hero from './components/Hero.jsx';
import IntroStory from './components/IntroStory.jsx';
import OurStory from './components/OurStory.jsx';
import TimelineLocations from './components/TimelineLocations.jsx';
import GodparentsSection from './components/GodparentsSection.jsx';
import Countdown from './components/Countdown.jsx';
import DressCode from './components/DressCode.jsx';
import GiftTable from './components/GiftTable.jsx';
import RsvpForm from './components/RsvpForm.jsx';
import MusicToggle from './components/MusicToggle.jsx';
import useWeddingAnimations from './hooks/useWeddingAnimations.js';

export default function App() {
  const mainRef = useRef(null);
  useWeddingAnimations(mainRef);

  return (
    <main ref={mainRef}>
      <MusicToggle />
      <Hero />
      <IntroStory />
      <OurStory />
      <TimelineLocations />
      <GodparentsSection />
      <Countdown />
      <DressCode />
      <GiftTable />
      <RsvpForm />
    </main>
  );
}
