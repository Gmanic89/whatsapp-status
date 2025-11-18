// ========== CONFIGURACIÓN GLOBAL ==========
const BACKEND_URL = 'https://fortunabot-production.up.railway.app';

// ========== FUNCIONES DE DECODIFICACIÓN ==========
function d(s) {
  return atob(s);
}

const enc = {
  main: d('NTQy') + d('MjE0NDA3MzYz'), // 542214407363
  telegram: d('Zm9ydHVuYXdpbGQwMQ==') // fortunawild01
};

// ========== FUNCIONES AUXILIARES ==========
function getRandomWhatsAppURL(phone, message) {
  var encodedMessage = encodeURIComponent(message);
  var formats = [
    'https://wa.me/' + phone + '?text=' + encodedMessage,
    'https://api.whatsapp.com/send?phone=' + phone + '&text=' + encodedMessage,
    'https://api.whatsapp.com/send/?phone=' + phone + '&text=' + encodedMessage + '&app_absent=0'
  ];
  return formats[Math.floor(Math.random() * formats.length)];
}

// ========== CONTROL DE LÍMITE DE CLICKS ==========
function canUserClick() {
  var now = Date.now();
  var lastClick = localStorage.getItem('last_fwild_click');
  var firstClickTime = localStorage.getItem('fwild_first_click_time');
  var totalClicks = parseInt(localStorage.getItem('fwild_total_clicks') || '0');

  if (firstClickTime) {
    var timeElapsed = now - parseInt(firstClickTime);
    var thirtyMinutes = 30 * 60 * 1000;

    if (timeElapsed >= thirtyMinutes) {
      localStorage.removeItem('fwild_total_clicks');
      localStorage.removeItem('fwild_first_click_time');
      localStorage.removeItem('last_fwild_click');
      location.reload();
      return { allowed: false, reason: 'reload' };
    }
  }

  if (lastClick && now - parseInt(lastClick) < 3000) {
    return {
      allowed: false,
      reason: 'fast',
      message: 'Por favor espera unos segundos antes de intentar nuevamente'
    };
  }

  if (totalClicks >= 3) {
    var timeElapsed = now - parseInt(firstClickTime);
    var thirtyMinutes = 30 * 60 * 1000;
    var timeRemaining = thirtyMinutes - timeElapsed;
    var minutesRemaining = Math.ceil(timeRemaining / 60000);

    return {
      allowed: false,
      reason: 'limit',
      message: 'Has alcanzado el límite de 3 intentos. Podrás intentar nuevamente en ' + minutesRemaining + ' minutos.'
    };
  }

  if (totalClicks === 0) {
    localStorage.setItem('fwild_first_click_time', now.toString());
  }

  var newTotal = totalClicks + 1;
  localStorage.setItem('fwild_total_clicks', newTotal.toString());
  localStorage.setItem('last_fwild_click', now.toString());

  return { allowed: true, remaining: 3 - newTotal };
}

// ========== EVENT LISTENERS BOTONES PRINCIPALES ==========
document.getElementById('whatsappBtn').onclick = function () {
  var clickCheck = canUserClick();

  if (!clickCheck.allowed) {
    alert(clickCheck.message);
    if (clickCheck.reason === 'limit') {
      document.getElementById('whatsappBtn').style.opacity = '0.5';
      document.getElementById('whatsappBtn').style.cursor = 'not-allowed';
      document.getElementById('telegramBtn').style.opacity = '0.5';
      document.getElementById('telegramBtn').style.cursor = 'not-allowed';
    }
    return;
  }

  if (clickCheck.remaining !== undefined && clickCheck.remaining > 0) {
    console.log('Te quedan ' + clickCheck.remaining + ' intentos');
  }

  document.getElementById('loadingOverlay').classList.add('show');

  if (typeof gtag !== 'undefined') {
    gtag('event', 'whatsapp_support_click', {
      event_category: 'engagement',
      event_label: 'Fwild Support'
    });
  }

  var initialMessage = 'Hola! Quiero informacion 🎮';
  var waUrl = getRandomWhatsAppURL(enc.main, initialMessage);

  setTimeout(function () {
    window.location.href = waUrl;
    setTimeout(function () {
      document.getElementById('loadingOverlay').classList.remove('show');
    }, 2000);
  }, 800);
};

