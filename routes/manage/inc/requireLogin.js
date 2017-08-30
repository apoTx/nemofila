function requireLogin(req,res,next) {
	if(!req.user){
		res.redirect('/manage/login');
	}else{
		next();
	}
}

module.exports = requireLogin;