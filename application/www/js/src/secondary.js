//=require ./moduly/pikaday.js

var pickadey_preklad = {
  previousMonth : 'Předchozí měsíc',
  nextMonth     : 'Další měsíc',
  months        : ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'],
  weekdays      : ['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'],
  weekdaysShort : ['Ne','Po','Út','St','Čt','Pá','So']
};

var secondary = function() {
  if( !checkDateInput() && document.querySelector('[name="datum_ukonceni"]') ) {
    var picker_datum_ukonceni = new Pikaday({
      field: document.querySelector('[name="datum_ukonceni"]'),
      i18n: pickadey_preklad,
      firstDay: 1,
      minDate: new Date(),
      format: 'D.M.YY',
      toString: function(date, format) {
         return date.toLocaleDateString().replace(/\s/g,'');
      }
    });
  }
};

if (document.readyState != 'loading'){
  secondary();
} else {
  document.addEventListener('DOMContentLoaded', secondary);
}

function checkDateInput() {
    var input = document.createElement('input');
    input.setAttribute('type','date');

    var notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue);

    return (input.value !== notADateValue);
}
