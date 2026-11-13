import http from "node:http";
import https from "node:https";
import tls from "node:tls";
import { spawn } from "node:child_process";

const clientId = "0120e057bd645470c1ed";
const targetUrl = "https://github.com/55ttyy/as.git";
const repository = "C:\\Users\\xy\\AppData\\Local\\Temp\\as-bundle-inspect-20261113";
const proxy = { host: "127.0.0.1", port: 8880 };

class ProxyAgent extends https.Agent {
  createConnection(options, callback) {
    const authority = `${options.host}:${options.port || 443}`;
    const connectRequest = http.request({
      host: proxy.host,
      port: proxy.port,
      method: "CONNECT",
      path: authority,
      headers: { Host: authority },
      agent: false,
    });

    let settled = false;
    const finish = (error, socket) => {
      if (settled) return;
      settled = true;
      callback(error, socket);
    };

    connectRequest.once("connect", (response, socket) => {
      if (response.statusCode !== 200) {
        socket.destroy();
        finish(new Error(`Proxy CONNECT failed with HTTP ${response.statusCode}`));
        return;
      }

      const tlsSocket = tls.connect({
        socket,
        servername: options.servername || options.host,
      });
      tlsSocket.once("secureConnect", () => finish(null, tlsSocket));
      tlsSocket.once("error", (error) => finish(error));
    });
    connectRequest.once("error", (error) => finish(error));
    connectRequest.end();
  }
}

const agent = new ProxyAgent({ keepAlive: false });

function requestJson(url, { method = "GET", body } = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? Buffer.from(body.toString()) : null;
    const request = https.request(
      url,
      {
        method,
        agent,
        headers: {
          Accept: "application/json",
          "User-Agent": "git-credential-manager",
          ...(payload
            ? {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": payload.length,
              }
            : {}),
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            reject(new Error(`GitHub returned invalid JSON (HTTP ${response.statusCode}): ${text}`));
            return;
          }

          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`GitHub returned HTTP ${response.statusCode}: ${text}`));
            return;
          }
          resolve(data);
        });
      },
    );
    request.setTimeout(20000, () => {
      request.destroy(new Error("GitHub request timed out"));
    });
    request.once("error", reject);
    if (payload) request.write(payload);
    request.end();
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function runGitPush(token) {
  const authorization = Buffer.from(`x-access-token:${token}`).toString("base64");
  return new Promise((resolve, reject) => {
    const child = spawn(
      "git",
      ["-c", "http.sslBackend=openssl", "push", targetUrl, "main:main"],
      {
        cwd: repository,
        env: {
          ...process.env,
          HTTP_PROXY: "http://127.0.0.1:8880",
          HTTPS_PROXY: "http://127.0.0.1:8880",
          GIT_TERMINAL_PROMPT: "0",
          GIT_CONFIG_COUNT: "1",
          GIT_CONFIG_KEY_0: "http.extraHeader",
          GIT_CONFIG_VALUE_0: `Authorization: Basic ${authorization}`,
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`git push exited with code ${code}`));
    });
  });
}

async function main() {
  const device = await requestJson("https://github.com/login/device/code", {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      scope: "repo",
    }),
  });

  console.log(`Open: ${device.verification_uri}`);
  console.log(`Code: ${device.user_code}`);
  console.log(`Expires in ${Math.round(device.expires_in / 60)} minutes.`);

  let interval = Math.max(Number(device.interval) || 5, 5) * 1000;
  let token;
  const deadline = Date.now() + Number(device.expires_in) * 1000;

  while (!token) {
    if (Date.now() >= deadline) {
      throw new Error("GitHub device authorization expired; please run the flow again.");
    }

    await delay(interval);
    let response;
    try {
      response = await requestJson("https://github.com/login/oauth/access_token", {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientId,
          device_code: device.device_code,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        }),
      });
    } catch (error) {
      console.log(`Temporary network error; retrying: ${error.message}`);
      continue;
    }

    if (response.access_token) {
      token = response.access_token;
      break;
    }
    if (response.error === "authorization_pending") {
      console.log("Waiting for GitHub authorization...");
      continue;
    }
    if (response.error === "slow_down") {
      interval += 5000;
      console.log("Waiting for GitHub authorization...");
      continue;
    }
    throw new Error(`GitHub authorization failed: ${response.error || "unknown error"}`);
  }

  console.log("GitHub authorization complete. Pushing main...");
  await runGitPush(token);
  console.log("Push complete.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
