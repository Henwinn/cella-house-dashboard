var express = require('express');
var router = express.Router();
const sequelize = require('../models')
const products = sequelize.products

router.get('/', (req,res) => {
    products.findAll({
        where: {
            storeId: req.session.storeId,
            status: 'A'
        },
        include: {
            model: 'categories',
            attributes: ['name']
        },
        attributes: {
            excldue: ['storeName', 'variant', 'note']
        }
    })
    .then(product => {
        res.json(product)
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/add', (req,res) => {
    products.create({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        categoryName: req.body.categoryName,
        variant: req.body.variant,
        note: req.body.note,
        storeName: req.session.storeName
    })
    .then(product => {
        res.json({product})
    })
    .catch(err => {
        next(err)
    })
})

router.post('/update', (req,res) => {
    products.update({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        categoryName: req.body.categoryName,
        variant: req.body.variant,
        note: req.body.note
    }, {
        where: {
            storeName: req.session.storeName,
            id: req.query.prodId,
            status: 'A'
        }
    })
    .then(product => {
        res.json({product})
    })
    .catch(err => {
        next(err)
    })
})

router.post('/delete', (req, res) => {
    products.update({
        status: 'N'
    }, {
        where: {
            storeName: req.session.storeName,
            id: req.query.prodId
        }
    })
    .then( () => {
        res.json({message: 'delete success'})
    })
    .catch(err => {
        next(err)
    })
})

module.exports = router