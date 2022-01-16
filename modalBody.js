var tmp;  // placeholder for currentCount
var cellLocation;  // so we can find our cell
var sheetCellColumnLocation;  // so we can find our cell column on Google Sheets
var sheetCellRowLocation;  // so we can find our cell row on Google Sheets
var onlyOneCurrentCount = false; // we only want the current count var to be changed once each time the modal is opened
var currentCount;  // value from cell

function modalBodyButtons(Value)
{
    var modalBodyHeader = document.getElementById("editInputLabel").innerHTML;  // get the header text of the modal
    var txtBoxValue = parseInt(document.getElementsByName("ViewChanges")[0].value);
    
    if (!onlyOneCurrentCount)
    {
        onlyOneCurrentCount = true;
        // grabbing number from string, so find correct string pattern
        if (modalBodyHeader.includes("Current Item Count: "))
        {
            currentCount = parseInt(modalBodyHeader.replace("Current Item Count: ", ""));  // gives us an integer
        }
        // else if (modalBodyHeader.includes("Changed Count From "))
        // {
        //     currentCount = parseInt(modalBodyHeader.replace("Changed Count From " + currentCount + " to ", ""));  // gives us an integer
        // }
        tmp = currentCount;
    }
    

    if (Value == 0)  // get input field text
    {
        if (txtBoxValue != currentCount)  // do nothing if the value is already this
        {
            if (Number.isInteger(txtBoxValue))  // number is valid integer
            {
                document.getElementById("editInputLabel").innerHTML = "Changed Count From " + currentCount + " to " + txtBoxValue;
                tmp = txtBoxValue;
            }
            else  // non-integer so don't let the input pass and alert the user
            {
                alert("Enter a valid integer (i.e. 1, 2, 3)");
            } 
        }
    }
    else if (Value == 1)  // add to item count
    {
        tmp += 1;
        document.getElementById("editInputLabel").innerHTML = "Changed Count From " + currentCount + " to " + (tmp);
    }
    else if (Value == 2)  // subtract from item count
    {
        if (tmp - 1 < 0)
        {
            alert("Subtraction would create negative value!");
        }
        else
        {
            tmp -= 1;
            document.getElementById("editInputLabel").innerHTML = "Changed Count From " + currentCount + " to " + (tmp);
        }
    }
}

function modalConfirmButton()
{
    if (currentCount != tmp)  // only do this if the value has changed
    {
        // Get the modal
        var modal = document.getElementById("myModal");

        // cell in our tables
        var tableCell = document.getElementById(cellLocation);
        
        // set text in the cell
        tableCell.textContent = tmp + " (Click to Edit)";

        // update table cell in google sheets
        makeApiCallWrite(parseInt(tableCell.name), parseInt(tableCell.id) + 1, tmp);

        // close modal
        modal.style.display = "none";

        // scroll to cell so user can see cell that was changed
        document.getElementById(cellLocation).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

        // color animation
        $(tableCell).toggleClass('clicked');  
    }
    else
    {
        alert("No changes have been made!");
    }    
}

