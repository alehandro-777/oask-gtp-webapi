

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



ActiveWorkbook.XmlMaps("response_map").Export URL:="c:\temp\2.xml", Overwrite:=True

Sub IterateTableRows

  Dim table As ListObject
  Dim tableData, rowData As Range

  Set table = Worksheets("Eeno1").ListObjects("Oaaeeoa1")
  Set tableData = table.Range

For i = 1 To tableData.Rows.Count
    For j = 1 To tableData.Columns.Count
MsgBox tableData.Cells(i, j).Value
    Next
Next

End Sub


Sub CreateXMLDoc()

Dim XmlDoc
Set XmlDoc = CreateObject("MSXML2.DomDocument")
Dim header
Set header = XmlDoc.createProcessingInstruction("xml", "version=""1.0"" encoding=""UTF-8""")
XmlDoc.appendChild (header)
Dim elm
Set elm = XmlDoc.createElement("Message")
elm.Text = "FUUUUUUUUCK"
XmlDoc.appendChild (elm)

MsgBox XmlDoc.XML

End Sub


Sub macroPOST()
    Set objHTTP = CreateObject("MSXML2.ServerXMLHTTP")
    URL = "[Your URL]"
    objHTTP.Open "POST", URL, False
    objHTTP.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
    objHTTP.Send ("id=dddaaa&pwd=1234[Your request parameters]")

    replyTXT = objHTTP.responseText

    If objHTTP.Status = "200" Then 'success
        MsgBox replyTXT
    Else
        'Do something
    End If
End Sub 