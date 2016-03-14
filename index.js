var Dja = {};
var sites = {};
var $url = $('form input[type=text]');

$('form').submit(function(){
	try {
		var url = $url.val();
		var host = new URL(url).host;
		var abbr = sites[host];
		Dja[abbr].work(url);
	} catch (e) {
		alert("Not supported!");
	}
 return false;
});

sites['www.fanfiction.net'] = 'FFN';
sites['m.fanfiction.net'] = 'FFN';
sites['localhost'] = 'FFN';

Dja.FFN = {};
Dja.FFN.work = function(url){
	if(!/\/s\/([0-9]+)/.test(url)){alert("Not a FFN story page!");}

  var id = url.match(/\/s\/([0-9]+)/)[1];
	$.get(`http://localhost/s/${id}/1.htm`,function(data){
		console.log(Dja.FFN.parseInfo(data));
	});
	}

Dja.FFN.parseInfo = function(data) {
    var d = $(data);
    var info = {};
    info.title = d.find('#profile_top > b').html();
    info.author = d.find('#profile_top > a:first').html();
    info.cover = d.find('.cimage').eq(1).attr('src');
    info.published = d.find('#profile_top .xgray span:last').data('xutime');
    info.updated = d.find('#profile_top .xgray span:first').data('xutime');

    //Chapters
		var $chapters  = d.find("#chap_select").children();
    var chap_count = $chapters.size() / 2;

		if(!chap_count){
			info.story = d.find("#storytext").html();

	  }else{
		  info.story  = [];
      for(var i=0; i<chap_count; i++){
        info.story[i] = {
            number: i+1,
            title: $chapters[i].innerHTML.replace(/^[0-9]+. /,''),
            text: d.find("#storytext").html()
            }
        }
    }

    return info;
}
