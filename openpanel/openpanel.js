define(function(require, module, exports) {
    main.consumes = ["Panel", "ui"];
    main.provides = ["openpanel"];
    return main;

    function main(options, imports, register) {
        var Panel = imports.Panel;
        var ui = imports.ui;

        /***** Initialization *****/

        var plugin = new Panel("CPP reference", main.consumes, {
            index: 0,
            caption: "C++ reference",
            width: 800,
            minWidth: 800,
            where: "right",
            autohide: true
        });

        plugin.on("draw", function(e) {
            // Insert css
            ui.insertCss(require("text!./panel.css"), options.staticPrefix, plugin);

            // Set some custom HTML
            e.html.innerHTML = "<div class='myCSS'><iframe src='http://en.cppreference.com/w/' width='800' height='1000'></iframe></div>";
        });

        /***** Register *****/

        plugin.freezePublicAPI({

        });
        
        plugin.setCommand({
            name: "togglepanel",
            hint: "toggles panel",
            bindKey: { mac: "Command-U", win: "Ctrl-I" }
        });

        register("", {
            "openpanel": plugin
        });
    }
});