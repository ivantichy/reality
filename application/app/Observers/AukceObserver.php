<?php
namespace App\Observers;
use App\Aukce;
use Illuminate\Support\Facades\Cache;

class AukceObserver
{

    /**
     * Listen to the Aukce saved event.
     *
     * @param  Aukce  $aukce
     * @return void
     */
    public function saved(Aukce $aukce)
    {
      // todo: vyčistit pouze cahce "aukcí"
      Cache::flush();
    }

    /**
     * Listen to the Aukce created event.
     *
     * @param  Aukce  $aukce
     * @return void
     */
    public function created(Aukce $aukce)
    {
        //
    }

    /**
     * Listen to the Aukce deleting event.
     *
     * @param  Aukce  $aukce
     * @return void
     */
    public function deleting(Aukce $aukce)
    {
        //
    }
}
