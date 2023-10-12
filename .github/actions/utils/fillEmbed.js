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
} = process.env;

const fillDefaultEmbed = async () => {
	const githubActor = GITHUB_ACTOR;
	const avatarUrl = await getAuthorAvatar(githubActor);
	const color = Math.floor(Math.random() * 16777215) + 1;

	const embed = {
		embeds: [
			{
				...DEFAULT_EMBED.embeds[0],
				color,
				author: {
					name: githubActor,
					icon_url: avatarUrl,
				},
				title: "Repositório",
				url: `https://github.com/${GITHUB_REPOSITORY}`,
			},
		],
	};

	switch (context.eventName) {
		case "pull_request":
			if (context.payload.action === "opened") {
				embed.embeds[0].description =
					MENSAGE_ON_PULL_REQUEST_OPENED || DEFAULT_MESSAGES.pr_opened;
			} else {
				console.error("Pull Request event not supported");
				process.exit(1);
			}
			break;
		case "issues":
			embed.embeds[0].description =
				MENSAGE_ON_ISSUE_OPENED || DEFAULT_MESSAGES.issue;
			embed.embeds[0].footer.text = `Conteúdo da issue: ${context.payload.issue.body}`
			break;
		case "push":
			const mensagemDoCommitMaisRecente =
				context.payload.commits[context.payload.commits.length - 1].message;
			const identifyMessage = "Merge pull request";

			if (
				mensagemDoCommitMaisRecente
					.toLowerCase()
					.includes(identifyMessage.toLowerCase())
			) {
				
				embed.embeds[0].description =
					MENSAGE_ON_PULL_REQUEST_MERGED || DEFAULT_MESSAGES.pr_acepted;
			} else {
				embed.embeds[0].description = MENSAGE_ON_PUSH || DEFAULT_MESSAGES.push;
				embed.embeds[0].footer.text = `O commit que disparou a mensagem: ${
					context.payload.commits[context.payload.commits.length - 1].message
				}`;
			}
			break;
		default:
			console.error("Event not supported");
			process.exit(1);
	}

	return embed;
};

module.exports = fillDefaultEmbed;
