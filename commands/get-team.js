const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-team')
		.setDescription('Fetch the data for a team.')
		.addStringOption((option) =>
			option
				.setName('team-number')
				.setDescription('The team number of the team you want the data for.')
		),
	async execute(interaction) {
		const teamNumber = interaction.options.getString('team-number')

		const response = await fetch(
			`https://api.ftcscout.org/rest/v1/teams/${teamNumber}`
		)
		const data = await response.json()

		console.log(data)
	},
}
