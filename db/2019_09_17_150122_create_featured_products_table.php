<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFeaturedProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cms_featured_products', function (Blueprint $table) {
            $table->increments('id');
			$table->integer("section_id")->unsigned();
			$table->integer("product_id");
			$table->enum("product_type",["course","blog","product","bundle"]);
			$table->integer("row_order");
			$table->timestamps();
			$table->foreign('section_id')->references('id')->on('cms_featured_products_sections');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cms_featured_products');
    }
}
