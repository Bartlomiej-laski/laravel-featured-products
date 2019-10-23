<?php

use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\Auth\User\AccountController;
use App\Http\Controllers\Backend\Auth\User\ProfileController;
use \App\Http\Controllers\Backend\Auth\User\UpdatePasswordController;

//===== Featured Products =====//
Route::get('featured-products', ['uses' => 'Admin\Cms\FeaturedProductsController@index', 'as' => 'cms.featured_products']);

Route::get('ajax/featured-products/get-all-sections','Admin\Cms\FeaturedProductsController@get_all_sections');
Route::get('ajax/featured-products/get-all-products','Admin\Cms\FeaturedProductsController@get_all_products');
Route::post('ajax/featured-products/add-section','Admin\Cms\FeaturedProductsController@add_section');
Route::put('ajax/featured-products/edit-section','Admin\Cms\FeaturedProductsController@edit_section');

Route::post('ajax/featured-products/add-product','Admin\Cms\FeaturedProductsController@add_product');
Route::get('ajax/featured-products/get-linked-products','Admin\Cms\FeaturedProductsController@get_linked_products');
Route::put('ajax/featured-products/sort-products','Admin\Cms\FeaturedProductsController@sort_products');

Route::delete('ajax/featured-products/delete','Admin\Cms\FeaturedProductsController@delete');

Route::get('ajax/featured-products/search','Admin\Cms\FeaturedProductsController@search');
