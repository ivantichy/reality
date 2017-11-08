/* jshint esversion: 6 */
var menu_break = 720;
var carousel = false;
var modal =  false;
var main = function() {
  resize();
  window.addEventListener('resize', resize, false);
  document.getElementById('hamburger').addEventListener('click', function(e) {
    zobraz_menu();
  }, false);

  // zruš scrollovací efekt u inputů
  let number_input = document.getElementsByTagName('number');
  if( number_input.length ) {
    number_input.addEventListener("mousewheel", function(e){
      e.preventDefault();
    });
  }

  /*
  var banner_link = document.querySelector('.banner-link');
  if(banner_link) {
    banner_link.addEventListener('click', function(e) {
      e.preventDefault();
    }, false);
  }
  */

  let hlidacipes_button = document.querySelectorAll('.hlidacipes-js');
  if( hlidacipes_button ) {
    forEach(hlidacipes_button, function (index, element) {
      element.addEventListener('click', function(e) {
        e.preventDefault();
        modal.setContent(document.querySelector('#kontaktujte-nas').innerHTML);
        modal.open();
      }, false);
    });
  }
  forEach(document.forms, function (index, form) {
    Validation.init(form, true);
  });

  let nabidkaform_button = document.querySelectorAll('.majitel-form-js, .main-vlozit-nabidku .nabidka-wrap');
  if( nabidkaform_button ) {
    forEach(nabidkaform_button, function (index, element) {
      element.addEventListener('click', function(e) {
        e.preventDefault();
        modal.setContent(document.querySelector('#majitel-form').innerHTML);
        modal.open();
      }, false);
    });
  }
  forEach(document.forms, function (index, form) {
    Validation.init(form, true);
  });

  modal = new tingle.modal({
      footer: false,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Zavřít",
      cssClass: ['custom-class-1', 'custom-class-2'],
      onOpen: function() {
          Validation.init(document.querySelector('#form-modal'), true);
          document.querySelector('.tingle-modal-box .form-modal').focus();
      },
      onClose: function() {

      },
      beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
      	return false; // nothing happens
      }
  });


  form_vlozit_aukci();

  if( document.getElementById('carousel') ) {
    carousel = new myCarousel();
    carousel.init({
      id: 'carousel',
      slidenav: false,
      animate: false,
      startAnimated: false
    });
  }

  if ( is_touch_device() ) {
    addClass(document.body, 'touch');
  }

  var carousel_thumb = document.querySelectorAll('.detail-obrazky-link');
  if(carousel_thumb.length) {
    forEach(carousel_thumb, function (index, thumb) {
      thumb.addEventListener('click', function(e) {
        e.preventDefault();
        var carousel_el = document.querySelector('#carousel');
        if( hasClass(carousel_el, 'skryt') ) {
          removeClass(document.querySelector('#carousel'), 'skryt');
          carousel_el.setAttribute('aria-hidden', 'false');
          document.querySelector('#mapa').setAttribute('aria-hidden', 'true');
        }
        carousel.goto(parseInt(this.getAttribute('data-index')));
      }, false);
    });
  }

  let ikona_mapa = document.getElementById('ikona-mapa');
  if( ikona_mapa ) {
    ikona_mapa.addEventListener('click', function(e) {
      e.preventDefault();
      addClass(document.querySelector('#carousel'), 'skryt');
      removeClass(document.querySelector('#mapa'), 'skryt');
      document.querySelector('#carousel').setAttribute('aria-hidden', 'true');
      document.querySelector('#mapa').setAttribute('aria-hidden', 'false');
    }, false);
  }

  let ikona_fotky = document.getElementById('ikona-fotky');
  if( ikona_fotky ) {
    ikona_fotky.addEventListener('click', function(e) {
      e.preventDefault();
      removeClass(document.querySelector('#carousel'), 'skryt');
      addClass(document.querySelector('#mapa'), 'skryt');
      document.querySelector('#carousel').setAttribute('aria-hidden', 'false');
      document.querySelector('#mapa').setAttribute('aria-hidden', 'true');
    }, false);
  }

  let hodnoceni_button = document.querySelector('.detail-hodnoceni-button');
  if( hodnoceni_button ) {
    hodnoceni_button.addEventListener('click', function(e) {
      e.preventDefault();
      modal.setContent(document.querySelector('#kontaktujte-nas').innerHTML);
      modal.open();
    }, false);
  }

  let myTooltip = Frtooltip({
  	selector: '.js-tooltip',
  	tooltipSelector: '.js-tooltip-tooltip',
  	toggleSelector: '.js-tooltip-toggle',
  	tooltipIdPrefix: 'tooltip',
  	readyClass: 'tooltip--is-ready'
  });

  var nacti_dalsi = document.querySelectorAll('.nacti-dalsi');
  if(nacti_dalsi.length) {
    forEach(nacti_dalsi, function (index, thumb) {
      thumb.addEventListener('click', function(e) {
        e.preventDefault();
        let params = '';
        params += 'akce=nacti_produkty';
        params += '&stav='+this.dataset.stav;
        params += '&typ='+this.dataset.typ;
        params += '&strana='+this.dataset.strana;
        params += '&lokalita='+this.dataset.lokalita;
        params += '&pocet=6';
        // roztočit spiner
        addClass(this.parentNode, 'roztocto');
        nacti_produkty(params, this);
      }, false);
    });
  }
};

