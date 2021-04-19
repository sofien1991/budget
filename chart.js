//get chart div
const chart = document.querySelector(".chart");

//creat canvas el and append it to chart div and add height and width to it
const canvas = document.createElement("canvas")
canvas.height = 50;
canvas.width = 50;
chart.appendChild(canvas)
console.log(chart)

//active canvas api
const ctx = canvas.getContext("2d");

ctx.lineWidth = 8;

const R = 20;

//draw circle
const drawCircle = (color, ratio, anticlockwise) =>{

	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise);
	ctx.stroke();
}

// update the chart 
const updateChart = (income, outcome) => {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let ratio = income / (income + outcome);

	drawCircle("#fff", - ratio, true )
	drawCircle("#f0624d", 1 - ratio, false )

}
