$(document).ready(function(){
  

    var s = $('input'),
        f  = $('form'),
        a = $('.after'),
            w = $('.wrapper');
      
     $('body').on('mouseenter','.wiki',function(){
       $(this).find('.gap').css('opacity',1);
     }).on('mouseleave','.wiki',function(){
       $(this).find('.gap').css('opacity',0);
     })
    
    s.focus(function(){
      if( f.hasClass('open') ) return;
      f.addClass('in');
      setTimeout(function(){
        f.addClass('open');
        f.removeClass('in');
      }, 1300);
    });
    
    a.on('click', function(e){
      e.preventDefault();
      if( !f.hasClass('open') ) return;
       if(s.val()!==''){
       w.css('top','50%');
      w.css('transform','translate(-50%, -50%)');
         w.css('position','absolute'); 
         $('.description').text('Click search, Enter to submit');
       }
      clear();
       s.val('');
      f.addClass('close');
      f.removeClass('open');
      setTimeout(function(){
        f.removeClass('close');
      }, 1300);
    })
    
    f.submit(function(e){
      var query = s.val();
      e.preventDefault();
      f.addClass('explode');
      $('.description').text('');
      setTimeout(function(){
        f.removeClass('explode');
      }, 30);
      //lift the wrapper up to the top to make room
      w.css('position','relative');
      w.css('top','0%');
      w.css('transform','translate(-50%, 0%)');
      //display income data
      clear();//cleanup first
      if(query) display(query);
    })
    
    $("p.clickable").on("click",function(){
        window.open("https://en.wikipedia.org/wiki/Special:Random");
    })
    
    var clear = function(){
      $(".wiki").remove();
    }
    
    var display = function(query){
      
        $.ajax({
            url: "https://en.wikipedia.org/w/api.php",
        data: {
            format: "json",
            action: "query",
             generator: 'search',
                        //parameters for generator
                        gsrsearch: query,
                        gsrnamespace: 0,
                        gsrlimit: 10,
    
                    prop: "extracts",
                        //parameters for extracts
                        exchars: 250,
                        exlimit: 'max',
                        explaintext: true,
                        exintro: true,
            
        },
        dataType: 'jsonp',
        headers: {
          'Api-User-Agent': 'Example/1.0'
        },
            success: function (data, textStatus, jqXHR) {
              
              var obj = data.query.pages;
              for (var o in obj){
                 var id = obj[o].pageid;
              var url = "https://en.wikipedia.org/?curid=" + id;
                $('.wrapper').after("<div class = 'wiki'><div class = 'gap'></div><h3>" + obj[o].title +"</h3><p>" + obj[o].extract + "</p><a href = "+ url +" target = '_blank'></a></div>")
              }
            },
            error: function (errorMessage) {
            }
        });
    }
    
     $(".searchbox").autocomplete({
        source: function(request, response) {
            console.log(request.term);
            $.ajax({
                url: "https://en.wikipedia.org/w/api.php",
                dataType: "jsonp",
                data: {
                    'action': "opensearch",
                    'format': "json",
                    'search': request.term
                },
                success: function(data) {
                    response(data[1]);
                }
            });
        }
    });
      
      
    })