// ==UserScript==
// @name        Cashout Select All
// @namespace   Violentmonkey Scripts
// @match       https://groundops.alaskaair.com/CashoutWebUI*
// @grant       none
// @version     1.0.0
// @author      Sheldon Corcoran
// @description Add a Select All button to the Station Cashout view
// ==/UserScript==


(function(){
	function isStationSummary(){
		return !!document.getElementById('stationSummaryView');
	}

	function getRows(){
		return document.getElementById('stationAgentsTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
	}

	function isOpen(row){
		return row.getElementsByTagName('td')[1].innerText === 'Open';
	}

	function openAgentRows(){
		const open_rows = [];
		const rows = getRows();

		for(let i = 0; i < rows.length; i++){
			if(isOpen(rows[i])){
				open_rows.push(rows[i]);
			}
		}

		return open_rows;
	}

	function agentsNeedToCashOut(){
		return openAgentRows().length > 0;
	}

	function makeWrapper(){
		const wrapper = document.createElement('div');
		wrapper.className = 'col-sm-3 col-md-2';

		return wrapper;
	}

	function makeButton(){
		const button = document.createElement('button');
		button.id = 'stationSelectAllButton';
		button.className = 'btn btn-default';
		button.innerText = 'Select All';

		return button;
	}

	function isSelected(row){
		return row.getElementsByTagName('td')[7].getElementsByTagName('span')[0].classList.contains('glyphicon-ok');
	}

	function selectRow(row){
		if(isSelected(row)){
			return;
		}
		
		row.getElementsByTagName('td')[7].getElementsByTagName('button')[0].click();
	}

	function selectAll(){
		const rows = openAgentRows();
		for(let i = 0; i < rows.length; i++){
			selectRow(rows[i]);
		}
	}

	function needToAddButton(){
		return !document.getElementById('stationSelectAllButton');
	}

	function addButton(){
		const container = document.getElementById('summaryTotalsButtons');
		const wrapper = makeWrapper();
		const button = makeButton();

		button.onclick = selectAll;

		wrapper.appendChild(button);

		container.appendChild(wrapper);
	}


	const app = document.getElementById('app');
	const config = { childList: true, subtree: true };
	const callback = (mutationList, observer) => {
		if(isStationSummary() && agentsNeedToCashOut() && needToAddButton()){
			addButton();
		}
	};

	const observer = new MutationObserver(callback);
        
	observer.observe(app, config);
})();