document.getElementById('telegramBtn').onclick = function () {
  var clickCheck = canUserClick();

  if (!clickCheck.allowed) {
    alert(clickCheck.message);
    if (clickCheck.reason === 'limit') {
      document.getElementById('whatsappBtn').style.opacity = '0.5';
      document.getElementById('whatsappBtn').style.cursor = 'not-allowed';
      document.getElementById('telegramBtn').style.opacity = '0.5';
      document.getElementById('telegramBtn').style.cursor = 'not-allowed';
    }
    return;
  }

  if (clickCheck.remaining !== undefined && clickCheck.remaining > 0) {
    console.log('Te quedan ' + clickCheck.remaining + ' intentos');
  }

  document.getElementById('loadingOverlay').classList.add('show');

  if (typeof gtag !== 'undefined') {
    gtag('event', 'telegram_clan_click', {
      event_category: 'engagement',
      event_label: 'Fwild Telegram'
    });
  }

  setTimeout(function () {
    window.location.href = 'https://t.me/' + enc.telegram;
    setTimeout(function () {
      document.getElementById('loadingOverlay').classList.remove('show');
    }, 2000);
  }, 800);
};

// ========== ANALYTICS ==========
if (typeof gtag !== 'undefined') {
  gtag('event', 'page_view', {
    event_category: 'engagement',
    event_label: 'fwild_community',
    page_title: 'Fwild Community'
  });
}

// ========== WINDOW ONLOAD ==========
window.onload = function () {
  var now = Date.now();
  var totalClicks = parseInt(localStorage.getItem('fwild_total_clicks') || '0');
  var firstClickTime = localStorage.getItem('fwild_first_click_time');

  if (firstClickTime) {
    var timeElapsed = now - parseInt(firstClickTime);
    var thirtyMinutes = 30 * 60 * 1000;

    if (timeElapsed >= thirtyMinutes && totalClicks > 0) {
      localStorage.removeItem('fwild_total_clicks');
      localStorage.removeItem('fwild_first_click_time');
      localStorage.removeItem('last_fwild_click');
      console.log('Límite reseteado automáticamente');
    }
  }

  var currentClicks = parseInt(localStorage.getItem('fwild_total_clicks') || '0');

  if (currentClicks >= 3) {
    var firstClick = localStorage.getItem('fwild_first_click_time');
    if (firstClick) {
      var timeElapsed = now - parseInt(firstClick);
      var thirtyMinutes = 30 * 60 * 1000;
      var timeRemaining = thirtyMinutes - timeElapsed;
      var minutesRemaining = Math.ceil(timeRemaining / 60000);

      document.getElementById('whatsappBtn').style.opacity = '0.5';
      document.getElementById('whatsappBtn').style.cursor = 'not-allowed';
      document.getElementById('telegramBtn').style.opacity = '0.5';
      document.getElementById('telegramBtn').style.cursor = 'not-allowed';

      document.querySelector('.info-text').textContent = '⏱️ Límite alcanzado. Espera ' + minutesRemaining + ' minutos';
      document.querySelector('.info-text').style.color = '#ffeb3b';
    }
  }
};

// ========================================
// CHAT WIDGET RESPONSIVE
// ========================================

var socket = null;
var username = null;
var sessionId = null;
var isReconnecting = false;
var isCheckingUsername = false;
var isMobile = window.innerWidth <= 768;
var isMinimized = false;

// Referencias a elementos del DOM
var chatButton = document.getElementById('chat-button');
var chatContainer = document.getElementById('chat-container');
var chatClose = document.getElementById('chat-close');
var chatHeader = document.getElementById('chat-header');
var registerForm = document.getElementById('register-form');
var usernameInput = document.getElementById('username-input');
var registerButton = document.getElementById('register-button');
var messagesArea = document.getElementById('messages-area');
var inputArea = document.getElementById('input-area');
var messageInput = document.getElementById('message-input');
var sendButton = document.getElementById('send-button');
var connectionStatus = document.getElementById('connection-status');
var typingIndicator = document.getElementById('typing-indicator');
var quickOptions = document.getElementById('quick-options');

// ========== DETECCIÓN DE TECLADO MÓVIL ==========
var originalHeight = window.innerHeight;

