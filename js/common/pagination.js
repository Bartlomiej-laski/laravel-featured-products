Pagination = {
	show: function(target,action,lastPage,activePage){
		let btnPrev, btnNext,classy;
		let trg= $(target);
		trg.empty();

		let from = activePage - 2;
		let to = activePage + 2;
		let toChange;

		if(to > lastPage){
			toChange = to - lastPage;
			from -= toChange;
			to = lastPage;
		}
		if(from < 1){
			from = Math.abs(from);
			if(from === 0){
				if(to < lastPage) to +=1;
			}else if(from === 1){
				if(to < lastPage -1) to+=2;
				else if(to < lastPage) to +=1;
				else if(to === lastPage) to= lastPage;
			}
			from = 1;
		}


		for(let i=from;i<=to;i++){
			if(activePage === i) classy="active";
			else classy="";
			let item = "<li class='page-item "+classy+"' data-action='pagination' data-mode='"+action+"' data-page='"+i+"'><a class='page-link'>"+i+"</a></li>";
			trg.append(item)
		}
		if(activePage > 1){
			btnPrev = "<li class='page-item' data-action='pagination' data-mode='"+action+"' data-page='"+(activePage-1)+"'><a class='page-link'>&laquo;</a></li>";
			trg.prepend(btnPrev);
		}
		if(activePage < lastPage){
			btnNext = "<li class='page-item' data-action='pagination' data-mode='"+action+"' data-page='"+(activePage+1)+"'><a class='page-link'>&raquo;</a></li>";
			trg.append(btnNext);
		}
	},

	remove:function(target){
		$(target).empty();
	}
};