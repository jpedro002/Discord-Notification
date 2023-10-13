const {  postMessage } = require("./api.js");
const fillDefaultEmbed = require("./fillEmbed.js")




const sendDiscordMessage = async (DISCORD_WEBHOOK,DISCORD_PERSONALIZED_EMBED) => {
	
	if (!DISCORD_WEBHOOK) {
		console.error("DISCORD_WEBHOOK is not defined");
		process.exit(1);
	} else if (
		DISCORD_PERSONALIZED_EMBED 
	) {
		const parseEmbed = JSON.parse(DISCORD_PERSONALIZED_EMBED)
		const embedToSend = parseEmbed[0]
		postMessage(DISCORD_WEBHOOK, embedToSend);
	} else {
		try {
			const data = await fillDefaultEmbed();
			console.log(JSON.stringify(data, null, 2));
			console.log(DISCORD_WEBHOOK);
			await postMessage(DISCORD_WEBHOOK,data);
		} catch (error) {
			console.error("Error:", error);
		}
	}
}


module.exports = 
sendDiscordMessage
