const TelegramApi = require("node-telegram-bot-api");

const token = "2110311986:AAFMyvaYX72Z5sFaxtNx3GiL8dUJkAU0S48";
const bot = new TelegramApi(token, { polling: true });

const buttons = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Да", callback_data: "true" }],
      [{ text: "Нет", callback_data: "false" }],
    ],
  }),
};

const start = () => {
  bot.deleteMyCommands([]);
  bot.onText(/\w/, function onLoveText(msg) {
    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [
          ["Yes, you are the bot of my life ❤"],
          ["No, sorry there is another one..."],
        ],
      }),
    };
    bot.sendMessage(msg.chat.id, "Do you love me?", opts);
  });
  // bot.onText(/\w/, (msg) => {
  //   console.log(msg);
  //   const opts = {
  //     reply_to_message_id: msg.message_id,
  //     reply_markup: JSON.stringify({
  //       keyboard: [["Да ✅"], ["Нет ❌"]],
  //     }),
  //   };
  //   return bot.sendMessage(
  //     msg.chat.id,
  //     "Вы уверены отправить сообщение?",
  //     opts
  //   );
  // });
  // bot.on("message", async (msg) => {
  //   let text = msg.text;
  //   const chatId = msg.chat.id;
  //   // console.log(msg);
  //   if (text !== "/start" && chatId !== -1001754268091) {
  //     // await bot.sendMessage(
  //     //   chatId,
  //     //   "Вы действительно хотите отправить сообщение?",
  //     //   buttons
  //     // );
  //     // bot.on("callback_query", async (msg) => {
  //     //   if (msg.data === "true") {
  //     //     await bot.sendMessage(-1001786722240, text);
  //     //     await bot.sendMessage(chatId, "Ваше сообщение отправлено!");
  //     //     text = "";
  //     //   } else {
  //     //     text = "";
  //     //     await bot.sendMessage(chatId, "Ваше сообщение отменено!");
  //     //   }
  //     // });

  //   }
  // });
};
start();
