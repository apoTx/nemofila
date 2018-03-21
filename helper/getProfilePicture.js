function getProfilePicture(provider, id) {
	let url;
	if (provider === 'Facebook'){
		url = 'http://graph.facebook.com/'+ id +'/picture?type=large&redirect=true&width=500&height=500';
	}

	return url;
}

module.exports = getProfilePicture;
