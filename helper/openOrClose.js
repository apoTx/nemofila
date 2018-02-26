const geoTz = require('geo-tz');
const moment = require('moment');

// helpers
const getDayName = require('../helper/getDayName');

const openOrClose = (data) => {
	console.log(data);
	const tzMoment = geoTz.tzMoment(data.place.geometry.location.lat, data.place.geometry.location.lng);
	const now_local_time = moment.parseZone(tzMoment).format('H:m');
	const dayName = getDayName();
	const clockOpenClose = (now_local_time > data.workTimes[dayName].openTime && now_local_time < data.workTimes[dayName].closeTime);
	const open = data.workTimes[dayName].open && (data.workTimes[dayName].hour24 || clockOpenClose);

	return open;
};

module.exports = openOrClose;
