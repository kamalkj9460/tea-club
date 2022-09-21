
  (function () {
    // console.log('Script Start');
    var oldSnippetPresent = true;
    try {
      var snip = document.getElementById("trustedShopsCheckout");
      if (snip) {
        snip.remove();
      } else {
        oldSnippetPresent = false;
      }
    } catch(e) {
      oldSnippetPresent = false;
    }
    
  function addCheckoutData(oldSnippetPresent, callback) {
    function addTsElements(cdata, reqdata) {
      var items = "";
      var lis = reqdata.line_items;
      for (var idx in lis) {
        var i = lis[idx];
        var iStr = 
        '        <div class="tsCheckoutProductItem">            <div class="tsCheckoutProductUrl">'+ i.productUrl +'</div>            <div class="tsCheckoutProductImageUrl">'+ i.imageUrl +'</div>            <div class="tsCheckoutProductName">'+ i.title +'</div>            <div class="tsCheckoutProductSKU">'+ i.sku +'</div>            <div class="tsCheckoutProductGTIN">'+ i.barcode +'</div>             <div class="tsCheckoutProductBrand">'+ i.vendor +'</div>        </div>        ';
        items += iStr;
      }
      var div = document.createElement('div');
      div.innerHTML =
      '      <!-- Trusted Shops v2.0 -->      <div id="trustedShopsCheckout" style="display:none;">        <!-- <div id="tsCheckoutOrderNr">'+ cdata.order_id + '</div> -->        <div id="tsCheckoutOrderNr">'+ reqdata.orderName + '</div>        <div id="tsCheckoutBuyerId">'+ cdata.customer_id + '</div>        <div id="tsCheckoutBuyerEmail">'+ cdata.email + '</div>        <div id="tsCheckoutOrderAmount">'+ cdata.total_price +'</div>        <div id="tsCheckoutOrderPaymentType">'+ reqdata.paymentGateway +'</div>        <div id="tsCheckoutOrderCurrency">'+ cdata.currency +'</div>        <!-- for each product in the basket full set of data is required -->        '+ items + '        <!-- product reviews end -->      </div>      <!-- Trusted Shops v2.0 - END -->      ';
      // Append Element
      document.body.appendChild(div);
    }

    if ( Shopify && Shopify.Checkout && Shopify.Checkout.OrderStatus) {
      // console.log('checkoutScript', 'we are on the checkout page ...');
      // check if we are on the thankyou page to display the code only once Shopify.Checkout.page != "thank_you"!!!
      if (!Shopify.checkout || Shopify && Shopify.Checkout && Shopify.Checkout.page != "thank_you") {
        // console.log('No object Shopify.checkout found');
      } else {
        var c = Shopify.checkout;
        var url = 'https://trustedshops.vilango.com/orderstatus/'+ Shopify.Checkout.apiHost +'/'+ c.order_id +'/'+ c.created_at+'?oldSnippetPresent='+oldSnippetPresent;
        // console.log('checkoutScript', url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
          if ( xhr.readyState === XMLHttpRequest.DONE ) {
            if (xhr.status === 200){
              // console.log('fetchData', url, xhr.response);
              // console.log('fetchData--', JSON.parse(xhr.response));
              var data = JSON.parse(xhr.response);
              addTsElements(c, data);
              callback(null);
            } else {
              callback(xhr.status);
              throw Error('Could not get order status: '+ xhr.status +'|'+ xhr.response);
            }
          }
        };
        xhr.send();
      }
    } else {
      callback();
    }
  };

    
function addProductData() {
  // Version 1.1
  // console.log("productScript", "loaded", 'shopify-section-product-template');
  var tsId = 'X51031D0AF094350A1B20AEFD2C90FB66';
  var prLocale = 'de_DE';
  var loadProductReviews = function(tsId, skus) {
    _tsProductReviewsConfig = {
      tsid: tsId,
      locale: prLocale,
      sku: skus,
      variant: 'productreviews',
      borderColor: '#0DBEDC',
      // Correct: Test override
      //'apiServer': '//api-qa.trustedshops.com/',
      introtext: 'Was unsere Kunden sagen',
      //maxHeight: 'undefined', not needed anymore
      hideEmptySticker: 'false'
    };
    //var scripts = document.getElementsByTagName('SCRIPT'), me = scripts[scripts.length - 1];
    var me = document.getElementById('shopify-section-product-template');
    var _ts = document.createElement('SCRIPT');
    _ts.type = 'text/javascript';
    _ts.async = true;
    _ts.charset = 'utf-8';
    // Correct: Test override
    _ts.src ='//widgets.trustedshops.com/reviews/tsSticker/tsProductSticker.js';
    //_ts.src ='//qa.trustedshops.com/trustbadge/reviews/tsSticker/tsProductSticker.js';
    if (me) {
      me.appendChild(_ts);
    }
    _tsProductReviewsConfig.script = _ts;
  };
  var pathname = window.location.pathname;
  if (pathname.indexOf('/products/') !== -1) {
    // console.log("productScript", "on product page");
    var request = new XMLHttpRequest();
    var productUrl = window.location.pathname+'.js';
    request.open('GET', productUrl, true);
    console.log("productScript", productUrl);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        // extract skus
        var skus = [];
        var arrayLength = data.variants.length;
        for (var i = 0; i < arrayLength; i++) {
          // console.log(data.variants[i]);
          skus.push(data.variants[i].sku);
        }
        console.log("success", skus, data);
        // Correct: Test override
        loadProductReviews(tsId, skus);
      } else {
        // We reached our target server, but it returned an error
        // console.warn("Could not load product json", request.status);
      }
    };
    
    request.onerror = function(error) {
      // There was a connection error of some sort
      // console.warn("Error loading product json", productUrl, error);
    };
    request.send();
  };
};

    if (typeof addProductData === "function") {
      addProductData();
    }
    addCheckoutData(oldSnippetPresent, function(error){
      if (!error) {
        
// Version 1.2
// console.log("Trusted Shops Badge", "loaded...");
( function() {
  var _tsid = 'X51031D0AF094350A1B20AEFD2C90FB66';
  _tsConfig = { 
    'yOffset': '150', /* offset from page bottom */
    'variant': 'reviews', /* text, default, small, reviews, custom, custom_reviews */
    
  };
  var _ts = document.createElement('script');
  _ts.type = 'text/javascript'; 
  _ts.charset = 'utf-8'; 
  _ts.async = true; 
  _ts.src = '//widgets.trustedshops.com/js/' + _tsid + '.js'; 
  var __ts = document.getElementsByTagName('script')[0];
  __ts.parentNode.insertBefore(_ts, __ts);
})();

      } else {
        console.error("Error - Not adding a tsScript", error);
      }
    });

    // add default styling to the productReviews
    var style = document.createElement('style');
    style.innerHTML =
      '#trustedshops-productreviews-sticker-wrapper {' +
        'margin: 20px 20px 0 20px;' +
      '}';
    // Get the first script tag
    var ref = document.querySelector('script');
    // Insert our new styles before the first script tag
    ref.parentNode.insertBefore(style, ref);
  })();
  