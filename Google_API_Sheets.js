<html>
  <head></head>
  <body>
    <!--
    BEFORE RUNNING:
    ---------------
    1. If not already done, enable the Google Sheets API
       and check the quota for your project at
       https://console.developers.google.com/apis/api/sheets
    2. Get access keys for your application. See
       https://developers.google.com/api-client-library/javascript/start/start-js#get-access-keys-for-your-application
    3. For additional information on authentication, see
       https://developers.google.com/sheets/api/quickstart/js#step_2_set_up_the_sample
    -->
    <script>
    function makeApiCall(action="read") 
	{

      var ssID = '1UT7O5soGVwHUQaGCE7ujVqLOpqN3EAYCRtHR7J4Pzs4';
      var rng = 'Sheet1';

	  // writing to sheets
	  if(action == "write")
	  {
		var noTableDuplicates = 0;  // this will make sure none of the tables are duplicated after the loop has iterated over a whole table
	  var headerRows = 0;  // keeps track of which rows get special header styles

	  for(var allRows=0; allRows<result.values.length; allRows++)  // goes through all rows in google sheets page/s
      {
	    if (result.values[allRows].length == 0)  // this is one cell after the table ends on sheets
		{	
		  for(var rlength=noTableDuplicates; rlength<allRows; rlength++)  // creates rows
		  {
			if(headerRows == 0 || headerRows == 1)  // these are the header rows
			{
			  var rRow = document.createElement("tr");
			  rRow.style.backgroundColor = "orange";
			  rRow.style.fontWeight = "bolder";
			  rRow.style.fontStyle = "arial";
			}
			else
			{
			  var rRow = document.createElement("tr");
			}
            headerRows++;  // increment to look at next row 
			for(var col=0; col<result.values[allRows - 1].length; col++)  // creates columns (grabs length of previous array)
			{
			  if(rlength == noTableDuplicates)  // looking at the first row
			  {
			    if(col == 0)  // looking at the first column in the first row because we only want one column in that row
				{
				  var cell = document.createElement("td");
				  cell.colSpan = result.values[allRows - 1].length;
				  cell.style.padding = "10px";
				  cell.style.textAlign = "center";
				  var cellText = document.createTextNode(result.values[rlength]);
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
			  }	

			  if(col + 1 == result.values[allRows - 1].length && headerRows != 1 && headerRows != 2)
			  {
			    cell.contentEditable = "true";
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
		  tbl.style.borderCollapse = "collapse";					  
		  
		  if(result.values[allRows + 1].length == 1 && result.values[allRows + 1] == "EndOfSheet")  // end of sheet
		  {
		    break;
		  }
		  else if(result.values[allRows + 2].length != 0)  // check if any tables left
		  {
		    headerRows = 0;  // reset variable because looking at new table now
		    allRows ++;  // skip over empty cells to move onto next table because still tables left
			noTableDuplicates = allRows + 1;  // this is the integer where the loop will begin again at the top
			var body = document.getElementsByTagName("body")[0];  // create new table
		    var tbl = document.createElement("table");
		    var tblBody = document.createElement("tbody");
			tbl.style.marginTop = "50px";
		  }
		  else 
		  {
		    console.log("break");
		    break;  // end loop because there are no tables left
		  }
		}			 
      }
      var params = 
	  {
        spreadsheetId: ssID,  // The ID of the spreadsheet to retrieve data from.
        range: rng,   // The A1 notation of the values to retrieve.
        valueInputOption: 'RAW',
      };
	  
	  var valueRangeBody = { "values": vals }; 
      var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
      } // end writing sheets
	else // reading from sheets
	{
	  var params = 
	  {
        spreadsheetId: ssID,  // The ID of the spreadsheet to retrieve data from.
        range: rng,   // The A1 notation of the values to retrieve.
      };
	  
      var request = gapi.client.sheets.spreadsheets.values.get(params);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
        populatesheet(response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
	}
	// end reading sheets
	}
	
    function initClient() {
      var API_KEY = '';  // TODO: Update placeholder with desired API key.

      var CLIENT_ID = '';  // TODO: Update placeholder with desired client ID.

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
      }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }

    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    function updateSignInStatus(isSignedIn) {
      if (isSignedIn) {
        makeApiCall();
      }
    }

    function handleSignInClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignOutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }

    function populatesheet(result)  // function to get values from google sheets and put them into front-end website tables
    {
	  // google sheets note: for EndofSheet leave one cell blank and for end of table leave two cells blank
	  var body = document.getElementsByTagName("body")[0];  // create new table
	  var tbl = document.createElement("table");
      var tblBody = document.createElement("tbody");
	  var noTableDuplicates = 0;  // this will make sure none of the tables are duplicated after the loop has iterated over a whole table
	  var headerRows = 0;  // keeps track of which rows get special header styles

	  for(var allRows=0; allRows<result.values.length; allRows++)  // goes through all rows in google sheets page/s
      {
	    if (result.values[allRows].length == 0)  // this is one cell after the table ends on sheets
		{	
		  for(var rlength=noTableDuplicates; rlength<allRows; rlength++)  // creates rows
		  {
			if(headerRows == 0 || headerRows == 1)  // these are the header rows
			{
			  var rRow = document.createElement("tr");
			  rRow.style.backgroundColor = "orange";
			  rRow.style.fontWeight = "bolder";
			  rRow.style.fontStyle = "arial";
			}
			else
			{
			  var rRow = document.createElement("tr");
			}
            headerRows++;  // increment to look at next row 
			for(var col=0; col<result.values[allRows - 1].length; col++)  // creates columns (grabs length of previous array)
			{
			  if(rlength == noTableDuplicates)  // looking at the first row
			  {
			    if(col == 0)  // looking at the first column in the first row because we only want one column in that row
				{
				  var cell = document.createElement("td");
				  cell.colSpan = result.values[allRows - 1].length;
				  cell.style.padding = "10px";
				  cell.style.textAlign = "center";
				  var cellText = document.createTextNode(result.values[rlength]);
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
			  }	

			  if(col + 1 == result.values[allRows - 1].length && headerRows != 1 && headerRows != 2)
			  {
			    cell.contentEditable = "true";
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
		  tbl.style.borderCollapse = "collapse";					  
		  
		  if(result.values[allRows + 1].length == 1 && result.values[allRows + 1] == "EndOfSheet")  // end of sheet
		  {
		    break;
		  }
		  else if(result.values[allRows + 2].length != 0)  // check if any tables left
		  {
		    headerRows = 0;  // reset variable because looking at new table now
		    allRows ++;  // skip over empty cells to move onto next table because still tables left
			noTableDuplicates = allRows + 1;  // this is the integer where the loop will begin again at the top
			var body = document.getElementsByTagName("body")[0];  // create new table
		    var tbl = document.createElement("table");
		    var tblBody = document.createElement("tbody");
			tbl.style.marginTop = "50px";
		  }
		  else 
		  {
		    console.log("break");
		    break;  // end loop because there are no tables left
		  }
		}			 
      }	      
    }

    </script>
    <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){};handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script>
    <button id="signin-button" onclick="handleSignInClick()">Sign in</button>
    <button id="signout-button" onclick="handleSignOutClick()">Sign out</button>
  </body>
</html>
