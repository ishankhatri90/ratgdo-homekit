# ESPHome builds with captive portal

Community builds of the official RATGDO ESPHome firmware for the Slim board
(ESP8266 D1 Mini Lite, 1 MB flash) with the ESPHome `captive_portal` component
added so the device serves its own Wi-Fi setup page on the fallback hotspot
(`http://192.168.4.1`).

Source: <https://github.com/ratgdo/esphome-ratgdo> at pinned commit
`7501d8070826c433aee114bb4c9c2e38195a5342` (the same commit the official
v2.5 D1 Mini Lite binaries were built from). The only change from the official
configuration is `captive_portal:`.

## Build

1. `python -m venv .venv-esphome && .venv-esphome\Scripts\pip install esphome==2026.7.0`
2. From this folder:

   ```powershell
   ..\.venv-esphome\Scripts\esphome.exe compile slim-v25-secplus2.yaml
   ..\.venv-esphome\Scripts\esphome.exe compile slim-v25-secplus1.yaml
   ```

3. Outputs: `.esphome\build\ratgdov25\.pioenvs\ratgdov25\firmware.factory.bin`
   (the second build overwrites the first — copy each `firmware.factory.bin`
   immediately after its build).

The factory bins are published at `docs/firmware/`:

- `esphome-ratgdo-v25-1mb-secplus2-captive.bin` (493,168 bytes)
- `esphome-ratgdo-v25-1mb-secplus1-captive.bin` (479,568 bytes)

Checksums and provenance: `docs/esphome-builds.json`.
