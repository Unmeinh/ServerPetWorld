exports.check_request_login = (req,res,next)=>{
    if(req.session.adLogin){
        next();
    }
    else{
        res.redirect('/account/login');
    }
}