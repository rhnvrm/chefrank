var monthNames = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
var currentMonth = monthNames[new Date().getMonth()];
var prevMonth = monthNames[new Date().getMonth()-1];
var prev2prevMonth = monthNames[new Date().getMonth()-2];
var currentYear = new Date().getFullYear().toString().substr(2,2) ;
  
var contests = [{name:currentMonth+currentYear,id:166,fetched:false} , {name:prevMonth+currentYear,id:165,fetched:false} , {name:prev2prevMonth+currentYear,id:164,fetched:false}];

var container = [];

var University = 'Shiv Nadar University, Chithera';

$(document).ready(function(){
  if(window.location.hash){
    University = decodeURIComponent(window.location.hash.split('#')[1]);
  }
  else{
    window.location.hash = encodeURIComponent(University);
  }
  document.getElementById("institue").innerHTML = University;
  fetchContents();
});


function fetchContents(){

  contests.forEach(function(item, index){

    $.ajax({
      type: "GET",
      dataType: 'json',
      url: 'https://cc-bouncer.herokuapp.com/'+item.name+'/Institution%3D'+University,
      success: function(data) {
        if(contests[index]["fetched"] == true)
          return;
        d = data.result.list;

        contents = '<h2>Codechef.com '+item.name+' Challenge</h2>'

        contents += '<table>';

        contents += '<th>Rank</th><th>Score</th><th>User Handle</th>'


        for(i = 0; i < d.length; i++){
          contents += '<tr>';
          contents += '<td>' + d[i].rank + '</td>';
          contents += '<td>' + d[i].score + '</td>';
          contents += '<td>' + '<a href="https://www.codechef.com/users/' + d[i].user_handle + '">' +d[i].user_handle + '</a>'  + '</td>';
          contents += '</tr>';
        }


        contents += '</table><hr>';
        container.push({content: contents, id: item.id});

        container.sort(function(a,b) {return (a.id < b.id) ? 1 : ((b.id > a.id) ? -1 : 0);});

        //re-render on another successful ajax req
        document.getElementById("ranklist").innerHTML = "";

        container.forEach(function(item, index){
          document.getElementById("ranklist").innerHTML += item.content;
        });
        contests[index]["fetched"] = true;

      },
      error: function(e) {
        fetchContents();
        console.log("Error fetching data");
        console.log(e.message);            
      }
    });
    
  });
}

$('#institue').bind('keypress',function(e){
    $.ajax({
      type: "GET",
      dataType: 'json',
      url: 'https://cc-bouncer.herokuapp.com/autocomplete/'+contests[0].name+'/'+$(this).html(),
      success: function(data) {
        //empty before adding
        $('#suggestions').html('');

        data.result.forEach(function(item, index){
          encodedInsti = encodeURIComponent(item.text);
          document.getElementById('suggestions').innerHTML += '<a href="#'+encodedInsti+'" class="suggestion-item" id="'+encodedInsti+ '">' + item.text + '</a>,'; 
        })

        $('a.suggestion-item').click(function(){

          document.getElementById("institue").innerHTML = decodeURIComponent(this.id);

          //empty before updating
          $('#suggestions').html('');

          //render data of new uni
          University = this.id;
          document.getElementById("ranklist").innerHTML = "";

          fetchContents()

      });
      },
      error: function(e) {
        console.log("Error fetching data");
        console.log(e.message);            
      }
    });
});