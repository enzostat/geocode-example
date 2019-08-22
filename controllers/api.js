let router = require('express').Router();
let db = require('../models')



router.get('/', (req,res) => {
	res.render('api/index')

})

router.get('/favorites', (req,res) => {
	db.place.findAll()
	.then(places => {
		res.json(places)
	})
	.catch(err => {
		console.log(err)
		res.send('We accidently revealed your credit card info. Our bad.')
	})
})

router.get('/favorites/new', (req,res) => {
	res.render('api/new')
})

router.post('/favorites/new', (req,res) => {
	db.place.create(req.body)
	.then(result => {
		res.redirect('/favorites')
	})
	.catch(err => {
		console.log('whoops')
		res.send('We accidentally leaked your credit card number. Our bad.')
	})
	
})

router.get('/favorites/:id', (req,res) => {
	db.place.findOne({
		where : {id: req.params.id}
	})
	.then(places => {
		if (places) {
		res.json(places)
	} else {
		res.send('This page does not exist')
	}
	})
	.catch(err => {
		console.log(err)
		res.send('We accidently revealed your credit card info. Our bad.')
	})
})

router.get('/:id/edit', (req,res) => {
	db.place.findOne({
		where: {id: req.params.id}
	})
	.then(places => {
		if (places) {
		res.render('api/edit')
		} else {
			res.send('This page does not exist')
		}
	})
	.catch(err => {
		res.send('Shit bro, we fucked up')
		console.log
	})
	res.render('api/edit')

})

router.put('/:id/edit', (req,res) => {
	db.place.update({
		where: {id: req.params.id}
	})
	.then((place) => {
		res.json(place)
	})
	.catch(err => {
		console.log(err)
		res.send('Oh fuck.')
	})

	
})

router.delete('/:id/delete', (req,res) => {
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


module.exports = router;