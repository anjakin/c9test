define(function(require, exports, module) {
    main.consumes = ["Plugin", "tabManager", "menus", "ui", "commands", "find"];
    main.provides = ["opentab"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var manager = imports.tabManager;
        var menus = imports.menus;
        var ui = imports.ui;
        var commands = imports.commands;
        
        var finder = imports.find;
        
        var editor = manager.focussedTab.editor;

        /***** Initialization *****/
        
        var plugin = new Plugin("what am i doing tho", main.consumes);
        var emit = plugin.getEmitter();
        
        // testing commands also
        commands.addCommand( {
            name        : "testcommand",
            bindKey     : { win: "Ctrl-Shift-H" },
            exec        : function() {
                openTab();
            }
        }, plugin);
        
        // basically this should add a new menu item that opens a new tab 
        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;
            
            menus.addItemByPath("View/Open helper tab", new ui.item({
                command: "testcommand"
            }), 100, plugin);
        }
        
        /***** Methods *****/
        
        function openTab() {
            
            // this is gonna be used for the search
            var search = editor.ace.getCopyText();
            
            manager.openFile("test.txt", function(err, tab){
                if (err) return console.error(err);
            });
        }
        
        /***** Lifecycle *****/
        
        plugin.on("load", function() {
            load();
        });
        
        plugin.on("unload", function() {
            loaded = false;
        });
        
        /***** Register and define API *****/
        
        plugin.freezePublicAPI({
            
        });
        
        register(null, {
            "opentab": plugin
        });
    }
});