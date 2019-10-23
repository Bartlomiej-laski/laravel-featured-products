<?php

namespace App\Models\backend\cms;

use Illuminate\Database\Eloquent\Model;

class FeaturedProducts extends Model
{
	protected $table='cms_featured_products';
	public $primaryKey='id';
	public $timestamps = true;
	protected $fillable = [
		'section_id', 'product_id','product_type',
	];
}
