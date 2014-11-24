function UI()
{
	var self = this;
	self.tableManager = new TableManager("balanceTable");	
}

UI.prototype.showError = function(err)
{
	$("#errPopup").stop().fadeOut(0).html("Error: " + err).fadeIn(300, function(){
		$(this).fadeOut(5000);
	})
}

UI.prototype.showMsg = function(msg)
{
	var self = this;
	$("#successPopup").stop().fadeOut(0).html(msg).fadeIn(300, function(){
		$(this).fadeOut(5000);
	})	
}

UI.prototype.addTableRow = function(accountsData, account)
{
	var self = this;
	self.tableManager.addRow(accountsData, account);
}