function createCellModal(location, rawValue)
    {  
        // scroll to cell so it is in view while modal opens
        document.getElementById(location).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

        //set var so whole script can see location of cell   
        cellLocation = location;

        // reset var each time modal is opened  
        onlyOneCurrentCount = false;

        // find our cell
        var ourCell = document.getElementById(location);

        // Get the modal
        var modal = document.getElementById("myModal");
         
        // open the modal
        modal.style.display = "block";

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // get int value of cell
        var rawValue = ourCell.textContent.replace(" (Click to Edit)", "");

        document.getElementById("editInputLabel").innerHTML = "Current Item Count: " + rawValue;

        // if the last char is an s
        if (ourCell.value.slice(-1) == 's')
        {
            if (rawValue == 1)  // 1 is singular, so remove s
            {
                ourCell.value = ourCell.value.slice(0, -1);
            }
        }
        else if (ourCell.value.slice(-1) != 's' && ourCell.value.slice(-1) != " ")  // last char is not an s
        {
            if (rawValue != 1)  // everything other than 1 is singular, so add s
            {
                ourCell.value += 's';
            }
        }

        // add unique text to header
        document.getElementById("HeaderModal").innerHTML = rawValue + " " + ourCell.value;

        // // add unique text to subheader
        //document.getElementById("SubheaderModal").innerHTML = tableSubheader;

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() 
        {
            modal.style.display = "none";
            $(ourCell).toggleClass('clicked');  // color animation
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) 
        {
            if (event.target == modal) 
            {
                modal.style.display = "none";
                $(ourCell).toggleClass('clicked');  // color animation
            }
        }
    }

    function deleteTables()
    {
        // do this after tables have been created so we can delete them
        while (tableNumber > 0)  // looks at each table we have
        {                
            var parent = document.getElementById("table" + tableNumber)  // find our table
            while(parent.hasChildNodes())  // look at each of the table's contents
            {
                parent.removeChild(parent.firstChild);  // remove it
            }
                
            parent.parentNode.removeChild(parent);  // remove the element so we can give the name to another table
            parent.style.borderWidth = "0px";  // removes borders so they will no longer show
            parent.style.display = "none";  // completely hides table and returns space on page
            tableNumber --;  // subtract one from tmp variable
       }
    }

    function populatesheet(materialType, result)  // function to get values from google sheets and put them into front-end website tables
    {
        // do this after tables have been created so we can delete them
        if (document.getElementById("table1") != null)  
        {
            deleteTables();
        }

        // google sheets note: for EndofSheet leave one cell blank and for end of table leave two cells blank
        var body = document.getElementsByTagName("body")[0];  // create new table
        var tbl = document.createElement("table");

        // number our tables so we can reference them later
        tbl.id = "table1"
        tableNumber = 1;
        var tblBody = document.createElement("tbody");
        var headerRows = 0;  // keeps track of which rows get special header styles
        var startingPoint;  // will tell us where to start the loop

        for(var tableRows=0; tableRows<result.values.length; tableRows++)  // find where to start searching in sheets
        {
            if(result.values[tableRows] == materialType + " Start")
            {
                startingPoint = tableRows + 2;
                break;
            }
        }

        // goes through specified range in google sheets page/s
        for(var allRows=startingPoint; allRows<result.values.length; allRows++)  
        {
            // this is one cell after the table ends on sheets
            if (result.values[allRows].length == 0)  
            {	
                //console.log(result.values[allRows - 1])
                for(var rlength=startingPoint; rlength<allRows; rlength++)  // creates rows
                {
                    if(headerRows == 0 || headerRows == 1 || headerRows == 2)  // these are the header rows
                    {
                        var rRow = document.createElement("tr");
                        rRow.style.backgroundColor = "#ababab";
                        rRow.style.fontWeight = "bolder";
                        rRow.style.fontStyle = "arial";
						rRow.style.color = "black";
                    }
                    else
                    {
                        var rRow = document.createElement("tr");
                    }
                    headerRows++;  // increment to look at next row 
                    for(var col=0; col<result.values[allRows - 1].length; col++)  // creates columns (grabs length of previous array)
                    {
                        // looking at the first and second rows
                        if(rlength == startingPoint || rlength == startingPoint + 1)  
                        {
                            if(col == 0)  // looking at the first column in the first row because we only want one column in that row
                            {
                                var cell = document.createElement("td");                                                              
                                cell.colSpan = result.values[allRows - 1].length;
                                cell.style.padding = "10px";
                                cell.style.textAlign = "center";
                                cell.style.borderColor = "Black";
                                cell.style.borderStyle = "solid";
                                cell.style.borderWidth = "1px";
                                
                                var cellText = document.createTextNode(result.values[rlength]);

                                if (rlength == startingPoint)
                                {
                                    nameOfHeader = cellText.textContent;  // text in table header first row & column
                                }
                                else
                                {
                                    nameOfSubheader = cellText.textContent;  // text in table header first row & column
                                }
                                                                
                            }
                        }
                        else  // this is for all other 'normal rows and columns'
                        {	
                            var cell = document.createElement("td");                        
                            cell.style.borderColor = "Black";
                            cell.style.borderStyle = "solid";
                            cell.style.borderWidth = "1px";
                            cell.style.padding = "10px";                            
                            var cellText = document.createTextNode(result.values[rlength][col]);
                            cell.style.color = "black";
                        }	
            
                        // these are the editable cells
                        if(col + 1 == result.values[allRows - 1].length && headerRows != 1 && headerRows != 2 && headerRows != 3)
                        {   
                            // add cell to this class
                            cell.className = "colorAnimations";

                            $(function()
                            { 
                                $(cell).click(function()
                                { 
                                    $(this).toggleClass('clicked') 
                                }) 
                            });

                            // header of cell
                            cell.value = nameOfHeader + " - (" + nameOfSubheader + ")";

                            // add text to cell's textContent
                            cellText.textContent += " (Click to Edit)";   

                            // column of cell on Google Sheet
                            cell.name  = (col + 1)
                            
                            // make cell's id unique
                            cell.id = rlength;
                            
                            // cells perform this function when they are clicked
                            cell.onclick = function()
                            { 
                                createCellModal(this.id, this.textContent);  // send the cells unique id and cellText
                            };                             
                        }
                        
                        cell.appendChild(cellText);			  
                        rRow.appendChild(cell);
                    }
        
                    tblBody.appendChild(rRow);
                }
                
                tbl.appendChild(tblBody);
                body.appendChild(tbl);
                
                tbl.style.marginLeft = "auto";
                tbl.style.marginRight = "auto";
                tbl.style.borderColor = "Black";
                tbl.style.borderStyle = "solid";
                tbl.style.borderWidth = "1px";
                //tbl.style.borderCollapse = "collapse";					  

                if(result.values[allRows + 1].length == 1 && result.values[allRows + 1] == materialType + " End")  // end of type
                {
                    break;
                }
                else if(result.values[allRows + 2].length != 0)  // check if any tables left
                {                    
                    headerRows = 0;  // reset variable because looking at new table now
                    allRows ++;  // skip over empty cells to move onto next table because still tables left
                    startingPoint = allRows + 1;  // this is the integer where the loop will begin again at the top
                    var body = document.getElementsByTagName("body")[0];  // create new table
                   
                    var tbl = document.createElement("table");
                    tableNumber += 1;  // new table so give it a different value
                    tbl.id = "table" + tableNumber

                    var tblBody = document.createElement("tbody");
                    tbl.style.marginTop = "75px";
                }
                else 
                {
                    break;  // end loop because there are no tables left
                }
            }			 
        }	      
    }

