let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let yayinSchema = new Schema({
  drive_id: String,
  drive_id_trailer: String,
  imdb_id: {
    type: String,
    unique: true
  },
  imdb_score: Number,
  cover: String,
  coverFromImdb: Boolean, // poster imdb den mi geliyor ?
  background: String,
  folder_guid: String,
  director: String,
  release_country:  String,
  release_year: Number,
  hours: Number,
  minutes: Number,
  categories: [],
  slug: {
    type: String,
    unique: true
  },
  active: Boolean,
  created_at: Date,
  lang: {
    en:{
      title: String,
      description: String,
      subtitle: String,
      metaTitle: String,
      metaDescription: String
    },
    tr:{
      title: String,
      description: String,
      subtitle: String,
      metaTitle: String,
      metaDescription: String
    },
    mk:{
      title: String,
      description: String,
      subtitle: String,
      metaTitle: String,
      metaDescription: String
    },
    sr:{
      title: String,
      description: String,
      subtitle: String,
      metaTitle: String,
      metaDescription: String
    },
    hr:{
      title: String,
      description: String,
      subtitle: String,
      metaTitle: String,
      metaDescription: String
    },
    es:{
      title: String,
      description: String,
      subtitle: String,
      metaTitle: String,
      metaDescription: String
    },
    bg:{
      title: String,
      description: String,
      subtitle: String,
      metaTitle: String,
      metaDescription: String
    }
  },
	
});

module.exports = mongoose.model('yayin', yayinSchema);