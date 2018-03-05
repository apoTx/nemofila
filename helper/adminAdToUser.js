const Ads = require('../models/ads');

function adminAdToUser(newId, adminAdUuid) {
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
			(err, result) => {
				if (err)
					throw new Error(err);

				console.log(result);
			}
		);
	}
}

module.exports = adminAdToUser;
