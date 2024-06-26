interface Embed {
  footer: {
    text: string;
  };
  author: {
    name: string;
    icon_url: string;
  };
  color: string | number;
  description: string;
  title: string;
  url: string;
}

export interface DefaultEmbed {
  username: string;
  avatar_url: string;
  embeds: Embed[];
}

const DEFAULT_EMBED: DefaultEmbed = {
  username: "GitHub Alert",
  avatar_url:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFDTKV4IUyFOpFh5_we4BJxAbFl9GaHYL5SRLfovXmuG0DpGXUPglO6d7CQwCE0X4tDRA&usqp=CAU",
  embeds: [
    {
      footer: {
        text: "",
      },
      author: {
        name: "Delivery Girl",
        icon_url: "https://i.imgur.com/V8ZjaMa.jpg",
      },

      color: "14177041",
      description:
        "acabou de ter um pull request aceito! Parabéns! Continue assim.",
      title: "sdfuhskduyfhaskdifuhasdiuf",
      url: "https://google.com/",
    },
  ],
};

const DEFAULT_MESSAGES = {
  pr_acepted: "acabou de ter um pull request aceito! Parabéns! Continue assim.",
  pr_opened: "acabou de abrir um pull request! Vamos lá, você consegue!",
  push: "acabou de fazer um push! Vamos lá, você consegue!",
  issue: "acabou de abrir uma issue!",
  issue_comment: "acabou de comentar em uma issue!",
};

export { DEFAULT_EMBED, DEFAULT_MESSAGES };
