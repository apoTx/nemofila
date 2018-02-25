function getDayName() {
	const d = new Date();
	const weekday = new Array(7);
	weekday[0] = 'sunday';
	weekday[1] = 'monday';
	weekday[2] = 'tuesday';
	weekday[3] = 'wednesday';
	weekday[4] = 'thursday';
	weekday[5] = 'friday';
	weekday[6] = 'saturday';

	return weekday[d.getDay()];
}

module.exports = getDayName;