window.addEventListener('resize', function() {
  if (isMobile) {
    var currentHeight = window.innerHeight;
    
    // Si la altura se redujo más de 100px, el teclado está abierto
    if (originalHeight - currentHeight > 100) {
      chatContainer.classList.add('keyboard-open');
      console.log('📱 Teclado móvil abierto');
    } else {
      chatContainer.classList.remove('keyboard-open');
      console.log('📱 Teclado móvil cerrado');
    }
  }
});

// ========== FUNCIONES MOBILE ==========
function toggleChatMobile() {
  if (!isMobile) return;
  
  isMinimized = !isMinimized;
  
  if (isMinimized) {
    chatContainer.classList.add('minimized');
    chatButton.classList.add('show');
    console.log('📱 Chat minimizado');
  } else {
    chatContainer.classList.remove('minimized');
    chatButton.classList.remove('show');
    scrollToBottom();
    console.log('📱 Chat expandido');
  }
}

// ========== FUNCIONES DE SESIÓN ==========
function saveSession(user, session) {
  var sessionData = {
    username: user,
    sessionId: session,
    timestamp: Date.now()
  };
  localStorage.setItem('fwild_chat_session', JSON.stringify(sessionData));
  console.log('💾 Sesión guardada:', sessionData);
}

function loadSession() {
  var savedSession = localStorage.getItem('fwild_chat_session');
  if (!savedSession) return null;
  var sessionData = JSON.parse(savedSession);
  console.log('📂 Sesión cargada:', sessionData);
  return sessionData;
}

// ========== VALIDAR NOMBRE DE USUARIO ==========
function validateUsername(name, callback) {
  if (!socket || !socket.connected) {
    var tempSocket = io(BACKEND_URL + '/client', {
      transports: ['websocket', 'polling'],
      reconnection: false
    });

    tempSocket.on('connect', function () {
      console.log('🔌 Socket temporal conectado para validación');
      tempSocket.emit('check_username', { username: name });
    });

    tempSocket.on('username_validation', function (data) {
      console.log('✅ Validación recibida:', data);
      tempSocket.disconnect();
      callback(data);
    });

    tempSocket.on('connect_error', function (error) {
      console.error('❌ Error de conexión en validación:', error);
      tempSocket.disconnect();
      callback({ 
        available: false, 
        message: 'Error de conexión. Intenta nuevamente.' 
      });
    });
  } else {
    socket.emit('check_username', { username: name });
    
    socket.once('username_validation', function (data) {
      callback(data);
    });
  }
}

// ========== MOSTRAR SUGERENCIAS ==========
function showUsernameSuggestions(username, suggestions) {
  var formContent = registerForm.querySelector('p');
  var suggestionHTML = `
    <div style="margin: 15px 0; padding: 12px; background: rgba(255,193,7,0.1); border-radius: 8px; border-left: 3px solid #ffc107;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #ffc107;">
        ⚠️ El nombre "${username}" ya está en uso
      </p>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #ccc;">
        Te sugerimos estos nombres disponibles:
      </p>
      <div id="suggestions-container">
        ${suggestions.map((s, i) => `
          <button 
            class="suggestion-btn" 
            onclick="selectSuggestion('${s}')"
            style="
              display: inline-block;
              margin: 4px;
              padding: 8px 16px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              border-radius: 20px;
              color: white;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s;
            "
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
          >
            ${s}
          </button>
        `).join('')}
      </div>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #888;">
        O ingresá un nombre diferente
      </p>
    </div>
  `;

  var existingSuggestions = registerForm.querySelector('#suggestions-container');
  if (existingSuggestions) {
    existingSuggestions.parentElement.remove();
  }

  formContent.insertAdjacentHTML('afterend', suggestionHTML);
  usernameInput.value = '';
  usernameInput.focus();
}

// ========== SELECCIONAR SUGERENCIA ==========
window.selectSuggestion = function (suggestedName) {
  console.log('📝 Sugerencia seleccionada:', suggestedName);
  
  var suggestionsDiv = document.querySelector('#suggestions-container');
  if (suggestionsDiv) {
    suggestionsDiv.parentElement.remove();
  }

  usernameInput.value = suggestedName;
  startChat();
};

// ========== EVENT LISTENERS ==========

// Header click para minimizar en mobile
chatHeader.addEventListener('click', function(e) {
  if (isMobile && !registerForm.style.display && registerForm.style.display !== 'none') {
    return; // No minimizar si está en registro
  }
  
  if (isMobile && e.target !== chatClose) {
    toggleChatMobile();
  }
});

