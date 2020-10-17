const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '449afd72ce63493fa15e67012d243e95'
});

const handleApiCall=(req,res) => {
app.models
.predict(Clarifai.DEMOGRAPHICS_MODEL, req.body.input)
.then(data => {
	res.json(data);
   })
     .catch(err => res.satus(400).json('unabe to work with API'))
}

const handleImage=(req,res,db) => {
	const {id} = req.body;
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries => {
   	res.json(entries[0]);
   })
   .catch(err => res.status(400).json('uable to get entries'))
  }
 module.exports={
 	handleImage,
 	handleApiCall:handleApiCall
 }