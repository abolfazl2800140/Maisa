'use client';

import { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'سلام! به فروشگاه مایسا خوش آمدید. چطور می‌تونم کمکتون کنم؟',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'وضعیت سفارش من چیه؟',
    'چطور می‌تونم سفارش بدم؟',
    'هزینه ارسال چقدره؟',
    'زمان تحویل چقدره؟',
  ];

  // Advanced pattern matching with multiple keywords and context
  const botKnowledge = [
    {
      patterns: ['سلام', 'درود', 'صبح بخیر', 'عصر بخیر', 'شب بخیر', 'هلو', 'hi', 'hello'],
      responses: [
        'سلام! به فروشگاه مایسا خوش آمدید. چطور می‌تونم کمکتون کنم؟',
        'درود! خوشحالیم که با ما هستید. چه سوالی دارید؟',
        'سلام و وقت بخیر! در خدمتم، بفرمایید.',
      ],
      category: 'greeting'
    },
    {
      patterns: ['وضعیت سفارش', 'پیگیری سفارش', 'سفارشم کجاست', 'کد پیگیری', 'tracking', 'پیگیری'],
      responses: [
        'برای پیگیری سفارش:\n1️⃣ به بخش "حساب کاربری" > "سفارشات من" بروید\n2️⃣ یا کد پیگیری خود را به من بدهید\n3️⃣ یا با شماره 021-12345678 تماس بگیرید',
      ],
      category: 'order_tracking'
    },
    {
      patterns: ['چطور سفارش', 'نحوه سفارش', 'خرید', 'چجوری خرید', 'order', 'buy'],
      responses: [
        'برای ثبت سفارش این مراحل رو دنبال کنید:\n\n1️⃣ محصول مورد نظر را انتخاب کنید\n2️⃣ روی "افزودن به سبد" کلیک کنید\n3️⃣ به سبد خرید بروید\n4️⃣ روی "تسویه حساب" کلیک کنید\n5️⃣ اطلاعات خود را وارد کنید\n6️⃣ پرداخت را انجام دهید\n\nخیلی ساده است! 😊',
      ],
      category: 'how_to_order'
    },
    {
      patterns: ['هزینه ارسال', 'پست', 'حمل', 'shipping', 'delivery cost'],
      responses: [
        '📦 هزینه ارسال:\n\n✅ سفارشات بالای 500 هزار تومان: رایگان\n💰 سفارشات زیر 500 هزار تومان: 30 هزار تومان\n\n🚚 ارسال با پست پیشتاز و تیپاکس',
      ],
      category: 'shipping_cost'
    },
    {
      patterns: ['زمان تحویل', 'کی میرسه', 'چند روز', 'delivery time', 'تحویل'],
      responses: [
        '⏰ زمان تحویل:\n\n🏙️ تهران و کرج: 2-3 روز کاری\n🌍 سایر شهرها: 3-7 روز کاری\n\n📍 ارسال از شنبه تا پنجشنبه',
      ],
      category: 'delivery_time'
    },
    {
      patterns: ['پشتیبانی', 'تماس', 'شماره', 'ایمیل', 'support', 'contact'],
      responses: [
        '📞 راه‌های ارتباطی:\n\n☎️ تلفن: 021-12345678\n📧 ایمیل: support@maysa.com\n💬 چت آنلاین: همین‌جا!\n\n⏰ پاسخگویی 24/7',
      ],
      category: 'support'
    },
    {
      patterns: ['بازگشت', 'مرجوع', 'return', 'refund', 'پس دادن'],
      responses: [
        '🔄 ضمانت بازگشت:\n\n✅ 7 روز ضمانت بازگشت کالا\n✅ بدون هیچ شرطی\n✅ بازگشت وجه کامل\n\nفقط کافیه با پشتیبانی تماس بگیرید.',
      ],
      category: 'return'
    },
    {
      patterns: ['تخفیف', 'کد تخفیف', 'discount', 'کوپن', 'coupon'],
      responses: [
        '🎁 کدهای تخفیف فعال:\n\n💎 WELCOME10: 10% تخفیف برای اولین خرید\n🎉 SUMMER20: 20% تخفیف محصولات تابستانی\n\nکد تخفیف رو در سبد خرید وارد کنید.',
      ],
      category: 'discount'
    },
    {
      patterns: ['قیمت', 'چقدر', 'price', 'گرون', 'ارزون'],
      responses: [
        'قیمت محصولات ما بسیار رقابتی است! 💰\n\nبرای دیدن قیمت‌ها:\n🔍 به بخش "فروشگاه" بروید\n🏷️ یا محصول مورد نظر را جستجو کنید\n\nهمیشه بهترین قیمت رو داریم! ✨',
      ],
      category: 'price'
    },
    {
      patterns: ['کیفیت', 'اصل', 'تقلبی', 'quality', 'original'],
      responses: [
        '✨ کیفیت محصولات:\n\n✅ 100% اصل و اورجینال\n✅ ضمانت اصالت کالا\n✅ گارانتی معتبر\n\nما فقط محصولات با کیفیت می‌فروشیم! 🏆',
      ],
      category: 'quality'
    },
    {
      patterns: ['پرداخت', 'payment', 'کارت', 'آنلاین', 'درگاه'],
      responses: [
        '💳 روش‌های پرداخت:\n\n✅ پرداخت آنلاین (کارت به کارت)\n✅ درگاه بانکی معتبر\n✅ پرداخت در محل (برای تهران)\n\n🔒 پرداخت کاملاً امن است.',
      ],
      category: 'payment'
    },
    {
      patterns: ['ممنون', 'متشکر', 'مرسی', 'thanks', 'thank you'],
      responses: [
        'خواهش می‌کنم! خوشحالم که تونستم کمکتون کنم. 😊',
        'قابلی نداشت! همیشه در خدمتیم. 🙏',
      ],
      category: 'thanks'
    },
    {
      patterns: ['خداحافظ', 'بای', 'bye', 'goodbye'],
      responses: [
        'خداحافظ! منتظر خریدتون هستیم. 👋',
        'بای بای! امیدواریم به زودی برگردید. 😊',
      ],
      category: 'goodbye'
    },
  ];

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Check for empty message
    if (!lowerMessage) {
      return 'لطفاً سوال خود را بنویسید. 😊';
    }

    // Find matching pattern with scoring
    let bestMatch = { score: 0, response: '' };

    for (const knowledge of botKnowledge) {
      for (const pattern of knowledge.patterns) {
        if (lowerMessage.includes(pattern.toLowerCase())) {
          const score = pattern.length; // Longer matches get higher score
          if (score > bestMatch.score) {
            const responses = knowledge.responses;
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            bestMatch = { score, response: randomResponse };
          }
        }
      }
    }

    // If found a match, return it
    if (bestMatch.score > 0) {
      return bestMatch.response;
    }

    // Default response with helpful suggestions
    return `متوجه سوال شما نشدم. 🤔\n\nمی‌تونید از این موضوعات بپرسید:\n• وضعیت سفارش\n• نحوه خرید\n• هزینه ارسال\n• زمان تحویل\n• کدهای تخفیف\n\nیا با پشتیبانی تماس بگیرید: 021-12345678`;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 left-6 z-40 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-110 flex items-center justify-center group"
          aria-label="باز کردن چت"
        >
          <FaComments className="text-2xl" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 left-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-lg shadow-2xl flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FaRobot className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="font-bold">پشتیبانی مایسا</h3>
                <p className="text-xs text-white/80">معمولاً در چند دقیقه پاسخ می‌دهیم</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="p-3 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">سوالات متداول:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-primary text-white w-10 h-10 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
