'use strict'

const co = require('co')
const fetch = require('node-fetch')

const API_KEY = require('./maps-api-key')
const GMAPS_ENDPOINT = `https://maps.googleapis.com/maps/api/directions/json`
const KGXY = '40.4263727,-104.6388996'
const KFNL = '40.4492601,-105.0046167'

function dist(member, where) {
	const url = `${GMAPS_ENDPOINT}?origin=${encodeURIComponent(member.address)}&destination=${where}&key=${API_KEY}`
	return fetch(url)
		.then(r => r.json())
		.then(d => {
			if (!d.routes[0]) {
				console.log(member, where)
				process.exit(1)
			}
			return d.routes[0].legs[0]
		})
}

function toMinutes(s) {
	const m = /^(?:(\d+) hours?)?\s*(?:(\d+) mins?)$/.exec(s)
	const hours = m[1] ? parseInt(m[1]) : 0
	const mins = parseInt(m[2])
	return hours * 60 + mins
}

co(function * main() {
	const members = require('./members.json')

	for (const member of members) {
		const gxy = yield dist(member, KGXY)
		const fnl = yield dist(member, KFNL)

		const gxyTime = toMinutes(gxy.duration.text)
		const gxyDist = parseFloat(gxy.distance.text.replace(' mi', ''))

		const fnlTime = toMinutes(fnl.duration.text)
		const fnlDist = parseFloat(fnl.distance.text.replace(' mi', ''))

		member.gxy = { time: gxyTime, dist: gxyDist }
		member.fnl = { time: fnlTime, dist: fnlDist }
		member.favorTime = fnlTime < gxyTime ? 'FNL' : 'GXY'
		member.favorDist = fnlDist < gxyDist ? 'FNL' : 'GXY'
	}

	console.log('Name,Address,GXY (distance),GXY (time),FNL (distance),FNL (time),Favor (distance),Favor (time)')
	members.forEach(member => {
		console.log([ member.name, member.address, member.gxy.dist, member.gxy.time, member.fnl.dist, member.fnl.time, member.favorDist, member.favorTime ]
			.map(s => `"${s}"`)
			.join(','))
	})
})
.catch(e => console.error(e && e.stack ? e.stack : e))
