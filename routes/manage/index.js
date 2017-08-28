let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let slugify = require('slugify');

let User = require('./../../models/users');
let Yayin = require('./../../models/manage/yayin');
let requireLogin = require('./inc/requireLogin.js');

let Guid = require('guid');
let mkdirp = require('mkdirp');
let mv = require('mv');
let wget = require('node-wget');
let fileUpload = require('express-fileupload');
let request = require('request');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
  Yayin.find().sort('-zaman.eklenmeZamanı').find((ex, yayinlar) => {
    res.render('manage/index', { title: 'Dashboard', maclar: yayinlar });
  });
});

router.get('/login',(req,res) => {
  res.render('manage/login');
});

router.post('/login', (req,res) => {

  User.findOne({ email: req.body.email },(err,user) => {

    // Yemi şifre üretmek için

    /*
      const saltRounds = 10;
      const myPlaintextPassword = 'MnoguTeskaLozinka123';

      bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
          console.log(hash);
      });
    */

    if(!user){
      res.render('manage/login',{ error: 'email yada şifre geçersiz' });
    }else{
      bcrypt.compare(req.body.password, user.pw, (err, r) => {
        if (r) {
          req.session.user = user;
          res.redirect('./');
        }else{
          res.render('manage/login',{ error: '** Email yada şifre geçersiz.' });
          next();
        }
      });
    }
  });
});


router.get('/dashboard', requireLogin, (req, res) => {
  res.render('manage/index');
});


router.get('/logout', requireLogin, (req,res) => {
  req.session.reset();
  res.redirect('./');
});



/* Add a new film */

router.get('/new', requireLogin, (req,res) => {
  res.render('manage/new', { title: 'Film Ekle' });
});

