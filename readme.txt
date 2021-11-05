





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

Sub Êíîïêà2_Ùåë÷îê()

ActiveWorkbook.XmlMaps("response_map").Export URL:="c:\temp\2.xml", Overwrite:=True
Dim doc
Dim root As Object
Dim XmlDoc
Set XmlDoc = CreateObject("MSXML2.DomDocument")

XmlDoc.async = False

XmlDoc.Load ("c:\temp\2.xml")

//-----------------------------------------------------------

Set root = XmlDoc.DocumentElement
Set doc = root.getElementsByTagName("doc")
 
  
    Set objHTTP = CreateObject("MSXML2.ServerXMLHTTP")
    URL = "http://localhost:3000/docs/" & doc(0).Text
    objHTTP.Open "PUT", URL, False
    objHTTP.setRequestHeader "Content-Type", "text/xml"
    objHTTP.send XmlDoc.XML
    
    replyTXT = objHTTP.responseText

    If objHTTP.Status = "200" Then 'success
        MsgBox replyTXT
    Else
        MsgBox "Error request" 'Do something
    End If

End Sub
