// 검색어 완성
$(function() {
  $('#campus').keyup(_.debounce(function() {
      var query = $('#campus').val() || "";
      query = query.trim();

      console.log("AJAX called!")
      $.ajax({
        url: '/suggest',
        data: {q: query},
        success: function(data) {
          // Ajax의 결과를 잘 받았을 때
          // 화면에 받은 결과를 가지고 list를 rendering하고..
          var els = data.slice(0, 4).map(function(name) {
            return '<div class="select"> <img class="select-img" src="../images/university.png", alt="Uni" /> <li>' + name + '</li> </div>';
          });
          $('.suggest-box').html(els.join('\n')).show();

          // li item을 클릭했을 때, text box의 내용을 바꾸고, suggest-box감춤
          $('.suggest-box li').click(function(e) {
            $('#campus').val($(e.currentTarget).text());
            $('.suggest-box').hide();
          });
        },
        complete: function() {
          console.log("fails")
        }
      });
    }, 500));
  });