router.post('/new', fileUpload(), requireLogin, (req,res) => {
  let reqBody = req.body;

  let isEdit = req.body.isEdit;

  if (isEdit == 'true') {
    var guid = req.body.folder_guid;
  }else{
    var guid = Guid.create();
  }


  mkdirp('public/uploads/'+ guid +'', (err) => { 
    if (err) {
      console.error(err);
      res.json(err);
    }else{
      mkdirp('public/uploads/'+ guid +'/subtitles', (err) => { 
        if (err) {
          console.error(err);
          res.json(err);
        }else{

          if (req.body.filmPosterImdb == 'false') {

            var cover = req.files.film_cover;
            if (cover != undefined) {
              reqBody['cover'] = cover.name;
              cover.mv('public/uploads/'+ guid +'/'+cover.name+'', (err) => {
                if (err) {
                  console.log(err);
                  res.json(err);
                }
              });
            }
            
          }else{

            // eğer poster imdb den geliyorsa

            if (isEdit != 'true') {

              mkdirp('public/uploads/'+ guid +'/cover/', (err) => {

                // w185
                mkdirp('public/uploads/'+ guid +'/cover/w185/', (err) => {
                  let posterImdb = req.body.posterFromImdb;
                  wget({
                    url: posterImdb, 
                    dest: 'public/uploads/'+ guid +'/cover/w185/'
                  },
                  (error, response, body) => {
                    if (error) {
                      console.log(error);            // error encountered 
                    } else {
                      /*
                          console.log(response.headers); // response headers 
                          console.log(body);             // content of package 
                          */
                    }
                  });
                });

                // w300
                mkdirp('public/uploads/'+ guid +'/cover/w300/', (err) => {
                  let posterImdb = req.body.posterFromImdb2;
                  wget({
                    url: posterImdb, 
                    dest: 'public/uploads/'+ guid +'/cover/w300/'
                  },
                  (error, response, body) => {
                    if (error) {
                      console.log(error);            // error encountered 
                    } else {
                      /*
                          console.log(response.headers); // response headers 
                          console.log(body);             // content of package 
                          */
                    }
                  });
                });

              });

            }
            
          }

          // Wget background images
          let base_path = 'https://image.tmdb.org/t/p';

          mkdirp('public/uploads/'+ guid +'/background', (err) => {

            mkdirp('public/uploads/'+ guid +'/background/w780', (err) => {
              wget({
                url: base_path+ '/w780'+ req.body.bgFromImdbFileName, 
                dest: 'public/uploads/'+ guid +'/background/w780/'
              });
            });

            mkdirp('public/uploads/'+ guid +'/background/w1280', (err) => {
              wget({
                url: base_path+ '/w1280'+ req.body.bgFromImdbFileName, 
                dest: 'public/uploads/'+ guid +'/background/w1280/'
              });
            });

            mkdirp('public/uploads/'+ guid +'/background/original', (err) => {
              wget({
                url: base_path+ '/original'+ req.body.bgFromImdbFileName, 
                dest: 'public/uploads/'+ guid +'/background/original/'
              });
            });

          });
          
          
          
          // upload english subtitle
          let subtitle_en = req.files.subtitle_en;
          if (subtitle_en) {
            reqBody['lang.en.subtitle'] = subtitle_en.name;

            subtitle_en.mv('public/uploads/'+ guid +'/subtitles/'+subtitle_en.name+'', (err) => {
              if (err){
                console.log(err);
                res.json(err);
              }
            });
          }

          // upload turkish subtitle
          let subtitle_tr = req.files.subtitle_tr;
          if (subtitle_tr) {
            reqBody['lang.tr.subtitle'] = subtitle_tr.name;

            subtitle_tr.mv('public/uploads/'+ guid +'/subtitles/'+subtitle_tr.name+'', (err) => {
              if (err){
                console.log(err);
                res.json(err);
              }
            });
          }

          // upload macedonian subtitle
          let subtitle_mk = req.files.subtitle_mk;
          if (subtitle_mk) {
            reqBody['lang.mk.subtitle'] = subtitle_mk.name;

            subtitle_mk.mv('public/uploads/'+ guid +'/subtitles/'+subtitle_mk.name+'', (err) => {
              if (err){
                console.log(err);
                res.json(err);
              }
            });
          }

          // upload serbian subtitle
          let subtitle_sr = req.files.subtitle_sr;
          if (subtitle_sr) {
            reqBody['lang.sr.subtitle'] = subtitle_sr.name;

            subtitle_sr.mv('public/uploads/'+ guid +'/subtitles/'+subtitle_sr.name+'', (err) => {
              if (err){
                console.log(err);
                res.json(err);
              }
            });
          }

          // upload croatian subtitle
          let subtitle_hr = req.files.subtitle_hr;
          if (subtitle_hr) {
            reqBody['lang.hr.subtitle'] = subtitle_hr.name;

            subtitle_hr.mv('public/uploads/'+ guid +'/subtitles/'+subtitle_hr.name+'', (err) => {
              if (err){
                console.log(err);
                res.json(err);
              }
            });
          }

          // upload spanish subtitle
          let subtitle_es = req.files.subtitle_es;
          if (subtitle_es) {
            reqBody['lang.es.subtitle'] = subtitle_es.name;

            subtitle_es.mv('public/uploads/'+ guid +'/subtitles/'+subtitle_es.name+'', (err) => {
              if (err){
                console.log(err);
                res.json(err);
              }
            });
          }

          // upload bulgarian subtitle
          let subtitle_bg = req.files.subtitle_bg;
          if (subtitle_bg) {
            reqBody['lang.bg.subtitle'] = subtitle_bg.name;

            subtitle_bg.mv('public/uploads/'+ guid +'/subtitles/'+subtitle_bg.name+'', (err) => {
              if (err){
                console.log(err);
                res.json(err);
              }
            });
          }

          let title_en = req.body['lang.en.title'];
          let title_tr = req.body['lang.tr.title'];
          let title_mk = req.body['lang.mk.title'];
          let title_sr = req.body['lang.sr.title'];
          let title_hr = req.body['lang.hr.title'];
          let title_es = req.body['lang.es.title'];
          let title_bg = req.body['lang.bg.title'];

          let description_en = req.body['lang.en.description'];
          let description_tr = req.body['lang.tr.description'];
          let description_mk = req.body['lang.mk.description'];
          let description_sr = req.body['lang.sr.description'];
          let description_hr = req.body['lang.hr.description'];
          let description_es = req.body['lang.es.description'];
          let description_bg = req.body['lang.bg.description'];

          // meta data
          let metaTitle_tr = req.body['lang.tr.metaTitle'];
          let metaDescription_tr = req.body['lang.tr.metaDescription'];


          let director = req.body.director;
          let release_country = req.body.release_country;
          let release_year    = req.body.release_year;
          let hours    = req.body.hours;
          let minutes  = req.body.minutes;
          
          let background = req.body.bgFromImdbFileName;
          background = background.split('/');
          background = background[1];

          let imdb_score= req.body.imdb_score;
          let imdb_id  = req.body.imdb_id;
          let drive_id = req.body.drive_id;
          let drive_id_trailer = req.body.drive_id_trailer;
          let slug     = req.body.slug;
          let categories = JSON.parse(req.body.categories);

          let active = req.body.active;
          active == 'on' ? active = true : active = false;

          let created_at = new Date();
          
          let coverFromImdb;

          if (req.body.filmPosterImdb == 'true') {
            cover = req.body.posterFromImdbFileName;
            cover = cover.split('/');
            cover = cover[1];

            coverFromImdb = true;
          }else{
            if (cover != undefined) {
              cover = cover.name;
              coverFromImdb = false;
            }
          }

          
          let todo = new Yayin({
            'drive_id': drive_id,
            'drive_id_trailer': drive_id_trailer,
            'cover': cover ? cover : '',
            'coverFromImdb': coverFromImdb,
            'background': background,
            'folder_guid': guid,
            'slug': slug,
            'active': active,
            'imdb_id': imdb_id,
            'imdb_score': imdb_score,
            'director': director,
            'release_country':  release_country,
            'release_year': release_year,
            'hours': hours,
            'minutes': minutes,
            'created_at': created_at,
            'categories': categories,
            lang: {
              en: {
                'title': title_en,
                'description': description_en,
                'subtitle': subtitle_en ? subtitle_en.name : '',
              },
              tr: {
                'title': title_tr,
                'description': description_tr,
                'subtitle': subtitle_tr ? subtitle_tr.name : '',
                'metaTitle': metaTitle_tr,
                'metaDescription': metaDescription_tr
              },
              mk: {
                'title': title_mk,
                'description': description_mk,
                'subtitle': subtitle_mk ? subtitle_mk.name : '',
              },
              sr: {
                'title': title_sr,
                'description': description_sr,
                'subtitle': subtitle_sr ? subtitle_sr.name : '',
              },
              hr: {
                'title': title_hr,
                'description': description_hr,
                'subtitle': subtitle_hr ? subtitle_hr.name : '',
              },
              es: {
                'title': title_es,
                'description': description_es,
                'subtitle': subtitle_es ? subtitle_es.name : '',
              },
              bg: {
                'title': title_bg,
                'description': description_bg,
                'subtitle': subtitle_bg ? subtitle_bg.name : '',
              },
            }
          });


          let collectionId = req.body.collectionId;

          
          if (isEdit == 'true') {
            reqBody.categories = categories;
            Yayin.findOneAndUpdate({ _id:collectionId }, reqBody, (err, place) => {
              res.redirect('/manage/filmler');
            });
          }else{
            todo.save((err) => {
              if (err) {
                console.log(err);
                res.json(err);
              }else{
                res.redirect('/manage/filmler');
              }
            });
          }


          
          

        }
      });
    }

      
  });

  

});


