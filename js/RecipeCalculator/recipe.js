/*$('#' + ingredientsDropdown + ' li a').on('click', function(){
    selectedIngredient = $(this).text();
});
*/

/***************** Ingredient object *****************/

function Ingredient (name, amount) {
	this.name = name;
	this.amount = amount;
}

Ingredient.prototype.toString = function() {
	if(this.hasAmount())
		return this.amount + ' ' + this.name;
	return this.name; 
};

Ingredient.prototype.hasAmount = function() {
	return this.amount != undefined && this.amount > 0;
};

/***************** Global Variables ******************/

var ingredients = [];		//array with the list of ingredients
var calculatingByAmount;	//boolean that indicates the option selected
var selectedIngredient;		//string with the name of the ingredient selected

/**************** HTML ids to be used ****************/

var recipeInput = 'originalRecipe';

var portionsButton = 'portionsButton';
var portionsDiv = 'portionsDiv';
var originalPortionsInput = 'originalPortions';
var newPortionsInput = 'newPortions';

var amountButton = 'amountButton';
var amountDiv = 'amountDiv';
var newAmountInput = 'newAmount';
var ingredientsDropdown = 'ingredientsDropdown';

var calculateLineDiv = 'calculateLine';
var resultDiv = 'resultDiv';
var resultUl = 'result';

/******************* GUI functions *******************/

function hideElement(elementId) {
	$('#'+elementId).addClass('hidden');
}

function showElement(elementId) {
	$('#'+elementId).removeClass('hidden');
}

function clearAmountDropdown() {
	var selectbox = document.getElementById(ingredientsDropdown);
    for(var i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}

function fillAmountDropdown() {
	readRecipe();
	clearAmountDropdown();
	var select = document.getElementById(ingredientsDropdown);
	for (var i = 0; i < ingredients.length; i++) {
		var option = document.createElement("option");
		option.text = ingredients[i].name;
		option.value = i;
		select.appendChild(option);
	}
}

function setAsActive(elementId) {
    $('#' + elementId).addClass('active');
}

function setAsInactive(elementId){
	$('#' + elementId).removeClass('active');
}

function byPortions() {
	showElement(portionsDiv);
	hideElement(amountDiv);
	setAsActive(portionsButton);
	setAsInactive(amountButton);
	calculatingByAmount = false;
	showCalculate();
}

function byAmount() {
	showElement(amountDiv);
	hideElement(portionsDiv);
	fillAmountDropdown();
	setAsActive(amountButton);
	setAsInactive(portionsButton);
	calculatingByAmount = true;
	showCalculate();
}

function showCalculate() {
	showElement(calculateLineDiv);
}

function execute() {
	readRecipe();
	if(calculatingByAmount)
		calculateByAmount();
	else
		calculateByPortions(originalPortions, newPortions);
	printRecipe();
}

function getElementValueById(elementId) {
	return document.getElementById(elementId).value;
}

function getOption() {
	var element = document.getElementById(ingredientsDropdown);
	return element.options[element.selectedIndex].value;
}

/*************** Calculator Functions ****************/

function readRecipe() {
	ingredients = [];
	var text = document.getElementById(recipeInput).value;
	var lines = text.split(/\n/);
	lines.forEach(function(line) {
		var ing = newIngredient(line);
		ingredients.push(ing);
	});
}

function newIngredient(line) {
	line = line.trim();
	var firstChar = line.charAt(0);
	if ((firstChar != ',' && firstChar!='.') && (firstChar < '0' || firstChar > '9'))
		return new Ingredient(line);
	var space = line.indexOf(' ');
	if (space < 0)
		throw 'Invalid Format';
	var amount = parseFloat(line.substring(0,space));
	return new Ingredient(line.substring(space + 1), amount);
}

function calculate(percent) {
	ingredients.forEach(function(ingredient) {
		if (ingredient.hasAmount())
			ingredient.amount = ingredient.amount * percent;
	});
}

function calculateByPortions() {
	var originalPortions = getElementValueById(originalPortionsInput);
	var newPortions = getElementValueById(newPortionsInput);
	var percent = newPortions / originalPortions;
	calculate(percent);
}

function calculateByAmount() {
	var newAmount = getElementValueById(newAmountInput);
	var idx = getOption();
	if(ingredients[idx].hasAmount()){
		var percent = newAmount / ingredients[idx].amount;
		calculate(percent);
	}
}

function printRecipe() {
	var newRecipe = '';
	var resultElement = document.getElementById(resultUl);
	resultElement.innerHTML = '';
	ingredients.forEach(function (ingredient) {
		var li = document.createElement('li');
		li.classList.add('list-group-item');
		li.appendChild(document.createTextNode(ingredient.toString()));
		resultElement.appendChild(li);
	});
	showElement(resultDiv);
}