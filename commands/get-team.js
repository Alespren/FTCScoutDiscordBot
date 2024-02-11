const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

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
		await interaction.deferReply()

		const teamNumber = interaction.options.getString('team-number')

		const response = await fetch(
			`https://api.ftcscout.org/rest/v1/teams/${teamNumber}`
		)
		const data = await response.json()

		const quickStatsResponse = await fetch(
			`https://api.ftcscout.org/rest/v1/teams/${teamNumber}/quick-stats`
		)
		const stats = await quickStatsResponse.json()

		// Construct embed
		const embed = new EmbedBuilder()
			.setColor('#fee066')
			.setTitle(`${data.number} ${data.name}`)
			.setURL(`https://ftcscout.org/teams/${data.number}`)
			.addFields(
				{ name: 'School', value: `${data.schoolName}`, inline: true },
				{
					name: 'Sponsors',
					value: `${data.sponsors.join(', ')}`,
					inline: true,
				},
				{ name: '\u200B', value: '\u200B', inline: true },
				{
					name: 'Location',
					value: `${data.city}, ${data.state}, ${data.country}`,
					inline: true,
				},
				{ name: 'Rookie Year', value: `${data.rookieYear}`, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true }
			)
			.setFooter({
				text: `Updated ${new Date(data.updatedAt).toDateString()}`,
			})

		interaction.followUp({ embeds: [embed] })
	},
}
