const utils = require("./utils");

class Formatter {
    constructor(config) {
        this.config = config;
    }

    getProcessOptions(filename = null) {
        const defaultOptions = ["--quiet", "-"];  // TODO: find a way to use --diff
        const commandArguments = this.config.commandArguments();
        const extraOptions = utils.normalizeOptions(commandArguments);

        const venvPath = this.config.venvPath();
        const venvOptions = (venvPath)
            ? [`--virtual-env=${venvPath}`]
            : [];

        return Array.from(new Set([...extraOptions, ...venvOptions, ...defaultOptions]));
    }

    getProcess() {
        const executablePath = nova.path.expanduser(this.config.executablePath());

        if (!nova.fs.stat(executablePath)) {
            console.error(`Executable ${executablePath} does not exist`);
            return;
        }

        const options = this.getProcessOptions();

        return new Process(
            executablePath,
            {
                args: options,
                stdio: "pipe",
                cwd: nova.workspace.path,  // NOTE: must be explicitly set
            }
        );
    }

    provideFormat(editor) {
        return new Promise((resolve, reject) => this.format(editor, resolve, reject));
    }

    format(editor, resolve = null, reject = null) {
        if (editor.document.isEmpty) {
            if (reject) reject("empty file");
            return;
        }

        let process = this.getProcess();

        if (!process) {
            if (reject) reject("no process");
            return;
        }

        const textRange = new Range(0, editor.document.length);
        const content = editor.document.getTextInRange(textRange);
        const filePath = nova.workspace.relativizePath(editor.document.path);

        let outBuffer = [];
        let errBuffer = [];

        process.onStdout((output) => outBuffer.push(output));
        process.onStderr((error) => errBuffer.push(error));
        process.onDidExit((status) => {
            if (status === 0) {
                const formattedContent = outBuffer.join("");

                let result = editor.edit((edit) => {
                    if (formattedContent !== content) {
                        console.log("Formatting " + filePath);
                        edit.replace(
                            textRange, formattedContent, InsertTextFormat.PlainText
                        );
                    } else {
                        console.log("Nothing to format");
                    }
                });

                if (resolve) resolve(result);
            } else {
                console.error(errBuffer.join(""));
                if (reject) reject();
            }
        });

        console.log("Running " + process.command + " " + process.args.join(" "));

        process.start();

        let writer = process.stdin.getWriter();

        writer.ready.then(() => {
            writer.write(content);
            writer.close();
        });
    }
}

module.exports = Formatter;
