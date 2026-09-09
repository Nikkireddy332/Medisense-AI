import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRobot, FaPaperPlane, FaUser, FaLightbulb, FaStethoscope, FaAmbulance, FaHospital, FaPills } from 'react-icons/fa';
import { aiService } from '../../api';

export default function Chatbot() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your MediSense AI Healthcare Assistant. How can I help you find specialists, analyze symptoms, or locate nearby medical centers today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'Check my symptoms',
    'Find Cardiologist near me',
    'Emergency care & ambulances',
    'Nearby 24/7 pharmacies'
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessageText = async (textToSend) => {
    if (!textToSend || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.chatWithAI(textToSend);
      const aiResponse = response.response || response.data?.response || response.data?.reply || 'I am processing your healthcare query.';
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);

      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-page pb-5">
      <div className="bg-gradient-primary text-white rounded-4 p-4 mb-4 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 bg-white text-primary rounded-circle">
            <FaRobot className="fs-2" />
          </div>
          <div>
            <h3 className="fw-bold mb-1">AI Healthcare Chatbot Assistant</h3>
            <p className="lead opacity-90 mb-0 small">Ask questions about medical conditions, recommended specialists, emergency tips, or hospital guidance.</p>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-lg glass-card rounded-4 p-4">
        {/* Chat Messages Body */}
        <div className="chat-messages p-3 rounded-4 bg-light mb-4" style={{ height: '420px', overflowY: 'auto' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`p-3 rounded-4 shadow-sm max-w-xl ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-white text-dark border border-secondary-subtle rounded-bl-none'
              }`}>
                <div className="d-flex align-items-center gap-2 mb-1 opacity-75 small">
                  {msg.role === 'user' ? (
                    <>
                      <FaUser className="small" /> <span>You</span>
                    </>
                  ) : (
                    <>
                      <FaRobot className="text-primary small" /> <span className="fw-bold text-primary">MediSense AI</span>
                    </>
                  )}
                </div>
                <div className="lh-base">{msg.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="p-3 rounded-4 bg-white border border-secondary-subtle shadow-sm d-flex align-items-center gap-2">
                <span className="spinner-border spinner-border-sm text-primary" role="status" />
                <span className="small text-muted">Analyzing medical query...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mb-3">
          <span className="small fw-bold text-muted d-block mb-2 d-flex align-items-center gap-1">
            <FaLightbulb className="text-warning" /> Suggested Questions & Actions
          </span>
          <div className="d-flex flex-wrap gap-2">
            {suggestions.map((sug, i) => (
              <button 
                key={i}
                onClick={() => sendMessageText(sug)}
                className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 bg-white"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="input-group">
          <input 
            type="text" 
            className="form-control form-control-lg rounded-start-4 border-end-0 bg-light p-3" 
            placeholder="Ask AI anything about symptoms, specialists, or health tips..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessageText(input)}
            disabled={isLoading}
          />
          <button 
            className="btn btn-primary px-4 rounded-end-4 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center"
            onClick={() => sendMessageText(input)}
            disabled={isLoading}
          >
            <FaPaperPlane className="fs-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
