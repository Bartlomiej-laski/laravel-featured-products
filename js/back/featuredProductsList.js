FpList = {
	page:1,
	mode:"products",
	searchBreak: false,

	init: function () {
		//Start loading
		Loading.start("#fp-products-section");
		$(document).delegate('[data-action=fp-get-products]', 'click', this._get_products);
		$(document).delegate('[data-action=fp-search]', 'keyup', this.search);
		//First loading
		this.get_products();
		//Pagination
		$(document).delegate('[data-action=pagination]', 'click', this.pagination_controller);
	},

	//Pagination Controller
	pagination_controller:function(){
		FpList.page = $(this).data("page");
		FpList.mode = $(this).data("mode");
		FpList.get_products();
	},
	//PRODUCTS
	_get_products: function(){
		FpList.page = 1;
		FpList.mode = $(this).attr("data-mode");
		FpList.get_products();
	},
	get_products:function(){
		Loading.start("#fp-products-section");
		$.ajax({
			type:"GET",
			url:"/user/ajax/featured-products/get-all-products",
			data:{
				page:FpList.page,
				limit:10,
				mode:FpList.mode
			},
			success: function (response) {
				if(response.data.length !== 0){
					FpList.show_products(response.data,FpList.mode);
					Pagination.show("#fp-products-pagination",FpList.mode,response.lastPage,FpList.page);
					$("#fp-products-search").attr("data-mode",FpList.mode);
				}else{
					let list = "#fp-products-section";
					Messages.alert(list,false,"No products add something");
					Loading.stop(list);
					$("#fp-products-list").empty();
				}
				$(".fp-header-select").find(".active").removeClass();
				$("#fp-get-"+FpList.mode).addClass("active");
			}
		})
	},

	show_products: function(data,mode){
		let list,C,flag;
		C = $("#fp-hidden-product-template");
		list = $("#fp-products-list");
		list.empty();
		Messages.clear_alerts();
		$.each(data,function(index,value){
			if(value.title) C.find(".fp-product-title").html(value.title);
			else if(value.name) C.find(".fp-product-title").html(value.name);
			if(mode === "categories") flag = "category";
			else  flag = mode.slice(0,-1);
			C.find(".list-group-item")
			.attr("data-product",value.id)
			.attr("data-type",flag)
			.attr("data-slug",value.slug);
			//Insert slug (For Menu manager)
			//Image
			let img; let noImage=false;
			if(value.course_image) img = value.course_image;
			else if(value.image) img = value.image;
			else if(value.image_url) img= value.image_url;
			else noImage =true;
			let obj =  C.find(".fp-product-image");
			if(noImage === false){
				obj.attr("src",appConfig.imagesURL+"/"+img)
				.removeClass("d-none");
			} else if(!obj.hasClass("d-none") && noImage === true) {
				obj.addClass("d-none");
			}
			//Append to target
			list.append(C.html());
		});
		Loading.stop("#fp-products-section");
	},
	//Search controllers
	search: function(){
		let mode = $(this).attr("data-mode");
		let search = $(this).val();
		if(search.length > 2 && FpList.searchBreak === false){
			Loading.start("#fp-products-section");
			FpList.searchBreak = true;
			$.ajax({
				type:"GET",
				url:"/user/ajax/featured-products/search",
				data:{
					search: search,
					mode: mode
				},
				success: function (data) {
					Pagination.remove("#fp-products-pagination");
					FpList.show_products(data.data,mode);
					FpList.stop_break();
				}
			})
		}else if(search.length === 0){
			FpList.get_products(1,mode);
			FpList.stop_break();
		}
	},
	stop_break(){
		setTimeout(function(){
			FpList.searchBreak = false;
		});
	}
};
$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	}
});