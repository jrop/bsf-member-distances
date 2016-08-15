/* Run this on the members list webpage */
JSON.stringify($$('table tr')
	.filter(row => !(row.innerHTML.includes('Name') && row.innerHTML.includes('Address') && row.innerHTML.includes('Phone') && row.innerHTML.includes('E-Mail')))
	.filter(row => row.children.length > 1)
	.map(row => ({
		name: row.children[0].innerText,
		address: row.children[1].innerText.replace(/\n/g, ', ')
	}))
	.filter(row => row.address != ''))
