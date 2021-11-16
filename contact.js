const TelegramApi = require("node-telegram-bot-api");

const token = "2127448315:AAFb9frEyR7SgqaaBenRsvam1WtfFMdPWvQ";
const bot = new TelegramApi(token, { polling: true });
const adminId = 648848311;

const start = () => {
  let message = "";

  bot.onText(/^[^$\/✅❌]*$/i, (msg) => {
    message = msg.text;
    const chatId = msg.chat.id;
    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [["Yes ✅", "No ❌"]],
      }),
    };

    return bot.sendMessage(chatId, "You want to send the message?", opts);
  });
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    const userName = msg.from.username;
    const userId = msg.from.id;

    if (msg.text === "/start") {
      await bot.sendMessage(
        chatId,
        "Hi, Amitian! Send your message about Aminymous Bot, bugs, offers and anything!"
      );
    }

    if (msg.text === "Yes ✅" && message) {
      await bot.sendMessage(
        adminId,
        `Message from:\n\nid: ${userId}\nFirstname: ${firstName}\nUsername: ${userName}\n\nMessage: ${message}`
      );
      await bot.sendMessage(chatId, "Your message has been sent!");
    } else if (msg.text === "No ❌" && message) {
      await bot.sendMessage(chatId, "Your message has been deleted!");
    }
    message = "";
  });
};
start();
