var fs = require('fs');
var board = JSON.parse(fs.readFileSync('o0JpJOo6.json', 'utf8'));

// Collect only cards into "Product Backlog"
var pbId = board.lists.find( l => l.name === "Product Backlog").id;
var ntbdId = board.lists.find( l => l.name.startsWith("Not")).id;

var productBacklog = board.cards.filter(c => c.idList == pbId && !c.closed);
console.log("BACKLOG ITEMS:",productBacklog.length);

// Collect Id of the custom fields
var storyPointsId = board.customFields.find( f => f.name=="storypoints").id;
var redmineIssueId = board.customFields.find( f => f.name=="Redmine Issue#").id;
var tecSpecId = board.customFields.find( f => f.name=="TecSpec ID").id;

// Collect storypoints numeric values
var sp = [];
board.customFields[0].options.forEach(v => sp[v.id] = Number(v.value.text))

// Collect cards without storypoints 
var unestimatedCards = productBacklog
	.filter( c => !c.customFieldItems.find( cf => cf.idCustomField == storyPointsId ) )
	.map( c => [c.idShort, c.name]	);
console.log("UNESTIMATED CARDS:",unestimatedCards.length);

var estimatedCards = productBacklog
	.filter( c => c.customFieldItems.find( cf => cf.idCustomField == storyPointsId ) )
	.map( c => [c.idShort, c.name,
		sp[c.customFieldItems.filter( cf => cf.idCustomField == storyPointsId )[0].idValue]
		]	);
console.log("ESTIMATED CARDS:",estimatedCards);

// Total storypoints of all cards (excluding "Not to be done")
let estimatedTotal=0;
board.cards.forEach( function(c) {
	if(c.idList != ntbdId) {
		let st = c.customFieldItems.find( cf => cf.idCustomField == storyPointsId );
		if( st ) estimatedTotal += sp[st.idValue]
		}
	});
console.log("ESTIMATED STORYPOINTS TOTAL:",estimatedTotal);
