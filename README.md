# private-discord
A simple Discord bot to add people to a role

This was built so when we host LAN parties, we can expose an internal website
where people can add themselves to an @LAN role, and be granted access to
channels visible only to people at the LAN.

## Setup

It's a bit convoluted, but here goes ...

1) Pick the URL this will be hosted at

For example, `http://discordauth.lan`. It does not need to be public, but it
must be accessible to anyone who should be able to use this app.

2) Register a bot with Discord and get the application ID, secret and token.

Visit [the app registration page](https://discordapp.com/developers/applications/me)
and add a new bot. Give it a name, this is what it appears as in the user list.
Add a `Redirect URI` that points to `{url_of_app}/callback` - using the example
from step 1, we would put `http://discordauth.lan/callback`. Make sure to click the "Add bot user" button too.

3) Add the bot to your server

Substitute your bot's client ID in this URL, then visit the URL:

`https://discordapp.com/oauth2/authorize?client_id=157730590492196864&scope=bot&permissions=268435456`

4) Create the config file

Copy `config.example.json` to `config.json`, then susbstitute all of the values
with your own.

* `guildId` is the ID of your server. You can get this from the  URL displayed
when you are viewing a channel in the server. There will be two numbers in the
URL, and it is the first number - `discordapp.com/channels/{guildID}/{channelID}`.
* `appid` comes from the bot page in step 2
* `appsecret` comes from the bot page in step 2
* `authtoken` comes from the bot page in step 2
* `absoluteUrl` is the URl you picked in step 1 (with no trailing slash)
* `roleId` is the ID of the role you want to this app to add users to. To make
it easy to get the role ID, you can leave this field empty then visit `/roles`
on this app (eg, `http://discordauth.lan/roles`) and it will give you a list of
all roles on the server.
* `randomStateString` just needs to be a random string. If I was doing this
properly, this would be stored in the user's cookie or session data and be
unique per user session. Hard coding this removes some of the security from
OAuth, so don't use this for nuclear military operations, k? 
(`// TODO: fix this`)
* `listenPort` is the TCP port for the HTTP server to listen on.

5) Install app dependencies

The app depends on a few things. They must be installed!

```
npm install --global typescript@1.8
npm install --global typings
npm install
typings install
tsc
```

6) Run the app

`NODE_ENV=production node index.js`

Now visit your app's URL (in our example, `http://discordauth.lan`),
authorise the bot to access your account and you'll be added to the role.
Awesome!

