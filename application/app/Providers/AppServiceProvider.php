<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Symfony\Component\Yaml\Yaml;
use App\Aukce;
use App\Observers\AukceObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
        if( file_exists(public_path('data/_nastaveni.yml')) ) {
          $data = Yaml::parse(file_get_contents(public_path('data/_nastaveni.yml')));
        } else {
          $data = [];
        }
        View::share('nastaveni',$data);
        View::share('script_prefix', config('app.env') == 'production' ? '.min' : '');

        Aukce::observe(AukceObserver::class);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
      $this->app->bind('path.public', function() {
          return base_path().DIRECTORY_SEPARATOR.'www';
      });
    }
}
