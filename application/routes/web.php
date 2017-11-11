<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', 'IndexController@showPronajem')->name('index-pronajem');
Route::get('/chci-koupit', 'IndexController@showProdej')->name('index-prodej');
Route::get('/ajax', 'IndexController@zpracujAjax')->name('ajax');

//Route::get('/elements/src/{element}', 'ElementController@show');

Route::any('/vlozit-nabidku/formular', 'AukceController@vlozitNabidku');
Route::any('/vlozit-nabidku/krok-{krok}', 'AukceController@vlozitNabidku')
  ->where('krok', '[1-3]+')
  ->name('nabidka-form');

Route::any('/vlozit-nabidku/zamitnuti', 'AukceController@zamitnoutNabidku')
  ->name('nabidka-zamitnuti');

Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});

Route::post('/kontakty', 'PageController@postKontakt');

Route::get('/prodej/{id}-{slug}', 'AukceController@show')
  ->where(['id' => '[0-9]+', 'name' => '[a-z]+']);

Route::get('/pronajem/{id}-{slug}', 'AukceController@show')
  ->where(['id' => '[0-9]+', 'name' => '[a-z]+']);

Route::get('/prodej/{id}-{slug}/prihoz', 'AukceController@showPrihoz')
  ->where(['id' => '[0-9]+', 'name' => '[a-z]+']);

Route::any('/prodej/{id}/mam-zajem', 'PoptavkaController@initPoptavka')
  ->where('id', '[0-9]+')
  ->name('poptavka-prodej');

Route::any('/pronajem/{id}/mam-zajem', 'PoptavkaController@initPoptavka')
  ->where('id', '[0-9]+')
  ->name('poptavka-pronajem');

Route::any('/prodej/{id}/mam-zajem/informace-o-vas', 'PoptavkaController@initPoptavkaKrok2')
  ->where('id', '[0-9]+')
  ->name('poptavka-prodej-krok-2');

Route::any('/pronajem/{id}/mam-zajem/informace-o-vas', 'PoptavkaController@initPoptavkaKrok2')
  ->where('id', '[0-9]+')
  ->name('poptavka-pronajem-krok-2');

Route::get('/prodej/{id}/mam-zajem/zamitnuti', 'PoptavkaController@zamitnoutPoptavku')
  ->where('id', '[0-9]+')
  ->name('poptavka-prodej-zamitnuti');

Route::get('/pronajem/{id}/mam-zajem/zamitnuti', 'PoptavkaController@zamitnoutPoptavku')
  ->where('id', '[0-9]+')
  ->name('poptavka-pronajem-zamitnuti');

Route::get('/{page}', 'PageController@show');
