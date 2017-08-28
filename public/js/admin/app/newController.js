app.controller('myCtrl', ['$scope', '$http', 'Slug', function($scope, $http, Slug) {

  $scope.filmDescription = {};
  $scope.filmTitle = {};
  $scope.subtitle = {};
  $scope.metaTitle = {};
  $scope.metaDescription = {};
  $scope.isEdit = false;

  let imdb_id_div = $('#imdb_id_div');
  let filmPoster;
	
  $scope.slugify = function(input) {
    $scope.slug = Slug.slugify(input);
  };

  $scope.update = function(id){

    if (id != 'undefined') {
      $scope.isEdit = true;
      $scope.filmPosterImdb = true;

      var id =  id;

      $http.get('/api/movie/detailById/'+ id +'/?api_key='+ movielab_api_settings.api_key).then((res) => {
        let data = res.data;

        $scope.imdb_id = data.imdb_id;
        $scope.imdbScore = data.imdb_score;

        //film titles
        $scope.filmTitle.en = data.lang.en.title;
        $scope.filmTitle.tr = data.lang.tr.title;
        $scope.filmTitle.mk = data.lang.mk.title;
        $scope.filmTitle.sr = data.lang.sr.title;
        $scope.filmTitle.hr = data.lang.hr.title;
        $scope.filmTitle.es = data.lang.es.title;
        $scope.filmTitle.bg = data.lang.bg.title;

        //film description
        $scope.filmDescription.en = data.lang.en.description;
        $scope.filmDescription.tr = data.lang.tr.description;
        $scope.filmDescription.mk = data.lang.mk.description;
        $scope.filmDescription.sr = data.lang.sr.description;
        $scope.filmDescription.hr = data.lang.hr.description;
        $scope.filmDescription.es = data.lang.es.description;
        $scope.filmDescription.bg = data.lang.bg.description;

        //meta tag
        $scope.metaTitle.tr = data.lang.tr.metaTitle;
        $scope.metaDescription.tr = data.lang.tr.metaDescription;


        $scope.hours = data.hours;
        $scope.minutes = data.minutes;
        $scope.releaseYear = data.release_year;
        $scope.releaseCountry = data.release_country;
        $scope.director = data.director;
        $scope.status = data.active;
        $scope.categories = data.categories;

        $scope.metaTitle.tr = data.lang.tr.metaTitle;
        $scope.metaDescription.tr = data.lang.tr.metaDescription;


        // drive
        $scope.driveId = data.drive_id;
        $scope.driveTrailerId = data.drive_id_trailer;

        //subtitle
        $scope.subtitle.en = data.lang.en.subtitle;
        $scope.subtitle.tr = data.lang.tr.subtitle;
        $scope.subtitle.mk = data.lang.mk.subtitle;
        $scope.subtitle.sr = data.lang.sr.subtitle;
        $scope.subtitle.hr = data.lang.hr.subtitle;
        $scope.subtitle.es = data.lang.es.subtitle;
        $scope.subtitle.bg = data.lang.bg.subtitle;

        $scope.slug = data.slug;
        $scope.folderGuid = data.folder_guid;

        filmPoster =  data.cover;
        $scope.filmPoster = '/uploads/'+ $scope.folderGuid +'/cover/w185/'+ data.cover;
        $scope.filmPoster2 = '/uploads/'+ $scope.folderGuid +'/cover/w300/'+ data.cover;
      });
    }
  };

  $scope.getFilmInfo_viaImdbID = function (isEdit){
    /*
		 * Get movie detail.
		 * 
		 * Example.
		 * https://api.themoviedb.org/3/movie/550?api_key=944d1b0d3929722758dc74a4f0105682	
		*/

    setTimeout(() => {

      imdb_id_div.addClass('loading');

      let url_slash = 'movie/';
      let url = themoviedb_api_settings.api_base_url + url_slash + $scope.imdb_id +'?api_key='+ themoviedb_api_settings.api_key;
			
      $http.get(url).then((res) => {
        let data = res.data;

        // Film title
        //$scope.filmTitle = data.title;
				
        // Runtime
        let runtime   = data.runtime;
        $scope.hours  = Math.floor(runtime / 60);
        $scope.minutes= runtime - ($scope.hours * 60);

        // Categories
        $scope.categories = data.genres;

        // Release data
        let release_date = data.release_date;
        $scope.releaseYear = release_date.split('-')[0];

        // Film poster
        filmPoster = data.poster_path;

        // Film background
        $scope.bgFromImdbFileName = data.backdrop_path;

				
        /*  
				 * themoviedb api den alamadığımız veriler için
				 *
				*/

        // omdb api
        let omdb_url = omdb_api_settings.api_base_url + '?i='+ $scope.imdb_id;
				
        $http.get(omdb_url).then((res) => {
          let data = res.data;
          $scope.releaseCountry = data.Country;
          $scope.imdbScore = data.imdbRating;
          $scope.director  = data.Director;

          imdb_id_div.removeClass('loading');
        },(e) => {
          console.log(e);
          imdb_id_div.removeClass('loading');
        });
        // omdb api

        getFilmDetailForLanguages();
        $scope.getFilmPoster();


      },(e) => {
        console.log(e);
        imdb_id_div.removeClass('loading');
      });


      // Description for languages

      function getFilmDetailForLanguages(){

        let lang_string = '&language=';
        let url_string  = url + lang_string;

        // english
        let url_en = url_string + 'en';
        $http.get(url_en).then((res) => {
          let data = res.data;
          $scope.filmTitle.en = data.title;
          $scope.filmDescription.en = data.overview;
        },(e) => {
          console.log(e);
        });

        // turkish
        let url_tr = url_string+ 'tr';
        $http.get(url_tr).then((res) => {
          let data = res.data;

          $scope.filmTitle.tr = data.title;
          $scope.filmDescription.tr = data.overview;


          setTimeout(() => {
            if ($scope.filmTitle.en != $scope.filmTitle.tr) {
              $scope.metaTitle.tr = $scope.filmTitle.en +' - '+ $scope.filmTitle.tr + ' altyazılı izle 1080p HD';
            }else{
              $scope.metaTitle.tr = $scope.filmTitle.en +' altyazılı izle 1080p HD';
            }
          },100);

					
          $('#tr-tab').removeClass('loading');
        },(e) => {
          console.log(e);
        });

        // macedonian
        let url_mk = url_string + 'mk';
        $http.get(url_mk).then((res) => {
          let data = res.data;

          $scope.filmTitle.mk = data.title;
          $scope.filmDescription.mk = data.overview;
        },(e) => {
          console.log(e);
        });

        // serbian
        let url_sr = url_string + 'sr';
        $http.get(url_sr).then((res) => {
          let data = res.data;

          $scope.filmTitle.sr = data.title;
          $scope.filmDescription.sr = data.overview;
        },(e) => {
          console.log(e);
        });

        // crotian
        let url_hr = url_string + 'hr';
        $http.get(url_hr).then((res) => {
          let data = res.data;

          $scope.filmTitle.hr = data.title;
          $scope.filmDescription.hr = data.overview;
        },(e) => {
          console.log(e);
        });

        // spanish
        let url_es = url_string + 'es';
        $http.get(url_es).then((res) => {
          let data = res.data;

          $scope.filmTitle.es = data.title;
          $scope.filmDescription.es = data.overview;
        },(e) => {
          console.log(e);
        });

        // bulgarian
        let url_bg = url_string + 'bg';
        $http.get(url_bg).then((res) => {
          let data = res.data;
					
          $scope.filmTitle.bg = data.title;
          $scope.filmDescription.bg = data.overview;
        },(e) => {
          console.log(e);
        });




				

      }

    }, 1);
  };

  $scope.filmPosterImdb = false;
  $scope.getFilmPoster = function (){
    $('#get_imdb_poster').addClass('loading');
        
    $scope.posterFromImdbFileName = filmPoster;
    $scope.filmPoster = themoviedb_api_settings.api_image_download_base +'w185'+ filmPoster;
    $scope.filmPoster2 = themoviedb_api_settings.api_image_download_base +'w300'+ filmPoster;
    $scope.filmPosterImdb = true;
  };

  $scope.uploadFilmPoster = function () {
    $scope.$apply((scope) => {
      $scope.filmPosterImdb = false;
     	});
  };

}]);

app.directive('imageonload', () => {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('load', () => {
        $('#get_imdb_poster').removeClass('loading');
      });
      element.bind('error', () => {
        alert('image could not be loaded');
      });
    }
  };
});