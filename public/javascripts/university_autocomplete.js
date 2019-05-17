// 검색어 완성
$(function() {
  $('#university').keyup(_.debounce(function() {
      var query = $('#university').val() || "";
      query = query.trim();

      console.log("AJAX called!")
      $.ajax({
        url: '/university_search',
        data: {q: query},
        success: function(data) {
          // Ajax의 결과를 잘 받았을 때
          // 화면에 받은 결과를 가지고 list를 rendering하고..
          var els = data.slice(0, 4).map(function(name) {
            return '<li class="select"><i class="fa fa-map-marker" /><p>' + name + '</p></li>';
          });
          $('.university-suggest-box').html(els.join('\n')).show();

          // li item을 클릭했을 때, text box의 내용을 바꾸고, suggest-box감춤
          $('.university-suggest-box li').click(function(e) {
            $('#university').val($(e.currentTarget).text());
            $('.university-suggest-box').hide();
          });
        },
        complete: function() {
          
        }
      });
    }, 500));
  });