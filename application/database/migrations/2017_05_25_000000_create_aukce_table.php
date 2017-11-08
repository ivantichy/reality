<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAukceTable extends Migration
{

    public function tabulka_aukce(Blueprint $table) {
        $table->increments('id');

        $table->string('nadpis', 255);
        $table->boolean('active');
        $table->string('slug', 255);
        $table->string('stav', 100);
        $table->string('typ_aukce', 10);
        $table->string('typ_nemovitosti', 10);
        $table->string('mesto', 255);
        $table->string('adresa', 255)->nullable();
        $table->string('souradnice', 255)->nullable();
        $table->text('popis', 4)->nullable();
        $table->text('specifikace')->nullable(); // json
        $table->text('podminky')->nullable();

        $table->char('model_aukce', 1)->nullable();
        $table->decimal('cena_vyvolavaci', 12, 2)->unsigned()->default(0);
        $table->decimal('poplatky', 10, 2)->unsigned()->default(0)->nullable();
        $table->decimal('kauce', 10, 2)->unsigned()->default(0)->nullable();
        $table->text('vybrane_terminy')->nullable(); // json
        $table->date('datum_ukonceni')->nullable();
        $table->text('obrazky')->nullable(); // json

        $table->string('jmeno', 200);
        $table->string('email', 200);
        $table->string('telefon', 20);
        $table->text('zajemci')->nullable(); // json
        $table->text('zajemci_pocet')->default(0); // json
        $table->string('dotaz_jsem', 150)->nullable();
        $table->text('dotaz_dulezite')->nullable(); // json
        $table->text('dotaz_zaujalo_mne')->nullable(); // json
        $table->text('dotaz_chci')->nullable();
        $table->string('landing_page', 150)->nullable();
        $table->integer('krok')->default(0);
        $table->string('secret_key', 12)->nullable();
        $table->text('poznamka')->nullable();

        //$table->rememberToken();
        $table->timestamps();
        $table->index(['active']);
        $table->index(['stav', 'active', 'typ_aukce']);
        $table->index(['stav', 'active', 'typ_aukce', 'mesto']);
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aukce', function (Blueprint $table) {
          self::tabulka_aukce($table);
        });

        Schema::create('nabidky', function (Blueprint $table) {
          self::tabulka_aukce($table);
        });

        Schema::create('poptavky', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_aukce')->unsigned();
            /*
            $table->foreign('id_aukce')
              ->references('id')->on('aukce')
              ->onDelete('SET NULL')
              ->onUpdate('SET NULL');
            */
            $table->string('typ_aukce', 255); // lze zjisiti z aukce

            $table->string('termin', 255);
            $table->char('model_aukce');
            $table->string('delka_pronajmu', 50)->nullable();
            $table->string('nazev_aukce', 255)->nullable();

            $table->string('jmeno', 200);
            $table->string('email', 200);
            $table->string('telefon', 20);
            $table->text('motivace')->nullable();
            $table->string('dotaz_vek', 50)->nullable();
            $table->string('dotaz_jsem', 150)->nullable();
            $table->text('dotaz_dulezite')->nullable(); // json
            $table->text('dotaz_zaujalo_mne')->nullable(); // json
            $table->text('dotaz_chci')->nullable();
            $table->string('landing_page', 150)->nullable();
            $table->integer('krok')->default(0);
            $table->string('secret_key', 12)->nullable();
            $table->text('poznamka')->nullable();

            //$table->rememberToken();
            $table->timestamps();

            $table->index('typ_aukce');
            $table->index('model_aukce');
        });

        Schema::create('zpravy', function (Blueprint $table) {
            $table->increments('id');
            $table->string('typ', 200);

            $table->string('jmeno', 200);
            $table->string('email', 200)->nullable();
            $table->string('telefon', 20)->nullable();
            $table->string('lokalita', 200)->nullable();
            $table->string('dispozice', 200)->nullable();
            $table->text('zprava')->nullable();

            $table->string('landing_page', 150)->nullable();
            $table->text('poznamka')->nullable();

            //$table->rememberToken();
            $table->timestamps();

            $table->index('typ');
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
        Schema::dropIfExists('nabidky');
        Schema::dropIfExists('poptavky');
        Schema::dropIfExists('zpravy');
    }
}
