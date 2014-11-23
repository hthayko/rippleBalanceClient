var TableManager = function(tabelID)
{
	this.$table = $("#" + tabelID);
	this.columns = [ "XRP" ];
	this.totals = { "XRP" : 0 };
	this.precision = 6;
}

TableManager.prototype.addRow = function(accountsData, account)
{
	var self = this;
	$tr = $("<tr></tr>").insertBefore($("tr:last-child",this.$table));
	$("<td></td>").html(account).appendTo($tr);
	
	var all = getAllCurrencies();

	for(i = 0; i < this.columns.length; ++i)	// adding existing currencies to the table
	{
		var value = (all[this.columns[i]] && all[this.columns[i]].toFixed(this.precision)) || "-";
		$("<td></td>").addClass(this.columns[i]).html(value).appendTo($tr);
		this.totals[this.columns[i]] += all[this.columns[i]] || 0;
	}
	
	for(var currency in all)	// adding new currencies to the table
	{
		if(this.columns.indexOf(currency) == -1)
		{
			addColumn(currency);
			$("td:last-child",$tr).html(all[currency].toFixed(this.precision));
			this.columns.push(currency);
			this.totals[currency] = all[currency];
		}
	}

	updateTotals();

	function addColumn(colName)
	{
		$("<td></td>").addClass(colName).html("-").appendTo($("tr:not(:first-child):not(:last-child)", this.$table));
		$("<th></th>").addClass(colName).html(colName.substr(0,10)).appendTo($("tr:first-child", this.$table));
		$("<th></th>").addClass(colName).html("0").appendTo($("tr:last-child", this.$table));		
	}

	function getAllCurrencies()
	{
		var all = {}, i;
		for(i = 0; i < accountsData.getTrustlines(account).length; ++i)
		{
			var line = accountsData.getTrustlines(account)[i];
			all[line.currency] = all[line.currency] || 0;
			all[line.currency] += +line.balance;
		}
		all["XRP"] = +accountsData.getXRP(account);
		return all;
	}

	function updateTotals()
	{
		var i;
		for(i = 0; i < self.columns.length; ++i)
		{
			$("tr:last-child th." + self.columns[i], self.$table).html(self.totals[self.columns[i]].toFixed(self.precision));
		}	
	}
}




