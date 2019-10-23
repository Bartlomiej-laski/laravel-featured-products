Messages = {
	fixed(status,message){
		let classy;
		if(status === true) classy = "alert-success";
		if(status === false) classy = "alert-danger";
		let closeButton = "<button type='button' class='close ml-2' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		let alert = "<div class='fixed-alert alert alert-dismissible fade show animated fadeIn "+classy+"'>"+message+""+closeButton+"</div>";
		let alertContainer = "<div class='fixed-alert-container' onClick='Messages.clear_alerts()'>"+alert+"</div>";
		$("body").append(alertContainer);
		setTimeout(function(){
			$(".fixed-alert-container").remove();
		},4000)
	},
	alert(target,status,message,style){
		let classy;
		Messages.clear_alerts();
		if(status === true) classy = "alert-success";
		if(status === false) classy = "alert-danger";
		if(status === 'info') classy = "alert-info";
		let closeButton = "<button type='button' class='close ml-2' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		let alert = "<div class='alert mt-2 mb-2 simple-alert "+classy+"' style='"+style+"'>"+message+""+closeButton+"</div>";
		$(target).append(alert);
	},
	clear_alerts(){
		$(".simple-alert").remove();
		$(".fixed-alert-container").remove();
	}
};
