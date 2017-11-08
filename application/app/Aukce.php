<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DateTime;

class Aukce extends Model
{
    protected $table = 'aukce';

    // protected $primaryKey = 'id';
  	// protected $guarded = [];
  	// protected $hidden = ['remember_token'];

    protected $fillable = [
        'email',
        'jmeno',
        'mesto',
        'adresa',
        'typ_aukce',
        'typ_nemovitosti',
    ];

    public $timestamps = true;

    public $typ_aukce_hodnoty = [ 'prodej', 'pronajem' ];
    public $typ_nemovitosti_hodnoty = [ 'byt', 'dum', 'chata' ];
    public $stav_hodnoty = [ 'probihajici', 'ukoncena' ];
    public $model_aukce_hodnoty = [ 'A', 'B' ];
    public $cena_vyvolavaci_array;
    public $vybrane_terminy_array;
    public $souradnice_array;

    public function getLink()
    {
      return url('/').'/'.$this->typ_aukce.'/'.$this->id.'-'.$this->slug;
    }

    /**
     * generuje text který popisuje kdy aukce končí
     *
     * @return string
     */
    function aukce_konci() {
      $dnes = new DateTime();
      $datum_ukonceni = new DateTime($this->datum_ukonceni);
      if( $dnes < $datum_ukonceni ) {
        $rozdil = $dnes->diff($datum_ukonceni)->days;
        if( $rozdil >= 5 ) {
          $this->aukce_konci = 'Za '.$rozdil.' dnů';
        } else if( $rozdil >= 2 ) {
          $this->aukce_konci = 'Za '.$rozdil.' dny';
        } else {
          $this->aukce_konci = 'Dnes';
        }
      } else {
        $this->aukce_konci = 'Aukce již skončila';
      }
    }

    function zjisti_dny_do_konce() {
      $dnes = new DateTime();
      $datum_ukonceni = new DateTime($this->datum_ukonceni);
      if( $dnes < $datum_ukonceni ) {
        $rozdil = $dnes->diff($datum_ukonceni)->days;
        if( $rozdil >= 5 ) {
          $this->dny_do_konce = $rozdil.' dní do konce aukce';
        } else if( $rozdil >= 2 ) {
          $this->dny_do_konce = $rozdil.' dny do konce aukce';
        } else {
          $this->dny_do_konce = $rozdil.' den do konce aukce';
        }
      } else {
        $this->dny_do_konce = 'Aukce již skončila';
      }
    }

    function ukoncena() {
      return $this->stav == 'ukoncena';
    }

}
