(function ($) {
    "use strict";


    /*==================================================================
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function () {
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity', '0');
    });

    $('.js-hide-modal-search').on('click', function () {
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity', '1');
    });

    $('.container-search-header').on('click', function (e) {
        e.stopPropagation();
    });


    /*==================================================================
    [ Isotope ]*/
    var $topeContainer = $('.isotope-grid');
    var $filter = $('.filter-tope-group');

    // filter items on button click
    $filter.each(function () {
        $filter.on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $topeContainer.isotope({ filter: filterValue });
        });

    });

    // init Isotope
    $(window).on('load', function () {
        var $grid = $topeContainer.each(function () {
            $(this).isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true,
                animationEngine: 'best-available',
                masonry: {
                    columnWidth: '.isotope-item'
                }
            });
        });
    });

    var isotopeButton = $('.filter-tope-group button');

    $(isotopeButton).each(function () {
        $(this).on('click', function () {
            for (var i = 0; i < isotopeButton.length; i++) {
                $(isotopeButton[i]).removeClass('how-active1');
            }

            $(this).addClass('how-active1');
        });
    });

    /*==================================================================
    [ Filter / Search product ]*/
    $('.js-show-filter').on('click', function () {
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        if ($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);
        }
    });

    $('.js-show-search').on('click', function () {
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        if ($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);
        }
    });


    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function () {
        var numProduct = Number($(this).next().val());
        var idCart = $(this).next().attr('data-id');
        if (numProduct > 0){
            $(this).next().val(changeCart(idCart, numProduct - 1, numProduct));
        };
    });

    $('.btn-num-product-up').on('click', function () {
        var numProduct = Number($(this).prev().val());
        var idCart = $(this).prev().attr('data-id');
        $(this).prev().val(changeCart(idCart, numProduct + 1, numProduct));        
    });

    $('#admin_cart_quantity').on('change',function(){
        var numProduct = $(this).val();
        var idCart = $('#admin_cart_quantity').attr('data-id');
        changeCart(idCart, numProduct, numProduct);
    })

    function changeCart(variantID,quantity,old) {
        var anw = old;
        var itemPrice = $('#admin_cart_price_'+variantID).attr('data-price');
        var invoiceTotal = $('#admin_invoice_total').attr('data-price');
        $.ajax({
            type: 'get',
            url: `/admin/selling/addtocart/${variantID}/${quantity}/1`,
            success: function(response) {
                document.getElementById('admin_cart_total_'+variantID).innerHTML = separator(itemPrice * quantity);
                var newTotal = invoiceTotal - (anw*itemPrice) + (quantity*itemPrice);
                document.getElementById('admin_invoice_total').innerHTML = separator(newTotal) + " VND";
                $('#admin_invoice_total').attr("data-price",newTotal);
            },
        });
        return quantity;
    }

    /*==================================================================
    [ Show modal1 ]*/
    $('.js-show-modal1').on('click', function (e) {
        e.preventDefault();
        $('.js-modal1').addClass('show-modal1');
        var url = $(this).attr('data-url');
        $.ajax({
            type: 'get',
            url: url,
            success: function (response) {
                $('#modal_product_name').text(response.data.name);
                $('#modal_product_desc').text(response.data.desc);
                $('#modal_product_price').text(separator(response.data.price) + " VND");

                const check = document.createElement('div');
                check.classList.add('check-modal-image');
                const modalImage = document.getElementById('modal_product_image');
                modalImage.innerHTML = `
                <div class="item-slick3" data-thumb="${response.data.image}">
                    <div class="wrap-pic-w pos-relative">
                        <img src="${response.data.image}" alt="IMG-PRODUCT">
                        <a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" href="${response.data.image}">
                            <i class="fa fa-expand"></i>
                        </a>
                    </div>
                </div>`;
                // Choose Size and Color
                $('#modal_product_size1').on('change', function () {
                    const boxSize = document.getElementById('modal_product_size1');
                    var selectedSize = boxSize.options[boxSize.selectedIndex].value;
                    var variantData = response.variant;
                    const boxColor = document.getElementById('modal_product_color1');
                    boxColor.innerHTML = `<option selected disabled>Chọn màu sắc</option>`;
                    variantData.forEach(function (item) {
                        if (item.size == selectedSize) {
                            boxColor.innerHTML = `<option value="${item.id}">${item.color}</option>`;
                        }
                    })
                });

            },
            error: function (jqXHR, textStatus, errorThrown) { }
        });
    });

    $('.js-hide-modal1').on('click', function () {
        $('.js-modal1').removeClass('show-modal1');
    });

    function separator(numb) {
        var str = numb.toString().split(".");
        str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return str.join(".");
    }


    // -------------- ADD TO CARD ----------------//
    $('#modal_product_add1').on('click', function () {
        const boxColor = document.getElementById('modal_product_color1');
        var variantID = boxColor.options[boxColor.selectedIndex].value;
        var quantity = document.getElementById('modal_product_quantity1').value;
        console.log(quantity);
        $.ajax({
            type: 'get',
            url: `/admin/selling/addtocart/${variantID}/${quantity}`,
            success: function (response) {
                console.log(response.status);
            }

        });
    });

    //------------ SEARCH CUSTOMER ----------------//
    $('#admin_customer_search').on('click',function(){
        var customerPhone = $(this).prev().val();
        $.ajax({
            type: 'get',
            url: `/admin/customer/search/${customerPhone}`,
            success: function(response){
                response.data.forEach(function($item){
                    $('#admin_customer_id').val($item.id)
                    $('#admin_customer_name').val($item.name)
                    $('#admin_customer_phone').val($item.phone)
                    $('#admin_customer_email').val($item.email)


                })
            },
            error: function(){
                alert('fail')
            }
        })
    })
})(jQuery);