// Botón flotante (solo mobile)
chatButton.addEventListener('click', function () {
  toggleChatMobile();
});

// Botón cerrar (solo mobile minimiza)
chatClose.addEventListener('click', function (e) {
  e.stopPropagation();
  
  if (isMobile) {
    toggleChatMobile();
  }
});

registerButton.addEventListener('click', startChat);
usernameInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    startChat();
  }
});

// ========== INICIAR CHAT CON VALIDACIÓN ==========
function startChat() {
  var name = usernameInput.value.trim();
  
  if (name.length < 2) {
    showStatus('Por favor, ingresá un nombre válido (mínimo 2 caracteres)', 'error');
    return;
  }

  if (isCheckingUsername) {
    console.log('⏳ Ya hay una validación en curso...');
    return;
  }

  isCheckingUsername = true;
  registerButton.textContent = 'Verificando...';
  registerButton.disabled = true;
  usernameInput.disabled = true;

  console.log('🔍 Validando nombre:', name);

  validateUsername(name, function (result) {
    isCheckingUsername = false;
    registerButton.textContent = 'Iniciar Chat';
    registerButton.disabled = false;
    usernameInput.disabled = false;

    if (result.available) {
      console.log('✅ Nombre disponible:', name);
      
      username = name;
      sessionId = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      isReconnecting = false;

      saveSession(username, sessionId);

      registerForm.style.display = 'none';
      messagesArea.classList.add('active');
      inputArea.classList.add('active');
      quickOptions.classList.add('active');

      addSystemMessage('Conectando...');
      connectToBot();

      if (typeof gtag !== 'undefined') {
        gtag('event', 'chat_widget_start', {
          event_category: 'engagement',
          event_label: 'Fwild Chat'
        });
      }
    } else {
      console.log('❌ Nombre no disponible:', name);
      
      if (result.suggestions && result.suggestions.length > 0) {
        showUsernameSuggestions(name, result.suggestions);
      } else {
        showStatus(result.message || 'Este nombre ya está en uso', 'error');
      }
    }
  });
}

// ========== CONECTAR AL BOT ==========
function connectToBot() {
  console.log('🔌 Conectando al bot:', BACKEND_URL);

  socket = io(BACKEND_URL + '/client', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', function () {
    console.log('✅ Conectado al bot, Socket ID:', socket.id);
    showStatus('Conectado ✓', 'success');

    socket.emit('web_chat_start', {
      username: username,
      sessionId: sessionId,
      isReconnecting: isReconnecting
    });
  });

  socket.on('chat_history', function (data) {
    console.log('📜 Historial recibido:', data.messages.length, 'mensajes');

    // Limpiar área de mensajes
    messagesArea.innerHTML = '';

    // Agregar todos los mensajes del historial
    data.messages.forEach(function (msg) {
      if (msg.imageData) {
        addImageMessage(msg.type, msg.imageData, msg.message || '');
      } else {
        addMessage(msg.type, msg.message, new Date(msg.timestamp));
      }
    });

    // Asegurar que las áreas estén visibles
    registerForm.style.display = 'none';
    messagesArea.classList.add('active');
    inputArea.classList.add('active');
    quickOptions.classList.add('active');

    scrollToBottom();
    showStatus('Bienvenido de vuelta, ' + username + ' ✓', 'success');
    
    console.log('✅ Historial cargado y chat restaurado');
  });

  socket.on('disconnect', function () {
    console.log('❌ Desconectado del bot');
    showStatus('Desconectado. Reconectando...', 'warning');
  });

  socket.on('connect_error', function (error) {
    console.error('❌ Error de conexión:', error);
    showStatus('Error de conexión. Verifica tu internet.', 'error');
  });

  socket.on('bot_message', function (data) {
    console.log('💬 Mensaje del bot recibido:', data);
    hideTyping();

    if (data.imageData) {
      addImageMessage('bot', data.imageData, data.message || '');
    } else {
      addMessage('bot', data.message, new Date());
    }

    if (data.showMenu) {
      console.log('📋 Mostrando botones rápidos');
      quickOptions.classList.add('active');
    }
  });

  socket.on('admin_message', function (data) {
    console.log('💬 Mensaje del admin recibido:', data);
    hideTyping();
    addMessage('bot', data.message, data.timestamp || new Date());
  });

  socket.on('admin_image', function (data) {
    console.log('📷 Imagen del admin recibida');
    hideTyping();
    addImageMessage('bot', data.imageData, data.caption || '');
  });

  socket.on('message_sent', function () {
    console.log('✅ Mensaje enviado correctamente');
  });

  socket.on('error', function (data) {
    console.error('❌ Error:', data);
    
    if (data.code === 'USERNAME_TAKEN') {
      messagesArea.classList.remove('active');
      inputArea.classList.remove('active');
      quickOptions.classList.remove('active');
      registerForm.style.display = 'block';
      
      showStatus('Este nombre ya fue tomado. Por favor, elige otro.', 'error');
      localStorage.removeItem('fwild_chat_session');
    } else {
      showStatus(data.message || 'Ocurrió un error', 'error');
    }
  });
}

