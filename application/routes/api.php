<?php

use Illuminate\Http\Request;
use App\Aukce;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('auctions', 'AukceApiController@index');
Route::get('auctions/{aukce}', 'AukceApiController@show');
Route::post('auctions', 'AukceApiController@store');
Route::put('auctions/{aukce}', 'AukceApiController@update');
Route::delete('auctions/{aukce}', 'AukceApiController@delete');

Route::put('auctions-visibility/{aukce}', 'AukceApiController@updateVisibility');
Route::put('auctions-updatePrice/{aukce}', 'AukceApiController@updateActualPrice');
Route::put('auctions-updatePriceAndClose/{aukce}', 'AukceApiController@updateActualPriceAndClose');
Route::put('auctions-timeWarp/{aukce}', 'AukceApiController@timeWarp');
Route::put('auctions-updateTOP3/{aukce}', 'AukceApiController@updateTOP3');





