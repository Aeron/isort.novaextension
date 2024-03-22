const Config = require("./Config");
const Formatter = require("./Formatter");

exports.activate = function () {
    const formatter = new Formatter(Config);

    console.info(`Executable path: ${Config.executablePath()}`);
    console.info(`Command arguments: ${Config.commandArguments()}`);
    console.info(`Format on save: ${Config.formatOnSave()}`);
    console.info(`Format on save: ${Config.venvPath()}`);

    nova.workspace.onDidAddTextEditor((editor) => {
        if (editor.document.syntax !== "python" || !Config.formatOnSave()) return;
        editor.onWillSave(formatter.provideFormat, formatter);
    });

    nova.commands.register("sortImportsWithIsort", formatter.format, formatter);
};