router.get('/filmler', requireLogin, (req,res) => {

  Yayin.find((ex, yayinlar) => {
    console.log((yayinlar.active == true).length);
    res.render('manage/filmler', { title: 'Filmler', filmler: yayinlar, total: yayinlar.length });
  }).sort( { created_at : -1 } );

});

router.get('/filmler/edit/:id', requireLogin, (req,res) => {
  let id = req.params.id;

  Yayin.findById(id,(ex,data) => {
    res.render('manage/new', { title: 'Film Düzenle', id: id,  data: data });
  });
});

router.get('/filmler/delete/:id', requireLogin, (req,res) => {
  let id = req.params.id;

  Yayin.findByIdAndRemove(id, (ex) => {
    if (ex) {
      console.log(ex);
    } else {
      res.redirect('/manage/filmler');
    }
  });
});

/*altyazı testi*/
router.get('/altyazitesti', requireLogin, (req,res) => {
  res.render('manage/altyazitesti');
});

router.post('/altyazitesti', fileUpload(), requireLogin, (req,res) => {
  let guid = Guid.create();
  let driveId = req.body.driveId;
  let subtitle = req.files.subtitle;

  request.get('http://jqueryegitimseti.com/movielab/getlinkdrive.php?drive_id='+driveId , (err, response, sources) => {
    if (subtitle) {
      let uploadFileName = guid +'-'+subtitle.name;
      subtitle.mv('public/subtitle-test/'+ uploadFileName, (err) => {
        if (err) {
          res.json(err);
        }
        res.render('manage/altyazitesti', { source: sources, subtitleName: uploadFileName });
      });
    }else{
      res.render('manage/altyazitesti', { source: sources });
    }
  });
});

module.exports = router;