// convert cellColumn to char b/c Google Sheets needs a char
function calculateCellLetter(valueToConvert)
{
    if (valueToConvert == 1)
    {
        valueToConvert = 'A';
    }
    else if (valueToConvert == 2)
    {
        valueToConvert = 'B';
    }
    else if (valueToConvert == 3)
    {
        valueToConvert = 'C';
    }
    else if (valueToConvert == 4)
    {
        valueToConvert = 'D';
    }
    else if (valueToConvert == 5)
    {
        valueToConvert = 'E';
    }
    else if (valueToConvert == 6)
    {
        valueToConvert = 'F';
    }
    else if (valueToConvert == 7)
    {
        valueToConvert = 'G';
    }
    else if (valueToConvert == 8)
    {
        valueToConvert = 'H';
    }
    else if (valueToConvert == 9)
    {
        valueToConvert = 'I';
    }
    else if (valueToConvert == 10)
    {
        valueToConvert = 'J';
    }
    else if (valueToConvert == 11)
    {
        valueToConvert = 'K';
    }
    else if (valueToConvert == 12)
    {
        valueToConvert = 'L';
    }
    else if (valueToConvert == 13)
    {
        valueToConvert = 'M';
    }
    else if (valueToConvert == 14)
    {
        valueToConvert = 'N';
    }
    else if (valueToConvert == 15)
    {
        valueToConvert = 'O';
    }
    else if (valueToConvert == 16)
    {
        valueToConvert = 'P';
    }
    else if (valueToConvert == 17)
    {
        valueToConvert = 'Q';
    }
    else if (valueToConvert == 18)
    {
        valueToConvert = 'R';
    }
    else if (valueToConvert == 19)
    {
        valueToConvert = 'S';
    }
    else if (valueToConvert == 20)
    {
        valueToConvert = 'T';
    }
    else if (valueToConvert == 21)
    {
        valueToConvert = 'U';
    }
    else if (valueToConvert == 22)
    {
        valueToConvert = 'V';
    }
    else if (valueToConvert == 23)
    {
        valueToConvert = 'W';
    }
    else if (valueToConvert == 24)
    {
        valueToConvert = 'X';
    }
    else if (valueToConvert == 25)
    {
        valueToConvert = 'Y';
    }
    else if (valueToConvert == 26)
    {
        valueToConvert = 'Z';
    }

    // return the char
    return valueToConvert;
}

