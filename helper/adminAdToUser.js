const Ads = require('../models/ads');

function adminAdToUser(newId, adminAdUuid, callback) {
	if(adminAdUuid){
		Ads.findOneAndUpdate(
			{
				uuid:adminAdUuid
			},
			{
				$set: {
					ownerId: newId,
					changeAdminToUser: 1
				}
			},
			(err) => {
				if (err)
					throw new Error(err);

				callback();
			}
		);
	}
}

module.exports = adminAdToUser;
