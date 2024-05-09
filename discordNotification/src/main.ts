import * as github from "@actions/github";
import * as core from "@actions/core";
import axios from "axios";

import { DEFAULT_EMBED, DEFAULT_MESSAGES, DefaultEmbed } from "./defaultEmbed";

const {
  DISCORD_WEBHOOK,
  DISCORD_PERSONALIZED_EMBED,
  GITHUB_REPOSITORY,
  GITHUB_ACTOR,
  MENSAGE_ON_PUSH,
  MENSAGE_ON_PULL_REQUEST_OPENED,
  MENSAGE_ON_PULL_REQUEST_MERGED,
  MENSAGE_ON_ISSUE_OPENED,
  MENSAGE_ON_ISSUE_MENSAGE_CREATED,
} = process.env;

const context = github.context;

const getAuthorAvatar = async (author: string): Promise<string> => {
  const response = await axios.get(`https://api.github.com/users/${author}`);
  return response.data.avatar_url;
};

const fillDefaultEmbed = async () => {
  const githubActor = GITHUB_ACTOR || context.actor;
  const avatarUrl = await getAuthorAvatar(githubActor);
  const color = Math.floor(Math.random() * 16777215) + 1;

  let embed: DefaultEmbed = {
    ...DEFAULT_EMBED,
  };

  embed.embeds[0].author = {
    icon_url: avatarUrl,
    name: githubActor,
  };
  embed.embeds[0].color = color;
  embed.embeds[0].title = "Repository";
  embed.embeds[0].url = `https://github.com/${GITHUB_REPOSITORY}`;

  switch (context.eventName) {
    case "pull_request":
      if (context.payload.pull_request && context.payload.pull_request.merged) {
        embed.embeds[0].description =
          MENSAGE_ON_PULL_REQUEST_MERGED || DEFAULT_MESSAGES.pr_acepted;
      } else if (context.payload.action === "opened") {
        embed.embeds[0].description =
          MENSAGE_ON_PULL_REQUEST_OPENED || DEFAULT_MESSAGES.pr_opened;
      } else {
        core.error("Event not supported: " + context.eventName);
        process.exit(1);
      }
      break;

    case "issues":
      if (context.payload.action === "opened") {
        embed.embeds[0].description =
          MENSAGE_ON_ISSUE_OPENED || DEFAULT_MESSAGES.issue;
        embed.embeds[0].footer.text = `issue content: ${context.payload.issue?.body}`;
      } else if (context.payload.action === "closed") {
        embed.embeds[0].description = `The issue ${context.payload.issue?.title} 
          has been closed`;
        embed.embeds[0].footer.text = `${context.payload.issue?.body}`;
      } else {
        core.error("Event not supported: " + context.eventName);
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
        embed.embeds[0].footer.text = `issue comment content: ${context.payload.comment?.body}`;
      } else {
        core.error("Event not supported: " + context.eventName);
      }

      break;
    default:
      core.error("Event not supported: " + context.eventName);
  }

  return embed;
};

const sendDiscordMessage = async (
  webhook: string | undefined,
  personalizedEmbed: any
) => {
  if (!webhook) {
    return core.error("DISCORD_WEBHOOK is not defined");
  } else if (personalizedEmbed) {
    console.log(personalizedEmbed);
    await axios.post(webhook, personalizedEmbed);
  } else {
    const data = await fillDefaultEmbed();
    await axios.post(webhook, JSON.stringify(context));
    await axios.post(webhook, data);
  }
};

try {
  sendDiscordMessage(DISCORD_WEBHOOK, DISCORD_PERSONALIZED_EMBED);
} catch (error) {
  if (error instanceof Error) {
    core.error(error);
  }
}