if (document.readyState != 'loading'){
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}


function resize() {
  zobraz_hamburger();
  // todo: najít lepší řešení an skrytí
  let detail_info_leva = document.getElementById('detail-info-leva');
  if( detail_info_leva ) {
    if( window.innerWidth < menu_break ) {
      detail_info_leva.setAttribute('aria-hidden', 'true');
      document.getElementById('detail-info-prava').setAttribute('aria-hidden', 'false');
    } else {
      detail_info_leva.setAttribute('aria-hidden', 'false');
      document.getElementById('detail-info-prava').setAttribute('aria-hidden', 'true');

    }
  }
}

function zobraz_menu() {
  if( hasClass(document.getElementById('header'), 'menu-zobrazeno') ) {
    removeClass(document.getElementById('header'), 'menu-zobrazeno');
    document.getElementById('menu').setAttribute('aria-hidden', 'true');
  } else {
    addClass(document.getElementById('header'), 'menu-zobrazeno');
    document.getElementById('menu').setAttribute('aria-hidden', 'false');
  }
}

function zobraz_hamburger() {
  removeClass(document.getElementById('header'), 'menu-zobrazeno'); // pro jistotu smažu class
  if( window.innerWidth < 780 ) {
    document.getElementById('hamburger').setAttribute('aria-hidden', 'false');
    document.getElementById('menu').setAttribute('aria-hidden', 'true');
  } else {
    document.getElementById('hamburger').setAttribute('aria-hidden', 'true');
    document.getElementById('menu').setAttribute('aria-hidden', 'false');
  }
}

function form_vlozit_aukci() {

  let kroky_button = document.querySelectorAll('.kroky .kroky-button');
  if(kroky_button.length) {
    forEach(kroky_button, function (index, krok_button) {
      krok_button.addEventListener('click', function(e) {
        e.preventDefault();
        if( hasClass(e.target, 'hotovo') ) {
          window.location.href = e.target.dataset.href;
        }

      }, false);
    });
  }

  let modely = document.querySelectorAll('.model .radio');
  if(modely.length) {
    oznac_model();
    forEach(modely, function (index, model) {
      model.addEventListener('change', function(e) {
        oznac_model();
      }, false);
    });
    let modely_spodek = document.querySelectorAll('.model-bot');
    if(modely_spodek.length) {
      forEach(modely_spodek, function (index, model) {
        model.addEventListener('click', function(e) {
          let radio = this.parentNode.parentNode.querySelector('.radio');
          if (radio && !radio.checked) {
            radio.checked = true;
            oznac_model();
          }
        }, false);
      });
    }
  }
  /*
  document.getElementById('krokJedna').addEventListener('submit', function(e) {
    e.preventDefault();
  }, false);
  */
}

