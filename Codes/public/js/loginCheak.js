// JavaScript Document



function cheakEmail(email){
	var emailRegExp = new RegExp(            "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
	if (!emailRegExp.test(email)||email.indexOf('.')==-1){
		return false;
		}else{
		return true;
	}
}


function cheakUP(userName,passWord){
	
	if(!cheakEmail(userName)){
		
		return false;
	}
	
	if(passWord.length<6){
		return false;
	}
	return true;
}



function cheakPassSame(pw1,pw2){
	if(pw1==pw2){
		return true;
	}
	else{
		return false;
	}
}

function cheakNull(Citem){
	if (Citem==""||Citem==null){
		return false;
	}
	else{
		return true;
	}
}
