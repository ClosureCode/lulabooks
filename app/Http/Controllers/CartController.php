<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Base\Controller;
use App\Helpers\Response;
use ShopKit\Core\ShopKit;
use App\Models\Product;
use Log;

class CartController extends Controller
{
    public function getShoppingCart()
    {
        return Response::build([
          'items' => ShopKit::getShoppingCart()->getItems(),
          'total' => ShopKit::getShoppingCart()->getPriceTotal(),
        ]);
    }

    public function addToShoppingCart()
    {
        $validator = Validator::make(request()->all(), [
          'id' => 'exists:product,id',
          'qty' => 'min:1',
        ]);

        if ($validator->fails()) {
            return Response::build('Invalid API Usage', 403);
        }

        $product = Product::find(request('id'));


        ShopKit::getShoppingCart()
                   ->addItem(ShopKit::getShoppingCart()
                                           ->createItem()
                                           ->setId($product->id)
                                           ->setName($product->name)
                                           ->setQuantity(request('qty'))
                                           ->setGrade(request('grade'))
                                           ->setPrice($product->price)
                                           ->setOriginalItem($product)
                                           ->setMisc([
                                             'description' => $product->description,
                                             'image' => $product->images->count() ? $product->images->first()->url : '/img/box.png',
                                           ]));
       return $this->getShoppingCart();
    }

    public function removeShoppingCartItem($productId)
    {
        $validator = Validator::make(['id' => $productId], [
          'id' => 'exists:product,id',
        ]);

        if ($validator->fails()) {
            return Response::build('Invalid API Usage', 403);
        }

        ShopKit::getShoppingCart()->removeItem(ShopKit::getShoppingCart()->createItem()->setId($productId));

        return $this->getShoppingCart();
    }
}
