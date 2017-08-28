$(() => {

  // form validation
  /*$('.ui.form')
	  .form({
	    fields: {
	      "title-en"  : 'empty',
	      "drive-id"  : 'empty',
	    }
	  });*/

  // new film tab
  $('.lang .item').tab();
  $('#context2 .menu .item').tab();


  // Film photo preview
  function readURL(input) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        $('#blah').attr('src', e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  $('input[name=\'film_cover\']').change(function(){
    readURL(this);
  });

});