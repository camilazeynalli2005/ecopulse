import { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, Radio, Volume2 } from "lucide-react";
import type { EcoLocation } from "@/data/ecopulse";

type SoundRig = { context: AudioContext; nodes: AudioScheduledSourceNode[]; master: GainNode; filters: BiquadFilterNode[] };

export default function AudioStoryPlayer({ location }: { location: EcoLocation }) {
  const [playing, setPlaying] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const rigRef = useRef<SoundRig | null>(null);

  const stopSound = () => {
    const rig = rigRef.current;
    if (!rig) return;
    rig.master.gain.setTargetAtTime(0, rig.context.currentTime, 0.16);
    window.setTimeout(() => {
      rig.nodes.forEach((node) => { try { node.stop(); } catch { /* already stopped */ } });
      void rig.context.close();
    }, 650);
    rigRef.current = null;
    setPlaying(false);
  };

  const startSound = async () => {
    if (rigRef.current) { stopSound(); return; }
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    if (context.state === "suspended") await context.resume();
    const master = context.createGain();
    master.gain.value = 0.0001;
    master.connect(context.destination);
    master.gain.setTargetAtTime(0.055, context.currentTime, 0.8);
    const nodes: AudioScheduledSourceNode[] = [];
    const filters: BiquadFilterNode[] = [];

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const channel = noiseBuffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) channel[i] = (Math.random() * 2 - 1) * 0.28;
    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = location.environment === "water" ? "lowpass" : "bandpass";
    filter.frequency.value = location.environment === "dry" ? 390 : location.environment === "water" ? 740 : 1150;
    filter.Q.value = 0.4;
    const noiseGain = context.createGain();
    noiseGain.gain.value = location.environment === "water" ? 0.23 : location.environment === "dry" ? 0.11 : 0.055;
    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start();
    nodes.push(noise);
    filters.push(filter);

    const baseFrequency = location.environment === "water" ? 174 : location.environment === "dry" ? 132 : 196;
    [1, 1.5, 2.01].forEach((multiple, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = baseFrequency * multiple;
      gain.gain.value = index === 0 ? 0.11 : 0.035;
      oscillator.connect(gain).connect(master);
      oscillator.start();
      nodes.push(oscillator);
    });

    if (location.environment === "forest") {
      for (let i = 0; i < 3; i += 1) {
        const chirp = context.createOscillator();
        const chirpGain = context.createGain();
        chirp.type = "sine";
        chirp.frequency.value = 1450 + i * 320;
        chirpGain.gain.value = 0;
        chirp.connect(chirpGain).connect(master);
        const start = context.currentTime + 0.3 + i * 0.9;
        chirpGain.gain.setValueAtTime(0, start);
        chirpGain.gain.linearRampToValueAtTime(0.045, start + 0.12);
        chirpGain.gain.linearRampToValueAtTime(0, start + 0.26);
        chirp.start(start);
        nodes.push(chirp);
      }
    }
    rigRef.current = { context, nodes, master, filters };
    setPlaying(true);
  };

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    rig.filters[0].type = location.environment === "water" ? "lowpass" : "bandpass";
    rig.filters[0].frequency.setTargetAtTime(location.environment === "dry" ? 390 : location.environment === "water" ? 740 : 1150, rig.context.currentTime, 0.25);
  }, [location.environment]);

  useEffect(() => () => {
    const rig = rigRef.current;
    if (rig) {
      rig.nodes.forEach((node) => { try { node.stop(); } catch { /* already stopped */ } });
      void rig.context.close();
    }
    window.speechSynthesis?.cancel();
  }, []);

  const speakStory = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(location.story);
    utterance.lang = "az-AZ";
    utterance.rate = 0.88;
    utterance.pitch = 0.94;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="audio-player-card">
      <div className="audio-art" aria-hidden="true">
        <div className={`audio-ripple ${playing ? "is-playing" : ""}`}><span /><span /><span /><Headphones size={25} strokeWidth={1.5} /></div>
        <div className="audio-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
      <div className="audio-content">
        <div className="audio-kicker"><Radio size={13} /> EKO-HEKAYƏ · {location.shortName.toLocaleUpperCase("az")}</div>
        <h3>{location.subtitle}</h3>
        <p>{location.story}</p>
        <div className="audio-actions">
          <button className="audio-play" type="button" onClick={() => void startSound()} aria-label={playing ? "Səs mənzərəsini dayandır" : "Demo səs mənzərəsini başlat"}>
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            <span>{playing ? "Dayandır" : "Səs mənzərəsini dinlə"}</span>
          </button>
          <button className="audio-speak" type="button" onClick={speakStory}>
            <Volume2 size={16} /> {speaking ? "Hekayəni dayandır" : "Hekayəni dinlə"}
          </button>
        </div>
        <div className="audio-disclaimer">Web Audio demo · Nümunə hekayə brauzer nitqi ilə oxunur</div>
      </div>
    </div>
  );
}
