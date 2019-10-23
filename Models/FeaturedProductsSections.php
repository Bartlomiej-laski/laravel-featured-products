<?php

namespace App\Models\backend\cms;

use Illuminate\Database\Eloquent\Model;

class FeaturedProductsSections extends Model
{
	protected $table='cms_featured_products_sections';
	public $primaryKey='id';
	public $timestamps = true;
	protected $fillable = [
		'name', 'shortcode',
	];
}
