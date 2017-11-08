<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Yaml\Yaml;
use App\Zprava;
use App\Aukce;
use Parsedown;
use Mail;
use Illuminate\Support\Facades\View;

class PageController extends Controller
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
     * Display the specified page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string $page
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $page)
    {
        if (!$request->session()->exists('landing_page') && $page == 'vlozit-nabidku') {
          // todo: sjednotit všechny zápisy "landing_page" (není důležité)
          $request->session()->put('landing_page', 'vložit nabídku');
        }

        $aukce_ukoncene = false;
        if ($page == 'vlozit-nabidku') {

          $aukce_ukoncene = Aukce::where('stav', 'ukoncena')
            ->paginate(6);

          foreach ($aukce_ukoncene as $a) {
            $a->aukce_konci();
          }
        }

        if( file_exists(base_path('www/templates/stranka-'.$page.'.twig') ) ) {
          $view = 'stranka-'.$page;
        } elseif( file_exists(base_path('www/templates/'.$page.'.twig') ) ) {
          $view = $page;
        } else {
          return response()->view('404', [], 404);
        }

        if( file_exists(public_path('data/'.$page.'.yml')) ) {
          $data = Yaml::parse(file_get_contents(public_path('data/'.$page.'.yml')));
        } else {
          $data = [];
        }

        /*
        if( $page == 'obchodni-podminky' && file_exists(public_path('data/'.$page.'.md')) ) {
          $Parsedown = new Parsedown();
          $data['markdown'] = $Parsedown->text( file_get_contents(public_path('data/'.$page.'.md')) );
        }
        */

        if( $page == 'vlozit-nabidku' && file_exists(public_path('data/index-prodej.yml')) ) {
          // todo: toto už asi není potřeba
          $data_2 = Yaml::parse(file_get_contents(public_path('data/index-prodej.yml')));
          $data = array_merge($data_2, $data);
        }

        if( isset($data['nas_pribeh']) ) {
          $data['nas_pribeh'] = self::nl2p($data['nas_pribeh']);
        }

        return view($view)
          ->with('data', $data)
          ->with('page', $page)
          ->with('aukce_ukoncene', $aukce_ukoncene);
    }

  /**
     * Přidej odstavce do textu
     *
     * @param  string  $string
     */
    static function nl2p($string)
    {
        $paragraphs = '';

        foreach (explode("\n", $string) as $line) {
            if (trim($line)) {
                $paragraphs .= '<p>' . $line . '</p>';
            }
        }

        return $paragraphs;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Contact form
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $page
     * @return \Illuminate\Http\Response
     */

    public function postKontakt(Request $request) {

        if ($request->session()->exists('landing_page')) {
            $landing_page = $request->session()->get('landing_page');
        } else {
            $landing_page = 'jiná';
        }

        $this->validate($request, [
            'typ_formulare' => 'required',
          ]);

        if( $request->typ_formulare == 'homepage' || $request->typ_formulare == 'majitel' ) {
          $this->validate($request, [
              'jmeno' => 'required|min:3',
              'email' => 'required|email',
              'velikost' => 'nullable',
              'telefon' => 'nullable',
              'zprava' => 'nullable'
            ]);
        } else if( $request->typ_formulare == 'aukce' ) {
          $this->validate($request, [
              'jmeno' => 'required|min:3',
              'email' => 'required|email',
              'telefon' => 'nullable',
            ]);
        } else {
          $this->validate($request, [
              'jmeno' => 'required|min:3',
              'email' => 'required|email',
              'telefon' => 'nullable',
              'lokalita' => 'nullable|string',
              'zprava' => 'required|min:3'
            ]);
        }

        $data = array(
            'typ_formulare' => $request->typ_formulare,
            'email' => $request->email,
            'subject' => 'Zpráva z kontaktního formuláře',
            'jmeno' => $request->jmeno,
            'lokalita' => !empty($request->lokalita) ? $request->lokalita : '---',
            'destinace' => !empty($request->destinace) ? $request->destinace : '---',
            'telefon' => !empty($request->telefon) ? $request->telefon : '---',
            'zprava' => !empty($request->zprava) ? strip_tags($request->zprava) : '---',
            'landing_page' => $landing_page,
        );

        // todo: tady ty "flashe" nemají smysl, stačí jen poslat proměnnou do viewu
        try {
            Mail::send('emails.kontakt', $data, function($message) use ($data){
                $message->from($data['email']);
                //$message->to('m.fojtik@seznam.cz');
                $message->to('info@aukcebydleni.cz');
                $message->subject($data['subject']);
            });

            View::share('success', 'Děkujeme, co nejdříve vás budeme kontaktovat.');
        } catch (\Exception $e) {
            View::share('error', 'Nastal problém při odesílání formuláře.');
        }

        // uložit do databáze
        $zprava = new Zprava;
        $zprava->typ = $request->typ_formulare;
        $zprava->jmeno = $request->jmeno;
        $zprava->email = $request->email;
        $zprava->telefon = $request->telefon;
        $zprava->lokalita = $request->lokalita;
        $zprava->dispozice = $request->dispozice;
        //$zprava->zprava = Purifier::clean($request->zprava);
        $zprava->zprava = strip_tags($request->zprava);
        $zprava->landing_page = $landing_page;

        $result = $zprava->save();

        if ($request->isMethod('post') && $request->has('ajax')) {
            if( $result ) {
                return response()->json(['success' => 'true', 'message' => 'Děkujeme, co nejdříve vás budeme kontaktovat.']);
            } else {
                return response()->json(['error' => $request->session()->get('error')]);
            }
        }

        return self::show($request, 'kontakty');
    }
}
