var tmp;  // placeholder for currentCount
var cellLocation;  // so we can find our cell
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

        // close modal
        modal.style.display = "none";

        // return cell's color to white
        tableCell.style.backgroundColor = "white";  
    }
    
}

function createCellModal(location, rawValue, tableHeader, tableSubheader)
    {  
        //set var so whole script can see location of cell   
        cellLocation = location;

        // reset var each time modal is opened  
        onlyOneCurrentCount = false;

        // find our cell
        var ourCell = document.getElementById(location);

        // make the cell's background yellow so it stands out
        ourCell.style.backgroundColor = "yellow";

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
        if (tableHeader.slice(-1) == s)
        {
            if (rawValue == 1)  // 1 is singular, so remove s
            {
                tableHeader = tableHeader.slice(0, -1);
            }
        }
        else  // last char is not an s
        {
            if (rawValue != 1)  // everything other than 1 is singular, so add s
            {
                tableHeader += "s";
            }
        }

        // add unique text to header
        document.getElementById("HeaderModal").innerHTML = rawValue + " " + tableHeader + " - (" + tableSubheader + ")";

        // // add unique text to subheader
        //document.getElementById("SubheaderModal").innerHTML = tableSubheader;

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() 
        {
            modal.style.display = "none";
            ourCell.style.backgroundColor = "white";  // return cell's color to white
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) 
        {
            if (event.target == modal) 
            {
                modal.style.display = "none";
                ourCell.style.backgroundColor = "white";  // return cell's color to white
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
                            // add text to cell's textContent
                            cellText.textContent += " (Click to Edit)";   

                            // make cell's id unique
                            cell.id = rlength;
                            
                            // cells perform this function when they are clicked
                            cell.onclick = function()
                            { 
                                createCellModal(this.id, this.textContent, nameOfHeader, nameOfSubheader);  // send the cells unique id and cellText
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

    function makeApiCall(valueOriginal, valueModified, action="read") 
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

            // api starts here
            var ssID = '1UT7O5soGVwHUQaGCE7ujVqLOpqN3EAYCRtHR7J4Pzs4';
            var rng = 'Sheet1';
            
            // writing to sheets
            if(action == "write")
            {
                var params = 
                {
                    spreadsheetId: ssID,  // The ID of the spreadsheet to retrieve data from.
                    range: rng,   // The A1 notation of the values to retrieve.
                    valueInputOption: 'RAW',
                };
                    
                var valueRangeBody = { "values": vals }; 
                var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
                request.then(function(response) 
                {
                    // TODO: Change code below to process the `response` object:
                }, function(reason) 
                {
                    console.error('error: ' + reason.result.error.message);
                });
            }   // end writing sheets
            else // reading from sheets
            {
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

        // end reading sheets
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