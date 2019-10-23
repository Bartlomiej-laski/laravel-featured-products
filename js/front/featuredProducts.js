FeaturedProducts = {
	init(){
		/*$(".fp-handle").each(function(){
			let target = "#"+$(this).attr("id");
			let shortcode = $(this).attr("data-shortcode");
			FeaturedProducts.get_linked_products(shortcode,target);
			Loading.start(target);
		})*/
	},
	get_linked_products: function(shortcode,target){
		$.ajax({
			type:"GET",
			url: "/ajax/featured-products/get-linked-products",
			data:{
				shortcode:shortcode
			},
			success: function (data){
				//console.log(data);
				FeaturedProducts.show_list(data.data,target,data.display);
			}
		})
	},
	show_list: function (data,target,display) {
		//Ancillary variables
		let img,buttonTxt;
		//Set target and display
		let trg = $(target);
		trg.addClass("dm-featuredProducts-"+display);
		//Get template
		let T = $("#featured-products-box-template");
		//Set template
		if(display === "slider"){
			T.find(".fp-box").addClass("fp-box-slider");
			T.find(".fp-slider-padding").addClass("fp-slider-padding-active");
			T.find(".fp-container").removeClass("mt-2 mb-2");
		}else if(display === "normal"){
			T.find(".fp-container").addClass("mt-2 mb-2");
			T.find(".fp-box").removeClass("fp-box-slider");
			T.find(".fp-slider-padding").removeClass("fp-slider-padding-active");
		}
		$.each(data,function(index,value){
			//Clear template
			FeaturedProducts.clear_template();
			//Check image
			let noImg = false;
			if(value.course_image) img = value.course_image;
			else if(value.image) img = value.image;
			else if(value.image_url) img = value.image_url;
			else noImg =true;
			//Set buttons text
			if(value.type === "blog") buttonTxt = "READ MORE";
			else buttonTxt = "BUY NOW";
			//Set url
			let type = value.type;
			let url;
			if(type === "blog") url = "/"+type+"/r/"+value.slug;
			else url = "/store/"+type+"/"+value.slug;
			T.find(".fp-link").attr("href",url);
			//Insert type
			T.find(".fp-box-type").html(type);
			//Insert title
			T.find(".fp-box-title").html(value.title);
			//Insert image if exist
			if(noImg === false) T.find(".fp-box-img").find("img").attr("src",appConfig.imagesURL+img);
			//Insert price if exist
			if(value.price) T.find(".fp-box-price").html(value.price+" $");
			if(value.total_price && value.total_price != value.price){
				T.find(".fp-box-price").html("<span style='text-decoration: line-through'>"+value.price+"</span> "+ value.total_price+" $");
			}
			if(!value.price) T.find(".fp-box-price").html("Free");
			//Insert description if exist
			if(value.description) T.find(".fp-box-desc").html(value.description.substr(0,150)+'..');
			if(value.content) T.find(".fp-box-desc").html(value.content.substr(0,150)+'..');
			//Insert url
			if(value.id) T.find(".fp-box-btn").html(buttonTxt).attr("href",url);
			//Target append
			//trg.append(T.html());
			trg.append(T.html());
		});
		if(display === "slider") FeaturedProducts.slick_slider(target);
		Loading.stop(target);
	},
	clear_template: function(){
		let T = $("#featured-products-box-template");
		T.find(".fp-box-title").html("");
		T.find(".fp-box-type").html("");
		T.find(".fp-box-img").find("img").attr("src","https://sl-shopping-cart.s3.amazonaws.com/prod/products/221/image_15652667244777.jpg");
		T.find(".fp-box-price").html("");
		T.find(".fp-box-desc").html("");
		T.find(".fp-box-btn").attr("href","");
	},
	slick_slider: function(target){
		$(target).slick({
			arrows:true,
			infinite: true,
			slidesToShow: 4,
			slidesToScroll: 1
		});
	}
};