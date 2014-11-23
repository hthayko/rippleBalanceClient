
$("#remoteConnect").on("click", onRemoteConnect);
$("#remoteDisconnect").on("click", onRemoteDisconnect);
$("#addAccountButton").on("click", onAddAccount);

var URL = {
	accountInfo : "/rippleAPI/getAccountInfo",
	accountLines : "/rippleAPI/getAccountLines",
	remoteConnect: "/rippleAPI/remoteConnect",
	remoteDisconnect: "/rippleAPI/remoteDisconnect"	
};

var accountsData = new AccountsData();
var tableManager = new TableManager("balanceTable");

function onAddAccount()
{
	var account = $("#newAccount").val();
	if(accountsData.getStatus(account) === "SUCCESS")	
	{
		showError("Account is in the list already");
		return;
	}
	accountsData.add(account);
	onAccountInfo(account);
	onAccountLines(account);
}

function onAccountInfo(account){
	var type = "accountInfo";
	makeAccountCall(type, account);
}

function onAccountLines(account){
	var type = "accountLines";
	makeAccountCall(type, account);
}

function makeAccountCall(type, account)
{
	$.ajax({		
		type: 		"GET",
		url: 		URL[type] + "/" + account,
		success: function(res){
			if(!res.success)
			{
				showError(res.errorMsg);
				accountsData.setStatus(account, type, "FAILED");
				return;
			}
			accountsData.populate(account, type, res);
			accountsData.setStatus(account, type, "SUCCESS", addTableRow);			
		},
		error: function(err){
			showError(err);
			accountsData.setStatus(account, type, "FAILED");
		},
	});	
}


function onRemoteConnect()
{
	onRemoteToggle(true);
};

function onRemoteDisconnect()
{
	onRemoteToggle(false);
};

function onRemoteToggle(turnOn)
{
	var url = turnOn ? URL.remoteConnect : URL.remoteDisconnect;
	var msg = turnOn ? "successfully connected" : "successfully disconnected";

	$.ajax({		
		type: 		"GET",
		url: 		url,
		success: function(res){
			if(!res.success)
			{
				showError(res.errorMsg);
				return;
			}
			showMsg(msg);
		},
		error: function(err){
			showError(res.errorMsg);
			return;
		},
	});	
}

function addTableRow(account)
{
	tableManager.addRow(accountsData, account);
}

function showError(err)
{
	$("#errPopup").stop().fadeOut(0).html("Error: " + err).fadeIn(300, function(){
		$(this).fadeOut(5000);
	})
}

function showMsg(msg)
{
	$("#successPopup").stop().fadeOut(0).html(msg).fadeIn(300, function(){
		$(this).fadeOut(5000);
	})
}

