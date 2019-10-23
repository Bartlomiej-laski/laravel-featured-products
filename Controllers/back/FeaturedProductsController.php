<?php

namespace App\Http\Controllers\Backend\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Models\Backend\Catalog\Product;
use App\Models\Backend\Cms\FeaturedProducts;
use App\Models\Backend\Cms\FeaturedProductsSections;
use App\Models\Blog;
use App\Models\Bundle;
use App\Models\Category;
use App\Models\Course;
use App\Models\Page;
use Illuminate\Http\Request;

class FeaturedProductsController extends Controller
{
	public function index(){
		return view("backend/cms/featuredProducts");
	}

	public function get_all_sections(){
		$sections = FeaturedProductsSections::all();
		return response()->json([
			'data' => $sections
		]);
	}

	public function add_section(Request $request){
		$name = $request->name;
		$shortcode = $request->shortcode;
		$display= $request->display;

		$check = FeaturedProductsSections::where("shortcode","=",$shortcode)->count();
		if($check === 0){
			$section = new FeaturedProductsSections;
			$section->name = $name;
			$section->shortcode = $shortcode;
			$section->display = $display;
			$section->save();

			return response()->json([
				'status' => $section? true:false,
				'message' => $section? "You have successfully added section":"Error, refresh page and try again"
			]);
		}else{
			return response()->json([
				'status' => false,
				'message' => "Section with this shortcode already exist.Choose another name."
			]);
		}
	}

	public function edit_section(Request $request){
		$name = $request->name;
		$shortcode = $request->shortcode;
		$id = $request->id;
		$display= $request->display;

		$section = FeaturedProductsSections::find($id);
		$section->name = $name;
		$section->shortcode = $shortcode;
		$section->display = $display;
		$section->save();

		return response()->json([
			'status' => $section? true:false,
			'message' => $section? "You have successfully edited section":"Error, refresh page and try again"
		]);
	}

	public function get_all_products(Request $request){
		$page = $request->page-1;
		$limit = $request->limit;
		if($request->mode === "products") $total = Product::select("id")->count();
		else if($request->mode === "courses") $total = Course::select("id")->count();
		else if($request->mode === "blogs") $total = Blog::select("id")->count();
		else if($request->mode === "bundles") $total = Bundle::select("id")->count();
		else if($request->mode === "pages") $total = Page::select("id")->where("published","=",1)->count();
		else if($request->mode === "categories") $total = Category::select("id")->where("status","=",1)->count();
		$lastPage = ceil($total / $limit);
		$from = $page * $limit;

		if($request->mode === "products"){
			$data = Product::select("catalog_products.id","title","image_url","slug")
				->leftJoin("catalog_product_images","catalog_products.id","=","catalog_product_images.product_id")
				->where("is_main","=",true)
				->skip($from)->take($limit)->get();
		}
		else if($request->mode === "courses") $data =  Course::select("id","title","course_image","slug")->skip($from)->take($limit)->get();
		else if($request->mode === "blogs") $data =  Blog::select("id","title","image","slug","category_id","user_id")->skip($from)->take($limit)->get();
		else if($request->mode === "bundles") $data = Bundle::select("id","title","course_image","slug")->skip($from)->take($limit)->get();
		else if($request->mode === "pages") $data = Page::select("id","title","slug")->where("published","=",1)->skip($from)->take($limit)->get();
		else if($request->mode === "categories") $data = Category::select("id","name","slug")->where("status","=",1)->skip($from)->take($limit)->get();
		return response()->json(['data' => $data, 'lastPage' => $lastPage]);
	}

	public function search(Request $request){
		$value = $request->search;
		$mode = $request->mode;

		if($mode === "products"){
			$data = Product::select("catalog_products.id","title","image_url")
				->leftJoin("catalog_product_images","catalog_products.id","=","catalog_product_images.product_id")
				->where("is_main","=",true)
				->where('title', 'like', '%' . $value . '%')->get();
		}
		if($mode === "courses") $data = Course::where('title', 'like', '%' . $value . '%')->get();
		if($mode === "blogs") $data = Blog::where('title', 'like', '%' . $value . '%')->get();
		if($mode === "bundles") $data = Bundle::where('title', 'like', '%' . $value . '%')->get();
		if($mode === "pages") $data = Page::where('title', 'like', '%' . $value . '%')->where("published","=",1)->get();
		if($mode === "categories") $data = Category::where('name', 'like', '%' . $value . '%')->where("status","=",1)->get();

		return response()->json(['data' => $data]);
	}

	public function add_product(Request $request){
		$linked = new FeaturedProducts;
		$count = FeaturedProducts::where("product_id","=",$request->product)
			->where("section_id","=",$request->section)
			->where("product_type","=",$request->type)->count();
		if($count === 0){
			$linked->section_id = $request->section;
			$linked->product_id = $request->product;
			$linked->product_type = $request->type;
			$linked->save();
			$linked->row_order = $linked->id;
			$linked->save();
			return response()->json([
				"status" => $linked? true:false,
				"message" => $linked? "You have successfully added product":"Error ! Refresh page and try again"
			]);
		}else{
			return response()->json([
				"status" => false,
				"message" => "You added this product before"
			]);
		}
	}

	public function delete(Request $request){
		if($request->mode === "linked"){
			$delete = FeaturedProducts::destroy($request->id);
		}else if($request->mode === "section"){
			FeaturedProducts::where("section_id", "=",$request->id)->delete();
			$delete = FeaturedProductsSections::destroy($request->id);
		}

		return response()->json([
			"status" => $delete ? true:false,
			"message" => $delete? "You have successfully deleted product":"Error ! Refresh page and try again"
		]);
	}

	public function get_linked_products(Request $request){
		$results = array();
		$products = FeaturedProducts::where("section_id","=",$request->section)->orderBy("row_order","ASC")->get();
		foreach($products as $product){
			if($product->product_type === "product"){
				$data = Product::select("catalog_products.id","title","image_url")
					->leftJoin("catalog_product_images","catalog_products.id","=","catalog_product_images.product_id")
					->where("is_main","=",true)
					->where("catalog_products.id","=",$product->product_id)->get();
			}
			else if($product->product_type === "course"){
				$data = Course::where("id","=",$product->product_id)->get();
			}else if($product->product_type === "bundle"){
				$data = Bundle::where("id","=",$product->product_id)->get();
			}else if($product->product_type === "blog"){
				$data = Blog::where("id","=",$product->product_id)->get();
			}
			$data[0]["type"] = $product->product_type;
			$data[0]["linked_id"] = $product->id;
			array_push($results,$data[0]);
		}
		return response()->json([
			"data" => $results
		]);
	}

	public function sort_products(Request $request){
		$product = $request->product;
		$type = $request->type;
		$section = $request->section;
		$order = $request->order;
		FeaturedProducts::where("id","=",$product)->update([
				"row_order" => $order
			]);
	}
}