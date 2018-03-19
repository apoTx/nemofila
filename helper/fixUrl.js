function fixUrl(item) {
	return '//' + item.replace(/^.*:\/\//, '');
}

module.exports = fixUrl;
