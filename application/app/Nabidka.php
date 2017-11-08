<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Aukce;

class Nabidka extends Aukce
{
    protected $table = 'nabidky';

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

}
