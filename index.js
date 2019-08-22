//required modules
require('dotenv').config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.accessToken });
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const app = express();
const db = require('./models')

//middleware and config
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(ejsLayouts);


//controllers
app.use('/api', require('./controllers/api'));

//render city-search view
app.get('/', (req,res) => {
	res.render('citySearch')
	
})



//use forward geo-coding to search for cities
//render the search results page
app.post('/search', (req,res) => {

	let city = req.body.city;
	let state = req.body.state;
	let query = `${city}, ${state}`
	geocodingClient.forwardGeocode({ query })
	.send()
	.then(response => {
		//TO DO: send all city listings instead of just first one
		const match = response.body.features[0];
		let lat = match.center[1];
		let long = match.center[0];
		let splitPlace_name = match.place_name.split(',');
		let city = splitPlace_name[0];
		let state = splitPlace_name[1];
		// console.log(match.features[0].center)
		// res.send(match.features[0])
		res.render('searchResults', {
			lat,
			long,
			city,
			state
		})
	})
	

})

//add selected city to our favorites
app.post('/favorites', (req,res) => {
	db.place.create(req.body)
	.then(result => {
		res.redirect('/favorites')
	})
	.catch(err => {
		console.log('whoops')
		res.send('We accidentally leaked your credit card number. Our bad.')
	})


})

//pull all of the favorite cities and pass them into views
app.get('/favorites', (req,res) => {
	db.place.findAll()
	.then(places => {
		res.render('favorites/index', {
			places
		})
	})
	.catch(err => {
		console.log(err)
		res.send('Whoops. Looks like everyone knows your social security number')
	})
	

})

//delete city rom favorites and then redirect back to favorites
app.delete('/favorites/:id', (req,res) => {
	db.place.destroy({
		where: {id: req.params.id}
	})
	.then(() => {
		res.redirect('/favorites')
	})
	.catch(err => {
		console.log(err)
		res.send('Oh fuck.')
	})

})


app.listen(3000, () => {
	console.log('now listening on port 3001')
})