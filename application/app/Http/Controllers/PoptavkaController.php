<?php

namespace App\Http\Controllers;

use App\Aukce;
use App\Poptavka;
use Illuminate\Http\Request;
use Symfony\Component\Yaml\Yaml;
use Illuminate\Validation\Rule;
use DateTime;
use Mail;

class PoptavkaController extends Controller
{
    private $krok = 1;

    /**
     * Přidat poptávku.
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function initPoptavka($id, Request $request)
    {
      $aukce = Aukce::find($id);

      if( !$aukce ) {
        // todo: možná bude vhodné do headeru přidat 404
        return view('aukce-poptavka-neexistuje')
          ->withErrors(['Požadovaná aukce neexistuje.']);
      }

      if( $aukce->stav == 'ukoncena' ) {
        // todo: možná bude vhodné do headeru přidat 404
        return view('aukce-poptavka-neexistuje')
          ->withErrors(['Tato aukce jejiž ukončena.']);
      }

      $aukce->zjisti_dny_do_konce();
      $aukce->vybrane_terminy_array = json_decode($aukce->vybrane_terminy);

      if( file_exists(public_path('data/form-aukce-poptavka.yml')) ) {
          $data = Yaml::parse(file_get_contents(public_path('data/form-aukce-poptavka.yml')));
      } else {
          $data = [];
      }

      // přidat datumy do $data
      $terminy = [];
      foreach ($aukce->vybrane_terminy_array as $key => $termin) {
        $termin_string = $termin->den.(!empty($termin->hodina) ? ' - '.trim($termin->hodina) : '');
        $terminy[($key + 1).' - '.$termin_string] = $termin_string;
      }
      $data['form']['termin']['hodnoty'] = array_merge($terminy, $data['form']['termin']['hodnoty']);

      $poptavka = false;
      if ( $id_poptavky = $request->session()->get('id_poptavky') ) {
        $poptavka = Poptavka::where('id', $id_poptavky)
          ->where('secret_key', $request->session()->get('poptavka_secret_key'))
          ->first();
          // todo: přesměrovat do prvního kroku, pokud neexistuje
      }

      if( !$poptavka ) {
          if ($this->krok == 2) {
              $request->session()->flash('error', 'Nejdříve doplňte všechny údaje v prvním kroku.');
              return redirect()->route('poptavka-'.$aukce->typ_aukce, ['id' => $aukce->id ]);
          }
          $poptavka = new Poptavka;
      }

      $result = false;
      if ($request->isMethod('post')) {
        if ($this->krok == 2) {
            if(self::ulozitPoptavkuKrok2($request, $aukce, $poptavka, $data)) {
              return redirect()
                ->route('poptavka-'.$aukce->typ_aukce.'-zamitnuti', ['id' => $aukce->id]);
            }
        } else {
            if(self::ulozitPoptavkuKrok1($request, $aukce, $poptavka, $data)) {
                return redirect()
                  ->route('poptavka-'.$aukce->typ_aukce.'-krok-2', ['id' => $aukce->id]);
            }
        }
      }

      return view('aukce-poptavka')
        ->with('krok_aktualni', $this->krok)
        ->withAukce($aukce)
        ->withPoptavka($poptavka)
        ->withData($data)
        ->withPage('poptavka');
    }

    public function initPoptavkaKrok2($id, Request $request)
    {
        $this->krok = 2;
        return $this->initPoptavka($id, $request);
    }

    public function ulozitPoptavkuKrok1(Request $request, Aukce $aukce, Poptavka $poptavka, Array $data)
    {

      if ($request->session()->exists('landing_page')) {
          $landing_page = $request->session()->get('landing_page');
      } else {
          $landing_page = 'jiná';
      }

      $nova_poptavka = !(bool)$poptavka->id;

      $this->validate($request, [
          'termin' => 'required',
          'model_aukce' => $aukce->typ_aukce == 'pronajem' ? [
              'required',
              Rule::in($poptavka->model_aukce_hodnoty),
          ] : 'nullable',
          'delka_pronajmu' => $aukce->typ_aukce == 'pronajem' ? 'required' : 'nullable',
          'jmeno' => 'required|min:3',
          'email' => 'required|email',
          'telefon' => 'required|min:9',
          'motivace' => 'nullable',
          'souhlas' => 'required|accepted',
          'krok' => 'required|integer',
      ]);

      // uložit do databáze
      $poptavka->id_aukce = $aukce->id;
      $poptavka->typ_aukce = $aukce->typ_aukce;
      $poptavka->nazev_aukce = $aukce->nadpis; // nazev aukce pro snažší orientaci
      $poptavka->termin = $request->termin;
      $poptavka->model_aukce = isset($request->model_aukce) ? $request->model_aukce : 'X';
      $poptavka->delka_pronajmu = $request->delka_pronajmu;

      $poptavka->jmeno = $request->jmeno;
      $poptavka->email = $request->email;
      $poptavka->telefon = $request->telefon;
      $poptavka->motivace = $request->motivace;

      $poptavka->landing_page = $landing_page;
      $poptavka->krok = $request->krok;
      $poptavka->secret_key = str_random(12);

      if( !$poptavka->save() ) {
          $request->session()->flash('error', 'Nastal problém při ukládání formuláře.');
          return false;
      }

      if( $nova_poptavka ) {
        $data['jmeno'] = $poptavka->jmeno;
        $data['email'] = $poptavka->email;
        $data['telefon'] = $poptavka->telefon;
        $data['odkaz'] = 'https://aukcebydleni.cz/admin/poptavka/'.$poptavka->id;
        Mail::send('emails.info-admin', $data, function($message) use ($data, $poptavka){
            $message->from($data['email_odesilatel']);
            $message->to($data['email_odesilatel']);
            $message->subject('Nová poptávka '.( $poptavka->typ_aukce == 'pronajem' ? 'pronájmu' : 'prodeje' ));
        });
      }

      $request->session()->put('id_poptavky', $poptavka->id);
      $request->session()->put('poptavka_secret_key', $poptavka->secret_key);
      return true;
    }


    public function ulozitPoptavkuKrok2(Request $request, Aukce $aukce, Poptavka $poptavka, Array $data)
    {
        $this->validate($request, [
            'dotaz_vek' => 'required',
            //'dotaz_jsem' => 'required',
            //'dotaz_dulezite' => 'sometimes|array',
            //'dotaz_zaujalo_mne' => 'sometimes|array',
            //'dotaz_chci' => 'sometimes|array',
            'krok' => 'required|integer',
        ]);

        $poptavka->dotaz_vek = $request->dotaz_vek;
        $poptavka->dotaz_jsem = $request->dotaz_jsem;
        $poptavka->dotaz_zaujalo_mne = is_array($request->dotaz_zaujalo_mne) ? implode(' | ',$request->dotaz_zaujalo_mne) : $request->dotaz_zaujalo_mne;
        $poptavka->dotaz_chci = is_array($request->dotaz_chci) ? implode(' | ',$request->dotaz_chci) : $request->dotaz_chci;
        $poptavka->krok = $request->krok;

        if( !$poptavka->save() ) {
            $request->session()->flash('error', 'Nastal problém při ukládání formuláře.');
            return false;
        }

        // odeslat email
        try {
            Mail::send('emails.poptavka-zamitnuti', $data, function($message) use ($data, $poptavka){
                $message->from($data['email_odesilatel']);
                $message->to($poptavka->email);
                $message->subject($data['email_predmet']);
            });

        } catch (\Exception $e) {
            View::share('error', 'Nastal problém při odesílání emailu.');
            return false;
        }

        $request->session()->forget('id_aukce');
        $request->session()->forget('poptavka_secret_key');

        return true;
    }

    /**
     * Zobrazit zamítnutí poptávky
     *
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function zamitnoutPoptavku($id, Request $request)
    {
        if( file_exists(public_path('data/form-aukce-poptavka.yml')) ) {
            $data = Yaml::parse(file_get_contents(public_path('data/form-aukce-poptavka.yml')));
        } else {
            $data = [];
        }

        // přidat Informace o Aukci
        $aukce = Aukce::find($id);

        if( !$aukce ) {
          // todo: možná bude vhodné do headeru přidat 404
          return view('aukce-poptavka-neexistuje')->withErrors(['Požadovaná aukce neexistuje']);
        }

        // todo: doplnit čísloa aktuálního kroku

        return view('aukce-poptavka-zamitnuti')
          ->withAukce($aukce)
          ->withData($data);
    }
}
