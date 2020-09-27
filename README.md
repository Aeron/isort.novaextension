# isort Nova Extension

It’s a stand-alone Nova extension to use [isort](https://github.com/PyCQA/isort),
a Python utility to sort imports .

## Requirements

Before using the extension, it’s necessary to install **isort** itself if you don’t have
one already.

**isort** can be installed simply by running `pip install isort`.

## Configuration

The extension supports both global and workspace configurations.
A workspace configuration always overrides a global one.

### Options

There are three options available to configure: executable path, command arguments,
and format on save. By default, the executable path is `/usr/local/bin/isort`, with no
additional arguments, and formatting on saving is on.

You could alter the executable path if **isort** installed in a different place
or if `/usr/bin/env` usage is desirable.

In the case of `/usr/bin/env`, it becomes the executable path, and `isort` becomes
the first argument.

Also, there is a _virtual environment_ path available as a workspace-only option.
It’s just a handy alias for the `--virtual-env` command argument.

### pyproject.toml

The extension respects `pyproject.toml` in a project directory. So, there’s no
need to specify the `--settings` argument explicitly.