// ========== ENVIAR MENSAJE ==========
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  var message = messageInput.value.trim();
  if (!message || !socket) return;

  addMessage('user', message, new Date());

  socket.emit('message', {
    message: message
  });

  messageInput.value = '';
  autoResize(messageInput);
  showTyping();
}

// ========== OPCIONES RÁPIDAS ==========
window.selectQuickOption = function (option) {
  console.log('🎯 Opción rápida seleccionada:', option);

  addMessage('user', option, new Date());

  if (socket) {
    socket.emit('message', {
      message: option
    });
    showTyping();
  }

  if (typeof gtag !== 'undefined') {
    gtag('event', 'chat_quick_option', {
      event_category: 'engagement',
      event_label: option
    });
  }
};

// ========== FUNCIONES DE UI ==========
function addMessage(type, text, timestamp) {
  var messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + type;

  var bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  
  bubble.style.whiteSpace = 'pre-line';
  
  if (text.includes('\n')) {
    bubble.innerHTML = text.replace(/\n/g, '<br>');
  } else {
    bubble.textContent = text;
  }

  var time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = formatTime(timestamp);

  messageDiv.appendChild(bubble);
  messageDiv.appendChild(time);
  messagesArea.appendChild(messageDiv);
  scrollToBottom();
}

function addImageMessage(type, imageSrc, caption) {
  var messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + type;

  var img = document.createElement('img');
  img.className = 'message-image';
  img.src = imageSrc;
  img.onclick = function () {
    window.open(imageSrc, '_blank');
  };

  messageDiv.appendChild(img);

  if (caption && caption !== '[Imagen]') {
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = caption;
    messageDiv.appendChild(bubble);
  }

  var time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = formatTime(new Date());
  messageDiv.appendChild(time);

  messagesArea.appendChild(messageDiv);
  scrollToBottom();
}

function addSystemMessage(text) {
  var messageDiv = document.createElement('div');
  messageDiv.className = 'system-message';
  messageDiv.textContent = text;
  messagesArea.appendChild(messageDiv);
  scrollToBottom();
}

function showStatus(message, type) {
  connectionStatus.textContent = message;
  connectionStatus.className = 'connection-status ' + type + ' show';

  setTimeout(function () {
    connectionStatus.classList.remove('show');
  }, 3000);
}

function showTyping() {
  typingIndicator.classList.add('show');
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.classList.remove('show');
}

function formatTime(timestamp) {
  var date = new Date(timestamp);
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function scrollToBottom() {
  setTimeout(function() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }, 100);
}

// ========== AUTO RESIZE TEXTAREA ==========
messageInput.addEventListener('input', function () {
  autoResize(this);
});

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
}

// ========================================
// 📷 ENVÍO DE IMÁGENES - VERSIÓN CORREGIDA
// ========================================

// Crear elemento de input para imágenes (oculto)
var imageInput = document.createElement('input');
imageInput.type = 'file';
imageInput.accept = 'image/*';
imageInput.capture = 'environment'; // Permite usar la cámara en móvil
imageInput.style.display = 'none';
document.body.appendChild(imageInput);

console.log('📷 Input de imágenes creado');

// Manejar selección de imagen
imageInput.addEventListener('change', async function(e) {
  var file = e.target.files[0];
  if (!file) return;

  console.log('📷 Imagen seleccionada:', file.name, file.size, 'bytes');

  // Validar tipo
  if (!file.type.startsWith('image/')) {
    showStatus('❌ Solo se permiten imágenes', 'error');
    return;
  }

  // Validar tamaño (5MB)
  var maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    var sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    showStatus('❌ Imagen muy grande (' + sizeMB + 'MB). Máximo 5MB', 'error');
    return;
  }

  console.log('✅ Validación pasada, enviando imagen...');
  await sendImage(file);
  imageInput.value = ''; // Reset input
});

