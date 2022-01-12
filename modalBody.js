modalBodyButtons(value)
{
    var modalBodyHeader = document.getElementById("editInputLabel").innerHTML;  // get the header text of the modal
    var currentCount = modalBodyHeader.replace("Current Item Count: ", "");  // gives us an integer

    if (value == 0)  // get input field text
    {
        modalBodyHeader = "Changed Count From " + currentCount + " to " 
    }
    else if (value == 1)  // add to item count
    {
        currentCount += 1;
        console.log(currentCount);
    }
    else if (value == 2)  // subtract from item count
    {

    }
}