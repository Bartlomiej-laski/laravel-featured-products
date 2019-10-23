Validation = {
	simple: function(target,classy){
		if(!classy) classy=".v-data";
		$(classy).css("border-color","#e4e7ea");
		$(".validate-text").remove();
		let errors = false;
		$(target +" "+ classy).each(function(){
			if($(this).hasClass("v-required")){
				if($(this).val() === ""){
					$(this).css("border-color","red");
					if(!$(this).hasClass("v-nt")) $(this).after("<small class='form-text text-danger validate-text d-block'>This field is required.</small>");
					errors = true;
				}
			}
		});
		if(errors === false) return true;
		else if(errors === true) {
			Messages.fixed(false,"Check red fields!");
			return false;
		}
	}
};