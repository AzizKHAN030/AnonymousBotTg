const fs = require("fs");
const TelegramApi = require("node-telegram-bot-api");

const token = "2131990498:AAF8-wn77FRUANnZDLIogwy8JmGXLYi0CFk";
const bot = new TelegramApi(token, { polling: true });
const channelId = -1001685576565;
const admins = [648848311, 571803901];
const options = {
  botStop: false,
  photoStop: false,
};
const start = () => {
  let message = [];

  const deleteTimer = (chat_id) => {
    setTimeout(() => {
      if (message.find((obj) => obj.userId === chat_id)) {
        message = message.filter((obj) => obj.userId !== chat_id);
        bot.sendMessage(chat_id, "Your message has been deleted");
      }
    }, 30000);
  };

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    if (!msg.photo) {
      if (
        msg.text.startsWith("/asw") &&
        admins.find((admin) => admin === chatId)
      ) {
        const newWords = msg.text.split("*");
        for (let i = 1; i < newWords.length; i++) {
          try {
            const data = fs.readFileSync("./swearWords.txt", "utf8");
            data.split(",").some((word) => word === newWords[i].toLowerCase())
              ? bot.sendMessage(
                  chatId,
                  `${newWords[i]} is already in the list `
                )
              : fs.appendFile(
                  "./swearWords.txt",
                  `${newWords[i].toLowerCase()},`,
                  (err) => {
                    if (err) throw err;
                  }
                );
          } catch (error) {
            console.log(error);
            bot.sendMessage(
              chatId,
              "An error occured, please report to @Aminymous_Contact_Bot"
            );
          }
        }
      }

      if (
        msg.text.startsWith("/rsw") &&
        admins.find((admin) => admin === chatId)
      ) {
        const newWords = msg.text.split("*");
        for (let i = 1; i < newWords.length; i++) {
          try {
            const data = fs.readFileSync("./swearWords.txt", "utf8");
            !data.split(",").some((word) => word === newWords[i].toLowerCase())
              ? bot.sendMessage(
                  chatId,
                  `There is no ${newWords[i]} in the list`
                )
              : fs.writeFileSync(
                  "./swearWords.txt",
                  data
                    .split(",")
                    .filter((word) => word !== newWords[i].toLowerCase())
                );
          } catch (error) {
            console.log(error);
            bot.sendMessage(
              chatId,
              "An error occured, please report to @Aminymous_Contact_Bot"
            );
          }
        }
      }

      if (msg.text === "/list" && admins.find((admin) => admin === chatId)) {
        try {
          const data = fs.readFileSync("./swearWords.txt", "utf8");
          bot.sendMessage(chatId, data);
        } catch (error) {
          console.log(error);
          bot.sendMessage(
            chatId,
            "An error occured, please report to @Aminymous_Contact_Bot"
          );
        }
      }
      if (msg.text === "/botstop" && admins.find((admin) => admin === chatId)) {
        options.botStop = true;
        bot.sendMessage(chatId, "Bot stopped");
      }
      if (
        msg.text === "/botstart" &&
        admins.find((admin) => admin === chatId)
      ) {
        options.botStop = false;
        bot.sendMessage(chatId, "Bot started");
      }
      if (
        msg.text === "/photostop" &&
        admins.find((admin) => admin === chatId)
      ) {
        options.photoStop = true;
        bot.sendMessage(chatId, "Photo sending is unavailable");
      }
      if (
        msg.text === "/photostart" &&
        admins.find((admin) => admin === chatId)
      ) {
        options.photoStop = false;
        bot.sendMessage(chatId, "Photo sending is available");
      }
    }
  });

  bot.onText(/^[^$✅❌]*$/i, (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (options.botStop) {
      return;
    }
    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [["Yes ✅", "No ❌"]],
      }),
    };

    if (message.find((obj) => obj.userId === chatId)) {
      message.map((obj) =>
        obj.userId === chatId ? (obj.messageText = text) : null
      );
    } else {
      message.push({ userId: chatId, messageText: text });
    }
    try {
      const data = fs.readFileSync("./swearWords.txt", "utf8");
      if (
        data.split(",").find((word) =>
          message
            .find((obj) => obj.userId === chatId)
            .messageText.toLowerCase()
            .includes(word)
        )
      ) {
        message = message.filter((obj) => obj.userId !== chatId);
        bot.sendMessage(chatId, "Swearing is forbidden!");
      } else {
        bot.sendMessage(
          chatId,
          "Are you sure you want to publish this message?",
          opts
        );
      }
    } catch (error) {
      console.log(error);
      bot.sendMessage(
        chatId,
        "An error occured, please report to @Aminymous_Contact_Bot"
      );
    }

    deleteTimer(chatId);
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    if (options.botStop) {
      bot.sendMessage(
        chatId,
        "Unfortunately bot is stopped for a moment, try again later!"
      );
      return;
    }

    if (!msg.photo && !options.botStop) {
      if (msg.text === "/start") {
        await bot.sendMessage(
          chatId,
          "Hi, Amitian! Send a message in order to publish it anonymously on the channel!\n\n\nPlease, do not use filthy language and do not insult anyone. Constructive criticism is accepted."
        );
      }

      if (
        msg.text === "Yes ✅" &&
        chatId !== channelId &&
        message.find((obj) => obj.userId === chatId)
      ) {
        if (message.find((obj) => obj.userId === chatId).photo) {
          const { photo, caption } = message.find(
            (obj) => obj.userId === chatId
          );
          bot.sendPhoto(channelId, photo, {
            caption: caption,
            parse_mode: "Markdown",
          });
        } else {
          await bot.sendMessage(
            channelId,
            message.find((obj) => obj.userId === chatId).messageText
          );
        }

        await bot.sendMessage(
          chatId,
          "Your message has been sent! \n\nIt is published here:\n\nhttps://t.me/anonbotchannel"
        );
      } else if (
        msg.text === "No ❌" &&
        chatId !== channelId &&
        message.find((obj) => obj.userId === chatId)
      ) {
        await bot.sendMessage(chatId, "Your message has been deleted!");
      }
      message = message.filter((obj) => obj.userId !== chatId);
    } else {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      const photoCaption = msg.caption;
      const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [["Yes ✅", "No ❌"]],
        }),
      };

      if (message.find((obj) => obj.userId === chatId)) {
        message.map((obj) =>
          obj.userId === chatId ? (obj.photo = fileId) : null
        );
      } else {
        if (options.photoStop) {
          bot.sendMessage(
            chatId,
            "Unfortunately sending photos is not available for now..."
          );
          return;
        }
        message.push({ userId: chatId, photo: fileId, caption: photoCaption });
      }
      try {
        const data = fs.readFileSync("./swearWords.txt", "utf8");
        if (
          message.find((obj) => obj.userId === chatId).caption &&
          data.split(",").find((word) =>
            message
              .find((obj) => obj.userId === chatId)
              .caption.toLowerCase()
              .includes(word)
          )
        ) {
          message = message.filter((obj) => obj.userId !== chatId);
          bot.sendMessage(chatId, "Swearing is forbidden!");
        } else {
          bot.sendMessage(
            chatId,
            "Are you sure you want to publish this message?",
            opts
          );
        }
      } catch (error) {
        console.log(error);
        bot.sendMessage(
          chatId,
          "An error occured, please report to @Aminymous_Contact_Bot"
        );
      }
      deleteTimer(chatId);
    }
  });
};

start();
