class Config {
    get(key) {
        let global = nova.config.get(nova.extension.identifier + "." + key);
        let workspace = nova.workspace.config.get(nova.extension.identifier + "." + key);

        // handle booleans as enums at the workspace level
        // doesn't seem to be a way to look up if the config is an enum
        if (key === "formatOnSave") {
          // enums must have string values, so map strings to boolean + null
          switch(workspace) {
            case "null":
              workspace = null;
              break;
            case "true":
              workspace = true;
              break;
            case "false":
              workspace = false;
              break;
            default:
              console.error(`Unexpected ${key}: ${workspace}`)
          }
        }
        if (workspace !== null && global !== workspace) return workspace;
        return global;
    }
}

module.exports = Config;
