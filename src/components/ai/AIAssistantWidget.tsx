import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Calendar,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ArrowRight,
  Bot
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { buildWhatsAppLink } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionLink?: {
    label: string;
    to?: string;
    href?: string;
  };
}

export const AIAssistantWidget: React.FC = () => {
  const { aiSettings, settings, services } = useStudio();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(aiSettings.voice_enabled ?? true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize welcome message
  useEffect(() => {
    const welcome = aiSettings.welcome_message || 
      'வணக்கம்! Welcome to Nithya Studio & Video. I am your studio AI assistant. How may I help you with your wedding photography, videography, or booking in Karapattu?';
    
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Wedding Photography Packages',
          'Studio Location in Karapattu',
          'How to Book a Date?',
          'Do you provide Drone shoot?'
        ]
      }
    ]);
  }, [aiSettings.welcome_message]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Web Speech API - Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English, also catches Tamil words

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Automatically send after voice capture
        handleSendQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Text-to-speech speaker
  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop ongoing speech
    // Strip action labels or markdown asterisks for natural voice
    const cleanText = text.replace(/[*_#`]/g, '').replace(/http\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick English or Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes('en-IN') || v.lang.includes('ta') || v.lang.includes('en-GB')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Local Intelligent Knowledge Responder (fallback or instant)
  const getLocalKnowledgeResponse = (query: string): { text: string; actionLink?: { label: string; to?: string; href?: string } } => {
    const q = query.toLowerCase();

    if (q.includes('price') || q.includes('cost') || q.includes('package') || q.includes('rate') || q.includes('vilai') || q.includes('kattanam')) {
      return {
        text: `At Nithya Studio & Video, our packages are customized based on your ceremony scale (Traditional + Candid Photography, 4K Cinematic Video, Drone Coverage, and Premium Layflat Canvera Albums). Wedding packages typically range from ₹35,000 for intimate functions up to ₹1,50,000+ for multi-day royal wedding films. Contact our studio directly for custom quote!`,
        actionLink: { label: 'Book Consultation / Get Quote', to: '/booking' }
      };
    }

    if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('karapattu') || q.includes('uthangarai') || q.includes('place')) {
      return {
        text: `Nithya Studio & Video is located at 99, Karapattu Village & Post, Uthangarai Taluk, Krishnagiri District, Tamil Nadu 635306. We serve couples and families across Uthangarai, Krishnagiri, Harur, Dharmapuri, Salem, and destination weddings all over South India!`,
        actionLink: { label: 'View Location Map & Contact', to: '/contact' }
      };
    }

    if (q.includes('book') || q.includes('reserve') || q.includes('date') || q.includes('availability') || q.includes('slot')) {
      return {
        text: `You can easily book your event date online through our website booking portal! Once submitted, our team locks your slot and contacts you to confirm the schedule and advance reservation.`,
        actionLink: { label: 'Check Date & Book Now', to: '/booking' }
      };
    }

    if (q.includes('drone') || q.includes('aerial') || q.includes('4k') || q.includes('cinematic') || q.includes('film') || q.includes('video')) {
      return {
        text: `Yes! We specialize in cinematic 4K video coverage, gimbal stabilization, high-definition audio recording for sacred mantras, and licensed 4K aerial drone videography to capture breathtaking perspectives of your wedding procession and venue.`,
        actionLink: { label: 'Explore Wedding Videography', to: '/wedding-videography' }
      };
    }

    if (q.includes('album') || q.includes('book') || q.includes('sheet') || q.includes('print') || q.includes('layflat')) {
      return {
        text: `All our wedding collections include luxury layflat albums printed on archival, waterproof, non-tearable photographic sheets with custom velvet/leatherette embossed presentation cases and mini parental pocket albums.`,
        actionLink: { label: 'View Our Portfolio', to: '/portfolio' }
      };
    }

    if (q.includes('pre-wedding') || q.includes('pre wedding') || q.includes('outdoor') || q.includes('couple') || q.includes('post-wedding')) {
      return {
        text: `We offer scenic pre-wedding and post-wedding outdoor couple shoots across picturesque hills, lakes, heritage temples, and modern resort backdrops with dramatic lighting, drone aerial shots, and romantic teaser reels.`,
        actionLink: { label: 'View Pre-Wedding Shoots', to: '/pre-wedding-photography' }
      };
    }

    if (q.includes('phone') || q.includes('contact') || q.includes('call') || q.includes('whatsapp') || q.includes('number')) {
      return {
        text: `You can reach Nithya Studio directly at ${settings.phone} or chat instantly on WhatsApp for immediate assistance. Our studio hours are 9:00 AM to 9:00 PM, all 7 days of the week.`,
        actionLink: { label: 'Chat on WhatsApp', href: buildWhatsAppLink('Hello Nithya Studio, I spoke with your AI Assistant and would like more details.') }
      };
    }

    // Default polite studio response
    return {
      text: `Nithya Studio & Video in Karapattu offers complete luxury wedding photography, 4K cinematic wedding films, pre-wedding sessions, drone aerials, and family portraits. Would you like to check date availability, see package details, or chat directly with our photographer?`,
      actionLink: { label: 'Enquire for Your Event', to: '/booking' }
    };
  };

  const handleSendQuery = async (queryToSend?: string) => {
    const query = (queryToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiKey = aiSettings.gemini_api_key || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      const model = aiSettings.model_name || 'gemini-1.5-flash';

      let replyText = '';
      let replyAction: { label: string; to?: string; href?: string } | undefined;

      if (apiKey && apiKey.trim().length > 5) {
        // Call Google Gemini API
        const systemInstruction = aiSettings.system_prompt || `You are the friendly AI Studio Concierge for "Nithya Studio & Video" located in Karapattu, Tamil Nadu (Phone: ${settings.phone}). Specializes in Luxury Wedding Photography, 4K Cinematic Films, Pre-wedding shoots, and Canvera layflat albums. Answer concisely, warmly, and helpfully in English or Tamil. Guide users to book via the website or WhatsApp.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: `${systemInstruction}\n\nVisitor Question: ${query}` }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const json = await response.json();
          replyText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      }

      // If Gemini returned empty or no API key, fallback to local knowledge
      if (!replyText) {
        const local = getLocalKnowledgeResponse(query);
        replyText = local.text;
        replyAction = local.actionLink;
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: replyAction || { label: 'Check Date & Book', to: '/booking' }
      };

      setMessages((prev) => [...prev, botMessage]);

      if (voiceEnabled) {
        speakText(replyText);
      }
    } catch (e) {
      const fallback = getLocalKnowledgeResponse(query);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: fallback.actionLink
      };
      setMessages((prev) => [...prev, botMessage]);
      if (voiceEnabled) speakText(fallback.text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendQuery(suggestion);
  };

  return (
    <>
      {/* Floating Studio AI Trigger Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full border transition-all duration-300 shadow-2xl ${
            isOpen
              ? 'bg-gold-500 text-studio-black border-gold-400 font-bold scale-105'
              : 'bg-studio-dark/95 backdrop-blur-md border-gold-500/50 text-gold-400 hover:border-gold-400 hover:scale-105 hover:shadow-gold-glow'
          }`}
          aria-label="Speak with Nithya Studio AI Assistant"
        >
          {/* Subtle pulsating glow effect */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-gold-400/20 animate-pulse pointer-events-none" />
          )}

          <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 group-hover:text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold tracking-wide">
              {isOpen ? 'Close Assistant' : 'Studio AI Concierge'}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-studio-muted font-medium -mt-0.5">
              Speak or Ask in Tamil / Eng
            </span>
          </div>
        </button>
      </div>

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm h-[520px] max-h-[75vh] flex flex-col bg-studio-dark/95 backdrop-blur-xl border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="p-4 bg-studio-card/90 border-b border-studio-border/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 p-[1.5px] shadow-gold-glow-sm">
                <div className="w-full h-full bg-studio-black rounded-[9px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gold-400" />
                </div>
              </div>
              <div>
                <h3 className="font-cinzel text-xs font-bold text-studio-light flex items-center gap-1.5">
                  <span>Nithya Studio AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                </h3>
                <p className="text-[10px] text-gold-400">Karapattu • 24/7 Digital Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Readout Toggle */}
              <button
                onClick={() => {
                  const next = !voiceEnabled;
                  setVoiceEnabled(next);
                  if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  voiceEnabled
                    ? 'bg-gold-500/10 text-gold-400 border-gold-500/40'
                    : 'bg-studio-surface text-studio-muted border-studio-border'
                }`}
                title={voiceEnabled ? 'Mute Voice Responses' : 'Enable Voice Audio'}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                }}
                className="p-1.5 rounded-lg text-studio-muted hover:text-white hover:bg-studio-surface"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      isAssistant
                        ? 'bg-studio-card border border-studio-border/80 text-studio-light rounded-tl-sm'
                        : 'bg-gold-500/20 border border-gold-500/40 text-gold-100 rounded-tr-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs">{msg.text}</p>

                    {/* Action link if available */}
                    {msg.actionLink && (
                      <div className="mt-2.5 pt-2 border-t border-studio-border/50">
                        {msg.actionLink.to ? (
                          <Link
                            to={msg.actionLink.to}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold-400 hover:text-gold-300 underline"
                          >
                            <span>{msg.actionLink.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : msg.actionLink.href ? (
                          <a
                            href={msg.actionLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
                          >
                            <span>{msg.actionLink.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-studio-muted/70 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggestion pills under assistant message */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(sug)}
                          className="px-2.5 py-1 rounded-full bg-studio-surface border border-gold-500/30 text-[10px] text-studio-light/90 hover:border-gold-500 hover:text-gold-400 transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gold-400 bg-studio-card border border-studio-border/80 px-3 py-2 rounded-2xl w-fit">
                <div className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                <span className="text-[11px]">Nithya Studio AI is preparing reply...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Bar */}
          {isListening && (
            <div className="bg-rose-950/70 border-t border-rose-500/30 px-3 py-1.5 flex items-center justify-between text-[11px] text-rose-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>Listening... speak in Tamil or English now</span>
              </div>
              <button
                onClick={toggleListening}
                className="text-rose-400 hover:underline font-semibold"
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-studio-card/90 border-t border-studio-border/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-studio-surface text-studio-muted border-studio-border hover:text-gold-400 hover:border-gold-500/50'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak with Microphone'}
                aria-label="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about dates, pricing, video..."
                className="flex-1 bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-xs text-studio-light placeholder-studio-muted/70 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gold-500 text-studio-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-400 transition-all shadow-gold-glow-sm"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
