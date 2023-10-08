var express = require("express");
var router = express.Router();
const axios = require('axios'); // for making HTTP requests
const TelegramBot = require('node-telegram-bot-api');


const apiURL =
	'https://apicomtest.kcic.co.id/public/routes?';

const tokenBotTele = "6480692915:AAEcDNmoebXYUr63WczKaUMhtv4FUBGz7Qs"
const bot = new TelegramBot(tokenBotTele, { polling: true });
const filter = [
	{
		route: "&filter[route]=halim-bandung",
		startDate: "&filter[date][$gte]=2023-10-07T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-09T16:59:59.059Z"
	},
	{
		route: "&filter[route]=halim-tegalluar",
		startDate: "&filter[date][$gte]=2023-10-07T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-09T16:59:59.059Z"
	},
	{
		route: "&filter[route]=tegalluar-halim",
		startDate: "&filter[date][$gte]=2023-10-07T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-09T16:59:59.059Z"
	},
	{
		route: "&filter[route]=bandung-halim",
		startDate: "&filter[date][$gte]=2023-10-07T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-09T16:59:59.059Z"
	},
	// 
	{
		route: "&filter[route]=halim-bandung",
		startDate: "&filter[date][$gte]=2023-10-09T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-11T16:59:59.059Z"
	},
	{
		route: "&filter[route]=halim-tegalluar",
		startDate: "&filter[date][$gte]=2023-10-09T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-11T16:59:59.059Z"
	},
	{
		route: "&filter[route]=tegalluar-halim",
		startDate: "&filter[date][$gte]=2023-10-09T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-11T16:59:59.059Z"
	},
	{
		route: "&filter[route]=bandung-halim",
		startDate: "&filter[date][$gte]=2023-10-09T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-11T16:59:59.059Z"
	},
	// 
	{
		route: "&filter[route]=halim-bandung",
		startDate: "&filter[date][$gte]=2023-10-11T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-13T16:59:59.059Z"
	},
	{
		route: "&filter[route]=halim-tegalluar",
		startDate: "&filter[date][$gte]=2023-10-11T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-13T16:59:59.059Z"
	},
	{
		route: "&filter[route]=tegalluar-halim",
		startDate: "&filter[date][$gte]=2023-10-11T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-13T16:59:59.059Z"
	},
	{
		route: "&filter[route]=bandung-halim",
		startDate: "&filter[date][$gte]=2023-10-11T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-13T16:59:59.059Z"
	},
	// 
	{
		route: "&filter[route]=halim-bandung",
		startDate: "&filter[date][$gte]=2023-10-13T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-15T16:59:59.059Z"
	},
	{
		route: "&filter[route]=halim-tegalluar",
		startDate: "&filter[date][$gte]=2023-10-13T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-15T16:59:59.059Z"
	},
	{
		route: "&filter[route]=tegalluar-halim",
		startDate: "&filter[date][$gte]=2023-10-13T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-15T16:59:59.059Z"
	},
	{
		route: "&filter[route]=bandung-halim",
		startDate: "&filter[date][$gte]=2023-10-13T17:00:00.000Z",
		endDate: "&filter[date][$lte]=2023-10-15T16:59:59.059Z"
	},
]

// Define a function to make the API request
router.get("/api/cron", async function (req, res) {
	{
		try {
			for (const iterator of filter) {
				let datex = iterator.endDate.split("=")
				const date = new Date()
				if (date > new Date(datex)) {
					continue
				}
				const response = await axios.get(apiURL + iterator.route + iterator.startDate + iterator.endDate);
				// console.log('API Response:', response.data);
				let datax = []
				response?.data?.data?.forEach((item) => {
					// Check if available_quota is not 0 and date and train_no are not null or undefined
					if (item.available_quota > 0 && item.date && item.train_no) {
						console.log('Valid Data:', item);
						// You can perform additional actions here with the valid data
						const originalDate = new Date(item?.date);
						const options = {
							year: 'numeric',
							month: 'long', // 'long' gives you the full month name
							day: 'numeric',
						};
						const formattedDate = originalDate?.toLocaleDateString('id-ID', options);
						let data = {
							"tanggalBerangkat": formattedDate,
							"jamBerangkat": `${item?.from?.hours}:${item?.from?.minutes}:${item?.from?.seconds}`,
							"trainNo": item?.train_no,
							"route": item?.route,
							"quota": item?.quota,
							"available_quota": item?.available_quota
						}
						datax?.push(data)
					}
				});
				// Format the datax array into a string
				const message = datax?.map((item) => {
					return `
  Tanggal Berangkat: ${item?.tanggalBerangkat}
  Jam Berangkat: ${item?.jamBerangkat}
  Train No: ${item?.trainNo}
  Route: ${item?.route}
  Quota: ${item?.quota}
  Available Quota: ${item?.available_quota}
        `;
				}).join('\n\n');

				// Send the message to the Telegram bot
				if (message.trim() !== '') {
					bot.sendMessage('571262339', message); // Replace 'YOUR_CHAT_ID' with the actual chat ID
				}
			}

			console.log('ok')
			// noData = true
			// if (response.data.success && Array.isArray(response.data.data)) {
			//   response.data.data.forEach((item) => {
			//     // Check if available_quota is not 0 and date and train_no are not null or undefined
			//     if (item.available_quota !== 0 && item.date && item.train_no) {
			//       console.log('Valid Data:', item);
			//       noData = false
			//       // You can perform additional actions here with the valid data
			//     }
			//   });
			// }
			// if (noData) {
			//   console.log("kuota 0")
			// }

			res.status(200).json({ status: "oke" });

		} catch (error) {
			console.error('Error:', error);
		} finally {
			const jakartaTimezone = 'Asia/Jakarta';
			const options = {
				timeZone: jakartaTimezone,
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				hour12: false, // Use 24-hour format
			};

			const jakartaDateTime = new Date().toLocaleString('en-US', options);
			console.log('Current Date and Time in Jakarta:', jakartaDateTime);
		}
	}
});

module.exports = router;
