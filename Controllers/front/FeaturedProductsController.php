<?php

namespace App\Http\Controllers\Frontend\Cms;

use App\Http\Controllers\Controller;
use App\Models\Backend\Catalog\Product;
use App\Models\Backend\Cms\FeaturedProducts;
use App\Models\Backend\Cms\FeaturedProductsSections;
use App\Models\Blog;
use App\Models\Bundle;
use App\Models\Course;
use Illuminate\Http\Request;

class FeaturedProductsController extends Controller
{
	public function get_linked_products(Request $request){
		$results = array(); $i=0;
		$shortcode = $request->shortcode;
		$section = FeaturedProductsSections::select("id","display")->where("shortcode","=",$shortcode)->first();
		$products = FeaturedProducts::select("product_id","product_type")
			->where("section_id","=",$section->id)
			->orderBy("row_order","ASC")->get();
		foreach($products as $product){
			if($product->product_type === "product"){
				$data = Product::leftJoin("catalog_product_images","catalog_products.id","=","catalog_product_images.product_id")
					->where("is_main","=",true)
					->where("catalog_products.id","=",$product->product_id)->first();
			}
			else if($product->product_type === "course"){
				$data = Course::select("id","title","course_image","price","description","slug")
					->where("id","=",$product->product_id)->first();
			}else if($product->product_type === "blog"){
				$data = Blog::where("id","=",$product->product_id)->first();
			}else if($product->product_type === "bundle"){
				$data = Bundle::select("id","title","course_image","price","description","slug")
					->where("id","=",$product->product_id)->first();
			}
			$results[$i]=$data;
			$results[$i]["type"]  = $product->product_type;
			$i ++;
		}
		return response()->json(['data' => $results,"display" => $section->display]);
	}
}