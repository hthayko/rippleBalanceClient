
var view = new UI();
var controller = new Controller(view);

$("#remoteConnect").on("click", controller.onRemoteConnect);
$("#remoteDisconnect").on("click", controller.onRemoteDisconnect);
$("#addAccountButton").on("click", onAddAccount);

function onAddAccount()
{
	var account = $("#newAccount").val();
	controller.getAccountBalances(account);
}