

//return array of objects
function SelectSingle(
	collection,
	datetime?,		//timestamp
	attributes?, 	//array of values
	precision? 		// true - точное совпадение метки времени, false - nearest
)

//return 2-dimensions array of objects
function SelectMany(
	collection,
	start?,
	end?,
	attributes?
)

function Summ(
	collection,
	start,
	end,
	attribute
)

function Avg(
	collection,
	start,
	end,
	attribute
)

function Min(
	collection,
	start,
	end,
	attribute
)

function Max(
	collection,
	start,
	end,
	attribute
)
