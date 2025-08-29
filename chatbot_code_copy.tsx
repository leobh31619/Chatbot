
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

// This is a copy of the chatbot code from src/pages/Index.tsx
// It is saved here for sharing purposes and is not actively used in the project.

const ChatbotCodeCopy = () => {

  // Part 1: JavaScript Logic (useEffect hook)
  useEffect(() => {
    // Add chat integration functions to window
    (window as any).chatInitialized = false;
    
    (window as any).initializeChat = function() {
      if ((window as any).chatInitialized) return;
      
      const chatContainer = document.getElementById('chat-interface');
      const webhookUrl = 'https://n8n.automacao-n8n.online/webhook/estetica';
      
      if (chatContainer) {
        chatContainer.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div><p class="mt-4 text-muted-foreground">Carregando consultoria...</p></div>';
        
        fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'start',
            timestamp: new Date().toISOString()
          }),
        })
        .then(async (response) => {
          try {
            const data = await response.json();
            (window as any).displayChatMessage(data);
          } catch (error) {
            // Se não conseguir fazer parse da resposta, mostrar interface padrão
            console.log('Webhook response could not be parsed, using default interface');
            if (chatContainer) {
              chatContainer.innerHTML = `
                <div class="space-y-6">
                  <div class="bg-primary/5 rounded-2xl p-6">
                    <p class="text-lg font-medium mb-4">👋 Olá! Como posso ajudá-lo hoje?</p>
                    <div class="space-y-2">
                      <button onclick="window.selectOption('agendar')" class="w-full text-left p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                        📅 Agendar uma consulta
                      </button>
                      <button onclick="window.selectOption('tratamentos')" class="w-full text-left p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                        💆‍♀️ Informações sobre tratamentos
                      </button>
                      <button onclick="window.selectOption('duvidas')" class="w-full text-left p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                        ❓ Dúvidas gerais
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }
          }
          (window as any).showMessageInput();
          (window as any).chatInitialized = true;
        })
        .catch(error => {
          console.error('Error connecting to webhook:', error);
          if (chatContainer) {
            chatContainer.innerHTML = `
              <div class="text-center py-8">
                <div class="text-orange-500 mb-4">⚠️ Conexão com o webhook perdida</div>
                <p class="text-muted-foreground mb-4">Não foi possível conectar com o sistema de IA. Você ainda pode usar o chat em modo offline.</p>
                <div class="space-y-2">
                  <button onclick="window.selectOption('agendar')" class="w-full text-left p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                    📅 Agendar uma consulta
                  </button>
                  <button onclick="window.selectOption('tratamentos')" class="w-full text-left p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                    💆‍♀️ Informações sobre tratamentos
                  </button>
                </div>
              </div>
            `;
          }
          (window as any).showMessageInput();
        });
      }
    };
    
    (window as any).displayChatMessage = function(data: any) {
      const chatContainer = document.getElementById('chat-interface');
      
      if (data.message && chatContainer) {
        chatContainer.innerHTML = `
          <div class="space-y-6">
            <div class="bg-primary/5 rounded-2xl p-6">
              <p class="text-lg font-medium mb-4">${data.message}</p>
              ${data.options ? (window as any).createOptionsHTML(data.options) : ''}
            </div>
          </div>
        `;
      }
    };
    
    (window as any).createOptionsHTML = function(options: any[]) {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          ${options.map(option => `
            <button 
              class="bg-white border-2 border-primary/20 hover:border-primary hover:bg-primary/5 rounded-2xl p-4 text-left transition-all"
              onclick="selectOption('${option.value}')"
            >
              <h4 class="font-semibold mb-2">${option.title}</h4>
              <p class="text-sm text-muted-foreground">${option.description}</p>
            </button>
          `).join('')}
        </div>
      `;
    };
    
    (window as any).selectOption = function(value: string) {
      const webhookUrl = 'https://n8n.automacao-n8n.online/webhook/estetica';
      
      // Adicionar mensagem do usuário
      (window as any).addMessageToChat(`Selecionei: ${value}`, 'user');
      
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'select',
          value: value,
          timestamp: new Date().toISOString()
        }),
      })
      .then(async (response) => {
        try {
          const contentType = response.headers.get('content-type') || '';
          const text = await response.text().catch(() => '');
          if (text && contentType.includes('application/json')) {
            const data = JSON.parse(text);
            if (data.message) {
              (window as any).addMessageToChat(data.message, 'bot');
            } else {
              (window as any).displayChatMessage(data);
            }
          } else if (text) {
            (window as any).addMessageToChat(text, 'bot');
          } else {
            throw new Error('Empty response from webhook');
          }
        } catch (error) {
          console.log('Could not parse webhook response for option selection:', error);
          // Resposta simulada baseada na opção selecionada
          let responseMessage = '';
          switch(value) {
            case 'agendar':
              responseMessage = 'Ótima escolha! Para agendar sua consulta, posso te ajudar. Qual seria o melhor horário para você?';
              break;
            case 'tratamentos':
              responseMessage = 'Temos diversos tratamentos disponíveis: faciais, corporais e com laser. Sobre qual você gostaria de saber mais?';
              break;
            case 'duvidas':
              responseMessage = 'Estou aqui para esclarecer suas dúvidas! O que você gostaria de saber sobre nossos serviços?';
              break;
            default:
              responseMessage = 'Obrigada pela sua escolha! Como posso te ajudar especificamente?';
          }
          (window as any).addMessageToChat(responseMessage, 'bot');
        }
      })
      .catch(error => {
        console.error('Error sending option to webhook:', error);
        (window as any).addMessageToChat('Opção registrada. No momento estamos com problemas de conexão, mas posso te ajudar!', 'system');
      });
    };

    (window as any).showMessageInput = function() {
      const inputContainer = document.getElementById('message-input-container');
      const messagesContainer = document.getElementById('chat-messages');
      
      if (inputContainer) {
        inputContainer.classList.remove('hidden');
      }
      if (messagesContainer) {
        messagesContainer.classList.remove('hidden');
      }
    };

    (window as any).sendMessage = function() {
      const input = document.getElementById('message-input') as HTMLInputElement;
      const message = input?.value?.trim();
      
      if (!message) return;
      
      // Add user message to chat
      (window as any).addMessageToChat(message, 'user');
      input.value = '';
      
      // Send to n8n with intelligent fallback
      (window as any).sendMessageToN8N(message);
    };

    (window as any).sendMessageToN8N = async function(userMessage: string) {
      const webhookUrl = 'https://n8n.automacao-n8n.online/webhook/estetica';
      
      // Show processing indicator
      (window as any).showProcessingIndicator(true);
      
      // Log para debug
      console.log('Enviando para webhook:', webhookUrl, {
        action: 'message',
        message: userMessage,
        timestamp: new Date().toISOString()
      });
      
      try {
        const payload = {
          action: 'message',
          message: userMessage,
          timestamp: new Date().toISOString(),
        };

        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const contentType = response.headers.get('content-type') || '';
          const text = await response.text().catch(() => '');

          if (text && contentType.includes('application/json')) {
            try {
              const data = JSON.parse(text);
              const reply = data.output || data.reply || data.message || data.response || data.text;
              if (reply) {
                (window as any).addMessageToChat(reply, 'bot');
              } else {
                (window as any).addMessageToChat((window as any).getIntelligentFallback(userMessage), 'bot');
              }
            } catch (e) {
              (window as any).addMessageToChat((window as any).getIntelligentFallback(userMessage), 'bot');
            }
          } else if (text) {
            (window as any).addMessageToChat(text, 'bot');
          } else {
            (window as any).addMessageToChat((window as any).getIntelligentFallback(userMessage), 'bot');
          }
        } catch (err) {
          console.error('Error sending message to webhook:', err);
          // Retry silently with no-cors (request may succeed but response is opaque)
          try {
            await fetch(webhookUrl, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } catch {}

          setTimeout(() => {
            (window as any).addMessageToChat((window as any).getIntelligentFallback(userMessage), 'bot');
          }, 800);
        }
      } catch (error) {
        console.error('Error sending message to webhook:', error);
        const fallbackResponse = (window as any).getIntelligentFallback(userMessage);
        setTimeout(() => {
          (window as any).addMessageToChat(fallbackResponse, 'bot');
        }, 1000);
      } finally {
        (window as any).showProcessingIndicator(false);
      }
    };

    (window as any).showProcessingIndicator = function(show: boolean) {
      if (show) {
        (window as any).addMessageToChat('Nossa IA está processando...', 'system');
      }
    };

    (window as any).getIntelligentFallback = function(userMessage: string) {
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custa')) {
        return 'Nossos valores variam conforme o tratamento escolhido. O ideal é agendar uma avaliação para um orçamento preciso. Gostaria de agendar?';
      } else if (lowerMessage.includes('agendar') || lowerMessage.includes('consulta') || lowerMessage.includes('marcar')) {
        return 'Vou te ajudar a agendar! Qual tratamento te interessa e qual seria o melhor horário para você?';
      } else if (lowerMessage.includes('tratamento') || lowerMessage.includes('facial') || lowerMessage.includes('laser') || lowerMessage.includes('corporal')) {
        return 'Temos excelentes opções de tratamentos! Você está interessada em tratamentos faciais, corporais ou com laser?';
      } else if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('hello')) {
        return 'Olá! É um prazer falar com você. Como posso ajudá-la hoje?';
      } else if (lowerMessage.includes('horário') || lowerMessage.includes('funcionamento') || lowerMessage.includes('aberto')) {
        return 'Funcionamos de segunda a sexta das 9h às 18h e sábados das 9h às 14h. Posso agendar um horário que seja conveniente para você!';
      } else if (lowerMessage.includes('localização') || lowerMessage.includes('endereço') || lowerMessage.includes('onde')) {
        return 'Estamos localizados em um ambiente acolhedor e moderno. Entre em contato para mais informações sobre nossa localização e como chegar!';
      } else {
        return 'Parece que estamos com instabilidade na conexão no momento. Por favor, tente novamente em alguns instantes ou entre em contato pelo nosso WhatsApp.';
      }
    };

    (window as any).addMessageToChat = function(message: string, sender: 'user' | 'bot' | 'system') {
      const messagesContainer = document.getElementById('chat-messages');
      
      if (!messagesContainer) return;
      
      const messageElement = document.createElement('div');
      const timestamp = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      if (sender === 'user') {
        messageElement.innerHTML = `
          <div class="flex justify-end">
            <div class="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
              <p class="text-sm">${message}</p>
              <span class="text-xs opacity-70 mt-1 block">${timestamp}</span>
            </div>
          </div>
        `;
      } else if (sender === 'bot') {
        messageElement.innerHTML = `
          <div class="flex justify-start">
            <div class="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
              <p class="text-sm">${message}</p>
              <span class="text-xs text-muted-foreground mt-1 block">${timestamp}</span>
            </div>
          </div>
        `;
      } else {
        messageElement.innerHTML = `
          <div class="flex justify-center">
            <div class="text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
              ${message}
            </div>
          </div>
        `;
      }
      
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
  }, []);


  // Part 2: JSX Interface
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-semibold mb-4">Descubra seu Tratamento Ideal</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa consultoria inteligente personalizada vai te ajudar a encontrar o tratamento perfeito para suas necessidades
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl shadow-soft p-8 md:p-12">
            <div id="n8n-chat-container" className="min-h-[500px]">
              {/* N8N Chat Integration */}
              <div id="chat-interface" className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold mb-4">Vamos começar sua jornada!</h3>
                  <p className="text-muted-foreground mb-8">
                    Responda algumas perguntas para descobrirmos o tratamento ideal para você
                  </p>
                  <button 
                    id="start-consultation" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-semibold transition-all hover:shadow-lg"
                    onClick={() => (window as any).initializeChat()}
                  >
                    Iniciar Consultoria
                  </button>
                </div>
              </div>
              
              {/* Chat Messages Container */}
              <div id="chat-messages" className="hidden space-y-4 max-h-96 overflow-y-auto"></div>
              
              {/* Message Input */}
              <div id="message-input-container" className="hidden">
                <div className="flex gap-3 mt-6">
                  <input 
                    id="message-input"
                    type="text" 
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    onKeyPress={(e) => e.key === 'Enter' && (window as any).sendMessage()}
                  />
                  <button 
                    id="send-button"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl font-semibold transition-all hover:shadow-lg"
                    onClick={() => (window as any).sendMessage()}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotCodeCopy;
