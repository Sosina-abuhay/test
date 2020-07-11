$('.mybutton').click(
  function () {
      if ($(this).hasClass('clicked')) {
        $(this).removeClass('clicked');
      }
      else {
        $('.clicked').removeClass('clicked');
        $(this).addClass('clicked');
      }

      var buttonId = $(this).attr('id');
      var prevShowingContainer = $('.content-container.show');
      prevShowingContainer.removeClass('show');
      prevShowingContainer.addClass('hidden');
      if ($('.clicked').length) {
        var nowShowingContainer = $(`.content-container.${buttonId}`);
        nowShowingContainer.addClass('show');
        nowShowingContainer.removeClass('hidden');

    }
  }
);

var distanceFromDarkSide = // small values represent closer distances
{ 'food': {
    'mcewen': 2,
    'howard': 4,
    'little': 5,
    'commons': 7,
    'bundy': 10,
  },
 'activities': {
   'rootglen': 2,
   'gym': 7,
   'sadove': 4,
   'wallclimbing': 7,
 },
 'study': {
   'burke': 8,
   'Kjlobby': 3,
   'sciencecenter': 9,
   'opuscafe': 2,
 }

};

var distanceFromLightSide = // small values represent closer distances
{ 'food': {
    'mcewen': 8,
    'howard': 6,
    'little': 5,
    'commons': 3,
    'bundy': 4,
  },
 'activities': {
   'rootglen': 8,
   'gym': 3,
   'sadove': 6,
   'wallclimbing': 3,
 },
 'study': {
   'burke': 5,
   'Kjlobby': 7,
   'sciencecenter': 3,
   'opuscafe': 8,
 }

};

var service_catagory =
{'food':
  {
    'mcewen': {'vegiterian': 10, 'junkFood': 0, 'regularFood': 5},
    'howard': {'vegiterian': 2, 'junkFood': 10, 'regularFood': 5},
    'little': {'vegiterian': 3, 'junkFood': 7, 'regularFood': 5},
    'commons': {'vegiterian': 9, 'junkFood': 5, 'regularFood': 9},
    'bundy': {'vegiterian': 8, 'junkFood': 3, 'regularFood': 9},
  },
  'activities':
  {
    'rootglen': {'adventure':9, 'fitness':5, 'fun':5},
    'gym': {'adventure':2, 'fitness':10, 'fun':4},
    'sadove': {'adventure':1, 'fitness':3, 'fun':9},
    'wallclimbing': {'adventure':3, 'fitness':7, 'fun':7},
  },
  'study':
  {
    'burke': {'quiet':7,'IT':8, 'comfort':8},
    'Kjlobby': {'quiet':5,'IT':7, 'comfort':7},
    'sciencecenter': {'quiet':6,'IT':8, 'comfort':6},
    'opuscafe': {'quiet':4,'IT':4, 'comfort':7}
  }

};

function relevanceCalculator(distancePref, servicePref, service, serviceType,  location) {
  var maxPrefVal = -Infinity;
  var mostPreferred = null;
  var ranking = {};
  if (location == 'Dark Side') {
    for (let place in distanceFromDarkSide[service]){
      var prefValue = servicePref * service_catagory[service][place][serviceType]-
      distancePref * distanceFromDarkSide[service][place];
      ranking[place] = prefValue;
      if (prefValue >= maxPrefVal) {
        maxPrefVal = prefValue;
        mostPreferred = place;
      }
    }

  }
  else {
    for (let place in distanceFromLightSide[service]){
      var prefValue = servicePref * service_catagory[service][place][serviceType]-
      distancePref * distanceFromLightSide[service][place];
      ranking[place] = prefValue;
      if (prefValue >= maxPrefVal) {
        maxPrefVal = prefValue;
        mostPreferred = place;
      }
    }
  }
  return ranking;
};
var values;
$('form.first-form').submit( function(event) {
  event.preventDefault();
  var service = $(this).attr('id');
  values = {};
  values['service'] = service;
  $.each($(this).serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });

for (let val in values){
  $('.test').append(values[val]);
$(`span.selected-service-type.${service}`)[0].innerText = values['serviceType'];
}
$(`.second-form.${service}`).removeClass('hidden');

$(`.first-form#${service}`).removeClass('show');
$(`.first-form#${service}`).addClass('hidden');

});

$(`form.second-form`).submit( function(event) {
  event.preventDefault();
  var service = values['service'];
  $.each($(this).serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });

for (let val in values){
  $('.test').append(values[val]);
}
var servicePref = Number(values['servicePref']);
var distancePref = Number(values['distancePref']);
var serviceType = values['serviceType'];
var loc = values['loc'];
$('.test').append('this is'+servicePref+'type'+typeof(servicePref));
$('.test').append('this is'+distancePref+'type'+typeof(distancePref));
$('.test').append('this is'+serviceType+'type'+typeof(serviceType));
$('.test').append('this is services '+service+'type'+typeof(service));
ranking = relevanceCalculator(distancePref, servicePref, service, serviceType, loc);
var items = Object.keys(ranking).map(function(key) {
  return [key, ranking[key]];
});

items.sort(function(first, second) {
  return second[1] - first[1];
});
// for (let result in ranking) {
//   $('.test').append(result);
// }
$(`.card-group.${service} > .card`).remove();
for (let result of items) {
  $('.test').append(result[0]);
  var idx = items.indexOf(result)
  var text = "<div class=card><div class=&#34;card-body&#34;><h5 class=&#34;card-title&#34;>"+result[0]+"</h5></div><img class=pic src="+
   result[0]+".jpg alt=&#34;&#34;></div></div>";
  $(`.card-group.${service}`).append(text);
}
// $('.test').append('this is place'+place);
});
