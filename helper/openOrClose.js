const geoTz = require('geo-tz');
const moment = require('moment');

const openOrClose = (data) => {
	try{
		const tzMoment = geoTz.tzMoment(data.place.geometry.location.lat, data.place.geometry.location.lng);
		const now_local_time = moment.parseZone(tzMoment).format('H:m');
		const clockOpenClose = (now_local_time > data.workTimesToday.openTime && now_local_time < data.workTimesToday.closeTime);
		const open = data.workTimesToday.open && (data.workTimesToday.hour24 || clockOpenClose);

		return open;

	}catch (e) {
		console.log(e);
	}
};

module.exports = openOrClose;
