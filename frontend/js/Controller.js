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

	self.getAccountBalances = function(account)
	{
		if(self.accountsData.getStatus(account) === "SUCCESS")	
		{
			self.view.showError("Account is in the list already");
			return;
		}

		self.accountsData.add(account);
		makeAccountCall("accountInfo", account);
		makeAccountCall("accountLines", account);
	}

	self.onRemoteConnect = function()
	{
		onRemoteToggle(true);
	};

	self.onRemoteDisconnect = function()
	{
		onRemoteToggle(false);
	};

	function makeAccountCall(type, account)
	{
		$.ajax({		
			type: 		"GET",
			url: 		self.URLs[type] + "/" + account,
			success: function(res){
				if(!res.success)
				{
					self.view.showError(res.errorMsg);
					self.accountsData.setStatus(account, type, "FAILED");
					return;
				}
				self.accountsData.populate(account, type, res);
				self.accountsData.setStatus(account, type, "SUCCESS", function(){
					self.view.addTableRow(self.accountsData, account);
				});			
			},
			error: function(err){
				self.view.showError(err);
				self.accountsData.setStatus(account, type, "FAILED");
			},
		});		
	}

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