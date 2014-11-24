/*
	Constructor UI
	constructs object for basic interaction with the DOM
*/

function UI()
{
	var self = this;
	self.tableManager = new TableManager("balanceTable");	
}

/*	shows an error	*/
UI.prototype.showError = function(err)
{
	$("#errPopup").stop().fadeOut(0).html("Error: " + err).fadeIn(300, function(){
		$(this).fadeOut(5000);
	})
}

/*	shows a success message	*/
UI.prototype.showMsg = function(msg)
{
	var self = this;
	$("#successPopup").stop().fadeOut(0).html(msg).fadeIn(300, function(){
		$(this).fadeOut(5000);
	})	
}

/*	adds a row to table using tableManager	*/
UI.prototype.addTableRow = function(accountsData, account)
{
	var self = this;
	self.tableManager.addRow(accountsData, account);
}
