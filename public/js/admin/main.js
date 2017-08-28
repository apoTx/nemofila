$(() => {

	
  $( '#tarih' ).datepicker();
  $('.dropdown.country').dropdown();
	

  let yayincont, parent;
  $('.yeniYayin').on('click',function(){
    	parent = $(this).parent('.field').prev('.yayincont');
    yayincont = parent.children('.fields:eq(0)').clone();


    parent.append(yayincont);

    	parent.children('.fields:last').find('input').val('');

    let obj = parent.children('input[type=hidden]');
    let yayinSize = parseInt(obj.val());
    obj.val(yayinSize+1);
  });


  /*yayin silme*/
  $('.yayincont#yayin').on('click', '.deleteStream', function() {
    if ($('.yayincont#yayin .fields').size() == 1){
      alert('Son kayıt silinemez!');
      return false;
    }

    $(this).parent('.field').parent('div').remove();

    let newSize = parseInt($('input[name=yayinSize]').val()) -1;
    $('input[name=yayinSize]').val(newSize);
  });
    

  $('.ui.checkbox').checkbox();
    
});