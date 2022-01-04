function submitform(valueOriginal, valueModified)
{
    valueOriginal = valueOriginal.replace(/\s/g, "");
    document.getElementById('Table_Section_Header').innerHTML = valueModified;
    document.getElementById('Table_Section_Image').src = "/files/theme/" + valueOriginal + ".PNG";
}