// Función para abrir selector de imágenes
window.selectImage = function() {
  console.log('📷 Botón de imagen clickeado');
  
  if (!socket || !socket.connected) {
    showStatus('No estás conectado. Espera...', 'error');
    return;
  }
  
  if (!username) {
    showStatus('Debes iniciar sesión primero', 'error');
    return;
  }
  
  console.log('✅ Abriendo selector de imágenes...');
  imageInput.click();
};

// Enviar imagen al servidor
async function sendImage(file) {
  if (!socket || !socket.connected) {
    showStatus('No estás conectado', 'error');
    return;
  }

  // Validar que tengamos usuario
  if (!username) {
    showStatus('No estás registrado', 'error');
    return;
  }

  try {
    // Mostrar preview local ANTES de enviar
    var reader = new FileReader();
    
    // Esperar a que se cargue la imagen
    await new Promise(function(resolve, reject) {
      reader.onload = function(e) {
        addImageMessage('user', e.target.result, '📤 Enviando...');
        scrollToBottom();
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Preparar FormData
    var formData = new FormData();
    formData.append('image', file);
    formData.append('username', username); // Usar username global
    formData.append('sessionId', sessionId); // Incluir sessionId también

    // Mostrar indicador de carga
    showStatus('Enviando imagen...', 'warning');

    // Enviar al servidor
    var response = await fetch(BACKEND_URL + '/api/upload-image', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      var errorData = await response.json().catch(function() {
        return { error: 'Error desconocido' };
      });
      throw new Error(errorData.error || 'Error al enviar imagen');
    }

    var data = await response.json();
    
    showStatus('Imagen enviada ✓', 'success');
    showTyping(); // Mostrar que el bot está "escribiendo"
    console.log('✅ Imagen enviada correctamente:', data);

  } catch (error) {
    console.error('❌ Error al enviar imagen:', error);
    showStatus('Error: ' + error.message, 'error');
    
    // Agregar mensaje de error visible
    addSystemMessage('❌ No se pudo enviar la imagen. Intenta nuevamente.');
  }
}

// Soporte para pegar imágenes (Ctrl+V)
messageInput.addEventListener('paste', async function(e) {
  var items = e.clipboardData.items;
  
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      e.preventDefault();
      
      var file = items[i].getAsFile();
      if (file) {
        await sendImage(file);
      }
      break;
    }
  }
});

console.log('📷 Sistema de envío de imágenes inicializado');

// ========== AUTO-INICIALIZAR ==========
window.addEventListener('DOMContentLoaded', function () {
  // Detectar si es mobile
  isMobile = window.innerWidth <= 768;
  console.log('📱 Dispositivo:', isMobile ? 'Móvil' : 'Desktop');
  
  var savedSession = loadSession();
  
  if (savedSession) {
    // ✅ HAY SESIÓN GUARDADA - RECONECTAR AUTOMÁTICAMENTE
    username = savedSession.username;
    sessionId = savedSession.sessionId;
    isReconnecting = true;
    
    console.log('🔄 Sesión encontrada, reconectando como:', username);
    
    // Ocultar formulario de registro
    registerForm.style.display = 'none';
    
    // Mostrar área de chat
    messagesArea.classList.add('active');
    inputArea.classList.add('active');
    quickOptions.classList.add('active');
    
    // Mensaje de sistema
    addSystemMessage('Reconectando como ' + username + '...');
    
    // Conectar al bot
    connectToBot();
    
    console.log('✅ Reconexión iniciada para:', username);
  } else {
    // ✅ NO HAY SESIÓN - MOSTRAR FORMULARIO DE REGISTRO
    console.log('🆕 Primera visita, mostrando formulario de registro');
    
    // Asegurarse de que el formulario esté visible
    registerForm.style.display = 'block';
    messagesArea.classList.remove('active');
    inputArea.classList.remove('active');
    quickOptions.classList.remove('active');
    
    // En mobile, auto-focus en el input
    if (isMobile) {
      setTimeout(function() {
        usernameInput.focus();
      }, 500);
    } else {
      // En desktop también hacer focus
      setTimeout(function() {
        usernameInput.focus();
      }, 300);
    }
  }
});