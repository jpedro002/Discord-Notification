const { getAuthorAvatar } = require("./api.js");
const { DEFAULT_EMBED, DEFAULT_MESSAGES } = require("./data-embeds.js");
const github = require("@actions/github");

const context = github.context;

const {
	GITHUB_REPOSITORY,
	GITHUB_ACTOR,
	MENSAGE_ON_PUSH,
	MENSAGE_ON_PULL_REQUEST_OPENED,
	MENSAGE_ON_PULL_REQUEST_MERGED,
	MENSAGE_ON_ISSUE_OPENED,
	MENSAGE_ON_ISSUE_MENSAGE_CREATED
} = process.env;

const fillDefaultEmbed = async () => {
	const githubActor = GITHUB_ACTOR;
	const avatarUrl = await getAuthorAvatar(githubActor);
	const color = Math.floor(Math.random() * 16777215) + 1;

	const embed = {
		...DEFAULT_EMBED,
		embeds: [
			{
				...DEFAULT_EMBED.embeds[0],
				color,
				author: {
					name: githubActor,
					icon_url: avatarUrl,
				},
				title: "Repository",
				url: `https://github.com/${GITHUB_REPOSITORY}`,
			},
		],
	};

	switch (context.eventName) {
		case "pull_request":
			if (context.payload.pull_request && context.payload.pull_request.merged) {
				embed.embeds[0].description =
					MENSAGE_ON_PULL_REQUEST_MERGED || DEFAULT_MESSAGES.pr_acepted;
			} else if (context.payload.action === "opened") {
				embed.embeds[0].description =
					MENSAGE_ON_PULL_REQUEST_OPENED || DEFAULT_MESSAGES.pr_opened;
			}else{
				console.log("Event not supported");
				exit(1);
			}
			break;

		case "issues":

			if (context.payload.action === "opened") {
				embed.embeds[0].description =
					MENSAGE_ON_ISSUE_OPENED || DEFAULT_MESSAGES.issue;
				embed.embeds[0].footer.text = `issue content: ${context.payload.issue.body}`;
			} else if (context.payload.action === "closed") {

				embed.embeds[0].description = `The issue ${context.payload.issue.title} 
				has been closed`;
				embed.embeds[0].footer.text = `${context.payload.issue.body}`;
			}else {
				console.log("Event not supported");
			}

			break;

		case "push":
			embed.embeds[0].description = MENSAGE_ON_PUSH || DEFAULT_MESSAGES.push;
			embed.embeds[0].footer.text = `O commit que disparou a mensagem: ${
				context.payload.commits[context.payload.commits.length - 1].message
			}`;

			break;
		case "issue_comment":
			if (context.payload.action === "created") {
				embed.embeds[0].description =
					MENSAGE_ON_ISSUE_MENSAGE_CREATED || DEFAULT_MESSAGES.issue_comment;
				embed.embeds[0].footer.text = `issue comment content: ${context.payload.comment.body}`;
			} else {
				console.log("Event not supported");
				exit(1);
			}

			break;
		default:
			console.error("Event not supported");
			process.exit(1);
	}

	return embed;
};

module.exports = fillDefaultEmbed;
