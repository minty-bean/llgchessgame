var express = require('express');
var util = require('../config/util.js');
var router = express.Router();
var config = require('config');
var fs = require('fs');

var { Contract, JsonRpcProvider, formatUnits } = require('ethers');

const CONTRACT_ADDR = '0x4691F60c894d3f16047824004420542E4674E621';

router.get('/', function(req, res, next) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/', function(req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    res.redirect('/game/' + token + '/' + side);
});

router.get('/balance-of', async function(req, res) {
    try {
        const abi = JSON.parse(fs.readFileSync('./config/abi.json'));
        const provider = new JsonRpcProvider(config.get('chesshub.rpc'));
        const contract = new Contract(CONTRACT_ADDR, abi, provider);
        const accountAddress = req.query.account;

        const balance = await contract.balanceOf(accountAddress);

        res.json({ balance: formatUnits(balance, 9) });
    } catch(e) {
        res.json({ error: true, message: e.message })
    }
    
});

module.exports = router;