function itemChange(){
  var design = ["로고디자인","간판디자인","명함·인쇄물","3D 모델링·도면","상세페이지·배너","웹·모바일 디자인","PPT·인포그래픽","패키지·북커버","캘리그라피","일러스트·삽화","웹툰·캐릭터","캐리커쳐·인물","포토샵편집","SNS·커뮤니티","현수막·POP","의류디자인,공간·인테리어,기타"];
  var programming = ["워드프레스","웹사이트 개발","쇼핑몰·커머스","모바일앱·웹","프로그램 개발","게임","데이터베이스","데이터분석·리포트","서버 및 기술지원", "QA·테스트","파일변환","챗봇", "기타"];
  var monitor = ["17인치","22인치","24인치","26인치"];
  
  var selectItem = $("#event_type").val();
  
  var changeItem;
  console.log(selectItem)
  if(selectItem == "Design"){
    changeItem = design;
  }
  else if(selectItem == "Programming"){
    changeItem = programming;
  }
  else if(selectItem == "Contents"){
    changeItem =  monitor;
  }
  
  $('#event_subtype').empty();
  
  $('#event_subtype').append("<option value='' selected disabled> Select a topic</option>")
  for(var count = 0; count < changeItem.length; count++){                
      var option = $("<option>"+changeItem[count]+"</option>");
      $('#event_subtype').append(option);
    }
  }


