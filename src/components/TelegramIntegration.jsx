import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Send, CheckCircle2, Copy } from 'lucide-react';
import '../styles/app.css';

export function TelegramIntegration({ onClose }) {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  // Проверка сохраненных данных при открытии
  useState(() => {
    const savedToken = localStorage.getItem('telegram_bot_token');
    const savedChatId = localStorage.getItem('telegram_chat_id');
    if (savedToken && savedChatId) {
      setBotToken(savedToken);
      setChatId(savedChatId);
      setIsConnected(true);
    }
  });

  const handleConnect = () => {
    if (botToken.trim() && chatId.trim()) {
      localStorage.setItem('telegram_bot_token', botToken);
      localStorage.setItem('telegram_chat_id', chatId);
      setIsConnected(true);
      alert('Telegram успешно подключен!');
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('telegram_bot_token');
    localStorage.removeItem('telegram_chat_id');
    setBotToken('');
    setChatId('');
    setIsConnected(false);
  };

  const sendTestMessage = async () => {
    if (!testMessage.trim()) return;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json();
      
      if (data.ok) {
        alert('Тестовое сообщение отправлено!');
        setTestMessage('');
      } else {
        alert('Ошибка при отправке сообщения: ' + data.description);
      }
    } catch (error) {
      alert('Ошибка при отправке сообщения');
      console.error(error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Скопировано в буфер обмена!');
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }} />
        <Dialog.Content style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--color-background)',
          borderRadius: '12px',
          padding: '32px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001,
          boxShadow: 'var(--shadow-lg)',
        }}>
          <Dialog.Title style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--color-text)',
          }}>
            <Send size={28} color="#0088cc" />
            Интеграция с Telegram
          </Dialog.Title>

          {isConnected ? (
            <div>
              <div style={{
                padding: '16px',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                borderRadius: '8px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <CheckCircle2 size={20} />
                <span>Telegram подключен</span>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: 'var(--color-text)',
                }}>
                  Отправить тестовое уведомление
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Введите текст сообщения..."
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={sendTestMessage}
                    disabled={!testMessage.trim()}
                  >
                    <Send size={16} />
                    Отправить
                  </button>
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: '8px',
                marginBottom: '24px',
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--color-text)',
                }}>
                  Настройки подключения:
                </h4>
                <div style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Bot Token:</strong> {botToken.substring(0, 15)}...
                  </div>
                  <div>
                    <strong>Chat ID:</strong> {chatId}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-danger"
                onClick={handleDisconnect}
                style={{ width: '100%' }}
              >
                Отключить Telegram
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
                color: 'var(--color-text-light)',
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: 'var(--color-text)',
                }}>
                  📝 Инструкция по подключению:
                </h4>
                <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Найдите в Telegram бота <strong>@BotFather</strong></li>
                  <li>Отправьте команду <code style={{
                    backgroundColor: 'var(--color-background)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}>/newbot</code> для создания нового бота</li>
                  <li>Следуйте инструкциям и скопируйте токен бота</li>
                  <li>Найдите бота <strong>@userinfobot</strong> и узнайте свой Chat ID</li>
                  <li>Вставьте данные в форму ниже</li>
                </ol>
              </div>

              <div className="form-group">
                <label htmlFor="botToken" className="form-label">
                  Bot Token *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="botToken"
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    className="form-input"
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyToClipboard(botToken)}
                    disabled={!botToken}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="chatId" className="form-label">
                  Chat ID *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="chatId"
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="form-input"
                    placeholder="123456789"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyToClipboard(chatId)}
                    disabled={!chatId}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleConnect}
                disabled={!botToken.trim() || !chatId.trim()}
                style={{ width: '100%', marginTop: '16px' }}
              >
                Подключить Telegram
              </button>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
