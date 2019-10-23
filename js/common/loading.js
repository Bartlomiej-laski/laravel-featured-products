Loading = {
	start:function(target){
		let loading = "<div class='dm-loading'><div class='spinner-grow text-info' role='status'><span class='sr-only'>Loading...</span></div></div>";
		$(target).append(loading);
	},

	stop:function(target){
		setTimeout(function(){
			$(target).find(".dm-loading").remove();
		},200);
	}
};