let SEARCHBREAK = false;

FeaturedProductsBackend = {
	init: function () {
		//Start loading
		Loading.start("#linked-products-section");
		Loading.start("#products-section");

		$(document).delegate('[data-action=add-section]', 'click', this._add_section);
		$(document).delegate('[data-action=save-section]', 'click', this.manage_section);
		$(document).delegate('[data-action=edit-section]', 'click', this._edit_section);
		$(document).delegate('[data-action=delete-section]', 'click', this.delete);

		$(document).delegate('#section-name', 'keyup', this.section_name_change_handle);
		$(document).delegate('#section-select', 'change', this.section_select_change_handle);

		$(document).delegate('[data-action=fp-add-linked-product]', 'click', this.add_product);
		$(document).delegate('[data-action=delete-product]', 'click', this.delete);
		$(document).delegate('[data-action=sort-products]', 'click', this.sort_products);

		this.get_sections("normal");

		//Sortable
		$( function() {
			let list = $( "#linked-products-list" );
			list.sortable({
				placeholder: "ui-state-highlight",
			});
			list.disableSelection();
		} );
	},

	//SECTIONS
	get_sections: function(mode,selectedID){
		$.ajax({
			type:"GET",
			url:"/user/ajax/featured-products/get-all-sections",
			success: function (data) {
				if(data.data.length === 0){
					let list = "#linked-products-section";
					Messages.alert(list,false,"No sections, add something");
					Loading.stop(list);
					$("#section-select").empty();
				}else FeaturedProductsBackend.show_sections(data.data,mode,selectedID);
			}
		})
	},

	show_sections: function(data,mode,selectedID){
		let list = $("#section-select");
		list.empty();
		$.each(data,function(index,value){
			let option = "<option value='"+value.id+"' data-display='"+value.display+"'>"+value.name+"</option>";
			list.append(option);
		});
		if(mode === "Edit section") $("#section-select option[value="+selectedID+"]").prop('selected', true);
		if(mode === "Add section") $("#section-select option:last").prop('selected', true);
		FeaturedProductsBackend.section_select_change_handle();
	},
	//Create shortcode
	section_name_change_handle: function(){
		let str = $("#section-name").val();
		let trimmed = $.trim(str);
		let slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
		replace(/-+/g, '-').
		replace(/^-|-$/g, '');
		$("#section-shortcode").val(slug.toLowerCase());
	},
	section_select_change_handle: function(){
		FeaturedProductsBackend.get_linked_products();
		let buttons = $("#section-buttons");
		if($("#section-select").val()) buttons.css("display","inline-block");
		else buttons.css("display","none");
	},
	//Add and edit section
	manage_section: function(){
		let name = $("#section-name").val();
		let shortcode = $("#section-shortcode").val();
		let mode = $(this).attr("data-mode");
		let sectionDisplay = $('input[name=section-display]:checked', '#section-form').val();
		let url,type,id;
		if( mode === "Add section"){
			url = "/user/ajax/featured-products/add-section";
			type = "POST";
			id = "";
		}else if(mode === "Edit section"){
			url = "/user/ajax/featured-products/edit-section";
			type = "PUT";
			id = $("#section-select option:selected").val();
		}
		if(Validation.simple("#manage-section")){
			$.ajax({
				type: type,
				url: url,
				data: {
					"name":name,
					"shortcode":shortcode,
					"display": sectionDisplay,
					"id":id
				},
				success: function (data) {
					Messages.fixed(data.status, data.message);
					if(data.status !== false){
						FeaturedProductsBackend.get_sections(mode,id);
					}
				}
			});
		}
	},
	//Before open "edit section" modal
	_edit_section: function(){
		let section = $("#section-select option:selected");
		//Get section name
		$("#section-name").val(section.html());
		//Get section display
		let display = section.data("display");
		if(display === "slider"){
			$("#slider-section").prop("checked", true);
		}else if(display === "normal"){
			$("#normal-section").prop("checked", true);
		}
		FeaturedProductsBackend.section_name_change_handle();
	},
	//Before open "add section" modal
	_add_section: function(){
		$("#section-form").find(".v-data").val("");
		$("#normal-section").prop("checked", true);
	},

	get_linked_products: function(){
		let sectionID = $("#section-select option:selected").val();
		if(sectionID){
			Loading.start("#linked-products-section");
			$.ajax({
				type:"GET",
				url:"/user/ajax/featured-products/get-linked-products",
				data:{
					section: sectionID
				},
				success: function (data) {
					//Check data
					if(data.data.length === 0){
						let section = "#linked-products-section";
						Messages.alert(section,false,"No products add something");
						Loading.stop(section);
						$("#linked-products-list").empty();
					} else FeaturedProductsBackend.show_products(data.data);
				}
			})
		}else Messages.alert("#linked-products-list",false,"No products add something");
	},
	show_products: function(data){
		let list,C,type;
		C = $("#hidden-product-template");
		list = $("#linked-products-list");
		list.empty();
		Messages.clear_alerts();
		//Each data
		$.each(data,function(index,value){
			//Product title
			C.find(".product-title").html(value.title);
			//Buttons
			type = value.type;
			C.find(".product-type").html(type);
			C.find(".product-delete").attr("data-id",value.linked_id);
			C.find(".list-group-item").attr("data-product",value.linked_id).attr("data-type",type);
			//Image
			let img; let noImage=false;
			if(value.course_image) img = value.course_image;
			else if(value.image) img = value.image;
			else if(value.image_url) img = value.image_url;
			else noImage =true;
			if(noImage === false) C.find(".product-image")
			.attr("src","/storage/img/products/"+img)
			.removeClass("d-none");
			//Append to target
			list.append(C.html());
		});
		Loading.stop("#linked-products-section");
	},

	add_product: function(){
		let sectionID = $("#section-select option:selected").val();
		//Select data from button
		let productID = $(this).data("product");
		let type = $(this).data("type");
		if(!sectionID) Messages.fixed(false,"You have to choose section");
		else{
			$.ajax({
				type:"POST",
				url:"/user/ajax/featured-products/add-product",
				data:{
					section: sectionID,
					product: productID,
					type: type
				},
				success: function (data) {
					Messages.fixed(data.status,data.message);
					if(data.status !== false){
						FeaturedProductsBackend.get_linked_products();
					}
				}
			});
		}
	},

	delete: function(){
		if(confirm("Are you sure ?")){
			let id;
			let mode = $(this).data("mode");
			if(mode === "linked") id = $(this).data("id");
			else if(mode === "section") id = $("#section-select option:selected").val();
			$.ajax({
				type:"DELETE",
				url:"/user/ajax/featured-products/delete",
				data:{
					id: id,
					mode:mode
				},
				success: function (data) {
					Messages.fixed(data.status, data.message);
					if (data.status !== false) {
						if (mode === "linked") FeaturedProductsBackend.get_linked_products();
						else if (mode === "section") FeaturedProductsBackend.get_sections("normal");
					}
				}
			});
		}
	},

	sort_products: function() {
		let list = $("#linked-products-list .list-group-item");
		let i = 0;
		list.each(
			function () {
				let product = $(this).attr("data-product");
				console.log(product);
				console.log(i);
				console.log("");
				$.ajax({
					type:"PUT",
					dataType: 'json',
					url:"/user/ajax/featured-products/sort-products",
					data:{
						product: product,
						order:i,
					}
				});
				i++;
			}
		).promise().done(function(){
			Messages.fixed(true,"You have successfully sorted products !");
		});
	},
};


$('#manage-section').on('show.bs.modal', function (event) {
	let button = $(event.relatedTarget);
	let mode = button.data('whatever');
	let modal = $(this);
	modal.find(".modal-title").html(mode);
	modal.find('#save-section').attr('data-mode',mode);
});
$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	}
});