<?php namespace App;

use Twig_Extension;
use Twig_SimpleFunction;
use Twig_SimpleFilter;

class Twiggy extends Twig_Extension {

  	public function getName() {
  		//
  	}

  	/**
  	 * Functions
  	 * @return void
  	 */
  	public function getFunctions() {
  		return [
  			new Twig_SimpleFunction('staticCall', [$this, 'staticCall']),
        new Twig_SimpleFunction('honeypot_generate', [$this, 'honeypot_generate']),
  		];
  	}

  	/**
  	 * Filters
  	 * @return void
  	 */
  	public function getFilters() {
  		return [
  			new Twig_SimpleFilter('cena', array($this, 'priceFilter')),
        new Twig_SimpleFilter('price', array($this, 'priceFilter')),
        new Twig_SimpleFilter('cislo', array($this, 'cisloFilter')),
        new Twig_SimpleFilter('konverze', array($this, 'konverze')),
        new Twig_SimpleFilter('konverze_mezer', array($this, 'konverze_mezer')),
  		];
  	}

    function staticCall($class, $function, $args = array())
    {
        if (class_exists($class) && method_exists($class, $function))
            return call_user_func_array(array($class, $function), $args);
        return null;
    }

    function honeypot_generate()
    {
        if (class_exists('Hoenypot'))
            return Honeypot::generate('my_name', 'my_time');
        return null;
    }

    public function priceFilter($number, $decimals = 0, $decPoint = '.', $thousandsSep = ' ')
    {
        return number_format($number, $decimals, $decPoint, $thousandsSep).' Kč';
    }

    public function cisloFilter($number)
    {
        return (int)$number > 0 ? number_format($number, 0, '.', '') : '';
    }

    public function konverze($text)
    {
        $text =  '<p>'.preg_replace(
        array("/([\n]{2,})/i", "/([\r\n]{3,})/i","/([^>])\n([^<])/i"),
        array("</p>\n<p>", "</p>\n<p>", '$1<br>$2'),
        trim($text)).'</p>';

        $text = preg_replace ('/(\*\*|__)(.*?)\1/', '<strong>\2</strong>', $text);
        return trim($text);
    }

    public function konverze_mezer($text)
    {
        return str_replace('[mezera]', '&nbsp;', $text);
    }
}
