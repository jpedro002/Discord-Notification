const axios = require("axios");

const getAuthorAvatar = async (username) => {
	try {
		const response = await axios.get(
			`https://api.github.com/users/${username}`
		);
		if (response.status === 200) {
			return response.data.avatar_url;
		} else {
			console.error(
				"Erro ao obter a foto de perfil. Código de status:",
				response.status
			);
		}
	} catch (error) {
		console.error("Erro ao obter a foto de perfil:", error.message);
	}
	return null;
};

const postMessage = async (webhook, message) => {
	try {
		const response = await axios.post(webhook, message);
		if (response.status === 204) {
			console.log("Embed enviada com sucesso!");
		} else {
			console.error(
				"Erro ao enviar a Embed. Código de status:",
				response.status
			);
		}
	} catch (error) {
		console.error("Erro ao enviar a Embed:", error.message);
	}
};

module.exports = { getAuthorAvatar, postMessage };
