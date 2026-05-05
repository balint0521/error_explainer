const vscode = require('vscode');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let currentPanel;

function activate(context) {
  const cmd = vscode.commands.registerCommand('error-explainer.explain', () => {
    const editor = vscode.window.activeTextEditor;
    const selectedCode =
      editor && !editor.selection.isEmpty
        ? editor.document.getText(editor.selection)
        : '';

    // If panel already open, reveal it and update code
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Beside);
      if (selectedCode) {
        currentPanel.webview.postMessage({ type: 'init', code: selectedCode });
      }
      return;
    }

    // Create a new panel
    const panel = vscode.window.createWebviewPanel(
      'errorExplainer',
      'Error Explainer',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    currentPanel = panel;

    panel.onDidDispose(() => {
      currentPanel = undefined;
    }, null, context.subscriptions);

    // Set up message listener BEFORE setting HTML to avoid race conditions
    panel.webview.onDidReceiveMessage(
      (msg) => {
        // Webview signals it's ready – send the pre-selected code
        if (msg.command === 'ready') {
          panel.webview.postMessage({ type: 'init', code: selectedCode });
          return;
        }

        if (msg.command !== 'explain') return;

        const config = vscode.workspace.getConfiguration('errorExplainer');
        const apiKey = config.get('groqApiKey', '');

        if (!apiKey) {
          panel.webview.postMessage({
            type: 'error',
            text: 'No API key configured.\n\nOpen Settings (Cmd+, on macOS / Ctrl+, on Windows), search for "Error Explainer", and paste your Groq API key.\n\nGet a free key at: https://console.groq.com',
          });
          return;
        }

        const scriptPath = path.join(context.extensionPath, 'backend', 'explain.py');
        const proc = spawn('python3', [scriptPath], {
          env: { ...process.env, GROQ_API_KEY: apiKey },
        });

        proc.stdin.write(JSON.stringify({ code: msg.code, error: msg.error }));
        proc.stdin.end();

        let out = '';
        let errOut = '';
        proc.stdout.on('data', (d) => { out += d; });
        proc.stderr.on('data', (d) => { errOut += d; });

        proc.on('close', (exitCode) => {
          if (exitCode === 0 && out) {
            try {
              const result = JSON.parse(out);
              if (result.explanation) {
                panel.webview.postMessage({ type: 'result', text: result.explanation });
              } else {
                panel.webview.postMessage({
                  type: 'error',
                  text: result.error || 'No explanation was returned.',
                });
              }
            } catch {
              panel.webview.postMessage({
                type: 'error',
                text: 'Could not parse the AI response.',
              });
            }
          } else {
            const raw = (errOut || '').trim();
            let errMsg;
            if (raw.includes('ModuleNotFoundError') || raw.includes('No module named')) {
              errMsg = 'The "groq" Python package is not installed.\nFix: pip3 install groq';
            } else if (!raw) {
              errMsg = `Python exited with code ${exitCode}.\nMake sure Python 3 is installed and run: pip3 install groq`;
            } else {
              errMsg = raw;
            }
            panel.webview.postMessage({ type: 'error', text: errMsg });
          }
        });

        proc.on('error', (err) => {
          panel.webview.postMessage({
            type: 'error',
            text: `Could not start Python.\nMake sure Python 3 is installed.\n\n${err.message}`,
          });
        });
      },
      undefined,
      context.subscriptions
    );

    // Load the webview HTML after the listener is registered
    const htmlPath = path.join(context.extensionPath, 'webview', 'panel.html');
    panel.webview.html = fs.readFileSync(htmlPath, 'utf8');
  });

  context.subscriptions.push(cmd);
}

exports.activate = activate;
exports.deactivate = () => {};
