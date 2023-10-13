const sendDiscordMessage = require("./utils/sendDiscordMessage");
const github = require("@actions/github");

const context = github.context;
console.log(context.eventName);

const { DISCORD_WEBHOOK, DISCORD_PERSONALIZED_EMBED } = process.env;

sendDiscordMessage(DISCORD_WEBHOOK, DISCORD_PERSONALIZED_EMBED).catch(
	(error) => {
		console.error("Error sending Discord message:", error);
	}
);
