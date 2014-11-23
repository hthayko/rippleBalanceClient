function AccountsData()
{
	this.accounts = {};
}

AccountsData.prototype.add = function(accountName)
{
	this.accounts[accountName] = {
		accountInfo : {
			status: "PENDING"
		},
		accountLines : {
			status: "PENDING"
		}
	};
} 

/*
*	function getStatus(accountName)
*	returns "SUCCESS" if all requests corresponding to this account name succeeded
*	returns "FAILED" if any request corresponding to this account FAILED
*	returns "PENDING" if there were no FAILURES but there is a PENDING request
*/
AccountsData.prototype.getStatus = function(accountName)
{
	if(!this.accounts[accountName])	return "FAILED";
	var pendingExists = false;
	for(var type in this.accounts[accountName])
	{
		if(this.accounts[accountName][type].status == "FAILED")	return "FAILED";
		if(this.accounts[accountName][type].status == "PENDING")	pendingExists = true;
	}
	if(pendingExists)	return "PENDING";
	return "SUCCESS";
}

AccountsData.prototype.setStatus = function(accountName, type, status, callBack)
{
	this.accounts[accountName][type].status = status;
	if(this.getStatus(accountName) == "SUCCESS")	callBack(accountName);
}

AccountsData.prototype.populate = function(accountName, type, data)
{
	this.accounts[accountName][type].data = data;
}

AccountsData.prototype.getXRP = function(accountName)
{
	return this.accounts[accountName].accountInfo.data.account_data.Balance;
}

AccountsData.prototype.getTrustlines = function(accountName)
{
	return this.accounts[accountName].accountLines.data.lines;
}

