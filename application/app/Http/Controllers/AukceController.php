<?php

namespace App\Http\Controllers;

use App\Aukce;
use App\Nabidka;
use Illuminate\Http\Request;
use Symfony\Component\Yaml\Yaml;
use Illuminate\Validation\Rule;
use DateTime;
use Mail;

class AukceController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // todo: zakázat zobrazení neaktivních Aukcí
        $data = Yaml::parse(file_get_contents(public_path('data/aukce-detail.yml')));

        $aukce = Aukce::findOrFail($id);

        $aukce->zjisti_dny_do_konce();
        $aukce->zajemci_array = json_decode($aukce->zajemci);
        $aukce->vybrane_terminy_array = json_decode($aukce->vybrane_terminy);
        $aukce->specifikace_array = json_decode($aukce->specifikace, true);
        $aukce->specifikace_celkem = count($aukce->specifikace_array);
        $aukce->podminky_array = json_decode($aukce->podminky, true);
        $aukce->souradnice_array = explode(',', $aukce->souradnice);

        $aukce->datum_ukonceni .= ' 23:59';

        // načte aukce ze stejného města
        $dalsi_aukce = Aukce::where('stav', 'probihajici')
          ->where('active', 1)
          ->whereNotIn('id', [$aukce->id])
          ->where('mesto', $aukce->mesto)
          ->where('typ_aukce', $aukce->typ_aukce)
          ->orderBy('created_at', 'desc')
          ->paginate(3);

        foreach ($dalsi_aukce as $dalsi) {
          $dalsi->aukce_konci();
        }

        return view('aukce-detail'.($aukce->ukoncena() ? '-ukoncena' : ''))
          ->withAukce($aukce)
          ->withObrazky(json_decode($aukce->obrazky, true))
          ->withData($data)
          ->with('page', 'detail-aukce')
          ->with('dalsi_aukce', $dalsi_aukce);
    }

    public function showPrihoz($id) {
      // TODO: neduplikovat kod z show, neprogramovat cesky
      $data = Yaml::parse(file_get_contents(public_path('data/aukce-detail.yml')));

      $aukce = Aukce::findOrFail($id);

      $aukce->zjisti_dny_do_konce();
      $aukce->zajemci_array = json_decode($aukce->zajemci);
      $aukce->vybrane_terminy_array = json_decode($aukce->vybrane_terminy);
      $aukce->specifikace_array = json_decode($aukce->specifikace, true);
      $aukce->specifikace_celkem = count($aukce->specifikace_array);
      $aukce->podminky_array = json_decode($aukce->podminky, true);
      $aukce->souradnice_array = explode(',', $aukce->souradnice);

      $aukce->datum_ukonceni .= ' 23:59';

      // načte aukce ze stejného města
      $dalsi_aukce = Aukce::where('stav', 'probihajici')
        ->where('active', 1)
        ->whereNotIn('id', [$aukce->id])
        ->where('mesto', $aukce->mesto)
        ->where('typ_aukce', $aukce->typ_aukce)
        ->orderBy('created_at', 'desc')
        ->paginate(3);

      foreach ($dalsi_aukce as $dalsi) {
        $dalsi->aukce_konci();
      }

      return view('aukce-detail-prihoz')
        ->withAukce($aukce)
        ->withObrazky(json_decode($aukce->obrazky, true))
        ->withData($data)
        ->with('page', 'detail-aukce')
        ->with('dalsi_aukce', $dalsi_aukce)
        ;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Aukce  $aukce
     * @return \Illuminate\Http\Response
     */
    public function edit(Aukce $aukce)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Aukce  $aukce
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Aukce $aukce)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Aukce  $aukce
     * @return \Illuminate\Http\Response
     */
    public function destroy(Aukce $aukce)
    {
        //
    }

    /**
     * Vložit novou akci
     *
     * @param  int $krok
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function vlozitNabidku($krok, Request $request)
    {
        if( file_exists(public_path('data/form-aukce-nabidka.yml')) ) {
            $data = Yaml::parse(file_get_contents(public_path('data/form-aukce-nabidka.yml')));
        } else {
            $data = [];
        }

        $id_nabidky = (int)$request->session()->get('id_nabidky');
        $nabidka_secret_key = $request->session()->get('nabidka_secret_key');
        $nabidka = $id_nabidky > 0 ? Nabidka::where('id', $id_nabidky)
          ->where('secret_key', $nabidka_secret_key)->first() : false;

        if( $krok > 1 && !$nabidka ) {
            $request->session()->flash('error', 'Nejdříve doplňte všechny údaje v prvním kroku.');
            return redirect()->route('nabidka-form', ['krok' => 1]);
        }

        //$krok = $request->input('krok');
        $result = false;
        if ($request->isMethod('post')) {
          if( $krok == 3 ) {
              $result = self::vlozitNabidkuKrok3($request, $nabidka, $data);
          } elseif ($krok == 2) {
              $result = self::vlozitNabidkuKrok2($request, $nabidka);
          } elseif( $request->isMethod('post') ) {
              $result = self::vlozitNabidkuKrok1($request, $data);
          }
        }

        /*
        if ($request->isMethod('post') && $request->has('ajax')) {
            if( $result ) {
                return response()->json(['success' => 'true']);
            } else {
                return response()->json(['error' => $request->session()->get('success')]);
            }
        }
        */

        if ( is_a ( $result, 'Illuminate\Http\RedirectResponse' ) ) {
            return $result;
        }

        if ($request->isMethod('post')) {
          if( $result ) {
            if( $krok == 3 ) {
              return redirect()->route('nabidka-zamitnuti');
            }
            return redirect()->route('nabidka-form', ['krok' => $krok + 1]);
          }
        }

        // konvertujeme některé proměnné
        if( $nabidka ) {
          if( $nabidka->datum_ukonceni ) {
            $datum_ukonceni = DateTime::createFromFormat('Y-m-d', $nabidka->datum_ukonceni);
            $nabidka->datum_ukonceni = $datum_ukonceni->format('d.n.Y');
          }
          if( $nabidka->model_aukce && $nabidka->cena_vyvolavaci ) {
            $nabidka->cena_vyvolavaci_array[$nabidka->model_aukce] = $nabidka->cena_vyvolavaci;
          }
          $vybrane_terminy_array = [];
          if( !empty($nabidka->vybrane_terminy) ) {
            $vybrane_terminy_array = json_decode($nabidka->vybrane_terminy, true);
            //todo: toto bude asi vhodné změnit (není důležité)
            foreach ($vybrane_terminy_array as $key => $value) {
              $nabidka->vybrane_terminy_array[] = json_encode($value);
            }
          }

          // doplníme hodnoty tak aby ve formuláři byly minimálně dva termmíny
          $count = count($nabidka->vybrane_terminy_array);
          for ($i=0; $i < max(2 - $count, 0); $i++) {
            $nabidka->vybrane_terminy_array[] = '';
          }
        }

        $specifikace = [];
        if( $krok == 1 && !empty($nabidka->specifikace) ) {
          $specifikace = json_decode($nabidka->specifikace);
        }

        return view('aukce-nabidka')
          ->withData($data)
          ->with('id_nabidky', $id_nabidky)
          //->with('nabidka_secret_key', $nabidka_secret_key)
          ->with('krok_aktualni', $krok)
          ->with('nabidka', $nabidka)
          ->with('specifikace', $specifikace)
          ->withPage('nabidka');
    }

    public function vlozitNabidkuKrok1(Request $request, Array $data)
    {

      if ($request->session()->exists('landing_page')) {
          $landing_page = $request->session()->get('landing_page');
      } else {
          $landing_page = 'jiná';
      }

      $nabidka = false;

      if ( $id_nabidky = $request->session()->get('id_nabidky') > 0 ) {
        $nabidka = Nabidka::where('id', $id_nabidky)->where('secret_key', $request->session()->get('nabidka_secret_key'))->first();
      }

      if( !$nabidka ) {
        $nabidka = new Nabidka;
      }

      $nova_nabidka = !(bool)$nabidka->id;

      $this->validate($request, [
          'typ_aukce' => [
              'required',
              Rule::in($nabidka->typ_aukce_hodnoty),
          ],
          'typ_nemovitosti' => [
              'required',
              Rule::in($nabidka->typ_nemovitosti_hodnoty),
          ],
          'mesto' => 'required|min:3',
          'adresa' => 'nullable',
          'specifikace' => 'required',
          'jmeno' => 'required|min:3',
          'email' => 'required|email',
          'telefon' => 'required|min:9',
          'souhlas' => 'required|accepted',
          'krok' => 'required|integer',
      ]);

      // uložit do databáze
      $nabidka->nadpis = $request->typ_aukce.' '.$request->typ_nemovitosti.' '.$request->mesto;
      $nabidka->slug = str_slug($nabidka->nadpis, '-');
      $nabidka->stav = 'probihajici';
      $nabidka->typ_aukce = $request->typ_aukce;
      $nabidka->typ_nemovitosti = $request->typ_nemovitosti;
      $nabidka->mesto = $request->mesto;
      $nabidka->adresa = $request->adresa;

      // todo: v JSONu skrýt nulové hodnoty (není důležité)
      $nabidka->specifikace = json_encode($request->specifikace);

      $nabidka->jmeno = $request->jmeno;
      $nabidka->email = $request->email;
      $nabidka->telefon = $request->telefon;

      $nabidka->landing_page = $landing_page;
      $nabidka->krok = $request->krok;
      $nabidka->secret_key = str_random(12);

      if( !$nabidka->save() ) {
          $request->session()->flash('error', 'Nastal problém při ukládání formuláře.');
          return false;
      }

      if( $nova_nabidka ) {
        $data['jmeno'] = $nabidka->jmeno;
        $data['email'] = $nabidka->email;
        $data['telefon'] = $nabidka->telefon;
        $data['odkaz'] = 'https://aukcebydleni.cz/admin/nabidka/'.$nabidka->id;
        Mail::send('emails.info-admin', $data, function($message) use ($data, $nabidka){
            $message->from($data['email_odesilatel']);
            $message->to($data['email_odesilatel']);
            $message->subject('Nová nabídka '.( $nabidka->typ_aukce == 'pronajem' ? 'pronájmu' : 'prodeje' ));
        });
      }

      $request->session()->put('id_nabidky', $nabidka->id);
      $request->session()->put('nabidka_secret_key', $nabidka->secret_key);
      return true;
    }

    public function vlozitNabidkuKrok2(Request $request, Nabidka $nabidka)
    {
        $this->validate($request, [
          'model_aukce' => [
              'required',
              Rule::in($nabidka->model_aukce_hodnoty),
          ],
          'cena_vyvolavaci_A' => $nabidka->typ_aukce == 'pronajem' ? 'required_if:model_aukce,A|nullable|numeric' : 'nullable',
          'cena_vyvolavaci_B' => $nabidka->typ_aukce == 'pronajem' ? 'required_if:model_aukce,B|nullable|numeric' : 'nullable',
          'cena_vyvolavaci' => $nabidka->typ_aukce == 'prodej' ? 'required|numeric' : 'nullable',
          'poplatky' => $nabidka->typ_aukce == 'pronajem' ? 'required|numeric' : 'nullable',
          'kauce' => $nabidka->typ_aukce == 'pronajem' ? 'required|nullable|numeric' : 'nullable',
          'terminy' => 'nullable',
          'datum_ukonceni' => 'required', // zatím neřešíme přesný formát datumu
          'krok' => 'required|integer',
        ]);

        // todo: validovat vložené termíny prohlídek
        $vybrane_terminy = [];
        if( $request->input('terminy') ) {
          // smažem prázdné termíny
          foreach ($request->input('terminy') as $termin) {
            if( !(empty($termin['den']) && empty($termin['hodina']) && empty($termin['pocet_zajemcu'])) ) {
              $vybrane_terminy[] = $termin;
            }
          }
        }

        $nabidka->model_aukce = $request->model_aukce;
        $nabidka->poplatky = $request->poplatky;
        $nabidka->kauce = $request->kauce;

        // FIX: strtotime jsem přidal protože občas může z webu přijít adresa s diakritikou, například v ní může být "pátek", pravděpobně bug v IE10 - 11
        $datum_ukonceni = new DateTime();
        $datum_ukonceni->setTimestamp(strtotime($request->datum_ukonceni));
        $nabidka->datum_ukonceni = $datum_ukonceni->format('Y-m-d');

        $nabidka->cena_vyvolavaci = (int)$request->input('cena_vyvolavaci_'.$request->model_aukce);
        $nabidka->vybrane_terminy = json_encode($vybrane_terminy);
        $nabidka->krok = $request->krok;

        if( !$nabidka->save() ) {
            $request->session()->flash('error', 'Nastal problém při ukládání formuláře.');
            return false;
        }
        return true;
    }

    public function vlozitNabidkuKrok3(Request $request, Nabidka $nabidka, Array $data)
    {

        $this->validate($request, [
          'dotaz_jsem' => 'required',
          //'dotaz_dulezite' => 'sometimes|array',
          //'dotaz_zaujalo_mne' => 'sometimes|array',
          //'dotaz_chci' => 'sometimes|array',
          'krok' => 'required|integer',
        ]);

        $nabidka->dotaz_jsem = $request->dotaz_jsem;
        $nabidka->dotaz_dulezite = is_array($request->dotaz_dulezite) ? implode(' | ',$request->dotaz_dulezite) : $request->dotaz_chci;
        $nabidka->dotaz_zaujalo_mne = is_array($request->dotaz_zaujalo_mne) ? implode(' | ',$request->dotaz_zaujalo_mne) : $request->dotaz_zaujalo_mne;
        $nabidka->dotaz_chci = is_array($request->dotaz_chci) ? implode(' | ',$request->dotaz_chci) : $request->dotaz_chci;
        $nabidka->krok = $request->krok;

        if( !$nabidka->save() ) {
            $request->session()->flash('error', 'Nastal problém při ukládání formuláře.');
            return false;
        }

        $data['zadane_udaje'] = [];
        $data['zadane_udaje'][] = [
          'nazev' => $data['form']['typ_nemovitosti']['label'],
          'hodnota' => $data['form']['typ_nemovitosti']['hodnoty'][$nabidka->typ_nemovitosti]
        ];
        $data['zadane_udaje'][]= [
          'nazev' => $data['form']['mesto']['label'],
          'hodnota' => $nabidka->mesto
        ];
        if( !empty($nabidka->adresa) ) {
          $data['zadane_udaje'][] = [
            'nazev' => $data['form']['adresa']['label'],
            'hodnota' => $nabidka->adresa
          ];
        }
        if( $nabidka->cena_vyvolavaci > 0 ) {
          $data['zadane_udaje'][] = [
            'nazev' => $data['form']['cena_vyvolavaci']['label'],
            'hodnota' => round($nabidka->cena_vyvolavaci, 0).' Kč'
          ];
        }

        $specifikace = json_decode($nabidka->specifikace);
        foreach ($data['form']['specifikace'] as $key => $hodnota) {
          if( !empty($specifikace->{$key}) ) {
            $data['zadane_udaje'][] = ['nazev' => $hodnota['label'], 'hodnota' => $specifikace->{$key}];
          }
        }

        // odeslat email
        try {
            // todo: doplnit parametry nabídky
            Mail::send('emails.nabidka-zamitnuti', $data, function($message) use ($data, $nabidka){
                $message->from($data['email_odesilatel']);
                $message->to($nabidka->email);
                $message->subject($data['email_predmet']);
            });

        } catch (\Exception $e) {
            View::share('error', 'Nastal problém při odesílání emailu.');
            return false;
        }

        $request->session()->forget('id_nabidky');
        $request->session()->forget('nabidka_secret_key');

        return true;
    }

    public function zamitnoutNabidku(Request $request)
    {
        if( file_exists(public_path('data/form-aukce-nabidka.yml')) ) {
            $data = Yaml::parse(file_get_contents(public_path('data/form-aukce-nabidka.yml')));
        } else {
            $data = [];
        }

        return view('aukce-nabidka-zamitnuti')
          ->withData($data);
    }
}
