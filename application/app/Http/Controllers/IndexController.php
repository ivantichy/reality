<?php

namespace App\Http\Controllers;

use App\Aukce;
use Illuminate\Http\Request;
use Symfony\Component\Yaml\Yaml;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class IndexController extends Controller
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function showProdej(Request $request)
    {
        if (!$request->session()->exists('landing_page')) {
          // todo: sjednotit všechny zápisy "landing_page" (není důležité)
          $request->session()->put('landing_page', 'chci koupit');
        }

        $aukce = Cache::remember('aukce_prodej', 30, function() {
          $aukce['probihajici'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'prodej')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
          $aukce['beroun'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'prodej')
            ->where('mesto', 'Beroun')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
           $aukce['praha'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'prodej')
            ->where('mesto', 'Praha')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
          $aukce['brno'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'prodej')
            ->where('mesto', 'Brno')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
          $aukce['ostrava'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'prodej')
            ->where('mesto', 'Ostrava')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
          $aukce['ukoncena'] = Aukce::where('stav', 'ukoncena')
            ->where('active', 1)
            ->where('typ_aukce', 'prodej')
            ->orderBy('created_at', 'desc')
            ->paginate(3);

          foreach ($aukce as $aukce_list) {
            if( !empty($aukce_list) ) {
              foreach ($aukce_list as $a) {
                $a->aukce_konci();
              }
            }
          }

          return $aukce;
        });


        $data = Yaml::parse(file_get_contents(public_path('data/index-prodej.yml')));

        return view('index-prodej')
          ->with('data', $data)
          ->with('aukce', $aukce)
          ->with('typ', 'prodej')
          ->with('page', 'index-prodej');
    }


    /**
     * Zobraz stránku s pronájmy
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function showPronajem(Request $request)
    {

        if (!$request->session()->exists('landing_page')) {
          // todo: sjednotit všechny zápisy "landing_page" (není důležité)
          $request->session()->put('landing_page', 'chci pronajmout');
        }

        $aukce = Cache::remember('aukce_pronajem', 30, function() {
          $aukce['probihajici'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'pronajem')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
          $aukce['praha'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'pronajem')
            ->where('mesto', 'Praha')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
          $aukce['brno'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'pronajem')
            ->where('mesto', 'Brno')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
          $aukce['ostrava'] = Aukce::where('stav', 'probihajici')
            ->where('active', 1)
            ->where('typ_aukce', 'pronajem')
            ->where('mesto', 'Ostrava')
            ->orderBy('created_at', 'desc')
            ->paginate(6);
          $aukce['ukoncena'] = Aukce::where('stav', 'ukoncena')
            ->where('active', 1)
            ->where('typ_aukce', 'pronajem')
            ->orderBy('created_at', 'desc')
            ->paginate(3);

          foreach ($aukce as $aukce_list) {
            if( !empty($aukce_list) ) {
              foreach ($aukce_list as $a) {
                $a->aukce_konci();
              }
            }
          }
          return $aukce;
        });

        $data = Yaml::parse(file_get_contents(public_path('data/index-pronajem.yml')));

        // nakopírujeme některé hodnoty z index.yml
        $data_2 = Yaml::parse(file_get_contents(public_path('data/index-prodej.yml')));
        $data = array_merge($data_2, $data);

        return view('index-pronajem')
          ->with('data', $data)
          ->with('aukce', $aukce)
          ->with('typ', 'pronajem')
          ->with('page', 'index-pronajem');
    }

    /**
     * Zpracuj ajaxové volání
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function zpracujAjax(Request $request)
    {
      $result = false;
      // todo: zlepšit validaci (není důležité)
      $this->validate($request, [
        'stav' => 'required',
        'typ' => 'required',
        'strana' => 'required',
        'lokalita' => 'required',
      ]);

      if( $request->lokalita == 'vse' ) {
        $aukce = Aukce::where('stav', $request->stav)
        ->where('active', 1)
          ->where('typ_aukce', $request->typ)
          ->orderBy('created_at', 'desc')
          ->simplePaginate(max(3, (int)$request->pocet), ['*'], 'strana', max(1, (int)$request->strana + 1));
      } else {
        $aukce = Aukce::where('stav', $request->stav)
          ->where('active', 1)
          ->where('mesto', $request->lokalita)
          ->where('typ_aukce', $request->typ)
          ->orderBy('created_at', 'desc')
          ->simplePaginate(max(3, (int)$request->pocet), ['*'], 'strana', max(1, (int)$request->strana + 1));
      }

      $aukce_html = '';
      foreach ($aukce as $a) {
        $a->aukce_konci();
        $aukce_html .= View::make('partials/nabidka', ['aukce' => $a])->render();
      }

      if( $aukce_html ) {
          return response()->json([
            'success' => 'true',
            'posledni' => !$aukce->hasMorePages(),
            'strana' => $aukce->currentPage(),
            'html' => $aukce_html
          ]);
      } else {
          return response()->json(['error' => 'Nastal problém při zpracování požadavku']);
      }
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
}
