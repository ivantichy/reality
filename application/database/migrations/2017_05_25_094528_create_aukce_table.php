<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAukceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aukce', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nadpis', 255);
            $table->string('slug', 255);
            $table->string('typ_aukce', 10);
            $table->string('typ_nemovitosti', 10);
            $table->string('mesto', 255);
            $table->string('adresa', 255);
            $table->longText('popis', 4)->nullable();
            $table->json('specifikace')->nullable();
            $table->json('podminky')->nullable();

            $table->char('model_aukce', 1);
            $table->decimal('cena_vyvolavaci', 10, 2)->unsigned();
            $table->decimal('polatky', 10, 2)->unsigned();
            $table->decimal('kauce', 10, 2)->unsigned();
            $table->json('vybrane_terminy');
            $table->date('datum_ukonceni');
            $table->json('obrazky')->nullable();

            //todo: zařadit toto do nové tabulky
            $table->string('jmeno', 200);
            $table->string('email', 200);
            $table->string('telefon', 20);
            $table->json('zajemci')->nullable();
            $table->string('dotaz_jsem', 150)->nullable();
            $table->json('dotaz_dulezite')->nullable();
            $table->json('dotaz_zaujalo_mne')->nullable();
            $table->string('dotaz_chci', 150)->nullable();
            $table->string('landing_page', 150)->nullable();

            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('aukce');
    }
}
