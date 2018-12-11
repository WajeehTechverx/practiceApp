var fs = require('fs');
var data;
fs.readFile('./data.json',{encoding: "utf8"},function(err,data){
	if(err)
		console.log(erro);
	// else
console.log("------------------Task 1---------------");
//console.log(data);
//console.log("Type is", (typeof JSON.parse(data)));
var record = JSON.parse(data);
var x;
for(x=0 ; x<2 ; x++)
{
//console.log(JSON.parse(record.companies[0].compnayCode));
console.log("------------------Task 2---------------");
var i = 0;
for(i=0 ; i<4; i++)
{
	console.log(record.companies[x].users[i].name+":     "+record.companies[x].users[i].salary);
}

console.log("------------------Task 3---------------");

var j =0;
var fisrt = true;
var finalSalary = 0;
var salaryCut = 0;
var curCut = 0;
fisrt = true;
var bonus = false;
var history = [];

for(i=0 ; i<4 ; i++)
{
	history[i] = -1;
	minSalaryCut = 50000;
	//console.log("Leaves of "+record.companies[x].users[i].Trackingnumber.substring(0,2)+" are as:");
	finalSalary = record.companies[x].users[i].salary;
	salaryCut = 0;
	fisrt = true;
	if(record.companies[x].users[i].Trackingnumber.substring(0,2) == "32")
	{
		//curCut = 0;
		for(j=0 ; j<3 ; j++)
		{
			//console.log(record.companies[x].users[i].leav)
			if((record.companies[x].users[i].leaves[j].type == "paid") && (record.companies[x].users[i].leaves[j].date != record.companies[x].Holidays))
			{
				if(fisrt)
				{
					//console.log("Here");
					curCut = ((record.companies[x].users[i].salary)*(record.companies[x].SaralyCut[0]/100));
					//finalSalary = finalSalary - curCut;
					salaryCut = salaryCut + curCut;

					fisrt = false;
				}
				else
				{
					curCut = ((record.companies[x].users[i].salary)*(record.companies[x].SaralyCut[1]/100));
					//finalSalary = finalSalary - curCut;
					salaryCut = salaryCut + curCut;
				}
			}
		}
	}
	history[i] = salaryCut;
	finalSalary = finalSalary - salaryCut;

	console.log("Final Salaray of "+record.companies[x].users[i].name+" is: "+finalSalary);
	
}

console.log("------------------Task 4---------------");
var minSalaryCut = 50000;
var bonusIndex = -1;
for (i=0 ; i<4 ; i++)
{
	if(record.companies[x].users[i].Trackingnumber.substring(0,2) == "32")
	{
		if(history[i] < minSalaryCut)
		{
			minSalaryCut = history[i];
			bonusIndex = i;
		}
	}
}
console.log(record.companies[x].users[bonusIndex].name + " will get a bonus of:\t" + ((record.companies[x].users[bonusIndex].salary) * (record.companies[x].bonus/100)));
}


// for(i=0 ; i<4 ; i++)
// {
// 	console.log("Leaves of "+record.companies[x].users[i].name+" are as:");
// 	for(j=0 ; j<3 ; j++)
// 	{
// 		console.log(record.companies[x].users[i].leaves[j].date +"     "+record.companies[x].users[i].leaves[j].type)
// 	}
// 	console.log("\n");
// }

//console.log("Here");

});