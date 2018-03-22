function getProfilePicture(provider, id, username) {
	let url;
	if (provider === 'Facebook'){
		url = 'http://graph.facebook.com/'+ id +'/picture?type=large&redirect=true&width=500&height=500';
	}else if (provider === 'Twitter'){
		url = 'https://twitter.com/'+ username +'/profile_image?size=original';
	}

	return url;
}

module.exports = getProfilePicture;
