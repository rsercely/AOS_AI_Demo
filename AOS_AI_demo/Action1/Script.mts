'Launching env

context=DataTable.GlobalSheet.GetParameter("Context")
'Category = DataTable.GlobalSheet.GetParameter("Categories")		
Function LaunchEnvironment
		Set dt=DataTable
		Select Case 	dt.Value("Context")
			Case "Browser"
			
				While Browser("CreationTime:=0").Exist(0)   
					Browser("CreationTime:=0").Close 
				Wend
				SystemUtil.Run dt.Value("Browser") & ".exe" ,"","","",3
				Set LaunchEnvironment=Browser("CreationTime:=0")
				LaunchEnvironment.ClearCache
				LaunchEnvironment.Navigate dt.value("URL")
				LaunchEnvironment.Sync
				wait(2)
				LaunchEnvironment.Maximize		

			Case "Device"	
				Set oDevice=Device("Class Name:=Device","ostype:=" & dt.value("ostype") ,"id:=" & dt.value("device_id"))
				Set oApp=oDevice.App("Class Name:=App","identifier:=" & dt.value("app_identifier") ,"instrumented:=" & dt.value("app_instrumented"))		
				Set	LaunchEnvironment=oDevice
				oApp.Launch DoNotInstall, Restart
			End Select
End Function

Function CloseBrowser
	Set dt=DataTable
	Select Case DataTable.Value("Context")
	Case "Browser"
		'oContext.Close
		Browser("CreationTime:=0").Close
	Case "Device"
		'oContext.Close
		Device("Class Name:=Device","ostype:=" & dt.value("ostype") ,"id:=" & dt.value("device_id")).CloseViewer
		
	End  Select
End Function



Dim oShell

Set oShell = CreateObject ("WSCript.shell")
oShell.run "powershell -command ""Start-Service mediaserver"""
Set oShell = Nothing

set oContext=LaunchEnvironment
AIUtil.SetContext oContext 
								
If context="Device" Then 

	Select Case DataTable.Value("ostype") 
		Case "iOS"
		AIUtil("text_box", micAnyText, micFromTop, 1).Search DataTable.Value("URL")
		AIUtil.FindTextBlock("go").Click
		Case "ANDROID"
		AIUtil("button",  micAnyText, micFromTop, 1).Search DataTable.Value("URL")
	End  Select
	wait(3)
	AIUtil("hamburger_menu").Click
End If

AIUtil("profile").Click
AIUtil("input", "Username").Highlight

AIUtil("input", "Username").Type "Mercury"
AIUtil.FindTextBlock("OR").Click
AIUtil("input", "Password").Type "Mercury"
AIUtil("button", "SIGN IN").Click
'complete your script here
'
'
CloseBrowser


