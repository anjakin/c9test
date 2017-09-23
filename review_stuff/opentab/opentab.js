define(function(require, exports, module) {
    main.consumes = ["Plugin", "tabManager", "menus", "ui", "commands", "find", "Menu", "dialog.alert", "dialog.notification", "auth", "vfs", "fs"];
    main.provides = ["opentab"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var manager = imports.tabManager;
        var menus = imports.menus;
        var ui = imports.ui;
        var commands = imports.commands;

        var finder = imports.find;
        // var loaded = false;

        var editor = manager.focussedTab.editor;

        /***** Initialization *****/
        
        var plugin = new Plugin("Anja", main.consumes);
        var emit = plugin.getEmitter();
        
        // testing commands also
        commands.addCommand({
            name        : "Open tab",
            bindKey     : { win: "Ctrl-Shift-H" },
            exec        : function() {
                    openTab();
            }
        }, plugin);
        
        // basically this should add a new menu item that opens a new tab 
        function load() {
            //if (loaded) return false;
            //loaded = true;
            
            menus.addItemByPath("View/Open helper tab", new ui.item({
                command: "Open tab"
            }), 100, plugin);
        }
        
        /***** Methods *****/
        
        function showDialog() {
            
            var alertDialog = imports["dialog.alert"];
            alertDialog.show("I'm here to explain what's happening, hello!", 
                "Do you need more information about your selection?", 
                "You'll notice a new tab has opened. It should contain everything you need to get started or unstuck. Good luck!",
                function(){
                    if (alertDialog.dontShow)
                        settings.set("user/opentab/@no-alert", true);
                }, {
                    isHTML: true,
                    showDontShow: true
            });
        }
        
        function showPasteDialog(data) {
            
            var notify = imports["dialog.notification"].show;

            var showCloseButton = true;
            notify("<div class='mybar'>" + "Link to paste: " + data + "!</div>", showCloseButton);
        }

        function openTab() {
            
            var search = editor.ace.getCopyText();
            var filePath = "/cppreference/eloel/cpp/" + search + ".html";

            manager.open({
                active: true,
                editorType: "preview",
                path: filePath,
                title: "does this work?"
            });
            
            showDialog();
            doPastebinStuff();
        }
        
        function doPastebinStuff() {
            
            var apiKey = '7aa8dc24fcccba6dc8425101f54fb9e0';
            var pasteText = editor.ace.getCopyText();
            var pastePrivacy = '1';
            var pasteExpire = 'N';
            var pasteFormat = 'cpp';
            
            var url = 'https://pastebin.com/api/api_post.php';
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                // alert the user that a response now exists in the responseTest property.
                    if (xhr.responseText != null)
                        showPasteDialog(xhr.responseText);
                }
            }
            
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.send("api_dev_key=" + apiKey +  "&api_option=paste&api_paste_code=" + 
            pasteText + "&api_paste_format=" + pasteFormat + "&api_paste_private=" + pastePrivacy);
        }
        
        /***** Lifecycle *****/
        
        plugin.on("load", function() {
            load();
        });
        
        plugin.on("unload", function() {
            
        });
        
        /***** Register and define API *****/
        
        plugin.freezePublicAPI({
            
        });
        
        register(null, {
            "opentab": plugin
        });
    }
});

 // this is gonna be used for the search
            /*

            // the tab also becomes the active tab
            manager.activateTab(manager.openFile(filePath, function(err, tab){
                if (err) return console.error(err);
            }));
            
            var fs = imports.fs;
            
            fs.readFile(filePath, function (err, data) {
                if (err) throw err;
                // console.log(data);
                ui.html.innerHTML = data;
            });*/