function oznac_model() {
  forEach(document.querySelectorAll('.model'), function (index, model) {
    if( model.querySelector('.radio').checked ) {
      addClass(model, 'oznaceny');
    } else {
      removeClass(model, 'oznaceny');
    }
    let input = model.querySelector('.form-text-input');
    if( typeof input !== 'undefined' && input ) {
      if( model.querySelector('.radio').checked ) {
        input.setAttribute('required', 'required');
      } else {
        input.removeAttribute('required');
      }
    }
  });
}

function nacti_produkty(params, button) {
  let request = new XMLHttpRequest();
  request.open('GET', '/ajax?'+params, true);
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  request.onload = function() {
    var resp = request.responseText;
    var error = false;
    var data = false;
    try {
      data = JSON.parse(request.responseText);
    }
    catch(err) {
      error = true;
    }

    if (request.status >= 200 && request.status < 400 && data) {
      if( typeof data.html !== 'undefined' && typeof data.strana !== 'undefined' ) {
        // vypsat produkty do formuláře
        button.setAttribute('data-strana', data.strana);
        let tab = button.parentNode.parentNode;
        appendHtml(tab.querySelector('.row'), data.html);

        if( data.posledni ) {
          // todo: přidat hezčí efekt
          button.parentNode.style.display = 'none';
        } else {
          removeClass(button.parentNode, 'roztocto');
        }
      } else {
        error = true;
      }
    }

    if( error ) {
      // todo: bude vhodné nějak lépe vypsat error
      if( typeof data.error !== 'undefined' ) {
        alert( data.error );
      } else {
        alert('Nastal problém při načítání požadavku.');
      }
    }
  };

  request.onerror = function() {
    alert('Nastal problém při načítání požadavku.');
  };

  request.send();
}


function kontakt_ajax(form) {
  let request = new XMLHttpRequest();
  request.open('POST', '/kontakty?ajax=1', true);
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  request.onload = function() {
    var resp = request.responseText;
    var error = false;
    var data = false;
    try {
      data = JSON.parse(request.responseText);
    }
    catch(err) {
      error = true;
    }

    if (request.status >= 200 && request.status < 400 && !error) {
      if( typeof data.message !== 'undefined' ) {
        let zprava = document.querySelector('.zprava-uspech');
        zprava.innerHTML = data.message;
        zprava.style.display = 'block';
        document.getElementById('form-modal').style.display = 'none';
      } else {
        error = true;
      }
    }

    if(error) {
      // todo: bude vhodné nějak lépe vypsat error
      if( typeof data.error !== 'undefined' ) {
        alert( data.error );
      } else {
        alert('Nastal problém při ukládání formuláře.');
      }
    }
  };

  request.onerror = function() {
    alert('Nastal problém při ukládání formuláře.');
  };

  request.send(serialize(form));
}

/*
var form_ajax = function (form) {
  //var data = new FormData(form);
  var request = new XMLHttpRequest();
  request.open('POST', '/vlozit-aukci/formular?ajax=1', true);
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  request.onload = function() {
    var resp = request.responseText;
    if (request.status >= 200 && request.status < 400) {
      // Úspěch!

    } else {
      // todo: bude vhodné nějak lépe vypsat error
      var data = JSON.parse(request.responseText);
      if( typeof data.error !== 'undefined' ) {
        alert( data.error );
      } else {
        alert('Nastal problém při ukládání formuláře.');
      }
    }
  };

  request.onerror = function() {
    alert('Nastal problém při ukládání formuláře.');
  };

  request.send(serialize(form));
}
*/
