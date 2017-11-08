<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Yaml\Yaml;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Cache;

class AukceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $image_manager = new ImageManager();
        $directories = array_diff(scandir(database_path('data')), array('..', '.'));
        asort($directories);
        foreach ($directories as $directory) {

          //načist YML
          $data = Yaml::parse(file_get_contents(database_path('data/'.$directory.'/aukce.yml')));
          $obrazky = $data['obrazky'];
          $data['id'] = (int)$directory;
          $data['slug'] = str_slug($data['slug']);
          $data['specifikace'] = json_encode($data['specifikace']);
          $data['podminky'] = json_encode($data['podminky']);

          $data['dotaz_dulezite'] = json_encode($data['dotaz_dulezite']);
          $data['dotaz_zaujalo_mne'] = json_encode($data['dotaz_zaujalo_mne']);
          $vybrane_terminy_array = [];
          foreach ($data['vybrane_terminy'] as $termin) {
            $termin_explode = explode(' -', $termin, 2);
            $vybrane_terminy_array[] = [
              'den' => $termin_explode[0],
              'hodina' => isset($termin_explode[1]) ? $termin_explode[1] :''
            ];
          }
          $data['vybrane_terminy'] = json_encode( $vybrane_terminy_array );

          $data['zajemci'] = json_encode($data['zajemci'] );
          $data['obrazky'] = json_encode($data['obrazky'] );
          $data['created_at'] = date('Y-m-d H:i:s');

          if( isset($data['polatky'])) {
            $data['poplatky'] = $data['polatky'];
            unset($data['polatky']);
          }

          if( !isset($data['souradnice'])) {
            $data['souradnice'] = '49.073380, 17.970148';
          }

          //todo: konvertovat datum
          $datum_ukonceni = new DateTime();
          $datum_ukonceni->setTimestamp(strtotime($data['datum_ukonceni']));
          $data['datum_ukonceni'] = $datum_ukonceni->format('Y-m-d');

          if( DB::table('aukce')->where('id', $data['id'])->count() > 0 ) {
            continue;
          }

          DB::table('aukce')->insert($data);

          //uložit obrázky
          foreach ($obrazky as $key => $value) {
            $obrazek = database_path('data/'.$directory.'/'.$key.'.jpg');
            $obrazek_png = database_path('data/'.$directory.'/'.$key.'.png');
            if( file_exists($obrazek) || file_exists($obrazek_png) ) {
              if (!file_exists(public_path('images/aukce/'.$directory))) {
                  mkdir(public_path('images/aukce/'.$directory), 0777, true);
              }
              //print(PHP_EOL.'Obrázek: '.$obrazek.'');
              if( file_exists($obrazek_png) ) {
                $image_manager->make($obrazek_png)
                  ->save(public_path('images/aukce/'.$directory.'/'.$key.'.jpg'));
                $obrazek = public_path('images/aukce/'.$directory.'/'.$key.'.jpg');
              } else {
                copy(
                  $obrazek,
                  public_path('images/aukce/'.$directory.'/'.$key.'.jpg')
                );
              }
              // bug: nastane problém pokud obrázky jsou příliš veliké
              $image_manager->make($obrazek)
                ->fit(375, 281)
                ->save(public_path('images/aukce/'.$directory.'/'.$key.'-thumb.jpg'));
              $image_manager->make($obrazek)
                ->fit(781, 460)
                ->save(public_path('images/aukce/'.$directory.'/'.$key.'-velky.jpg'));
              $image_manager->make($obrazek)
                ->fit(187, 130)
                ->save(public_path('images/aukce/'.$directory.'/'.$key.'-maly.jpg'));
            } else {
                print(PHP_EOL.'Error: Obrázek '.$directory.'('.$key.') neexistuje.');
            }
          }
          // nahlásit error do konzole
        }

        Cache::flush();
    }
}