// writing to Google Sheets
function makeApiCallWrite(cellColumn, cellRow, cellValue) 
{
    // assign char to variable
    cellColumn = calculateCellLetter(cellColumn);

    var ssID = "1ZcIsDq_8INVhSjVX3xs1r9g-5OQCVbKAx7Q4_slHCBE"
    // var ssID = '1UT7O5soGVwHUQaGCE7ujVqLOpqN3EAYCRtHR7J4Pzs4';
    
    // sheet on google sheet
    var rng = 'Sheet1';

    var params = 
    {
        spreadsheetId: ssID,  // The ID of the spreadsheet to retrieve data from.
    };

    // update a cell range in Google Sheets
    var batchUpdateValuesRequestBody = 
    {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.

        // The new values to apply to the spreadsheet.
        data: [
            {
                range: "Sheet1!" + cellColumn + cellRow,  // cell location in Google Sheets
                //majorDimension: "COLUMNS",
                values: [[cellValue]]  // value/s to send
            }
        ],  // TODO: Update placeholder value.

        // TODO: Add desired properties to the request body.
    };
                    
    var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
    request.then(function(response) 
    {
       // TODO: Change code below to process the `response` object:
    }, function(reason) 
    {
        console.error('error: ' + reason.result.error.message);
    });
}

// reading to Google Sheets
function makeApiCallRead(valueOriginal, valueModified) 
{  
    if (valueOriginal == "Select Material:")  // blank option to show user they can click on the drop down menu
    {
        document.getElementById('Table_Section_Header').innerHTML = valueOriginal;
		document.getElementById('Table_Section_Image').src = "";
        if (document.getElementById("table1") != null)  
        {
            deleteTables();  // clear tables because nothing is selected
        }
    }
	else if (valueOriginal != undefined && valueOriginal != "Select Material:")  // run the api when the data is not undefined
	{
    	// change text of material and its image
		valueOriginal = valueOriginal.replace(/\s/g, "");
		document.getElementById('Table_Section_Header').innerHTML = valueModified;
		document.getElementById('Table_Section_Image').src = "/files/theme/" + valueOriginal + ".PNG";

        // Google sheet page id
        var ssID = "1ZcIsDq_8INVhSjVX3xs1r9g-5OQCVbKAx7Q4_slHCBE"
        // var ssID = '1UT7O5soGVwHUQaGCE7ujVqLOpqN3EAYCRtHR7J4Pzs4';
        var rng = 'Sheet1';

        var params = 
        {
            spreadsheetId: ssID,  // The ID of the spreadsheet to retrieve data from.
            range: rng,   // The A1 notation of the values to retrieve.
        };
                
        var request = gapi.client.sheets.spreadsheets.values.get(params);
        request.then(function(response) 
        {
            // TODO: Change code below to process the `response` object:
            console.log(response.result);
            populatesheet(valueModified, response.result);
        }, function(reason) 
        {
            console.error('error: ' + reason.result.error.message);
        });
    }
}
            
    function initClient() 
    {
        // TODO: Update placeholder with desired API key.
        var API_KEY = 'AIzaSyDOV7TpzBG2yClrGd8bkqzxrP3KU9Iftfw';  
        
        // TODO: Update placeholder with desired client ID.
        var CLIENT_ID = '86890114762-047sa8cboeh8csv1127spnlniu90dn6h.apps.googleusercontent.com';  
        
        // TODO: Authorize using one of the following scopes:
        //   'https://www.googleapis.com/auth/drive'
        //   'https://www.googleapis.com/auth/drive.file'
        //   'https://www.googleapis.com/auth/drive.readonly'
        //   'https://www.googleapis.com/auth/spreadsheets'
        //   'https://www.googleapis.com/auth/spreadsheets.readonly'
        var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
        
        gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            }).then(function() 
            {
                //gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
                //updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            });
    }
        
    function handleClientLoad() 
    {
        gapi.load('client:auth2', initClient);
    }
        
    // function updateSignInStatus(isSignedIn) 
    // {
    //     if (isSignedIn) 
    //     {
    //         makeApiCall();
    //     }
    // }
        
    // function handleSignInClick(event) 
    // {
    //     gapi.auth2.getAuthInstance().signIn();
    // }
        
    // function handleSignOutClick(event) 
    // {
    //     gapi.auth2.getAuthInstance().signOut();
    // }