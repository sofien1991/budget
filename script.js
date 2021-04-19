$(document).ready(() => {

	//get elements
	const balanceEl = $(".balance .value");
	const incomeTotalEl = $(".income-total");
	const outcomeTotalEl = $(".outcome-total");
	const chartEl = $(".chart");

	// get list windows
	const expenseEl = $("#expense");
	const incomeEl = $("#income");
	const allEl = $("#all");

	//get tabs buttons
	const expenseBtn = $(".tab1");
	const incomeBtn = $(".tab2");
	const allBtn = $(".tab3");

	//get Lists
	const expenseList = $("#expense .list");
	const incomeList = $("#income .list");
	const allList = $("#all .list");

	//get income Btn and inputs  
	const addIncome = $(".add-income");
	const incomeTitle = $("#income-title-input");
	const incomeAmount = $("#income-amount-input");

	////get expense Btn and values 
	const addExpense = $(".add-expense");
	const expenseTitle = $("#expense-title-input");
	const expenseAmount = $("#expense-amount-input");


	//toggle the expense tab
	expenseBtn.click(() => {
		expenseBtn.addClass("active")
		$(".tab2, .tab3").removeClass("active")
		expenseEl.show()
		$("#income, #all").hide()

	})
	//toggle the income tab
	incomeBtn.click(() => {
		incomeBtn.addClass("active")
		$(".tab1, .tab3").removeClass("active")
		incomeEl.show()
		$("#expense, #all").hide()
	})
	//toggle the all tab
	allBtn.click(() => {
		allBtn.addClass("active")
		$(".tab1, .tab2").removeClass("active")
		allEl.show()
		$("#income, #expense").hide()
	})

	// Lists array, if there is stored data then get it, if not then let it be an empty array
	let ENTRY_LIST; 
    ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];;


	//add expense entry
	addExpense.click(() => {

		if(expenseTitle.val() == "" || expenseAmount.val() == "" ){
			return false;
		}

		let expense = {
			type:"expense",
			title: expenseTitle.val(),
			amount: parseFloat(expenseAmount.val())
		}
		ENTRY_LIST.push(expense);
		updateUI();
		clearInput(expenseTitle, expenseAmount);
	})


	//add income entry
	addIncome.click(() => {

		if(incomeTitle.val() == "" || incomeAmount.val() == "" ){
			return false;
		}

		let income = {
			type:"income",
			title: incomeTitle.val(),
			amount: parseFloat(incomeAmount.val())
		}
		ENTRY_LIST.push(income);
		//showEntry(incomeList, income.type, income.title, income.amount, income.id)
		updateUI();
		clearInput(incomeTitle, incomeAmount);
	})




	//update the UI
	const updateUI = (entry) => {

		income = calculateTotal("income", ENTRY_LIST);
		expense = calculateTotal("expense", ENTRY_LIST);
		balance = calculateBalance(income, expense);


		incomeTotalEl.html(`<small>$</small>${income}`);
		outcomeTotalEl.html(`<small>$</small>${expense}`);
		balanceEl.html(`<small>$</small>${balance}`);

		clearElement([incomeList, expenseList, allList]);

		ENTRY_LIST.forEach((entry, index) =>{
			if (entry.type == "income"){
				showEntry(incomeList, entry.type, entry.title, entry.amount, index);
			}else if (entry.type == "expense"){
				showEntry(expenseList, entry.type, entry.title, entry.amount, index);
			}
			showEntry(allList, entry.type, entry.title, entry.amount, index);
		})	

		//save to local storage
		localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
		
		updateChart(income, expense);
	}


	// clear inputs
	const clearInput = (title, amount) => {
		title.val("");
		amount.val("");
	}

	//calculate Total
	const calculateTotal = (type, arr) => {
		
		let sum = 0;
		arr.forEach(entry =>{
			if(entry.type == type){
				sum += entry.amount;
			}
		})
		return sum;
	}

	//calculate balance
	const calculateBalance = (income, outcome) => {
		return income - outcome
	}

	//show the entry on the list
	const showEntry = (list, type, title, amount, id) => {

		const entry = `<li id="${id}" class="${type}">
					   	<div class"entry">${title} : $${amount} </div>
					   	<div id="edit"></div>
					   	<div id="delete"></div>
		               </li>`;

		list.prepend(entry)
	}

	
	//clear lists
	const clearElement = lists =>{
		lists.forEach(list => {
			list.html("");
		})
	}


	//delete entry
	const deleteEntry = (entry) => {
		ENTRY_LIST.splice(entry.id, 1)
		updateUI()
	}

	//edit entry
	const editEntry = (ENTRY) => {

		let entry = ENTRY_LIST[ENTRY.id]

		if(entry.type == "income"){
			incomeAmount.val(entry.amount)
			incomeTitle.val(entry.title)
		}else if(entry.type == "expense"){
			expenseAmount.val(entry.amount)
			expenseTitle.val(entry.title)
		}
		deleteEntry(entry)
	}

	//delete or edit entry
	const deleteOrEdit = (e) => {

		let eTarget = e.target;
		let entry = eTarget.parentNode;
		if(eTarget.id == "delete"){
			deleteEntry(entry)
		}else if(eTarget.id == "edit"){
			editEntry(entry)
		}
		
	}

	//add event listeners to delete and edit
	incomeEl.click(deleteOrEdit)
	expenseEl.click(deleteOrEdit)
	allEl.click(deleteOrEdit)

	
})
