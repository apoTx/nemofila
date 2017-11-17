function requireLogin(req,res,next) {
	if(!req.session.user){
		res.redirect('/manage/login');
	}else{
		next();
	}
}

module.exports = requireLogin;
