import express = require('express');
import OAuth = require('oauth');

import request = require('request');
var config: Config.config = require('../config.json');

var OAuth2 = OAuth.OAuth2;

var router = express.Router();
var auth = new OAuth2(config.appId,
		config.appSecret,
		'https://discordapp.com/api',
		'/oauth2/authorize',
		'/oauth2/token',
		null);

var state = config.randomStateString;
var redirectUri = config.absoluteUrl + '/callback';

router.get('/', (req, res, next) => {
	res.redirect('/login');
})

router.get('/login', (req, res, next) => {
	var authurl = auth.getAuthorizeUrl({
		redirect_uri: redirectUri,
		scope: ['identify'],
		state: state,
		response_type: "code",
	});

	res.redirect(307, authurl);
});

router.get('/callback', (req, res, next) => {
	if (!req.query.code || req.query.state != state) {
		return res.status(400).send("This page wasn't sent a code :(");
	}

	auth.getOAuthAccessToken(
		req.query.code,
		{ grant_type: "authorization_code", redirect_uri: redirectUri },
		function(e, access_token, refresh_token, results) {

			console.log(access_token, e, results);
			if (e) return res.status(500).end("Server failed to get an oauth token for your account :(");

			request({
				url: "https://discordapp.com/api/users/@me",
				headers: {
					Authorization: "Bearer " + access_token, //access_token
					"User-Agent": "SquidsBot (http://github.com/sirsquidness, 1.0beta)"
				}
			}, function(e, response, body) {
				if (e) { return res.status(500).end("Server failed to look up your user account details :(")}
				var user: any = JSON.parse(body);
				console.log(user);
				request({
					url: `https://discordapp.com/api/guilds/${config.guildId}/members/${user.id}`,
					headers: {
						Authorization: config.authToken,
						"User-Agent": "SquidsBot (http://github.com/sirsquidness, 1.0beta)"
					}
				}, function(e, response, body) {
					if (e) { return res.status(500).end() }

					var guildMember: any = JSON.parse(body);
					console.log(guildMember);
					var roles: string[] = guildMember.roles;
					if (roles.indexOf(config.roleId) === -1) {
						roles.push(config.roleId);
						
						console.log(roles);
						request.patch({
							url: `https://discordapp.com/api/guilds/${config.guildId}/members/${user.id}`,
							headers: {
								Authorization: config.authToken,
								"User-Agent": "SquidsBot (http://github.com/sirsquidness, 1.0beta)"
							},
							body: {
								roles: roles
							},
							json: true
						}, function(e, response, body) {
							if (e) {console.log(e); return res.status(500).end(e); }
							res.status(200).end("Success!");
						})
					} else {
						console.log("User already a member of that role!");
						res.status(200).end("Already a member of the group");
					}
				})
			})
		}
	)
});

router.get('/roles', (req, res, next) => {
	request.get({
		url: `https://discordapp.com/api/guilds/${config.guildId}/roles`,
		headers: {
			Authorization: config.authToken,
			"User-Agent": "SquidsBot (http://github.com/sirsquidness, 1.0beta)"
		}
	}, function(e, response, body) {
		if (e) {console.log(e); return res.status(500).end(e); }
		res.status(200).end(body);
	})
})

module.exports = router;