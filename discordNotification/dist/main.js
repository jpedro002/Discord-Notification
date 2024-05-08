"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main.ts
var github = __toESM(require("@actions/github"));
var core = __toESM(require("@actions/core"));
var import_axios = __toESM(require("axios"));

// src/defaultEmbed.ts
var DEFAULT_EMBED = {
  username: "GitHub Alert",
  avatar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFDTKV4IUyFOpFh5_we4BJxAbFl9GaHYL5SRLfovXmuG0DpGXUPglO6d7CQwCE0X4tDRA&usqp=CAU",
  embeds: [
    {
      footer: {
        text: ""
      },
      author: {
        name: "Delivery Girl",
        icon_url: "https://i.imgur.com/V8ZjaMa.jpg"
      },
      color: "14177041",
      description: "acabou de ter um pull request aceito! Parab\xE9ns! Continue assim.",
      title: "sdfuhskduyfhaskdifuhasdiuf",
      url: "https://google.com/"
    }
  ]
};
var DEFAULT_MESSAGES = {
  pr_acepted: "acabou de ter um pull request aceito! Parab\xE9ns! Continue assim.",
  pr_opened: "acabou de abrir um pull request! Vamos l\xE1, voc\xEA consegue!",
  push: "acabou de fazer um push! Vamos l\xE1, voc\xEA consegue!",
  issue: "acabou de abrir uma issue!",
  issue_comment: "acabou de comentar em uma issue!"
};

// src/main.ts
var {
  DISCORD_WEBHOOK,
  GITHUB_REPOSITORY,
  GITHUB_ACTOR,
  MENSAGE_ON_PUSH,
  MENSAGE_ON_PULL_REQUEST_OPENED,
  MENSAGE_ON_PULL_REQUEST_MERGED,
  MENSAGE_ON_ISSUE_OPENED,
  MENSAGE_ON_ISSUE_MENSAGE_CREATED
} = process.env;
var context2 = github.context;
var getAuthorAvatar = async (author) => {
  const response = await import_axios.default.get(`https://api.github.com/users/${author}`);
  return response.data.avatar_url;
};
var fillDefaultEmbed = async () => {
  const githubActor = GITHUB_ACTOR || context2.actor;
  const avatarUrl = await getAuthorAvatar(githubActor);
  const color = Math.floor(Math.random() * 16777215) + 1;
  let embed = {
    ...DEFAULT_EMBED
  };
  embed.embeds[0].author = {
    icon_url: avatarUrl,
    name: githubActor
  };
  embed.embeds[0].color = color;
  embed.embeds[0].title = "Repository";
  embed.embeds[0].url = `https://github.com/${GITHUB_REPOSITORY}`;
  switch (context2.eventName) {
    case "pull_request":
      if (context2.payload.pull_request && context2.payload.pull_request.merged) {
        embed.embeds[0].description = MENSAGE_ON_PULL_REQUEST_MERGED || DEFAULT_MESSAGES.pr_acepted;
      } else if (context2.payload.action === "opened") {
        embed.embeds[0].description = MENSAGE_ON_PULL_REQUEST_OPENED || DEFAULT_MESSAGES.pr_opened;
      } else {
        core.error("Event not supported: " + context2.eventName);
        process.exit(1);
      }
      break;
    case "issues":
      if (context2.payload.action === "opened") {
        embed.embeds[0].description = MENSAGE_ON_ISSUE_OPENED || DEFAULT_MESSAGES.issue;
        embed.embeds[0].footer.text = `issue content: ${context2.payload.issue?.body}`;
      } else if (context2.payload.action === "closed") {
        embed.embeds[0].description = `The issue ${context2.payload.issue?.title} 
          has been closed`;
        embed.embeds[0].footer.text = `${context2.payload.issue?.body}`;
      } else {
        core.error("Event not supported: " + context2.eventName);
      }
      break;
    case "push":
      embed.embeds[0].description = MENSAGE_ON_PUSH || DEFAULT_MESSAGES.push;
      embed.embeds[0].footer.text = `O commit que disparou a mensagem: ${context2.payload.commits[context2.payload.commits.length - 1].message}`;
      break;
    case "issue_comment":
      if (context2.payload.action === "created") {
        embed.embeds[0].description = MENSAGE_ON_ISSUE_MENSAGE_CREATED || DEFAULT_MESSAGES.issue_comment;
        embed.embeds[0].footer.text = `issue comment content: ${context2.payload.comment?.body}`;
      } else {
        core.error("Event not supported: " + context2.eventName);
      }
      break;
    default:
      core.error("Event not supported: " + context2.eventName);
  }
  return embed;
};
var sendDiscordMessage = async (webhook, message) => {
  if (!webhook) {
    core.error("DISCORD_WEBHOOK is not defined");
  } else {
    const data = await fillDefaultEmbed();
    await import_axios.default.post(webhook, data);
  }
};
try {
  sendDiscordMessage(DISCORD_WEBHOOK, DEFAULT_EMBED);
} catch (error2) {
  if (error2 instanceof Error) {
    core.error(error2);
  }
}
