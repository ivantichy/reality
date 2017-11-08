<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Poptavka extends Model
{
    protected $table = 'poptavky';

    // protected $primaryKey = 'id';
    // protected $guarded = [];
    // protected $hidden = ['remember_token'];

    protected $fillable = [
        'email',
        'jmeno',
    ];

    public $timestamps = true;

    public $model_aukce_hodnoty = [ 'A', 'B' ];
}
