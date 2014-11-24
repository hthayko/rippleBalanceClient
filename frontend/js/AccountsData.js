/*
	Constructor AccountsData
	constructs object for storing and interacting with account infos and account trustlines
*/


function AccountsData()
{
	var self = this;
	accounts = {};
	self.statusTypes = {PENDING: "PENDING", SUCCESS : "SUCCESS", FAILED : "FAILED"}

	/*	adds new account	*/
	self.add = function(accountName)
	{
		accounts[accountName] = {
			accountInfo : {
				status: self.statusTypes.PENDING
			},
			accountLines : {
				status: self.statusTypes.PENDING
			}
		};
	} 

	/*
	*	returns "SUCCESS" if all requests corresponding to account name succeeded
	*	returns "FAILED" if any request corresponding to account FAILED
	*	returns "PENDING" if there were no FAILURES but there is a PENDING request
	*/
	self.getStatus = function(accountName)
	{
		if(!accounts[accountName])	return self.statusTypes.FAILED;
		var pendingExists = false;
		for(var type in accounts[accountName])
		{
			if(accounts[accountName][type].status == self.statusTypes.FAILED)	return self.statusTypes.FAILED;
			if(accounts[accountName][type].status == self.statusTypes.PENDING)	pendingExists = true;
		}
		if(pendingExists)	return self.statusTypes.PENDING;
		return self.statusTypes.SUCCESS;
	}

	/*	set status of account 	*/
	self.setStatus = function(accountName, type, status, callBack)
	{
		accounts[accountName][type].status = status;
		if(self.getStatus(accountName) == self.statusTypes.SUCCESS && callBack)	callBack(accountName);
	}

	/*	populate account	*/
	self.populate = function(accountName, type, data)
	{
		accounts[accountName][type].data = data;
	}

	/*	return accounts XRP in drops	*/
	self.getXRP = function(accountName)
	{
		return accounts[accountName].accountInfo.data.account_data.Balance;
	}


	/*	return accounts trustlines	*/
	self.getTrustlines = function(accountName)
	{
		return accounts[accountName].accountLines.data.lines;
	}
}