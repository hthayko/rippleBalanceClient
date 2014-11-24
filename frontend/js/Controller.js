/*
	Constructor Controller
	constructs object for connecting to server, getting account data, storing them, and representing them
*/

function Controller(view)
{
	var self = this;
	self.URLs = {
		accountInfo : "/rippleAPI/getAccountInfo",
		accountLines : "/rippleAPI/getAccountLines",
		remoteConnect: "/rippleAPI/remoteConnect",
		remoteDisconnect: "/rippleAPI/remoteDisconnect"	
	};

	self.accountsData = new AccountsData();
	self.view = view;

	/*	get account data from server and store them in accountData	*/
	self.getAccountBalances = function(account)
	{
		if(self.accountsData.getStatus(account) === self.accountsData.statusTypes.SUCCESS)	
		{
			self.view.showError("Account is in the list already");
			return;
		}

		self.accountsData.add(account);
		makeAccountCall("accountInfo", account);
		makeAccountCall("accountLines", account);
	}

	/*	connect server to rippled 	*/
	self.onRemoteConnect = function()
	{
		onRemoteToggle(true);
	};

	/*	disconnect server from rippled 	*/
	self.onRemoteDisconnect = function()
	{
		onRemoteToggle(false);
	};

	/*	helper method for making account-related calls to server	*/
	function makeAccountCall(type, account)
	{
		$.ajax({		
			type: 		"GET",
			url: 		self.URLs[type] + "/" + account,
			success: function(res){
				if(!res.success)
				{
					self.view.showError(res.errorMsg);
					self.accountsData.setStatus(account, type, self.accountsData.statusTypes.FAILED);
					return;
				}
				self.accountsData.populate(account, type, res);
				self.accountsData.setStatus(account, type, self.accountsData.statusTypes.SUCCESS, function(){
					self.view.addTableRow(self.accountsData, account);
				});			
			},
			error: function(err){
				self.view.showError(err);
				self.accountsData.setStatus(account, type, self.accountsData.statusTypes.FAILED);
			},
		});		
	}


	/*	helper method for conect/disconnect server to/from rippled */
	function onRemoteToggle(turnOn)
	{
		var url = turnOn ? self.URLs.remoteConnect : self.URLs.remoteDisconnect;
		var msg = turnOn ? "successfully connected" : "successfully disconnected";

		$.ajax({		
			type: 		"GET",
			url: 		url,
			success: function(res){
				if(!res.success)
				{
					self.view.showError(res.errorMsg);
					return;
				}
				self.view.showMsg(msg);
			},
			error: function(err){
				self.view.showError(res.errorMsg);
				return;
			},
		});	
	}
}