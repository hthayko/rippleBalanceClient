/*
	Constructor TableManager
	constructs object for representing accounts data in a table specified by tabelID param
*/

function TableManager(tabelID)
{
	var self = this;
	self.$table = $("#" + tabelID);
	self.columns = [ "XRP" ];
	self.totals = { "XRP" : 0 };
	self.precision = 6;

	/*	adds a new row with corresponding data to existing table	*/
	self.addRow = function(accountsData, account)
	{	
		$tr = $("<tr></tr>").insertBefore($("tr:last-child",self.$table));
		$("<td></td>").html(account).appendTo($tr);
		
		var all = getAllCurrencies(accountsData, account);

		for(i = 0; i < self.columns.length; ++i)	// adding existing currencies to the table
		{
			var value = (all[self.columns[i]] && toFixed(all[self.columns[i]])) || "-";
			$("<td></td>").addClass(self.columns[i]).html(value).appendTo($tr);
			self.totals[self.columns[i]] += all[self.columns[i]] || 0;
		}
		
		for(var currency in all)	// adding new currencies to the table
		{
			if(self.columns.indexOf(currency) == -1)
			{
				addColumn(currency);
				$("td:last-child",$tr).html(toFixed(all[currency]));
				self.columns.push(currency);
				self.totals[currency] = all[currency];
			}
		}

		updateTotals();
	}

	/*	helper method for adding new column for new currency	*/
	function addColumn(colName)
	{
		$("<td></td>").addClass(colName).html("-").appendTo($("tr:not(:first-child):not(:last-child)", self.$table));
		$("<th></th>").addClass(colName).html(colName).appendTo($("tr:first-child", self.$table));
		$("<th></th>").addClass(colName).html("0").appendTo($("tr:last-child", self.$table));		
	}

	/*	helper method to retrieve all currencies from the accountData	*/
	function getAllCurrencies(accountsData, account)
	{
		var all = {}, i;
		for(i = 0; i < accountsData.getTrustlines(account).length; ++i)
		{
			var line = accountsData.getTrustlines(account)[i];
			all[line.currency] = all[line.currency] || 0;
			all[line.currency] += +line.balance;
		}
		all["XRP"] = +accountsData.getXRP(account) / 1000000;	// turn XRP drops into XRP
		return all;
	}

	/*	helper method to update totals row of the table	*/
	function updateTotals()
	{
		var i;
		for(i = 0; i < self.columns.length; ++i)
		{
			$("tr:last-child th." + self.columns[i], self.$table).html(toFixed(self.totals[self.columns[i]]));
		}	
	}

	/*	helper method to bring the number to specified precision	*/
	function toFixed(num)
	{
		var tensPow = Math.pow(10, self.precision) + 0.0;
		return Math.round(num * tensPow) / tensPow ;
	}
}




