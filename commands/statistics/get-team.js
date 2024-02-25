import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { markdownTable } from 'markdown-table'

export default {
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
		const infoEmbed = new EmbedBuilder()
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
				{
					name: 'Location',
					value: `${data.city}, ${data.state}, ${data.country}`,
					inline: true,
				},
				{ name: 'Rookie Year', value: `${data.rookieYear}`, inline: true }
			)
			.setFooter({
				text: `Updated ${new Date(data.updatedAt).toDateString()}`,
			})

		const table = markdownTable([
			[' ', 'Total NP', 'Auto', 'Teleop', 'Endgame'],
			[
				'Best OPR',
				`${roundNum(stats.tot.value)}`,
				`${roundNum(stats.auto.value)}`,
				`${roundNum(stats.dc.value)}`,
				`${roundNum(stats.eg.value)}`,
			],
			[
				'Rank',
				`${roundNum(stats.tot.rank)}`,
				`${roundNum(stats.auto.rank)}`,
				`${roundNum(stats.dc.rank)}`,
				`${roundNum(stats.eg.rank)}`,
			],
		])

		const statsEmbed = new EmbedBuilder()
			.setColor('#fee066')
			.setTitle(`Quick Stats`)
			.setDescription(`\`${table}\``)
			.setFooter({
				text: `Updated ${new Date(data.updatedAt).toDateString()}`,
			})

		const m = await interaction.editReply({ embeds: [infoEmbed, statsEmbed] })
		console.log(m.embeds)
	},
}

// Round to the second decimal place
function roundNum(num) {
	return Math.round(num * 100) / 100
}
