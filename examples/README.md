# Examples

Ready-to-run Postman files for trying out **Postman Runner** (and for smoke-testing the
extension after upgrades). They use the modern Collection Format **v2.1.0** and the
`pm.*` sandbox API, and target the public [Postman Echo](https://postman-echo.com)
service, so no credentials or local server are required (just an internet connection).

| File | What it is |
| --- | --- |
| `postman-echo.postman_collection.json` | Collection with four folders: **Basics** (GET, POST JSON, headers), **Auth** (Basic Auth), **Iteration data** (data-driven POST), and **Multipart form-data** (multipart POST, issue #26). 6 requests, 15 assertions. |
| `postman-echo.postman_environment.json` | Environment defining `baseUrl = https://postman-echo.com`. |
| `iteration-data.json` | Data file with 3 rows, used by the *Iteration data* folder. |
| `global-vars.postman_collection.json` | Single request that reads a `token` **global variable**, injected at run time (issue #15). |
| `echo-v1.postman_collection.json` | Legacy full Postman Echo collection in Collection Format **v1**. Kept as a compatibility sample. |
| `echo-v2.postman_collection.json` | Legacy full Postman Echo collection in Collection Format **v2.0.0**. Kept as a compatibility sample. |

> The two `echo-v*` collections are older, larger Postman Echo exports used to smoke-test format
> compatibility. A few of their assertions (cookie deletion, timestamp comparison) fail against the
> current Postman Echo service; they are kept because they still *run*, not because every assertion
> passes. Prefer `postman-echo.postman_collection.json` for a clean, all-green run.

## Run them

1. Open this repository (or just the `examples/` folder) in VS Code.
2. Run **Postman: Run > Question Mode** from the Command Palette (or `Cmd+R` / `Ctrl+Q`).
3. Answer the prompts:
   - **Collection** → `postman-echo.postman_collection.json`
   - **Folder** → `- ALL -` (or pick one)
   - **Environment** → `postman-echo.postman_environment.json`
   - **Iterations** → `1`
   - **Data file** → `- NONE -`
   - **Working directory** → `.`
   - **Global variables** → leave empty (or see below)

Every request has assertions, so the Postman Results output shows real passes.

### Inject global variables (issue #15)

Pick `global-vars.postman_collection.json` and, at the **Global variables** prompt, enter
`token=my-secret` (multiple pairs are separated by `;`, e.g. `token=abc; host=example.com`).
The request sends `?token={{token}}`, so the value you type is substituted into the URL and
the tests assert the server echoes it back. Leave the prompt empty and the same collection's
`token` assertions fail, showing the variable really is coming from your input.

### Try the data-driven run

Pick the **Iteration data** folder, choose `iteration-data.json` as the **Data file**, and
set **Iterations** to `3`. Newman runs the request once per row in the data file, sending a
different `username` / `role` each time.

### Multipart form-data (issue #26)

Pick the **Multipart form-data** folder to send a `multipart/form-data` POST. Newman adds
the real `Content-Type` header (with the generated boundary) only at send time, so it never
appears in the declared request headers. The extension synthesizes a
`Content-Type: multipart/form-data` line in the Postman Results output so the shown headers
match what is actually sent. The request's tests assert both that the server receives the
multipart Content-Type and that the declared headers omit it.

### See a failure

Edit an assertion in the collection (for example change `'bar'` to `'baz'` in the
*GET request* test) to watch a failing assertion render in the output and HTML report.
