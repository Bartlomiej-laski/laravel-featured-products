SlLightbox = {
	init: function() {
		$(document).delegate("[data-action=open-lightbox]", "click", this.open_lightbox);
		$(document).delegate("[data-action=close-lightbox]","click",this.close_lightbox);
	},
	open_lightbox: function(){
		let lightbox = $("#sl-lightbox");
		let image = $(this).attr("src");
		lightbox.find("img").attr("src",image);
		lightbox.removeClass("d-none");
	},
	close_lightbox: function(){
		let lightbox = $("#sl-lightbox");
		!lightbox.hasClass("d-none")?lightbox.addClass("d-none"):"";
	}
};