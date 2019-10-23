@extends('backend.layouts.app')
@section('title','Featured products')

@push('after-styles')
    <link rel="stylesheet" href="{{asset('css/common/common.css')}}"/>
    <link rel="stylesheet" href="{{asset('css/backend/cms/featuredProducts.css')}}"/>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
@endpush
@section('content')
    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <div class="row align-items-center">
                        <div class="col">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <label class="input-group-text" for="section-select">Sections</label>
                                </div>
                                <select class="custom-select" id="section-select">
                                    <!-- AJAX GET SECTIONS -->
                                </select>
                            </div>
                        </div>
                        <div class="col-md-auto">
                            <div id="section-buttons">
                                <button class="btn btn-primary" id="edit-section-button" data-toggle="modal" data-target="#manage-section" data-whatever="Edit section" data-action="edit-section">Edit</button>
                                <button class="btn btn-danger" id="delete-section-button" data-action="delete-section" data-mode="section"><i class="fas fa-trash"></i></button>
                            </div>
                            <button class="btn btn-success" data-toggle="modal" data-target="#manage-section" data-whatever="Add section" data-action="add-section">Add new</button>
                        </div>
                    </div>
                </div>
                <div class="bg-white" id="linked-products-section">
                    <ul class="list-group list-group-flush" id="linked-products-list">
                        <!-- Products list -->
                    </ul>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-block btn-lg" data-action="sort-products">Save order</button>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <div class="row align-items-center">
                        <div class="col header-select">
                            <span id="get-products">Products</span> |
                            <span data-action="get-courses" id="get-courses">Courses</span> |
                            <span data-action="get-bundles" id="get-bundles">Bundles</span> |
                            <span data-action="get-blogs" id="get-blogs">Blogs</span>
                        </div>
                        <div class="col">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="products-search-label"><i class="fas fa-search"></i></span>
                                </div>
                                <input type="text" class="form-control" id="products-search" data-action="search" data-mode="#searchmode" placeholder="Search" aria-label="Username" aria-describedby="products-search-label">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white" id="products-section">
                    <div class="list-group list-group-flush" id="products-list">
                        <!-- Products list -->
                    </div>
                </div>
                <div class="card-footer">
                    <ul class="pagination justify-content-end" id="products-pagination">
                        <!-- AJAX Pagination -->
                    </ul>
                </div>
            </div>
        </div>
    </div>




    <!-- Modal -->
    <div class="modal fade" id="manage-section" tabindex="-1" role="dialog" aria-labelledby="add-section-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="add-section-label">#Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="section-form">
                   <div class="form-group">
                       <label for="section-title">Name</label>
                       <input type="text" class="form-control v-data v-required" id="section-name">
                   </div>
                    <div class="form-group">
                        <label for="section-shortcode">Shortcode</label>
                        <input type="text" class="form-control v-data v-required" id="section-shortcode" disabled>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="section-display" id="normal-section" value="normal" checked>
                        <label class="form-check-label" for="normal-section">Normal</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="section-display" id="slider-section" value="slider">
                        <label class="form-check-label" for="slider-section">Slider</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" id="save-section" class="btn btn-primary" data-action="save-section" data-mode="#mode">Save changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Templates -->
    <div id="hidden-product-template" style="visibility: hidden">
        <li href="#" class="list-group-item ui-state-default" data-action="" data-product="#productID" data-type="#productType">
            <div>
                <img src="" class="product-image d-none">
                <span class="product-title">#Product title</span>
            </div>
            <!-- All products list -->
            <button class="add-product btn btn-success"><i class="fas fa-plus"></i></button>
            <!-- For linked products list -->
            <span class="linked-buttons">
                <button class="product-type btn btn-info"></button>
                <button class="product-delete btn btn-danger" data-action="delete-product" data-id="" data-mode="linked"><i class="fas fa-trash"></i></button>
            </span>
        </li>
    </div>
@endsection
@push('before-scripts')@endpush
@push('after-scripts')
    <script src="{{asset("js/backend/cms/featuredProducts.js")}}" type="text/javascript"></script>
    <script src="{{asset("js/common/pagination.js")}}" type="text/javascript"></script>
    <script src="{{asset("js/common/loading.js")}}" type="text/javascript"></script>
    <!--<script src="{{asset("js/common/search.js")}}" type="text/javascript"></script>-->


    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script>
    $(window).on('load', function(){
         FeaturedProductsBackend.init();
    });
    </script>
@endpush
