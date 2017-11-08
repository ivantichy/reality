<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Zprava extends Model
{
    protected $table = 'zpravy';

    // protected $primaryKey = 'id';
    // protected $guarded = [];
    // protected $hidden = ['id'];

    protected $fillable = [
        'email',
        'jmeno'
    ];

    public $timestamps = true;
}
